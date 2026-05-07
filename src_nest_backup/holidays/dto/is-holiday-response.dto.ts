import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HolidayResponseDto } from './holiday-response.dto';

export class IsHolidayResponseDto {
  @ApiProperty({
    example: '2026-07-20',
    description: 'Fecha consultada en formato YYYY-MM-DD.',
  })
  date: string;

  @ApiProperty({
    example: true,
    description: 'Indica si la fecha consultada es festivo.',
  })
  isHoliday: boolean;

  @ApiPropertyOptional({
    type: HolidayResponseDto,
    nullable: true,
    description: 'Información del festivo si aplica.',
  })
  holiday: HolidayResponseDto | null;
}
