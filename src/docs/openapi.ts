export const getOpenApiSpec = (origin: string) => ({
  openapi: "3.0.3",
  info: {
    title: "HOCO API",
    version: "1.0.0",
    description:
      "API pública para consultar festivos de Colombia, validar fechas festivas y calcular días hábiles.",
  },
  servers: [
    {
      url: origin,
      description: "Servidor actual",
    },
  ],
  tags: [
    {
      name: "Sistema",
      description: "Estado de la API.",
    },
    {
      name: "Festivos",
      description: "Consultas de festivos nacionales de Colombia.",
    },
    {
      name: "Días hábiles",
      description: "Cálculo de días hábiles excluyendo sábados, domingos y festivos.",
    },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Sistema"],
        summary: "Estado de la API",
        responses: {
          200: {
            description: "API funcionando correctamente.",
          },
        },
      },
    },
    "/api/holiday/{year}": {
      get: {
        tags: ["Festivos"],
        summary: "Consultar festivos por año",
        parameters: [
          {
            name: "year",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              example: 2026,
            },
          },
        ],
        responses: {
          200: {
            description: "Festivos consultados correctamente.",
          },
          400: {
            description: "Año inválido.",
          },
        },
      },
    },
    "/api/holiday/check/{date}": {
      get: {
        tags: ["Festivos"],
        summary: "Validar si una fecha es festiva",
        parameters: [
          {
            name: "date",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "2026-07-20",
            },
          },
        ],
        responses: {
          200: {
            description: "Fecha validada correctamente.",
          },
          400: {
            description: "Fecha inválida.",
          },
        },
      },
    },
    "/api/business-days": {
      get: {
        tags: ["Días hábiles"],
        summary: "Calcular días hábiles entre dos fechas",
        parameters: [
          {
            name: "from",
            in: "query",
            required: true,
            schema: {
              type: "string",
              example: "2026-01-01",
            },
          },
          {
            name: "to",
            in: "query",
            required: true,
            schema: {
              type: "string",
              example: "2026-06-01",
            },
          },
        ],
        responses: {
          200: {
            description: "Días hábiles calculados correctamente.",
          },
          400: {
            description: "Fechas inválidas.",
          },
        },
      },
    },
  },
});
