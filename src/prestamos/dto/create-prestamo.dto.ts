import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreatePrestamoDto {
  @IsInt()
  @IsNotEmpty()
  libroId: number;

  @IsInt()
  @IsNotEmpty()
  usuarioId: number;

  @IsDateString()
  @IsNotEmpty()
  fechaDevolucionEsperada: string;
}
