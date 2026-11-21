import {
  Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/acceso';
import { TorneosService } from './torneos.service';
import { TorneoDto, EditarTorneoDto } from './torneos.dto';
@ApiTags('torneos') @ApiBearerAuth() @Controller('torneos')
export class TorneosController {
  constructor(private servicio: TorneosService) {}
  @Get() listar() { return this.servicio.listar(); }
  @Get(':id') uno(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.uno(id);
  }
  @Roles('ADMIN') @Post() crear(@Body() dto: TorneoDto) {
    return this.servicio.crear(dto);
  }
  @Roles('ADMIN') @Patch(':id')
  editar(@Param('id', ParseIntPipe) id: number, @Body() dto: EditarTorneoDto) {
    return this.servicio.editar(id, dto);
  }
  @Roles('ADMIN') @Delete(':id')
  borrar(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.borrar(id);
  }
}
