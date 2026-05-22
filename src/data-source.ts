import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Autor } from './autores/autor.entity';
import { Libro } from './libros/libro.entity';
import { Usuario } from './usuarios/usuario.entity';
import { Prestamo } from './prestamos/prestamo.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [Autor, Libro, Usuario, Prestamo],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
