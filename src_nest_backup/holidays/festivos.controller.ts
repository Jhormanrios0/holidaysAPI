import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { buildResponse } from '../common/dto/api-response.dto';
import { HolidaysService } from './holidays.service';
import {
  FestivoDto,
  FestivosPorAnioResponseDto,
  VerificarFestivoResponseDto,
} from './dto/festivos-response.dto';
import { HolidayResponseDto } from './dto/holiday-response.dto';
import { DateParamDto, YearParamDto } from './dto/holiday-request.dto';
import {
  FestivosApiResponseDto,
  VerificarFestivoApiResponseDto,
} from './dto/api-holiday-response.dto';

@ApiTags('Holiday')
@Controller('holiday')
export class FestivosController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get(':year')
  @ApiOperation({
    summary: 'Consultar festivos por año',
    description:
      'Retorna los festivos nacionales de Colombia para el año consultado.',
  })
  @ApiParam({
    name: 'year',
    example: 2026,
    description: 'Año a consultar.',
  })
  @ApiOkResponse({
    description: 'Festivos consultados correctamente.',
    type: FestivosApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'El año enviado no es válido.',
  })
  getHolidaysByYear(@Param() params: YearParamDto) {
    const response = this.holidaysService.getColombiaHolidays(params.year);

    const data: FestivosPorAnioResponseDto = {
      pais: 'Colombia',
      anio: response.year,
      total: response.holidays.length,
      festivos: response.holidays.map((holiday) => this.mapHoliday(holiday)),
    };

    return buildResponse('Festivos consultados correctamente.', data);
  }

  @Get('check/:date')
  @ApiOperation({
    summary: 'Verificar si una fecha es festivo',
    description:
      'Valida si una fecha corresponde a un festivo nacional de Colombia.',
  })
  @ApiParam({
    name: 'date',
    example: '2026-07-20',
    description: 'Fecha a validar en formato YYYY-MM-DD.',
  })
  @ApiOkResponse({
    description: 'Fecha validada correctamente.',
    type: VerificarFestivoApiResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'La fecha enviada no es válida.',
  })
  checkHoliday(@Param() params: DateParamDto) {
    const year = Number(params.date.substring(0, 4));
    const response = this.holidaysService.isColombiaHoliday(year, params.date);

    const data: VerificarFestivoResponseDto = {
      fecha: response.date,
      esFestivo: response.isHoliday,
      festivo: response.holiday ? this.mapHoliday(response.holiday) : null,
    };

    return buildResponse('Fecha validada correctamente.', data);
  }

  private mapHoliday(holiday: HolidayResponseDto): FestivoDto {
    return {
      nombre: holiday.name,
      fecha: holiday.date,
      tipo: holiday.type,
      trasladado: holiday.moved,
      fechaOriginal: holiday.originalDate,
    };
  }
}
