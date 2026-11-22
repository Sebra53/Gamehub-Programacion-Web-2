import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import type { Peticion } from '../auth/acceso';
import { EquipoDto } from './equipos.dto';
import { EquiposService } from './equipos.service';
@ApiTags('equipos') @ApiBearerAuth() @Controller('equipos')
export class EquiposController {
  constructor(private servicio: EquiposService) {}
  @Get() listar() { return this.servicio.listar(); }
  @Get(':id') uno(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.uno(id);
  }
  @Post() crear(@Body() dto: EquipoDto, @Req() req: Peticion) {
    return this.servicio.crear(dto, req.usuario);
  }
  @Patch(':id') editar(@Param('id', ParseIntPipe) id: number,
    @Body() dto: EquipoDto, @Req() req: Peticion) {
    return this.servicio.editar(id, dto, req.usuario);
  }
  @Delete(':id') borrar(@Param('id', ParseIntPipe) id: number,
    @Req() req: Peticion) { return this.servicio.borrar(id, req.usuario); }
}
