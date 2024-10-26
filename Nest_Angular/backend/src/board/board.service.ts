import { Injectable } from '@nestjs/common';
import { CriarBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private repositorioBoard: Repository<Board>,
    private UserService: UserService,
  ) { }

  async create(criarBoardDto: CriarBoardDto, userId: number) {
    const board = new Board();
    board.Nome = criarBoardDto.Nome;
    const user = await this.UserService.findOne(userId);
    board.users = [user];
    return this.repositorioBoard.save(board);
  }

  findAllByUserId(userId: number) {
    return this.repositorioBoard.find({
      where: { users: { id: userId } },
      relations: ['users'],
    });
  }

  findOne(id: number, userId: number) {
    return this.repositorioBoard.findOne({
      where: {
        id,
        users: { id: userId },
      },
      relations: ['users', 'swimlanes', 'swimlanes.cards'],
    });
  }

  update(id: number, userId: number, updateBoardDto: UpdateBoardDto) {
    return this.repositorioBoard.update({
      id,
      users: { id: userId },
    }, {
      Nome: updateBoardDto.Nome,

    });
  }

  remove(id: number, userId: number) {
    return this.repositorioBoard.delete({
      id,
      users: { id: userId },
    });
  }
}
