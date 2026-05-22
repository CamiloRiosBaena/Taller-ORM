import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  Check,
} from 'typeorm';
import { Autor } from '../autores/autor.entity';
import { Prestamo } from '../prestamos/prestamo.entity';

@Entity('libros')
@Check(`"copias_disponibles" >= 0`)
export class Libro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  titulo: string;

  @Column({ unique: true, length: 20 })
  isbn: string;

  @Column({ name: 'anio_publicacion', nullable: true })
  anioPublicacion: number;

  @Column({ name: 'copias_disponibles', default: 0 })
  copiasDisponibles: number;

  @Column({ default: true })
  activo: boolean;

  @ManyToMany(() => Autor, (autor) => autor.libros, { eager: true })
  @JoinTable({
    name: 'libros_autores',
    joinColumn: { name: 'libro_id' },
    inverseJoinColumn: { name: 'autor_id' },
  })
  autores: Autor[];

  @OneToMany(() => Prestamo, (prestamo) => prestamo.libro)
  prestamos: Prestamo[];
}
