import { ApiProperty } from '@nestjs/swagger';
import {
  FestivosPorAnioResponseDto,
  VerificarFestivoResponseDto,
} from './festivos-response.dto';
import { DiasHabilesResponseDto } from './dias-habiles-response.dto';

export class FestivosApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Festivos consultados correctamente.' })
  message: string;

  @ApiProperty({ type: FestivosPorAnioResponseDto })
  data: FestivosPorAnioResponseDto;
}

export class VerificarFestivoApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Fecha validada correctamente.' })
  message: string;

  @ApiProperty({ type: VerificarFestivoResponseDto })
  data: VerificarFestivoResponseDto;
}

export class DiasHabilesApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Días hábiles calculados correctamente.' })
  message: string;

  @ApiProperty({ type: DiasHabilesResponseDto })
  data: DiasHabilesResponseDto;
}
