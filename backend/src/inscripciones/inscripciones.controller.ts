import {
  Controller, Get, Post, Patch, Param, Body, Req, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import type { Peticion } from '../auth/acceso';
import { InscripcionDto } from './inscripciones.dto';
import { InscripcionesService } from './inscripciones.service';
@ApiTags('inscripciones') @ApiBearerAuth() @Controller('inscripciones')
export class InscripcionesController {
  constructor(private servicio: InscripcionesService) {}
  @Get('torneo/:id') listar(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.listar(id);
  }
  @Post() crear(@Body() dto: InscripcionDto, @Req() req: Peticion) {
    return this.servicio.crear(dto, req.usuario);
  }
  @Patch(':id/cancelar') cancelar(@Param('id', ParseIntPipe) id: number,
    @Req() req: Peticion) { return this.servicio.cancelar(id, req.usuario); }
}
