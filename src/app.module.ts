import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutoresModule } from './autores/autores.module';
import { LibrosModule } from './libros/libros.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { Autor } from './autores/autor.entity';
import { Libro } from './libros/libro.entity';
import { Usuario } from './usuarios/usuario.entity';
import { Prestamo } from './prestamos/prestamo.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        ssl: config.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
        entities: [Autor, Libro, Usuario, Prestamo],
        synchronize: false,
        migrations: ['dist/migrations/*.js'],
        migrationsRun: false,
        logging: true,
      }),
    }),
    AutoresModule,
    LibrosModule,
    UsuariosModule,
    PrestamosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
