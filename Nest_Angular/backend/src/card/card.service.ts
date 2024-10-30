import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { SwimlaneService } from 'src/swimlane/swimlane.service';
import { UserService } from 'src/user/user.service';
import { ReorderedCardDto } from './dto/reorder-cards.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    private swimlaneService: SwimlaneService,
    private userService: UserService, 
  ) {}

  async create(createCardDto: CreateCardDto, userId: number) {
    const card = new Card();
    card.nome = createCardDto.nome;
    card.conteudo = createCardDto.conteudo;
    card.swimlaneId = createCardDto.swimlaneId;
    card.ordem = createCardDto.ordem;
    const hasAccessToSwimlane = await this.swimlaneService.hasAccessToSwimlane(
      createCardDto.swimlaneId,
      userId,
    );
    if (!hasAccessToSwimlane) {
      throw new UnauthorizedException('You are not a part of this board.');
    }
    return this.cardRepository.save(card);
  }

  async updateCardOrdersAndSwimlanes(
    reorder: ReorderedCardDto, 
    userId: number
  ) {
    await this.userService.isConnectedToBoard(userId, reorder.boardId);

    const promises = reorder.cards.map((card) =>
    this.cardRepository.update(card.id, {
      ordem: card.ordem,
      swimlaneId: card.swimlaneId,
    })
  )

  await Promise.all(promises);

    return true;
  }

  async update(id: number, userId: number, updateCardDto: UpdateCardDto) {
    return this.cardRepository.update(id, {
      nome: updateCardDto.nome,
      conteudo: updateCardDto.conteudo,
    });
  }

  async remove(id: number, userId: number) {
    return this.cardRepository.delete({
      id,
      swimlane: {
        board: {
          users: {
            id: userId,
          }
        }
      }
    });
  }
}
