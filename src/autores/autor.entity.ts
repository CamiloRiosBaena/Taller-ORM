import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Libro } from '../libros/libro.entity';

@Entity('autores')
export class Autor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ length: 100, nullable: true })
  nacionalidad: string;

  @ManyToMany(() => Libro, (libro) => libro.autores)
  libros: Libro[];
}
