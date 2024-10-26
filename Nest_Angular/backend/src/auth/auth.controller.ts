import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistrarDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private userService: UserService) { }

  @Post('registrar')
  async create(registrarDto: RegistrarDto) {
    registrarDto.email = registrarDto.email.toLowerCase();
    const user = await this.userService.create(registrarDto)
    if (!user) {
      throw new BadRequestException('Erro ao criar usuário');
    }
    return this.authService.login({
      email: user.email,
      senha: registrarDto.senha,
    });
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
