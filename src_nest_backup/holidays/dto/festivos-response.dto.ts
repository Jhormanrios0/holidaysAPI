import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FestivoDto {
  @ApiProperty({
    example: 'Día de la Independencia',
    description: 'Nombre del festivo.',
  })
  nombre: string;

  @ApiProperty({
    example: '2026-07-20',
    description: 'Fecha del festivo.',
  })
  fecha: string;

  @ApiProperty({
    example: 'FIXED',
    description: 'Tipo de festivo.',
  })
  tipo: string;

  @ApiProperty({
    example: false,
    description: 'Indica si fue trasladado al lunes.',
  })
  trasladado: boolean;

  @ApiPropertyOptional({
    example: '2026-01-06',
    description: 'Fecha original antes del traslado.',
  })
  fechaOriginal?: string;
}

export class FestivosPorAnioResponseDto {
  @ApiProperty({ example: 'Colombia' })
  pais: string;

  @ApiProperty({ example: 2026 })
  anio: number;

  @ApiProperty({
    example: 18,
    description: 'Cantidad total de festivos.',
  })
  total: number;

  @ApiProperty({
    type: [FestivoDto],
    description: 'Lista de festivos.',
  })
  festivos: FestivoDto[];
}

export class VerificarFestivoResponseDto {
  @ApiProperty({ example: '2026-07-20' })
  fecha: string;

  @ApiProperty({ example: true })
  esFestivo: boolean;

  @ApiPropertyOptional({
    type: FestivoDto,
    nullable: true,
  })
  festivo: FestivoDto | null;
}
