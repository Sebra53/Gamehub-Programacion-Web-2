import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Partido, Torneo, Resultado } from '../database/entities';
import { ResultadoDto } from './resultados.dto';
@Injectable()
export class ResultadosService {
  constructor(private db: DataSource) {}
  async uno(partidoId: number) {
    if (!(await this.db.getRepository(Partido).existsBy({ id: partidoId }))) {
      throw new NotFoundException('Partido inexistente');
    }
    return this.db.getRepository(Resultado).findOneBy({ partidoId });
  }
  guardar(partidoId: number, dto: ResultadoDto, autorId: number) {
    return this.db.transaction(async (m) => {
      const previo = await m.findOneBy(Partido, { id: partidoId });
      if (!previo) throw new NotFoundException('Partido inexistente');
      await m.findOne(Torneo, {
        where: { id: previo.torneoId }, lock: { mode: 'pessimistic_write' },
      });
      const p = await m.findOneOrFail(Partido, {
        where: { id: partidoId }, lock: { mode: 'pessimistic_write' },
      });
      if (p.estado === 'CANCELADO') throw new ConflictException('Partido cancelado');
      const r = await m.findOneBy(Resultado, { partidoId }) ||
        m.create(Resultado, { partidoId });
      Object.assign(r, dto);
      r.registradoPor = autorId;
      r.ganadorId = dto.puntajeLocal === dto.puntajeVisitante ? null :
        dto.puntajeLocal > dto.puntajeVisitante ? p.equipoLocalId : p.equipoVisitanteId;
      await m.save(Resultado, r);
      p.estado = 'FINALIZADO';
      await m.save(Partido, p);
      return r;
    });
  }
}
