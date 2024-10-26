import { Injectable } from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegistrarDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private RepositorioUsuario: Repository<User>,
  ) { }

  create(criarUsuarioDTO: RegistrarDto) {
    this.userService
    const user = new User();
    user.Email = criarUsuarioDTO.email;
    user.PrimeiroNome = criarUsuarioDTO.primeiroNome;
    user.UltimoNome = criarUsuarioDTO.ultimoNome;
    user.senha = criarUsuarioDTO.senha;
    return this.RepositorioUsuario.save(criarUsuarioDTO);
  }

  findOne(id: number) {
    return this.RepositorioUsuario.findOneBy({ id });
  }

  conectadoAoBoard(boardId: number, id: number) {
    return this.RepositorioUsuario.findOneBy({
      id, boards: {
        id: boardId
      }
    });
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return this.RepositorioUsuario.update(id, {
      PrimeiroNome: updateUsuarioDto.PrimeiroNome,
      UltimoNome: updateUsuarioDto.UltimoNome,
    });
  }

  remove(id: number) {
    return this.RepositorioUsuario.delete(id);
  }
}
