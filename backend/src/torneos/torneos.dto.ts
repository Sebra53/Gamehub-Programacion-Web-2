import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString, Length, Matches, IsIn, IsISO8601, IsInt, Min, Max,
} from 'class-validator';
export class TorneoDto {
  @ApiProperty({ example: 'Liga IPVG' })
  @IsString() @Length(3, 100) @Matches(/\S/) nombre!: string;
  @ApiProperty({ example: 'Rocket League' })
  @IsString() @Length(2, 60) @Matches(/\S/) videojuego!: string;
  @ApiProperty({ enum: ['LIGA'] })
  @IsIn(['LIGA']) modalidad!: string;
  @ApiProperty({ example: '2026-11-22T15:00:00-03:00' })
  @IsISO8601({ strict: true }) fechaInicio!: string;
  @ApiProperty({ example: '2026-11-21T18:00:00-03:00' })
  @IsISO8601({ strict: true }) cierreInscripcion!: string;
  @ApiProperty({ example: 8, minimum: 2 })
  @IsInt() @Min(2) @Max(128) cupoMaximo!: number;
  @ApiProperty({ enum: ['ABIERTO', 'CERRADO', 'FINALIZADO'] })
  @IsIn(['ABIERTO', 'CERRADO', 'FINALIZADO']) estado!: string;
}
export class EditarTorneoDto extends PartialType(
  TorneoDto, { skipNullProperties: false },
) {}
