import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne,
  ManyToMany, JoinTable, JoinColumn, OneToOne, Unique,
} from 'typeorm';
import type { Relation } from 'typeorm';
 
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 80 }) nombre!: string;
  @Column({ length: 40 }) alias!: string;
  @Column({ length: 120, unique: true }) correo!: string;
  @Column({ length: 255, select: false }) password!: string;
  @Column({ length: 20, default: 'ESTUDIANTE' }) rol!: string;
  @Column({ default: true }) activo!: boolean;
}
 
@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 80 }) nombre!: string;
  @Column() capitanId!: number;
  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'capitanId' })
  capitan!: Relation<Usuario>;
  @ManyToMany(() => Usuario)
  @JoinTable({ name: 'equipo_integrantes' })
  integrantes!: Relation<Usuario[]>;
  @Column({ length: 60 }) juegoPreferido!: string;
  @Column({ length: 20, default: 'ACTIVO' }) estado!: string;
}
 
@Entity('torneos')
export class Torneo {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 100 }) nombre!: string;
  @Column({ length: 60 }) videojuego!: string;
  @Column({ length: 20, default: 'LIGA' }) modalidad!: string;
  @Column({ type: 'datetime' }) fechaInicio!: Date;
  @Column({ type: 'datetime' }) cierreInscripcion!: Date;
  @Column({ type: 'int' }) cupoMaximo!: number;
  @Column({ length: 20, default: 'ABIERTO' }) estado!: string;
}
 
@Entity('inscripciones')
@Unique(['torneoId', 'equipoId'])
export class Inscripcion {
  @PrimaryGeneratedColumn() id!: number;
  @Column() torneoId!: number;
  @ManyToOne(() => Torneo, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'torneoId' }) torneo!: Relation<Torneo>;
  @Column() equipoId!: number;
  @ManyToOne(() => Equipo, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'equipoId' }) equipo!: Relation<Equipo>;
  @Column({ type: 'datetime' }) fecha!: Date;
  @Column({ length: 20, default: 'ACEPTADA' }) estado!: string;
}
 
@Entity('partidos')
export class Partido {
  @PrimaryGeneratedColumn() id!: number;
  @Column() torneoId!: number;
  @ManyToOne(() => Torneo, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'torneoId' }) torneo!: Relation<Torneo>;
  @Column() equipoLocalId!: number;
  @ManyToOne(() => Equipo, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'equipoLocalId' })
  local!: Relation<Equipo>;
  @Column() equipoVisitanteId!: number;
  @ManyToOne(() => Equipo, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'equipoVisitanteId' })
  visitante!: Relation<Equipo>;
  @Column({ type: 'datetime' }) fechaHora!: Date;
  @Column({ type: 'int' }) ronda!: number;
  @Column({ length: 20, default: 'PROGRAMADO' }) estado!: string;
}
 
@Entity('resultados')
export class Resultado {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ unique: true }) partidoId!: number;
  @OneToOne(() => Partido, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'partidoId' }) partido!: Relation<Partido>;
  @Column({ type: 'int' }) puntajeLocal!: number;
  @Column({ type: 'int' }) puntajeVisitante!: number;
  @Column({ type: 'int', nullable: true }) ganadorId!: number | null;
  @ManyToOne(() => Equipo, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ganadorId' }) ganador!: Relation<Equipo> | null;
  @Column() registradoPor!: number;
  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'registradoPor' }) autor!: Relation<Usuario>;
}
 
export const ENTIDADES = [
  Usuario, Equipo, Torneo, Inscripcion, Partido, Resultado,
];
