import { ApiProperty } from '@nestjs/swagger';

export class BusinessDaysResponseDto {
  @ApiProperty({ example: '2026-01-01' })
  from: string;

  @ApiProperty({ example: '2026-06-01' })
  to: string;

  @ApiProperty({ example: 101 })
  businessDays: number;

  @ApiProperty({ example: 152 })
  calendarDays: number;

  @ApiProperty({
    example: [
      '2026-01-01',
      '2026-01-12',
      '2026-03-23',
      '2026-04-02',
      '2026-04-03',
      '2026-05-01',
      '2026-05-18',
    ],
  })
  holidaysInRange: string[];
}
