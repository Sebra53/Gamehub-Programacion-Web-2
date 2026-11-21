import {
  Injectable, CanActivate, ExecutionContext, SetMetadata,
  UnauthorizedException, ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../database/entities';
import type { Request } from 'express';
 
export const Publico = () => SetMetadata('publico', true);
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export type Peticion = Request & { usuario: Usuario };
 
@Injectable()
export class AccesoGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
    @InjectRepository(Usuario) private repo: Repository<Usuario>,
  ) {}
  async canActivate(contexto: ExecutionContext) {
    const destinos = [contexto.getHandler(), contexto.getClass()];
    if (this.reflector.getAllAndOverride('publico', destinos)) return true;
    const req = contexto.switchToHttp().getRequest<Peticion>();
    const [tipo, token] = (req.headers.authorization || '').split(' ');
    if (tipo !== 'Bearer' || !token) {
      throw new UnauthorizedException('Inicia sesión');
    }
    let sub: number;
    try {
      const carga = await this.jwt.verifyAsync<{ sub: number }>(token);
      sub = carga.sub;
      if (!Number.isInteger(sub)) throw new Error('Token inválido');
    } catch { throw new UnauthorizedException('Sesión vencida o inválida'); }
    const usuario = await this.repo.findOneBy({ id: sub, activo: true });
    if (!usuario) throw new UnauthorizedException('Usuario inactivo');
    req.usuario = usuario;
    const roles = this.reflector.getAllAndOverride<string[]>('roles', destinos);
    if (roles && !roles.includes(usuario.rol)) {
      throw new ForbiddenException('Rol sin permiso para esta acción');
    }
    return true;
  }
}
