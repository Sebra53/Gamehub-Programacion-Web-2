import {
  Injectable, NotFoundException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Partido, Torneo, Inscripcion } from '../database/entities';
import { PartidoDto } from './partidos.dto';
@Injectable()
export class PartidosService {
  constructor(private db: DataSource) {}
  listar() {
    return this.db.getRepository(Partido).find({
      relations: { torneo: true, local: true, visitante: true },
      order: { fechaHora: 'ASC' },
    });
  }
  async uno(id: number) {
    const p = await this.db.getRepository(Partido).findOne({
      where: { id }, relations: { torneo: true, local: true, visitante: true },
    });
    if (!p) throw new NotFoundException('Partido inexistente');
    return p;
  }
  crear(dto: PartidoDto) {
    return this.db.transaction(async (m) => {
      const t = await m.findOne(Torneo, {
        where: { id: dto.torneoId }, lock: { mode: 'pessimistic_write' },
      });
      if (!t) throw new NotFoundException('Torneo inexistente');
      if (t.estado === 'FINALIZADO') throw new ConflictException('Torneo finalizado');
      if (dto.equipoLocalId === dto.equipoVisitanteId) {
        throw new BadRequestException('Los equipos deben ser distintos');
      }
      for (const equipoId of [dto.equipoLocalId, dto.equipoVisitanteId]) {
        if (!(await m.existsBy(Inscripcion, {
          torneoId: t.id, equipoId, estado: 'ACEPTADA',
        }))) throw new ConflictException('Ambos equipos deben estar inscritos');
      }
      const fechaHora = new Date(dto.fechaHora);
      if (fechaHora < t.fechaInicio) {
        throw new BadRequestException('Partido anterior al inicio del torneo');
      }
      return m.save(Partido, m.create(Partido, {
        ...dto, fechaHora, estado: 'PROGRAMADO',
      }));
    });
  }
  cancelar(id: number) {
    return this.db.transaction(async (m) => {
      const previo = await m.findOneBy(Partido, { id });
      if (!previo) throw new NotFoundException('Partido inexistente');
      await m.findOne(Torneo, {
        where: { id: previo.torneoId }, lock: { mode: 'pessimistic_write' },
      });
      const p = await m.findOneOrFail(Partido, {
        where: { id }, lock: { mode: 'pessimistic_write' },
      });
      if (p.estado === 'FINALIZADO') throw new ConflictException('Ya tiene resultado');
      p.estado = 'CANCELADO';
      return m.save(Partido, p);
    });
  }
}
