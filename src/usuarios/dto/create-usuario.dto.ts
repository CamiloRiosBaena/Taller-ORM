import { IsString, IsNotEmpty, IsEmail, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(150)
  email: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
