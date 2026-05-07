import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Matches, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class YearParamDto {
  @ApiProperty({
    example: 2026,
    description: 'Año a consultar. Debe estar entre 1900 y 2200.',
  })
  @Type(() => Number)
  @IsInt({ message: 'El año debe ser un número entero.' })
  @Min(1900, { message: 'El año mínimo permitido es 1900.' })
  @Max(2200, { message: 'El año máximo permitido es 2200.' })
  year: number;
}

export class DateParamDto {
  @ApiProperty({
    example: '2026-07-20',
    description: 'Fecha en formato YYYY-MM-DD.',
  })
  @IsNotEmpty({ message: 'La fecha es obligatoria.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener formato YYYY-MM-DD.',
  })
  date: string;
}

export class BusinessDaysQueryDto {
  @ApiProperty({
    example: '2026-01-01',
    description: 'Fecha inicial en formato YYYY-MM-DD.',
  })
  @IsNotEmpty({ message: 'La fecha inicial es obligatoria.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha inicial debe tener formato YYYY-MM-DD.',
  })
  from: string;

  @ApiProperty({
    example: '2026-06-01',
    description: 'Fecha final en formato YYYY-MM-DD.',
  })
  @IsNotEmpty({ message: 'La fecha final es obligatoria.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha final debe tener formato YYYY-MM-DD.',
  })
  to: string;
}
