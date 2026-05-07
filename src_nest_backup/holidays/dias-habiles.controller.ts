import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { buildResponse } from '../common/dto/api-response.dto';
import { HolidaysService } from './holidays.service';
import { DiasHabilesResponseDto } from './dto/dias-habiles-response.dto';
import { BusinessDaysQueryDto } from './dto/holiday-request.dto';
import { DiasHabilesApiResponseDto } from './dto/api-holiday-response.dto';

@ApiTags('Business Days')
@Controller('business-days')
export class DiasHabilesController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get()
  @ApiOperation({
    summary: 'Calcular días hábiles',
    description:
      'Calcula días hábiles en Colombia excluyendo sábados, domingos y festivos nacionales.',
  })
  @ApiQuery({
    name: 'from',
    example: '2026-01-01',
    description: 'Fecha inicial en formato YYYY-MM-DD.',
  })
  @ApiQuery({
    name: 'to',
    example: '2026-06-01',
    description: 'Fecha final en formato YYYY-MM-DD.',
  })
  @ApiOkResponse({
    description: 'Días hábiles calculados correctamente.',
    type: DiasHabilesApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Alguna de las fechas enviadas no es válida.',
  })
  getBusinessDays(@Query() query: BusinessDaysQueryDto) {
    const response = this.holidaysService.getBusinessDays(query.from, query.to);

    const data: DiasHabilesResponseDto = {
      desde: response.from,
      hasta: response.to,
      diasHabiles: response.businessDays,
      diasCalendario: response.calendarDays,
      festivosEnRango: response.holidaysInRange,
    };

    return buildResponse('Días hábiles calculados correctamente.', data);
  }
}
