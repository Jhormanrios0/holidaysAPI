import { BadRequestException, Injectable } from '@nestjs/common';
import {
  HolidayResponseDto,
  HolidayType,
  HolidaysByYearResponseDto,
} from './dto/holiday-response.dto';
import { IsHolidayResponseDto } from './dto/is-holiday-response.dto';
import { BusinessDaysResponseDto } from './dto/business-days-response.dto';

@Injectable()
export class HolidaysService {
  private readonly holidaysCache = new Map<number, HolidaysByYearResponseDto>();

  getColombiaHolidays(year: number): HolidaysByYearResponseDto {
    this.validateYear(year);

    const cachedHolidays = this.holidaysCache.get(year);

    if (cachedHolidays) {
      return cachedHolidays;
    }

    const holidays: HolidayResponseDto[] = [];

    holidays.push(
      this.createFixedHoliday(year, 1, 1, 'Año Nuevo'),
      this.createFixedHoliday(year, 5, 1, 'Día del Trabajo'),
      this.createFixedHoliday(year, 7, 20, 'Día de la Independencia'),
      this.createFixedHoliday(year, 8, 7, 'Batalla de Boyacá'),
      this.createFixedHoliday(year, 12, 8, 'Inmaculada Concepción'),
      this.createFixedHoliday(year, 12, 25, 'Navidad'),
    );

    holidays.push(
      this.createMovedToMondayHoliday(year, 1, 6, 'Día de los Reyes Magos'),
      this.createMovedToMondayHoliday(year, 3, 19, 'Día de San José'),
      this.createMovedToMondayHoliday(year, 6, 29, 'San Pedro y San Pablo'),
      this.createMovedToMondayHoliday(year, 8, 15, 'Asunción de la Virgen'),
      this.createMovedToMondayHoliday(year, 10, 12, 'Día de la Raza'),
      this.createMovedToMondayHoliday(year, 11, 1, 'Todos los Santos'),
      this.createMovedToMondayHoliday(
        year,
        11,
        11,
        'Independencia de Cartagena',
      ),
    );

    const easterSunday = this.getEasterSunday(year);

    holidays.push(
      this.createEasterRelatedHoliday(easterSunday, -3, 'Jueves Santo', false),
      this.createEasterRelatedHoliday(easterSunday, -2, 'Viernes Santo', false),
      this.createEasterRelatedHoliday(
        easterSunday,
        39,
        'Ascensión del Señor',
        true,
      ),
      this.createEasterRelatedHoliday(easterSunday, 60, 'Corpus Christi', true),
      this.createEasterRelatedHoliday(
        easterSunday,
        68,
        'Sagrado Corazón de Jesús',
        true,
      ),
    );

    const sortedHolidays = holidays.sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    const response: HolidaysByYearResponseDto = {
      country: 'CO',
      year,
      holidays: sortedHolidays,
    };

    this.holidaysCache.set(year, response);

    return response;
  }

  isColombiaHoliday(year: number, date: string): IsHolidayResponseDto {
    this.validateYear(year);
    this.validateDateFormat(date);

    const holidays = this.getColombiaHolidays(year).holidays;
    const holiday = holidays.find((item) => item.date === date) ?? null;

    return {
      date,
      isHoliday: Boolean(holiday),
      holiday,
    };
  }

  getBusinessDays(from: string, to: string): BusinessDaysResponseDto {
    this.validateDateFormat(from);
    this.validateDateFormat(to);

    const startDate = this.parseDate(from);
    const endDate = this.parseDate(to);

    if (startDate > endDate) {
      throw new BadRequestException(
        'La fecha inicial no puede ser mayor a la fecha final.',
      );
    }

    const years = this.getYearsInRange(startDate, endDate);
    const holidayDates = new Set<string>();

    for (const year of years) {
      const holidays = this.getColombiaHolidays(year).holidays;

      for (const holiday of holidays) {
        holidayDates.add(holiday.date);
      }
    }

    let businessDays = 0;
    let calendarDays = 0;
    const holidaysInRange: string[] = [];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      calendarDays++;

      const formattedDate = this.formatDate(currentDate);
      const isWeekend = this.isWeekend(currentDate);
      const isHoliday = holidayDates.has(formattedDate);

      if (isHoliday) {
        holidaysInRange.push(formattedDate);
      }

      if (!isWeekend && !isHoliday) {
        businessDays++;
      }

      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return {
      from,
      to,
      businessDays,
      calendarDays,
      holidaysInRange,
    };
  }

  private createFixedHoliday(
    year: number,
    month: number,
    day: number,
    name: string,
  ): HolidayResponseDto {
    const date = this.createUTCDate(year, month, day);

    return {
      name,
      date: this.formatDate(date),
      type: HolidayType.FIXED,
      moved: false,
    };
  }

  private createMovedToMondayHoliday(
    year: number,
    month: number,
    day: number,
    name: string,
  ): HolidayResponseDto {
    const originalDate = this.createUTCDate(year, month, day);
    const finalDate = this.moveToNextMonday(originalDate);

    return {
      name,
      date: this.formatDate(finalDate),
      type: HolidayType.MOVED_TO_MONDAY,
      moved: this.formatDate(originalDate) !== this.formatDate(finalDate),
      originalDate: this.formatDate(originalDate),
    };
  }

  private createEasterRelatedHoliday(
    easterSunday: Date,
    daysFromEaster: number,
    name: string,
    moveToMonday: boolean,
  ): HolidayResponseDto {
    const originalDate = this.addDays(easterSunday, daysFromEaster);
    const finalDate = moveToMonday
      ? this.moveToNextMonday(originalDate)
      : originalDate;

    return {
      name,
      date: this.formatDate(finalDate),
      type: HolidayType.EASTER_RELATED,
      moved: this.formatDate(originalDate) !== this.formatDate(finalDate),
      originalDate: this.formatDate(originalDate),
    };
  }

  private moveToNextMonday(date: Date): Date {
    const dayOfWeek = date.getUTCDay();

    if (dayOfWeek === 1) {
      return new Date(date);
    }

    const daysToAdd = (8 - dayOfWeek) % 7;

    return this.addDays(date, daysToAdd);
  }

  private isWeekend(date: Date): boolean {
    const dayOfWeek = date.getUTCDay();

    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  private addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setUTCDate(newDate.getUTCDate() + days);

    return newDate;
  }

  private createUTCDate(year: number, month: number, day: number): Date {
    return new Date(Date.UTC(year, month - 1, day));
  }

  private parseDate(date: string): Date {
    const [year, month, day] = date.split('-').map(Number);

    return this.createUTCDate(year, month, day);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getYearsInRange(startDate: Date, endDate: Date): number[] {
    const years: number[] = [];

    for (
      let year = startDate.getUTCFullYear();
      year <= endDate.getUTCFullYear();
      year++
    ) {
      years.push(year);
    }

    return years;
  }

  private validateYear(year: number): void {
    if (!Number.isInteger(year) || year < 1900 || year > 2200) {
      throw new BadRequestException(
        'El año debe ser un número entero entre 1900 y 2200.',
      );
    }
  }

  private validateDateFormat(date: string): void {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (typeof date !== 'string' || !dateRegex.test(date)) {
      throw new BadRequestException('La fecha debe tener formato YYYY-MM-DD.');
    }

    const parsedDate = this.parseDate(date);

    if (this.formatDate(parsedDate) !== date) {
      throw new BadRequestException('La fecha enviada no es válida.');
    }
  }

  private getEasterSunday(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);

    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return this.createUTCDate(year, month, day);
  }
}
