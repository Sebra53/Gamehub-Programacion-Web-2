import {
  Injectable, NotFoundException, ForbiddenException,
  BadRequestException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Equipo, Usuario } from '../database/entities';
import { EquipoDto } from './equipos.dto';
@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo) private repo: Repository<Equipo>,
    @InjectRepository(Usuario) private usuarios: Repository<Usuario>,
  ) {}
  listar() {
    return this.repo.find({ relations: { capitan: true, integrantes: true } });
  }
  async uno(id: number) {
    const equipo = await this.repo.findOne({
      where: { id }, relations: { capitan: true, integrantes: true },
    });
    if (!equipo) throw new NotFoundException('Equipo inexistente');
    return equipo;
  }
  permiso(equipo: Equipo, usuario: Usuario) {
    if (usuario.rol !== 'ADMIN' && equipo.capitanId !== usuario.id) {
      throw new ForbiddenException('Solo el capitán puede administrar su equipo');
    }
  }
  async miembros(correos: string[], capitanId: number) {
    const unicos = [...new Set(correos.map(c => c.trim().toLowerCase()))];
    const integrantes = unicos.length ? await this.usuarios.findBy({
      correo: In(unicos), activo: true,
    }) : [];
    if (integrantes.length !== unicos.length) {
      throw new BadRequestException('Hay correos no registrados o inactivos');
    }
    if (!integrantes.some(u => u.id === capitanId)) {
      integrantes.push(await this.usuarios.findOneByOrFail({ id: capitanId }));
    }
    return integrantes;
  }
  async crear(dto: EquipoDto, usuario: Usuario) {
    const { integrantesCorreos, ...datos } = dto;
    return this.repo.save(this.repo.create({ ...datos, capitanId: usuario.id,
      integrantes: await this.miembros(integrantesCorreos, usuario.id) }));
  }
  async editar(id: number, dto: EquipoDto, usuario: Usuario) {
    const equipo = await this.uno(id);
    this.permiso(equipo, usuario);
    const { integrantesCorreos, ...datos } = dto;
    Object.assign(equipo, datos);
    equipo.integrantes = await this.miembros(integrantesCorreos, equipo.capitanId);
    return this.repo.save(equipo);
  }
  async borrar(id: number, usuario: Usuario) {
    const equipo = await this.uno(id);
    this.permiso(equipo, usuario);
    try { await this.repo.remove(equipo); }
    catch (e) {
      if ((e as { code?: string }).code === 'ER_ROW_IS_REFERENCED_2') {
        throw new ConflictException('Equipo con inscripciones o partidos');
      }
      throw e;
    }
    return { mensaje: 'Equipo eliminado' };
  }
}
