import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CriarSwimlaneDto } from './dto/create-swimlane.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Swimlane } from './entities/swimlane.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SwimlaneService {
  constructor(
    @InjectRepository(Swimlane)
    private RepositorioSwimlane: Repository<Swimlane>,
    private UserService: UserService,
  ) { }

  async create(criarSwimlaneDto: CriarSwimlaneDto, userId: number) {
    // gera o swimlane que vai ser automaticamente conectado ao board especificado pelo boardId
    const swimlane = new Swimlane();
    swimlane.Nome = criarSwimlaneDto.nome;
    swimlane.ordem = criarSwimlaneDto.ordem;
    swimlane.boardId = criarSwimlaneDto.boardId;

    const conectado = await this.UserService.conectadoAoBoard(
      userId,
      swimlane.boardId
    );

    if (!conectado) {
      throw new UnauthorizedException('Você não está conectado a esse board.');
    }

    return this.RepositorioSwimlane.save(swimlane);
  }

  async temAcessoAoSwimlane(swimlaneId: number, userId: number) {
    const temAcesso = await this.RepositorioSwimlane.count({
      where: {
        id: swimlaneId,
        board: { users: { id: userId } }
      }
    });
      return temAcesso > 0;
  }

  findAllByBoardId(boardId: number, userId: number) {
    return this.RepositorioSwimlane.find({
      where: {
        boardId,
        board: { users: { id: userId } }
      },
    });
  }

  update(id: number, userId: number, updateSwimlaneDto: UpdateSwimlaneDto) {
    return this.RepositorioSwimlane.update({
      id,
      board: {
        users: { id: userId }
      }
    }, {
      Nome: updateSwimlaneDto.nome,
      ordem: updateSwimlaneDto.ordem,
    })
  }

  remove(id: number, userId: number) {
    return this.RepositorioSwimlane.delete({
      id,
      board: {
        users: { id: userId }
      }
    });
  }
}
