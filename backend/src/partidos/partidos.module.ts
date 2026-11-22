import { Module } from '@nestjs/common';
import { PartidosService } from './partidos.service';
import { PartidosController } from './partidos.controller';
@Module({ providers: [PartidosService], controllers: [PartidosController] })
export class PartidosModule {}
