import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './DTO/create-user.dto';
import { LoginUserDto } from './DTO/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { USER_MESSAGES, JWT_SECRET } from '../common/constants';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async register(dto: CreateUserDto) {
    try {
      const user = await this.usersService.create(dto);
      return { message: USER_MESSAGES.USER_CREATED, data: user };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const user = await this.usersService.findByEmail(dto.email);
      if (!user) throw new HttpException(USER_MESSAGES.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) throw new HttpException(USER_MESSAGES.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

      const payload = { sub: user._id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload);

      return { message: USER_MESSAGES.LOGIN_SUCCESS, access_token: token };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
