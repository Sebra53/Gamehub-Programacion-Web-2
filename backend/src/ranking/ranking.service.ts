
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Torneo, Inscripcion, Resultado } from '../database/entities';
import { calcularRanking } from './calcular-ranking';

@Injectable()
export class RankingService {
  constructor(private db: DataSource) {}

  tabla(torneoId: number) {
    return this.db.transaction('REPEATABLE READ', async (m) => {

      if (!(await m.existsBy(Torneo, { id: torneoId }))) {
        throw new NotFoundException('Torneo inexistente');
      }

      const inscritos = await m.find(Inscripcion, {
        where: { torneoId, estado: 'ACEPTADA' },
        relations: { equipo: true },
      });

      const resultados = await m.getRepository(Resultado)
        .createQueryBuilder('r')
        .innerJoinAndSelect('r.partido', 'p')
        .where('p.torneoId = :torneoId', { torneoId })
        .andWhere('p.estado = :estado', { estado: 'FINALIZADO' })
        .getMany();

      return calcularRanking(
        inscritos.map(i => i.equipo),
        resultados.map(r => ({
          localId: r.partido.equipoLocalId,
          visitanteId: r.partido.equipoVisitanteId,
          local: r.puntajeLocal,
          visitante: r.puntajeVisitante,
        }))
      );
    });
  }
}
