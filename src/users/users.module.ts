import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schema/user.schema';
import { Role ,RoleSchema } from './schema/role.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),],
  providers: [UsersService],
  exports: [UsersService], 
})
export class UsersModule {}
