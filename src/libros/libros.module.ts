import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { Libro } from './libro.entity';
import { Autor } from '../autores/autor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Libro, Autor])],
  controllers: [LibrosController],
  providers: [LibrosService],
  exports: [TypeOrmModule],
})
export class LibrosModule {}
