import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from '../auth/DTO/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ROLES } from '../common/constants';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto, role: string = ROLES.USER): Promise<User> {
    try {
      const existing = await this.userModel.findOne({ email: dto.email });
      if (existing) throw new HttpException('User already exists', HttpStatus.CONFLICT);

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = new this.userModel({ ...dto, password: hashedPassword, role });
      return await user.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async seedAdmin() {
    const admin = await this.userModel.findOne({ role: ROLES.ADMIN });
    if (!admin) {
      await this.create({ name: 'Admin', email: 'admin@example.com', password: 'admin123' }, ROLES.ADMIN);
    }
  }
}
