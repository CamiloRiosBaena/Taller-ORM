import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';
import { Prestamo } from './prestamo.entity';
import { Libro } from '../libros/libro.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prestamo, Libro, Usuario])],
  controllers: [PrestamosController],
  providers: [PrestamosService],
})
export class PrestamosModule {}
