import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Libro } from '../libros/libro.entity';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('prestamos')
export class Prestamo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Libro, (libro) => libro.prestamos, { nullable: false })
  @JoinColumn({ name: 'libro_id' })
  libro: Libro;

  @ManyToOne(() => Usuario, (usuario) => usuario.prestamos, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @CreateDateColumn({ name: 'fecha_prestamo' })
  fechaPrestamo: Date;

  @Column({ name: 'fecha_devolucion_esperada', type: 'date' })
  fechaDevolucionEsperada: Date;

  @Column({ name: 'fecha_devolucion_real', type: 'date', nullable: true })
  fechaDevolucionReal: Date;
}
