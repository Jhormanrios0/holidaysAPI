# Holiday API Colombia

API construida con **NestJS** para consultar festivos nacionales de Colombia, verificar si una fecha es festivo y calcular días hábiles excluyendo sábados, domingos y festivos.

## Características

- Consulta de festivos nacionales de Colombia por año.
- Verificación de si una fecha específica es festivo.
- Cálculo de días hábiles entre dos fechas.
- Exclusión automática de sábados, domingos y festivos.
- Documentación interactiva con Swagger.
- Validaciones de entrada con class-validator.
- Respuesta estándar para todos los endpoints.
- Seguridad básica con Helmet.
- CORS habilitado.
- Compresión de respuestas.
- Cache en memoria para festivos por año.
- Tests unitarios con Jest.

## Endpoints disponibles

### Health

Verifica si la API está funcionando correctamente.

```http
GET /api/health
```

Ejemplo de respuesta:

```json
{
  "success": true,
  "message": "Holiday API Colombia funcionando correctamente.",
  "data": {
    "status": "ok",
    "service": "holiday-api-colombia",
    "timestamp": "2026-05-06T20:00:00.000Z"
  }
}
```

### Consultar festivos por año

Retorna todos los festivos nacionales de Colombia para el año consultado.

```http
GET /api/holiday/2026
```

Ejemplo de respuesta:

```json
{
  "success": true,
  "message": "Festivos consultados correctamente.",
  "data": {
    "pais": "Colombia",
    "anio": 2026,
    "total": 18,
    "festivos": [
      {
        "nombre": "Año Nuevo",
        "fecha": "2026-01-01",
        "tipo": "FIXED",
        "trasladado": false
      },
      {
        "nombre": "Día de los Reyes Magos",
        "fecha": "2026-01-12",
        "tipo": "MOVED_TO_MONDAY",
        "trasladado": true,
        "fechaOriginal": "2026-01-06"
      }
    ]
  }
}
```

### Verificar si una fecha es festivo

Valida si una fecha específica corresponde a un festivo nacional de Colombia.

```http
GET /api/holiday/check/2026-07-20
```

Ejemplo de respuesta:

```json
{
  "success": true,
  "message": "Fecha validada correctamente.",
  "data": {
    "fecha": "2026-07-20",
    "esFestivo": true,
    "festivo": {
      "nombre": "Día de la Independencia",
      "fecha": "2026-07-20",
      "tipo": "FIXED",
      "trasladado": false
    }
  }
}
```

Si la fecha no es festivo:

```json
{
  "success": true,
  "message": "Fecha validada correctamente.",
  "data": {
    "fecha": "2026-07-21",
    "esFestivo": false,
    "festivo": null
  }
}
```

### Calcular días hábiles

Calcula los días hábiles entre dos fechas, excluyendo sábados, domingos y festivos nacionales.

```http
GET /api/business-days?from=2026-01-01&to=2026-06-01
```

Ejemplo de respuesta:

```json
{
  "success": true,
  "message": "Días hábiles calculados correctamente.",
  "data": {
    "desde": "2026-01-01",
    "hasta": "2026-06-01",
    "diasHabiles": 101,
    "diasCalendario": 152,
    "festivosEnRango": [
      "2026-01-01",
      "2026-01-12",
      "2026-03-23",
      "2026-04-02",
      "2026-04-03",
      "2026-05-01",
      "2026-05-18"
    ]
  }
}
```

### Swagger

La documentación interactiva está disponible en:

http://localhost:3000/docs

Desde Swagger puedes probar todos los endpoints sin usar PowerShell ni Postman.

## Instalación

Instalar dependencias:

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run start:dev
```

La API quedará disponible en:

http://localhost:3000

Swagger estará disponible en:

http://localhost:3000/docs

## Ejecutar tests

```bash
npm run test
```

## Estructura principal

```
src/
  common/
    dto/
      api-response.dto.ts
  health/
    health.controller.ts
    health.module.ts
  holidays/
    dto/
      api-holiday-response.dto.ts
      business-days-response.dto.ts
      dias-habiles-response.dto.ts
      festivos-response.dto.ts
      holiday-request.dto.ts
      holiday-response.dto.ts
      is-holiday-response.dto.ts
    dias-habiles.controller.ts
    festivos.controller.ts
    holidays.module.ts
    holidays.service.ts
    holidays.service.spec.ts
  app.module.ts
  main.ts
```

## Respuesta estándar

Todos los endpoints responden con la misma estructura:

```json
{
  "success": true,
  "message": "Operación realizada correctamente.",
  "data": {}
}
```

## Validaciones

La API valida:

- Año entre 1900 y 2200.
- Fechas en formato YYYY-MM-DD.
- Fecha inicial menor o igual a la fecha final.
- Parámetros obligatorios.

## Tecnologías usadas

- NestJS
- TypeScript
- Swagger
- class-validator
- class-transformer
- Helmet
- Compression
- Jest

## Autor

Proyecto creado como API base para consultar festivos y días hábiles de Colombia.
