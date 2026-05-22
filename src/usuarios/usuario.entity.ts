import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Prestamo } from '../prestamos/prestamo.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Prestamo, (prestamo) => prestamo.usuario)
  prestamos: Prestamo[];
}
