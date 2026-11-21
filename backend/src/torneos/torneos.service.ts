import {
  Injectable, NotFoundException, BadRequestException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Torneo, Inscripcion, Partido } from '../database/entities';
import { TorneoDto, EditarTorneoDto } from './torneos.dto';
 
@Injectable()
export class TorneosService {
  constructor(
    @InjectRepository(Torneo) private repo: Repository<Torneo>,
    private db: DataSource,
  ) {}
  listar() { return this.repo.find({ order: { id: 'DESC' } }); }
  async uno(id: number) {
    const torneo = await this.repo.findOneBy({ id });
    if (!torneo) throw new NotFoundException('Torneo inexistente');
    return torneo;
  }
  validar(torneo: Torneo) {
    if (torneo.cierreInscripcion >= torneo.fechaInicio) {
      throw new BadRequestException('Cierre debe ser anterior al inicio');
    }
  }
  crear(dto: TorneoDto) {
    const torneo = this.repo.create({ ...dto,
      fechaInicio: new Date(dto.fechaInicio),
      cierreInscripcion: new Date(dto.cierreInscripcion),
    });
    this.validar(torneo);
    return this.repo.save(torneo);
  }
  editar(id: number, dto: EditarTorneoDto) {
    return this.db.transaction(async (m) => {
      const repo = m.getRepository(Torneo);
      const torneo = await repo.findOne({
        where: { id }, lock: { mode: 'pessimistic_write' },
      });
      if (!torneo) throw new NotFoundException('Torneo inexistente');
      const { fechaInicio, cierreInscripcion, ...resto } = dto;
      Object.assign(torneo, resto);
      if (fechaInicio) torneo.fechaInicio = new Date(fechaInicio);
      if (cierreInscripcion) torneo.cierreInscripcion = new Date(cierreInscripcion);
      this.validar(torneo);
      const inscritos = await m.countBy(Inscripcion, {
        torneoId: id, estado: 'ACEPTADA',
      });
      if (torneo.cupoMaximo < inscritos) {
        throw new ConflictException('Cupo menor que los equipos inscritos');
      }
      const partidos = await m.findBy(Partido, { torneoId: id });
      if (partidos.some(p => p.fechaHora < torneo.fechaInicio)) {
        throw new ConflictException('El nuevo inicio deja partidos fuera de fecha');
      }
      return repo.save(torneo);
    });
  }
  async borrar(id: number) {
    const torneo = await this.uno(id);
    try { await this.repo.remove(torneo); }
    catch (e) {
      if ((e as { code?: string }).code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('El torneo tiene inscripciones o partidos');
      }
      throw e;
    }
    return { mensaje: 'Torneo eliminado' };
  }
}
