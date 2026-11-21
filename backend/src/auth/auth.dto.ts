import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
 
export class RegistroDto {
  @ApiProperty({ example: 'Ana Pérez' })
  @IsString() @Length(3, 80) @Matches(/\S/)
  nombre!: string;
  @ApiProperty({ example: 'ana' })
  @IsString() @Length(3, 40) @Matches(/\S/)
  alias!: string;
  @ApiProperty({ example: 'ana@example.test' })
  @IsEmail() @Length(5, 120)
  correo!: string;
  @ApiProperty({ minLength: 8, example: 'ClaveDemo123!' })
  @IsString() @Length(8, 72)
  password!: string;
}
export class LoginDto extends PickType(
  RegistroDto, ['correo', 'password'] as const,
) {}
export class PerfilDto extends PartialType(PickType(
  RegistroDto, ['nombre', 'alias'] as const,
), { skipNullProperties: false }) {}
