import { Controller, Get, Put, Param, Body, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/acceso';
import type { Peticion } from '../auth/acceso';
import { ResultadoDto } from './resultados.dto';
import { ResultadosService } from './resultados.service';
@ApiTags('resultados') @ApiBearerAuth() @Controller('partidos')
export class ResultadosController {
  constructor(private servicio: ResultadosService) {}
  @Get(':id/resultado') uno(@Param('id', ParseIntPipe) id: number) {
    return this.servicio.uno(id);
  }
  @Roles('ADMIN') @Put(':id/resultado')
  guardar(@Param('id', ParseIntPipe) id: number,
    @Body() dto: ResultadoDto, @Req() req: Peticion) {
    return this.servicio.guardar(id, dto, req.usuario.id);
  }
}
