import { HolidaysService } from './holidays.service';

describe('HolidaysService', () => {
  let service: HolidaysService;

  beforeEach(() => {
    service = new HolidaysService();
  });

  it('debe retornar 18 festivos para Colombia en 2026', () => {
    const response = service.getColombiaHolidays(2026);

    expect(response.country).toBe('CO');
    expect(response.year).toBe(2026);
    expect(response.holidays).toHaveLength(18);
  });

  it('debe validar que el 20 de julio de 2026 es festivo', () => {
    const response = service.isColombiaHoliday(2026, '2026-07-20');

    expect(response.isHoliday).toBe(true);
    expect(response.holiday?.name).toBe('Día de la Independencia');
  });

  it('debe validar que el 21 de julio de 2026 no es festivo', () => {
    const response = service.isColombiaHoliday(2026, '2026-07-21');

    expect(response.isHoliday).toBe(false);
    expect(response.holiday).toBeNull();
  });

  it('debe calcular días hábiles excluyendo fines de semana y festivos', () => {
    const response = service.getBusinessDays('2026-01-01', '2026-06-01');

    expect(response.businessDays).toBe(101);
    expect(response.calendarDays).toBe(152);
    expect(response.holidaysInRange).toContain('2026-01-01');
    expect(response.holidaysInRange).toContain('2026-05-18');
  });

  it('debe lanzar error si la fecha inicial es mayor a la fecha final', () => {
    expect(() => service.getBusinessDays('2026-06-01', '2026-01-01')).toThrow(
      'La fecha inicial no puede ser mayor a la fecha final.',
    );
  });
});
