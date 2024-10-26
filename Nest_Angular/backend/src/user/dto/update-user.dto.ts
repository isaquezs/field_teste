import { PartialType } from '@nestjs/mapped-types';
import { CriarUsuarioDto } from './create-user.dto';

export class UpdateUsuarioDto extends PartialType(CriarUsuarioDto) {}
