import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CardService } from './card.service';
import { CriarCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthGuard, PayloadRequest } from 'src/auth/auth/auth.guard';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCardDto: CriarCardDto, @Request() req: PayloadRequest) {
    return this.cardService.create(createCardDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string,
    @Request() req: PayloadRequest,
    @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, req.user.id, updateCardDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req: PayloadRequest,) {
    return this.cardService.remove(+id, req.user.id);
  }
}
