
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RankingService } from './ranking.service';

@ApiTags('ranking')
@ApiBearerAuth()
@Controller('ranking')
export class RankingController {
  constructor(private servicio: RankingService) {}

  @Get(':torneoId')
  tabla(@Param('torneoId', ParseIntPipe) id: number) {
    return this.servicio.tabla(id);
  }
}
