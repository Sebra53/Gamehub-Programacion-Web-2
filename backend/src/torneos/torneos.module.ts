import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Torneo } from '../database/entities';
import { TorneosService } from './torneos.service';
import { TorneosController } from './torneos.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Torneo])],
  providers: [TorneosService], controllers: [TorneosController],
})
export class TorneosModule {}
