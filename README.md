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

## ¿Cómo se calculan los festivos?

La API calcula los festivos nacionales de Colombia de forma interna, sin depender de una API externa ni de una base de datos.

Los festivos se dividen en tres grupos principales:

### 1. Festivos fijos

Son festivos que siempre caen en la misma fecha del calendario, sin importar el día de la semana.

Ejemplos:

- Año Nuevo: 1 de enero.
- Día del Trabajo: 1 de mayo.
- Día de la Independencia: 20 de julio.
- Batalla de Boyacá: 7 de agosto.
- Inmaculada Concepción: 8 de diciembre.
- Navidad: 25 de diciembre.

Estos festivos se agregan directamente usando el año consultado.

Ejemplo:

```txt
2026-07-20
```

---

### 2. Festivos trasladables al lunes

Algunos festivos en Colombia se trasladan al lunes siguiente cuando no caen lunes. Esta lógica corresponde a la regla conocida como Ley Emiliani.

Ejemplos:

- Día de los Reyes Magos.
- Día de San José.
- San Pedro y San Pablo.
- Asunción de la Virgen.
- Día de la Raza.
- Todos los Santos.
- Independencia de Cartagena.

La API primero calcula la fecha original y luego valida el día de la semana.

Si la fecha original ya cae lunes, se mantiene igual.

Si la fecha original cae martes, miércoles, jueves, viernes, sábado o domingo, se mueve al siguiente lunes.

Ejemplo:

```txt
Día de los Reyes Magos 2026
Fecha original: 2026-01-06
Fecha final:    2026-01-12
```

Respuesta esperada:

```json
{
  "nombre": "Día de los Reyes Magos",
  "fecha": "2026-01-12",
  "tipo": "MOVED_TO_MONDAY",
  "trasladado": true,
  "fechaOriginal": "2026-01-06"
}
```

---

### 3. Festivos relacionados con Semana Santa

Algunos festivos dependen del Domingo de Pascua. Por eso no tienen una fecha fija cada año.

La API calcula primero el **Domingo de Pascua** usando un algoritmo gregoriano. A partir de esa fecha calcula los festivos relacionados:

- Jueves Santo: 3 días antes del Domingo de Pascua.
- Viernes Santo: 2 días antes del Domingo de Pascua.
- Ascensión del Señor: 39 días después del Domingo de Pascua y luego se traslada al lunes.
- Corpus Christi: 60 días después del Domingo de Pascua y luego se traslada al lunes.
- Sagrado Corazón de Jesús: 68 días después del Domingo de Pascua y luego se traslada al lunes.

Ejemplo para 2026:

```txt
Domingo de Pascua: 2026-04-05

Jueves Santo:              2026-04-02
Viernes Santo:             2026-04-03
Ascensión del Señor:       2026-05-18
Corpus Christi:            2026-06-08
Sagrado Corazón de Jesús:  2026-06-15
```

---

## ¿Cómo se calculan los días hábiles?

El endpoint de días hábiles recibe una fecha inicial y una fecha final.

```http
GET /api/business-days?from=2026-01-01&to=2026-06-01
```

La API recorre cada fecha del rango, incluyendo la fecha inicial y la fecha final.

Por cada día valida:

1. Si es sábado.
2. Si es domingo.
3. Si está dentro de la lista de festivos calculados para Colombia.

Si el día no es sábado, no es domingo y no es festivo, entonces se cuenta como día hábil.

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

---

## Cache de festivos

Como los festivos de un año no cambian durante la ejecución de la API, el servicio usa cache en memoria.

Cuando se consultan los festivos de un año por primera vez, la API los calcula y los guarda en memoria.

Si se vuelve a consultar el mismo año, la API retorna el resultado guardado en cache.

Esto evita recalcular los festivos en cada petición y mejora el rendimiento.

---

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

---

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

---

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

---

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

## Swagger

La documentación interactiva está disponible en:

```txt
http://localhost:3000/docs
```

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

```txt
http://localhost:3000
```

Swagger estará disponible en:

```txt
http://localhost:3000/docs
```

## Ejecutar tests

```bash
npm run test
```

## Estructura principal

```txt
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
- Fechas en formato `YYYY-MM-DD`.
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
