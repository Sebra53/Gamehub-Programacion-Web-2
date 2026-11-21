import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegistroDto, LoginDto, PerfilDto } from './auth.dto';
import { Publico } from './acceso';
import type { Peticion } from './acceso';
 
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private servicio: AuthService) {}
  @Publico() @Post('registro')
  registro(@Body() dto: RegistroDto) { return this.servicio.registro(dto); }
  @Publico() @Post('login')
  login(@Body() dto: LoginDto) { return this.servicio.login(dto); }
  @ApiBearerAuth() @Get('yo')
  yo(@Req() req: Peticion) { return req.usuario; }
  @ApiBearerAuth() @Patch('yo')
  perfil(@Req() req: Peticion, @Body() dto: PerfilDto) {
    return this.servicio.perfil(req.usuario.id, dto);
  }
}
