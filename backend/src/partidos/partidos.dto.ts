import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsISO8601 } from 'class-validator';
export class PartidoDto {
  @ApiProperty({ example: 1 }) @IsInt() @Min(1) torneoId!: number;
  @ApiProperty({ example: 1 }) @IsInt() @Min(1) equipoLocalId!: number;
  @ApiProperty({ example: 2 }) @IsInt() @Min(1) equipoVisitanteId!: number;
  @ApiProperty({ example: '2026-11-22T16:00:00-03:00' })
  @IsISO8601({ strict: true }) fechaHora!: string;
  @ApiProperty({ example: 1 }) @IsInt() @Min(1) ronda!: number;
}

