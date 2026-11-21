import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
export class InscripcionDto {
  @ApiProperty({ example: 1 }) @IsInt() @Min(1) torneoId!: number;
  @ApiProperty({ example: 1 }) @IsInt() @Min(1) equipoId!: number;
}
