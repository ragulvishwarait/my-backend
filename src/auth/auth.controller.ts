import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './DTO/create-user.dto';
import { LoginUserDto } from './DTO/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
