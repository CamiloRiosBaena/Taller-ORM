import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateLibroDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  isbn: string;

  @IsInt()
  @IsOptional()
  anioPublicacion?: number;

  @IsInt()
  @Min(0)
  copiasDisponibles: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  autorIds: number[];
}
