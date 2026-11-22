import {
  Controller, Get, Post, Patch, Param, Body, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/acceso';
import { PartidoDto } from './partidos.dto';
import { PartidosService } from './partidos.service';
@ApiTags('partidos') @ApiBearerAuth() @Controller('partidos')
export class PartidosController {
  constructor(private servicio: PartidosService) {}
  @Get() listar() { return this.servicio.listar(); }
  @Get(':id') uno(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.uno(id);
  }
  @Roles('ADMIN') @Post() crear(@Body() dto: PartidoDto) {
    return this.servicio.crear(dto);
  }
  @Roles('ADMIN') @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.cancelar(id);
  }
}
