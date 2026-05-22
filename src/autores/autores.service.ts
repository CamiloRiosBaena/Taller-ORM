import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autor } from './autor.entity';
import { CreateAutorDto } from './dto/create-autor.dto';

@Injectable()
export class AutoresService {
  constructor(
    @InjectRepository(Autor)
    private readonly autorRepo: Repository<Autor>,
  ) {}

  create(dto: CreateAutorDto): Promise<Autor> {
    const autor = this.autorRepo.create(dto);
    return this.autorRepo.save(autor);
  }

  findAll(): Promise<Autor[]> {
    return this.autorRepo.find();
  }

  async findOne(id: number): Promise<Autor> {
    const autor = await this.autorRepo.findOne({ where: { id } });
    if (!autor) throw new NotFoundException(`Autor #${id} no encontrado`);
    return autor;
  }

  async update(id: number, dto: Partial<CreateAutorDto>): Promise<Autor> {
    await this.findOne(id);
    await this.autorRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.autorRepo.delete(id);
  }
}
