
import { AuthService } from './auth.service';
import { Usuario } from '../database/entities';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';

describe('AuthService', () => {
  function preparar() {
    const consulta = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    const repo = {
      existsBy: jest.fn().mockResolvedValue(false),
      create: jest.fn((datos: Partial<Usuario>) => datos),
      save: jest.fn().mockResolvedValue({ id: 1 }),
      findOneByOrFail: jest.fn().mockResolvedValue({
        id: 1,
        rol: 'ESTUDIANTE',
      }),
      createQueryBuilder: jest.fn(() => consulta),
    };

    const jwt = {
      signAsync: jest.fn().mockResolvedValue('token-prueba'),
    };

    const servicio = new AuthService(
      repo as unknown as Repository<Usuario>,
      jwt as unknown as JwtService,
    );

    return { servicio, repo, jwt, consulta };
  }

  it('registra estudiante y guarda hash en vez de contraseña', async () => {
    const { servicio, repo } = preparar();

    await servicio.registro({
      nombre: 'Ana Pérez',
      alias: 'ana',
      correo: 'ANA@example.test',
      password: 'Demo12345!',
    });

    const creado = repo.create.mock.calls[0][0];

    expect(creado.rol).toBe('ESTUDIANTE');
    expect(creado.correo).toBe('ana@example.test');
    expect(creado.password).not.toBe('Demo12345!');
    expect(await compare('Demo12345!', creado.password!)).toBe(true);
  });

  it('rechaza correo duplicado sin guardar otro usuario', async () => {
    const { servicio, repo } = preparar();

    repo.existsBy.mockResolvedValue(true);

    await expect(
      servicio.registro({
        nombre: 'Ana Pérez',
        alias: 'ana',
        correo: 'ana@example.test',
        password: 'Demo12345!',
      }),
    ).rejects.toThrow('Correo ya registrado');

    expect(repo.save).not.toHaveBeenCalled();
  });

  it('rechaza contraseña incorrecta y no emite token', async () => {
    const { servicio, consulta, jwt } = preparar();

    consulta.getOne.mockResolvedValue({
      id: 1,
      activo: true,
      password: await hash('Correcta123!', 4),
    });

    await expect(
      servicio.login({
        correo: 'ana@example.test',
        password: 'Incorrecta123!',
      }),
    ).rejects.toThrow('Credenciales incorrectas');

    expect(jwt.signAsync).not.toHaveBeenCalled();
  });
});
