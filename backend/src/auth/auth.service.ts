import {
  Injectable, ConflictException, UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import { Usuario } from '../database/entities';
import { RegistroDto, LoginDto, PerfilDto } from './auth.dto';
 
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private repo: Repository<Usuario>,
    private jwt: JwtService,
  ) {}
  async registro(dto: RegistroDto) {
    const correo = dto.correo.trim().toLowerCase();
    if (await this.repo.existsBy({ correo })) {
      throw new ConflictException('Correo ya registrado');
    }
    const usuario = this.repo.create({
      ...dto, correo, password: await hash(dto.password, 12),
      rol: 'ESTUDIANTE', activo: true,
    });
    try { await this.repo.save(usuario); }
    catch (e) {
      if ((e as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Correo ya registrado');
      }
      throw e;
    }
    return this.repo.findOneByOrFail({ id: usuario.id });
  }
  async login(dto: LoginDto) {
    const usuario = await this.repo.createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.correo = :correo', {
        correo: dto.correo.trim().toLowerCase(),
      }).getOne();
    if (!usuario || !usuario.activo ||
      !(await compare(dto.password, usuario.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return { access_token: await this.jwt.signAsync({ sub: usuario.id }) };
  }
  async perfil(id: number, dto: PerfilDto) {
    await this.repo.update(id, dto);
    return this.repo.findOneByOrFail({ id });
  }
}
