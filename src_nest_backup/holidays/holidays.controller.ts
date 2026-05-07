import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { HolidaysService } from './holidays.service';
import { HolidaysByYearResponseDto } from './dto/holiday-response.dto';
import { IsHolidayResponseDto } from './dto/is-holiday-response.dto';
import { BusinessDaysResponseDto } from './dto/business-days-response.dto';

@ApiTags('Holidays')
@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Get('co/business-days')
  @ApiOperation({
    summary: 'Calcular días hábiles entre dos fechas',
    description:
      'Calcula días hábiles en Colombia excluyendo sábados, domingos y festivos nacionales.',
  })
  @ApiQuery({
    name: 'from',
    example: '2026-05-11',
    description: 'Fecha inicial en formato YYYY-MM-DD.',
  })
  @ApiQuery({
    name: 'to',
    example: '2026-07-15',
    description: 'Fecha final en formato YYYY-MM-DD.',
  })
  @ApiOkResponse({
    description: 'Cálculo de días hábiles generado correctamente.',
    type: BusinessDaysResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Alguna de las fechas enviadas no es válida.',
  })
  getBusinessDays(
    @Query('from') from: string,
    @Query('to') to: string,
  ): BusinessDaysResponseDto {
    return this.holidaysService.getBusinessDays(from, to);
  }

  @Get('co/:year')
  @ApiOperation({
    summary: 'Listar festivos de Colombia por año',
    description:
      'Retorna los días festivos de Colombia para el año consultado, incluyendo festivos fijos, trasladables al lunes y relacionados con Semana Santa.',
  })
  @ApiParam({
    name: 'year',
    example: 2026,
    description: 'Año a consultar.',
  })
  @ApiOkResponse({
    description: 'Listado de festivos generado correctamente.',
    type: HolidaysByYearResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'El año enviado no es válido.',
  })
  getColombiaHolidays(
    @Param('year', ParseIntPipe) year: number,
  ): HolidaysByYearResponseDto {
    return this.holidaysService.getColombiaHolidays(year);
  }

  @Get('co/:year/is-holiday/:date')
  @ApiOperation({
    summary: 'Validar si una fecha es festivo en Colombia',
    description:
      'Recibe un año y una fecha en formato YYYY-MM-DD. Retorna si la fecha corresponde o no a un festivo colombiano.',
  })
  @ApiParam({
    name: 'year',
    example: 2026,
    description: 'Año a consultar.',
  })
  @ApiParam({
    name: 'date',
    example: '2026-07-20',
    description: 'Fecha a validar en formato YYYY-MM-DD.',
  })
  @ApiOkResponse({
    description: 'Resultado de la validación.',
    type: IsHolidayResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'El año o la fecha enviada no es válida.',
  })
  isColombiaHoliday(
    @Param('year', ParseIntPipe) year: number,
    @Param('date') date: string,
  ): IsHolidayResponseDto {
    return this.holidaysService.isColombiaHoliday(year, date);
  }
}
