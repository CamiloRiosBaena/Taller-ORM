import { IsDateString, IsNotEmpty } from 'class-validator';

export class DevolucionDto {
  @IsDateString()
  @IsNotEmpty()
  fechaDevolucionReal: string;
}
