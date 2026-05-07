export type HolidayType = "FIXED" | "MOVED_TO_MONDAY" | "EASTER_BASED";

export interface Holiday {
  nombre: string;
  fecha: string;
  tipo: HolidayType;
  trasladado: boolean;
  fechaOriginal?: string;
}

export interface HolidaysByYearResponse {
  pais: "Colombia";
  anio: number;
  total: number;
  festivos: Holiday[];
}

export interface HolidayCheckResponse {
  fecha: string;
  esFestivo: boolean;
  festivo: Holiday | null;
}

export interface BusinessDaysResponse {
  from: string;
  to: string;
  businessDays: number;
  calendarDays: number;
  holidaysInRange: string[];
}
