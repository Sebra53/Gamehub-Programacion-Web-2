
import { EquiposService } from './equipos.service';
import { Equipo, Usuario } from '../database/entities';
import { Repository } from 'typeorm';

describe('Permiso de equipos', () => {
  const servicio = new EquiposService(
    {} as Repository<Equipo>,
    {} as Repository<Usuario>,
  );

  const equipo = { capitanId: 1 } as Equipo;

  it('rechaza a otro estudiante aunque conozca el ID', () => {
    expect(() =>
      servicio.permiso(equipo, {
        id: 2,
        rol: 'ESTUDIANTE',
      } as Usuario),
    ).toThrow('Solo el capitán');
  });

  it('admite al capitán y al administrador', () => {
    expect(() =>
      servicio.permiso(equipo, {
        id: 1,
        rol: 'ESTUDIANTE',
      } as Usuario),
    ).not.toThrow();

    expect(() =>
      servicio.permiso(equipo, {
        id: 2,
        rol: 'ADMIN',
      } as Usuario),
    ).not.toThrow();
  });
});
