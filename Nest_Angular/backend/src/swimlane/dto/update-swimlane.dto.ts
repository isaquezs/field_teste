import { PartialType } from '@nestjs/mapped-types';
import { CriarSwimlaneDto } from './create-swimlane.dto';

export class UpdateSwimlaneDto extends PartialType(CriarSwimlaneDto) {}
