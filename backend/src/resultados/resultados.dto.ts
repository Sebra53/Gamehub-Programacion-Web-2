import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';
export class ResultadoDto {
  @ApiProperty({ example: 3 }) @IsInt() @Min(0) @Max(999)
  puntajeLocal!: number;
  @ApiProperty({ example: 1 }) @IsInt() @Min(0) @Max(999)
  puntajeVisitante!: number;
}
