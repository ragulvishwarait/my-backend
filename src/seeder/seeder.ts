import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from '../users/schema/role.schema';
import { User, UserDocument } from '../users/schema/user.schema';
import * as bcrypt from 'bcrypt';


class Seeder {
  constructor(
    private roleModel: Model<RoleDocument>,
    private userModel: Model<UserDocument>,
  ) {}

  async seed() {
    console.log(' Starting database seeding...');

    // --- Roles ---
    const roles = ['admin', 'user'];
    for (const role of roles) {
      const exists = await this.roleModel.findOne({ name: role });
      if (!exists) {
        await this.roleModel.create({ name: role });
        console.log(`Role created: ${role}`);
      }
    }

    // --- Admin User ---
    const adminEmail = 'admin@example.com';
    const adminExists = await this.userModel.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);

      const adminRole = await this.roleModel.findOne({ name: 'admin' });

      await this.userModel.create({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: adminRole?._id,
      });

      console.log('Admin user created with email: admin@example.com, password: Admin@123');
    }

    console.log('Seeding completed!');
  }
}

// Bootstrap seeder
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const roleModel = app.get<Model<RoleDocument>>('RoleModel');
  const userModel = app.get<Model<UserDocument>>('UserModel');

  const seeder = new Seeder(roleModel, userModel);
  await seeder.seed();

  await app.close();
}
bootstrap();
