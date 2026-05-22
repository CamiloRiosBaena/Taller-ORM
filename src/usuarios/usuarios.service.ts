import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const existe = await this.usuarioRepo.findOne({ where: { email: dto.email } });
    if (existe) throw new ConflictException(`Email ${dto.email} ya registrado`);
    const usuario = this.usuarioRepo.create(dto);
    return this.usuarioRepo.save(usuario);
  }

  findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuario;
  }

  async update(id: number, dto: Partial<CreateUsuarioDto>): Promise<Usuario> {
    await this.findOne(id);
    await this.usuarioRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usuarioRepo.delete(id);
  }
}
