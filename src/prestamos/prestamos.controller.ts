import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { DevolucionDto } from './dto/devolucion.dto';

@ApiTags('prestamos')
@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post()
  create(@Body() dto: CreatePrestamoDto) {
    return this.prestamosService.create(dto);
  }

  @Get()
  findAll() {
    return this.prestamosService.findAll();
  }

  @Get('activos')
  findActivos() {
    return this.prestamosService.findActivos();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prestamosService.findOne(id);
  }

  @Patch(':id/devolucion')
  registrarDevolucion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DevolucionDto,
  ) {
    return this.prestamosService.registrarDevolucion(id, dto);
  }
}
