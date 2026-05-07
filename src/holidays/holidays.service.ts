import type {
  BusinessDaysResponse,
  Holiday,
  HolidaysByYearResponse,
  HolidayType,
  HolidayCheckResponse,
} from "./holidays.types";

const createUtcDate = (year: number, month: number, day: number) => {
  return new Date(Date.UTC(year, month - 1, day));
};

const formatDate = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
};

const moveToNextMonday = (date: Date) => {
  const day = date.getUTCDay();

  if (day === 1) return date;

  const daysToAdd = (8 - day) % 7;
  return addDays(date, daysToAdd);
};

const isWeekend = (date: Date) => {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
};

const getEasterSunday = (year: number) => {
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

  return createUtcDate(year, month, day);
};

const fixedHoliday = (
  nombre: string,
  year: number,
  month: number,
  day: number,
): Holiday => {
  return {
    nombre,
    fecha: formatDate(createUtcDate(year, month, day)),
    tipo: "FIXED",
    trasladado: false,
  };
};

const movedHoliday = (
  nombre: string,
  year: number,
  month: number,
  day: number,
): Holiday => {
  const originalDate = createUtcDate(year, month, day);
  const finalDate = moveToNextMonday(originalDate);
  const fechaOriginal = formatDate(originalDate);
  const fecha = formatDate(finalDate);
  const trasladado = fecha !== fechaOriginal;

  return {
    nombre,
    fecha,
    tipo: "MOVED_TO_MONDAY",
    trasladado,
    ...(trasladado ? { fechaOriginal } : {}),
  };
};

const easterHoliday = (
  nombre: string,
  easterSunday: Date,
  offsetDays: number,
  tipo: HolidayType = "EASTER_BASED",
): Holiday => {
  return {
    nombre,
    fecha: formatDate(addDays(easterSunday, offsetDays)),
    tipo,
    trasladado: false,
  };
};

export class HolidaysService {
  getHolidaysByYear(year: number): HolidaysByYearResponse {
    const easterSunday = getEasterSunday(year);

    const holidays: Holiday[] = [
      fixedHoliday("Año Nuevo", year, 1, 1),
      movedHoliday("Día de los Reyes Magos", year, 1, 6),
      movedHoliday("Día de San José", year, 3, 19),

      easterHoliday("Jueves Santo", easterSunday, -3),
      easterHoliday("Viernes Santo", easterSunday, -2),

      fixedHoliday("Día del Trabajo", year, 5, 1),

      easterHoliday("Ascensión del Señor", easterSunday, 43, "MOVED_TO_MONDAY"),
      easterHoliday("Corpus Christi", easterSunday, 64, "MOVED_TO_MONDAY"),
      easterHoliday("Sagrado Corazón de Jesús", easterSunday, 71, "MOVED_TO_MONDAY"),

      movedHoliday("San Pedro y San Pablo", year, 6, 29),

      fixedHoliday("Día de la Independencia", year, 7, 20),
      fixedHoliday("Batalla de Boyacá", year, 8, 7),

      movedHoliday("Asunción de la Virgen", year, 8, 15),
      movedHoliday("Día de la Raza", year, 10, 12),
      movedHoliday("Todos los Santos", year, 11, 1),
      movedHoliday("Independencia de Cartagena", year, 11, 11),

      fixedHoliday("Inmaculada Concepción", year, 12, 8),
      fixedHoliday("Navidad", year, 12, 25),
    ].sort((a, b) => a.fecha.localeCompare(b.fecha));

    return {
      pais: "Colombia",
      anio: year,
      total: holidays.length,
      festivos: holidays,
    };
  }

  checkHoliday(date: Date): HolidayCheckResponse {
    const fecha = formatDate(date);
    const year = date.getUTCFullYear();
    const holiday = this.getHolidaysByYear(year).festivos.find(
      (item) => item.fecha === fecha,
    );

    return {
      fecha,
      esFestivo: Boolean(holiday),
      festivo: holiday ?? null,
    };
  }

  getBusinessDays(from: Date, to: Date): BusinessDaysResponse {
    const fromText = formatDate(from);
    const toText = formatDate(to);

    const fromYear = from.getUTCFullYear();
    const toYear = to.getUTCFullYear();

    const holidaySet = new Set<string>();

    for (let year = fromYear; year <= toYear; year += 1) {
      for (const holiday of this.getHolidaysByYear(year).festivos) {
        holidaySet.add(holiday.fecha);
      }
    }

    let cursor = new Date(from);
    let businessDays = 0;
    let calendarDays = 0;
    const holidaysInRange: string[] = [];

    while (cursor.getTime() <= to.getTime()) {
      const current = formatDate(cursor);

      calendarDays += 1;

      if (holidaySet.has(current)) {
        holidaysInRange.push(current);
      }

      if (!isWeekend(cursor) && !holidaySet.has(current)) {
        businessDays += 1;
      }

      cursor = addDays(cursor, 1);
    }

    return {
      from: fromText,
      to: toText,
      businessDays,
      calendarDays,
      holidaysInRange,
    };
  }
}
