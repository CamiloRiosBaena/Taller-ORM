import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dto/create-libro.dto';

@ApiTags('libros')
@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Post()
  create(@Body() dto: CreateLibroDto) {
    return this.librosService.create(dto);
  }

  @Get()
  findAll() {
    return this.librosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateLibroDto>) {
    return this.librosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.remove(id);
  }
}
