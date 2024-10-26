import { PartialType } from '@nestjs/mapped-types';
import { CriarCardDto } from './create-card.dto';

export class UpdateCardDto extends PartialType(CriarCardDto) {}
