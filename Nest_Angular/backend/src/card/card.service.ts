import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CriarCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { SwimlaneService } from 'src/swimlane/swimlane.service';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private RepositorioCard: Repository<Card>,
    private swimlaneService: SwimlaneService,
  ) { }

  async create(criarCardDto: CriarCardDto, userId: number) {
    const card = new Card();
    card.Nome = criarCardDto.Nome;
    card.conteudo = criarCardDto.conteudo;
    card.swimlaneId = criarCardDto.swimlaneId;
    const temAcessoAoSwimlane = await this.swimlaneService.temAcessoAoSwimlane(
      criarCardDto.swimlaneId,
      userId,
    )
    if (!temAcessoAoSwimlane) {
      throw new UnauthorizedException('Você não tem acesso a esse swimlane.');
    }
    return this.RepositorioCard.save(card);
  }

  update(id: number, userId: number, updateCardDto: UpdateCardDto) {
    return this.RepositorioCard.update(
      {
        id,
        swimlane: {
          board: {
            users: { id: userId },
          }
        },
      }, {
      Nome: updateCardDto.Nome,
      conteudo: updateCardDto.conteudo,
    });
  }

  remove(id: number, userId: number) {
    return this.RepositorioCard.delete({
      id,
      swimlane: {
        board: {
          users: { id: userId },
        }
      }
    });
  }
}
