import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private RepositorioUsuario: Repository<User>,
    private jwtService: JwtService
  ) { }
  async login(loginDto: LoginDto) {
    const user = await this.RepositorioUsuario.findOne({
      where: { Email: loginDto.email }
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!bcrypt.compareSync(loginDto.senha, user.senha)) {
      throw new UnauthorizedException('Senha ou Usuário inválidos');
    }

    const payload = { userId: user.id, Email: user.Email };


    return {accessToken: await this.jwtService.signAsync(payload)};

  }
}