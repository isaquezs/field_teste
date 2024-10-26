import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BoardService } from './board.service';
import { CriarBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard, PayloadRequest } from 'src/auth/auth/auth.guard';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() criarBoardDto: CriarBoardDto, @Request() req: PayloadRequest) {
    return this.boardService.create(criarBoardDto, req.user.id);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() req: PayloadRequest) {
    return this.boardService.findAllByUserId(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Request() req: PayloadRequest) {
    return this.boardService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string,
    @Request() req: PayloadRequest,
    @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(+id, req.user.id, updateBoardDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req: PayloadRequest) {
    return this.boardService.remove(+id, req.user.id);
  }
}
