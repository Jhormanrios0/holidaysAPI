import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum HolidayType {
  FIXED = 'FIXED',
  MOVED_TO_MONDAY = 'MOVED_TO_MONDAY',
  EASTER_RELATED = 'EASTER_RELATED',
}

export class HolidayResponseDto {
  @ApiProperty({
    example: 'Día de la Independencia',
    description: 'Nombre del festivo.',
  })
  name: string;

  @ApiProperty({
    example: '2026-07-20',
    description: 'Fecha del festivo en formato YYYY-MM-DD.',
  })
  date: string;

  @ApiProperty({
    enum: HolidayType,
    example: HolidayType.FIXED,
    description: 'Tipo de festivo.',
  })
  type: HolidayType;

  @ApiProperty({
    example: false,
    description: 'Indica si el festivo fue trasladado al lunes.',
  })
  moved: boolean;

  @ApiPropertyOptional({
    example: '2026-01-06',
    description: 'Fecha original antes del traslado.',
  })
  originalDate?: string;
}

export class HolidaysByYearResponseDto {
  @ApiProperty({ example: 'CO' })
  country: string;

  @ApiProperty({ example: 2026 })
  year: number;

  @ApiProperty({
    type: [HolidayResponseDto],
    description: 'Lista de festivos del año consultado.',
  })
  holidays: HolidayResponseDto[];
}
