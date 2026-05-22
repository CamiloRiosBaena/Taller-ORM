import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, DataSource } from 'typeorm';
import { Prestamo } from './prestamo.entity';
import { Libro } from '../libros/libro.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { DevolucionDto } from './dto/devolucion.dto';

@Injectable()
export class PrestamosService {
  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamoRepo: Repository<Prestamo>,
    @InjectRepository(Libro)
    private readonly libroRepo: Repository<Libro>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly dataSource: DataSource,
  ) {}

  // R4 + R5: crear préstamo con transacción atómica
  async create(dto: CreatePrestamoDto): Promise<Prestamo> {
    return this.dataSource.transaction(async (manager) => {
      const libro = await manager.findOne(Libro, {
        where: { id: dto.libroId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!libro) throw new NotFoundException(`Libro #${dto.libroId} no encontrado`);
      if (!libro.activo) throw new BadRequestException('El libro no está activo');

      // R6: validación — no prestar si copias = 0
      if (libro.copiasDisponibles <= 0)
        throw new BadRequestException('No hay copias disponibles para préstamo');

      const usuario = await manager.findOne(Usuario, { where: { id: dto.usuarioId } });
      if (!usuario) throw new NotFoundException(`Usuario #${dto.usuarioId} no encontrado`);
      if (!usuario.activo) throw new BadRequestException('El usuario no está activo');

      libro.copiasDisponibles -= 1;
      await manager.save(Libro, libro);

      const prestamo = manager.create(Prestamo, {
        libro,
        usuario,
        fechaDevolucionEsperada: new Date(dto.fechaDevolucionEsperada),
      });
      return manager.save(Prestamo, prestamo);
    });
  }

  // R4: listar préstamos activos (sin fecha_devolucion_real)
  findActivos(): Promise<Prestamo[]> {
    return this.prestamoRepo.find({
      where: { fechaDevolucionReal: IsNull() },
      relations: { libro: true, usuario: true },
    });
  }

  findAll(): Promise<Prestamo[]> {
    return this.prestamoRepo.find({ relations: { libro: true, usuario: true } });
  }

  async findOne(id: number): Promise<Prestamo> {
    const prestamo = await this.prestamoRepo.findOne({
      where: { id },
      relations: { libro: true, usuario: true },
    });
    if (!prestamo) throw new NotFoundException(`Préstamo #${id} no encontrado`);
    return prestamo;
  }

  // R4 + R5: registrar devolución con transacción atómica
  async registrarDevolucion(id: number, dto: DevolucionDto): Promise<Prestamo> {
    return this.dataSource.transaction(async (manager) => {
      const prestamo = await manager.findOne(Prestamo, {
        where: { id },
        relations: { libro: true },
      });
      if (!prestamo) throw new NotFoundException(`Préstamo #${id} no encontrado`);
      if (prestamo.fechaDevolucionReal)
        throw new ConflictException('Este préstamo ya fue devuelto');

      prestamo.fechaDevolucionReal = new Date(dto.fechaDevolucionReal);
      await manager.save(Prestamo, prestamo);

      prestamo.libro.copiasDisponibles += 1;
      await manager.save(Libro, prestamo.libro);

      return prestamo;
    });
  }
}
