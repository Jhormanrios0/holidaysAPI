import { ApiProperty } from '@nestjs/swagger';

export class DiasHabilesResponseDto {
  @ApiProperty({ example: '2026-01-01' })
  desde: string;

  @ApiProperty({ example: '2026-06-01' })
  hasta: string;

  @ApiProperty({
    example: 101,
    description: 'Cantidad de días hábiles.',
  })
  diasHabiles: number;

  @ApiProperty({
    example: 152,
    description: 'Cantidad de días calendario.',
  })
  diasCalendario: number;

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
  festivosEnRango: string[];
}
