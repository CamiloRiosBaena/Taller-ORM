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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AutoresService } from './autores.service';
import { CreateAutorDto } from './dto/create-autor.dto';

@ApiTags('autores')
@Controller('autores')
export class AutoresController {
  constructor(private readonly autoresService: AutoresService) {}

  @Post()
  create(@Body() dto: CreateAutorDto) {
    return this.autoresService.create(dto);
  }

  @Get()
  findAll() {
    return this.autoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.autoresService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateAutorDto>) {
    return this.autoresService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.autoresService.remove(id);
  }
}
