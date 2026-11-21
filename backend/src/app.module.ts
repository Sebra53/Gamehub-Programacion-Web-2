import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTIDADES } from './database/entities';
import { TorneosModule } from './torneos/torneos.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { EquiposModule} from './equipos/equipos.module';
import { AuthModule } from './auth/auth.module'; 
 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot ({
      
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ENTIDADES,
      synchronize: true,
    }),
    AuthModule,
    TorneosModule,
    EquiposModule,
    InscripcionesModule,
  ],
})
export class AppModule {}
