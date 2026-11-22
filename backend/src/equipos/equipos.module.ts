import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo, Usuario } from '../database/entities';
import { EquiposService } from './equipos.service';
import { EquiposController } from './equipos.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Equipo, Usuario])],
  providers: [EquiposService], controllers: [EquiposController],
})
export class EquiposModule {}
