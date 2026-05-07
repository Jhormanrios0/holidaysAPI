import { Hono } from "hono";
import { ok, fail } from "../lib/response";
import { parseDateString, parseYear } from "../lib/validators";
import { HolidaysService } from "./holidays.service";

export const holidaysRoutes = new Hono();
const service = new HolidaysService();

holidaysRoutes.get("/health", (c) => {
  return ok(c, "HOCO API Colombia funcionando correctamente.", {
    status: "ok",
    service: "hoco-api-colombia",
    timestamp: new Date().toISOString(),
  });
});

holidaysRoutes.get("/holiday/check/:date", (c) => {
  const dateParam = c.req.param("date");
  const date = parseDateString(dateParam);

  if (!date) {
    return fail(
      c,
      "La fecha enviada no es válida. Usa el formato YYYY-MM-DD.",
      400,
      { date: dateParam },
    );
  }

  return ok(
    c,
    "Fecha validada correctamente.",
    service.checkHoliday(date),
    60 * 60 * 24,
  );
});

holidaysRoutes.get("/holiday/:year", (c) => {
  const yearParam = c.req.param("year");
  const year = parseYear(yearParam);

  if (!year) {
    return fail(
      c,
      "El año enviado no es válido. Usa un año entre 1900 y 2100.",
      400,
      { year: yearParam },
    );
  }

  return ok(
    c,
    "Festivos consultados correctamente.",
    service.getHolidaysByYear(year),
    60 * 60 * 24 * 30,
  );
});

holidaysRoutes.get("/business-days", (c) => {
  const fromParam = c.req.query("from");
  const toParam = c.req.query("to");

  if (!fromParam || !toParam) {
    return fail(c, "Debes enviar los parámetros from y to.", 400, {
      example: "/api/business-days?from=2026-01-01&to=2026-06-01",
    });
  }

  const from = parseDateString(fromParam);
  const to = parseDateString(toParam);

  if (!from || !to) {
    return fail(
      c,
      "Las fechas enviadas no son válidas. Usa el formato YYYY-MM-DD.",
      400,
      { from: fromParam, to: toParam },
    );
  }

  if (from.getTime() > to.getTime()) {
    return fail(
      c,
      "La fecha inicial no puede ser mayor que la fecha final.",
      400,
      { from: fromParam, to: toParam },
    );
  }

  return ok(
    c,
    "Días hábiles calculados correctamente.",
    service.getBusinessDays(from, to),
    60 * 60 * 24,
  );
});
