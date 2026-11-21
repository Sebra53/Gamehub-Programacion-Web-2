import {
  Injectable, NotFoundException, ConflictException, ForbiddenException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Torneo, Equipo, Usuario, Inscripcion, Partido } from '../database/entities';
import { InscripcionDto } from './inscripciones.dto';
@Injectable()
export class InscripcionesService {
  constructor(private db: DataSource) {}
  async torneo(m: EntityManager, id: number) {
    const t = await m.findOne(Torneo, {
      where: { id }, lock: { mode: 'pessimistic_write' },
    });
    if (!t) throw new NotFoundException('Torneo inexistente');
    return t;
  }
  async equipo(m: EntityManager, id: number, usuario: Usuario) {
    const e = await m.findOneBy(Equipo, { id });
    if (!e) throw new NotFoundException('Equipo inexistente');
    if (usuario.rol !== 'ADMIN' && e.capitanId !== usuario.id) {
      throw new ForbiddenException('Solo el capitán puede inscribir o cancelar');
    }
    return e;
  }
  async listar(torneoId: number) {
    if (!(await this.db.getRepository(Torneo).existsBy({ id: torneoId }))) {
      throw new NotFoundException('Torneo inexistente');
    }
    return this.db.getRepository(Inscripcion).find({
      where: { torneoId }, relations: { equipo: true },
    });
  }
  crear(dto: InscripcionDto, usuario: Usuario) {
    return this.db.transaction(async (m) => {
      const t = await this.torneo(m, dto.torneoId);
      const e = await this.equipo(m, dto.equipoId, usuario);
      if (t.estado !== 'ABIERTO' || t.cierreInscripcion <= new Date()) {
        throw new ConflictException('Inscripción cerrada');
      }
      if (e.estado !== 'ACTIVO') throw new ConflictException('Equipo inactivo');
      const anterior = await m.findOneBy(Inscripcion, dto);
      if (anterior?.estado === 'ACEPTADA') {
        throw new ConflictException('Equipo ya inscrito');
      }
      const ocupados = await m.countBy(Inscripcion, {
        torneoId: t.id, estado: 'ACEPTADA',
      });
      if (ocupados >= t.cupoMaximo) throw new ConflictException('No quedan cupos');
      const inscripcion = anterior || m.create(Inscripcion, dto);
      inscripcion.estado = 'ACEPTADA'; inscripcion.fecha = new Date();
      return m.save(Inscripcion, inscripcion);
    });
  }
  cancelar(id: number, usuario: Usuario) {
    return this.db.transaction(async (m) => {
      const i = await m.findOneBy(Inscripcion, { id });
      if (!i) throw new NotFoundException('Inscripción inexistente');
      const t = await this.torneo(m, i.torneoId);
      await this.equipo(m, i.equipoId, usuario);
      if (t.estado !== 'ABIERTO' || t.cierreInscripcion <= new Date()) {
        throw new ConflictException('No se puede cancelar fuera del período');
      }
      const partidos = await m.count(Partido, { where: [
        { torneoId: i.torneoId, equipoLocalId: i.equipoId },
        { torneoId: i.torneoId, equipoVisitanteId: i.equipoId },
      ] });
      if (partidos) throw new ConflictException('El equipo ya tiene partidos');
      i.estado = 'CANCELADA';
      return m.save(Inscripcion, i);
    });
  }
}
