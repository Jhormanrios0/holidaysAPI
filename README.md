# HOCO API

HOCO API es una API pública para consultar festivos nacionales de Colombia, validar si una fecha es festiva y calcular días hábiles excluyendo sábados, domingos y festivos.

El nombre viene de:

- HO: Holiday
- CO: Colombia

## URL pública

API:

https://api.hocoapi-colombia.workers.dev

Documentación:

https://api.hocoapi-colombia.workers.dev/api/docs

OpenAPI JSON:

https://api.hocoapi-colombia.workers.dev/api/openapi.json

## Tecnologías

- Hono
- TypeScript
- Cloudflare Workers
- Wrangler
- OpenAPI
- Swagger UI

## Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | /api/health | Estado de la API |
| GET | /api/holiday/:year | Consulta los festivos de Colombia por año |
| GET | /api/holiday/check/:date | Valida si una fecha es festiva |
| GET | /api/business-days?from=YYYY-MM-DD&to=YYYY-MM-DD | Calcula días hábiles entre dos fechas |

## Respuesta estándar

Respuesta exitosa:

{
  "success": true,
  "message": "Operación realizada correctamente.",
  "data": {}
}

Respuesta con error:

{
  "success": false,
  "message": "Descripción del error.",
  "error": {
    "statusCode": 400,
    "details": {}
  }
}

## Ejemplos

### Estado de la API

GET /api/health

Ejemplo:

https://api.hocoapi-colombia.workers.dev/api/health

### Consultar festivos por año

GET /api/holiday/2026

Ejemplo:

https://api.hocoapi-colombia.workers.dev/api/holiday/2026

### Validar una fecha

GET /api/holiday/check/2026-07-20

Ejemplo:

https://api.hocoapi-colombia.workers.dev/api/holiday/check/2026-07-20

### Calcular días hábiles

GET /api/business-days?from=2026-01-01&to=2026-06-01

Ejemplo:

https://api.hocoapi-colombia.workers.dev/api/business-days?from=2026-01-01&to=2026-06-01

## Cómo se calculan los festivos de Colombia

HOCO API calcula los festivos internamente, sin depender de servicios externos.

La API contempla tres tipos principales de festivos:

### 1. Festivos fijos

Son fechas que siempre ocurren el mismo día y mes.

Ejemplos:

| Festivo | Fecha |
|---|---|
| Año Nuevo | 1 de enero |
| Día del Trabajo | 1 de mayo |
| Independencia de Colombia | 20 de julio |
| Batalla de Boyacá | 7 de agosto |
| Inmaculada Concepción | 8 de diciembre |
| Navidad | 25 de diciembre |

### 2. Festivos trasladados al lunes

Algunos festivos en Colombia se trasladan al siguiente lunes cuando no caen lunes.

Ejemplos:

| Festivo | Fecha base |
|---|---|
| Día de los Reyes Magos | 6 de enero |
| Día de San José | 19 de marzo |
| San Pedro y San Pablo | 29 de junio |
| Asunción de la Virgen | 15 de agosto |
| Día de la Raza | 12 de octubre |
| Todos los Santos | 1 de noviembre |
| Independencia de Cartagena | 11 de noviembre |

### 3. Festivos basados en Semana Santa

La API calcula primero el Domingo de Pascua para el año consultado. A partir de esa fecha obtiene los festivos relacionados con Semana Santa.

| Festivo | Cálculo |
|---|---|
| Jueves Santo | Pascua - 3 días |
| Viernes Santo | Pascua - 2 días |
| Ascensión del Señor | Relativo a Pascua y trasladado al lunes |
| Corpus Christi | Relativo a Pascua y trasladado al lunes |
| Sagrado Corazón de Jesús | Relativo a Pascua y trasladado al lunes |

## Cálculo de días hábiles

Para calcular días hábiles, HOCO API:

1. Recorre cada día entre from y to.
2. Excluye sábados.
3. Excluye domingos.
4. Excluye festivos nacionales de Colombia.
5. Retorna días calendario, días hábiles y festivos encontrados en el rango.

## Validaciones

| Parámetro | Regla |
|---|---|
| year | Debe ser un año válido entre 1900 y 2100 |
| date | Debe tener formato YYYY-MM-DD |
| from | Debe tener formato YYYY-MM-DD |
| to | Debe tener formato YYYY-MM-DD |
| rango | from no puede ser mayor que to |

## Instalación local

Clonar repositorio:

git clone https://github.com/Jhormanrios0/holidaysAPI.git

Entrar al proyecto:

cd holidaysAPI

Instalar dependencias:

npm install

Ejecutar localmente:

npm run dev

API local:

http://localhost:8787

Documentación local:

http://localhost:8787/api/docs

## Scripts

| Script | Descripción |
|---|---|
| npm run dev | Ejecuta la API localmente con Wrangler |
| npm run build | Valida TypeScript |
| npm run deploy | Despliega en Cloudflare Workers |

## Despliegue

Validar proyecto:

npm run build

Desplegar:

npm run deploy

## Estructura del proyecto

src/
- docs/
  - docs.routes.ts
  - openapi.ts
- holidays/
  - holidays.routes.ts
  - holidays.service.ts
  - holidays.types.ts
- lib/
  - response.ts
  - validators.ts
- index.ts

## Autor

Desarrollado por Jhorman Ríos.

## Licencia

Proyecto público para consulta de festivos y días hábiles de Colombia.
