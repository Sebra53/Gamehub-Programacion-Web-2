import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, Length, Matches, IsIn, IsArray, IsEmail, ArrayMaxSize,
} from 'class-validator';
export class EquipoDto {
  @ApiProperty({ example: 'Dragones IPVG' })
  @IsString() @Length(3, 80) @Matches(/\S/) nombre!: string;
  @ApiProperty({ example: 'Rocket League' })
  @IsString() @Length(2, 60) @Matches(/\S/) juegoPreferido!: string;
  @ApiProperty({ enum: ['ACTIVO', 'INACTIVO'] })
  @IsIn(['ACTIVO', 'INACTIVO']) estado!: string;
  @ApiProperty({ type: [String], example: ['ana@example.test'] })
  @IsArray() @ArrayMaxSize(20) @IsEmail({}, { each: true })
  integrantesCorreos!: string[];
}
