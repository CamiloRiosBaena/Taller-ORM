import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateAutorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  nacionalidad?: string;
}
