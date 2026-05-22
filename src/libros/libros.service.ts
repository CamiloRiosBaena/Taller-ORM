import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Libro } from './libro.entity';
import { Autor } from '../autores/autor.entity';
import { CreateLibroDto } from './dto/create-libro.dto';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepo: Repository<Libro>,
    @InjectRepository(Autor)
    private readonly autorRepo: Repository<Autor>,
  ) {}

  async create(dto: CreateLibroDto): Promise<Libro> {
    const existe = await this.libroRepo.findOne({ where: { isbn: dto.isbn } });
    if (existe) throw new ConflictException(`ISBN ${dto.isbn} ya registrado`);

    const autores = await this.autorRepo.findBy({ id: In(dto.autorIds) });
    if (autores.length !== dto.autorIds.length)
      throw new BadRequestException('Uno o más autores no existen');

    const libro = this.libroRepo.create({
      titulo: dto.titulo,
      isbn: dto.isbn,
      anioPublicacion: dto.anioPublicacion,
      copiasDisponibles: dto.copiasDisponibles,
      activo: dto.activo ?? true,
      autores,
    });
    return this.libroRepo.save(libro);
  }

  // R4: listado sin N+1 — eager loading ya configurado en la entidad
  findAll(): Promise<Libro[]> {
    return this.libroRepo.find({ where: { activo: true } });
  }

  async findOne(id: number): Promise<Libro> {
    const libro = await this.libroRepo.findOne({ where: { id } });
    if (!libro) throw new NotFoundException(`Libro #${id} no encontrado`);
    return libro;
  }

  async update(id: number, dto: Partial<CreateLibroDto>): Promise<Libro> {
    const libro = await this.findOne(id);

    if (dto.isbn && dto.isbn !== libro.isbn) {
      const existe = await this.libroRepo.findOne({ where: { isbn: dto.isbn } });
      if (existe) throw new ConflictException(`ISBN ${dto.isbn} ya registrado`);
    }

    if (dto.autorIds) {
      const autores = await this.autorRepo.findBy({ id: In(dto.autorIds) });
      libro.autores = autores;
    }

    Object.assign(libro, {
      titulo: dto.titulo ?? libro.titulo,
      isbn: dto.isbn ?? libro.isbn,
      anioPublicacion: dto.anioPublicacion ?? libro.anioPublicacion,
      copiasDisponibles: dto.copiasDisponibles ?? libro.copiasDisponibles,
      activo: dto.activo ?? libro.activo,
    });

    return this.libroRepo.save(libro);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.libroRepo.delete(id);
  }
}
