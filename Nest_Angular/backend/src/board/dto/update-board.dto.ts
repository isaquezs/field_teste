import { PartialType } from '@nestjs/mapped-types';
import { CriarBoardDto } from './create-board.dto';

export class UpdateBoardDto extends PartialType(CriarBoardDto) {}
