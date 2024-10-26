import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SwimlaneService } from './swimlane.service';
import { CriarSwimlaneDto } from './dto/create-swimlane.dto';
import { UpdateSwimlaneDto } from './dto/update-swimlane.dto';
import { AuthGuard, PayloadRequest } from 'src/auth/auth/auth.guard';

@Controller('swimlane')
export class SwimlaneController {
  constructor(private readonly swimlaneService: SwimlaneService) { }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Request() req: PayloadRequest,
    @Body() criarSwimlaneDto: CriarSwimlaneDto) {
    return this.swimlaneService.create(criarSwimlaneDto, req.user.id);
  }

  @Get('board/:boardId')
  @UseGuards(AuthGuard)
  findAll(@Param('boardId') boardId: string, @Request() req: PayloadRequest,) {
    return this.swimlaneService.findAllByBoardId(Number(boardId), req.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSwimlaneDto: UpdateSwimlaneDto,
    @Request() req: PayloadRequest,) {
    return this.swimlaneService.update(+id, req.user.id, updateSwimlaneDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Request() req: PayloadRequest) {
    return this.swimlaneService.remove(+id, req.user.id);
  }
}
