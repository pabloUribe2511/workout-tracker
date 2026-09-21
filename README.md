# Workout Tracker API

API REST para gestionar usuarios, ejercicios, entrenamientos y progreso de entrenamiento en Workout Tracker.

## Base URL

```text
http://localhost:8000/api/v1
```

> La API actualmente usa datos en memoria. Si reinicias el servidor, los registros creados durante esa ejecución se pierden.

---

## Estado de la API

| Código | Estado | Descripción |
| --- | --- | --- |
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado correctamente |
| 400 | Bad Request | Datos faltantes o inválidos |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error interno del servidor |

---

## Endpoints

| Recurso | Método | Ruta | Descripción |
| --- | --- | --- | --- |
| Usuarios | GET | /users | Listar usuarios |
| Usuarios | GET | /users/:id | Obtener usuario por ID |
| Usuarios | POST | /users | Crear usuario |
| Usuarios | PUT | /users/:id | Actualizar usuario |
| Usuarios | DELETE | /users/:id | Eliminar usuario |
| Ejercicios | GET | /exercises | Listar catálogo de ejercicios |
| Ejercicios | GET | /exercises/:id | Obtener ejercicio por ID |
| Workouts | GET | /users/:userId/workouts | Listar entrenamientos del usuario |
| Workouts | POST | /users/:userId/workouts | Crear entrenamiento |
| Workouts | GET | /users/:userId/workouts/:id | Obtener entrenamiento por ID |
| Workouts | PUT | /users/:userId/workouts/:id | Actualizar entrenamiento |
| Workouts | DELETE | /users/:userId/workouts/:id | Eliminar entrenamiento |
| Progreso | GET | /users/:userId/progress | Obtener resumen de progreso |

---

## Ejemplos de uso

### 1) Listar usuarios

```bash
curl "http://localhost:8000/api/v1/users?role=user&search=Carlos"
```

Respuesta:

```json
{
  "data": [
    {
      "id": "b42f53fa-7b30-4b91-8d36-dc1c6ef27611",
      "name": "Carlos Navia",
      "email": "carlos@example.com",
      "role": "user",
      "createdAt": "2025-09-12T12:00:00Z"
    }
  ]
}
```

---

### 2) Crear usuario

```bash
curl -X POST http://localhost:8000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Gómez",
    "email": "ana@example.com",
    "role": "user"
  }'
```

Respuesta esperada:

```json
{
  "id": "1757851234567",
  "name": "Ana Gómez",
  "email": "ana@example.com",
  "role": "user",
  "createdAt": "2026-09-21T00:00:00.000Z"
}
```

Estados:
- 201 Created
- 400 Bad Request

Error ejemplo:

```json
{
  "error": "Name y email son requeridos"
}
```

---

### 3) Listar ejercicios

```bash
curl http://localhost:8000/api/v1/exercises
```

Respuesta:

```json
{
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "name": "Press de Banca",
      "description": "Ejercicio compuesto para el desarrollo del pectoral mayor, deltoides anterior y tríceps.",
      "category": "pecho"
    },
    {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "name": "Extensiones de Tríceps",
      "description": "Ejercicio de aislamiento para tríceps.",
      "category": "brazo"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

Estados:
- 200 OK

---

### 4) Cómo se agrega un ejercicio a un entrenamiento

Para crear un entrenamiento con ejercicios, debes enviar un cuerpo como este:

```bash
curl -X POST http://localhost:8000/api/v1/users/b42f53fa-7b30-4b91-8d36-dc1c6ef27611/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tren Superior - Día 1",
    "description": "Rutina enfocada en pecho y tríceps",
    "scheduledAt": "2026-09-20T07:00:00Z",
    "exercises": [
      {
        "exerciseId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "sets": 4,
        "reps": 12,
        "weight": 60
      },
      {
        "exerciseId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "sets": 3,
        "reps": 15,
        "weight": 20
      }
    ],
    "comments": "Aumentar peso en la próxima semana."
  }'
```

Respuesta esperada:

```json
{
  "data": {
    "id": "w-1758530000000",
    "userId": "b42f53fa-7b30-4b91-8d36-dc1c6ef27611",
    "name": "Tren Superior - Día 1",
    "description": "Rutina enfocada en pecho y tríceps",
    "scheduledAt": "2026-09-20T07:00:00Z",
    "status": "pending",
    "exercises": [
      {
        "exerciseId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "sets": 4,
        "reps": 12,
        "weight": 60,
        "name": "Press de Banca"
      },
      {
        "exerciseId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "sets": 3,
        "reps": 15,
        "weight": 20,
        "name": "Extensiones de Tríceps"
      }
    ],
    "comments": "Aumentar peso en la próxima semana.",
    "createdAt": "2026-09-21T00:00:00.000Z"
  }
}
```

Estados:
- 201 Created
- 400 Bad Request

---

### 5) Obtener progreso del usuario

```bash
curl "http://localhost:8000/api/v1/users/b42f53fa-7b30-4b91-8d36-dc1c6ef27611/progress?period=month"
```

Respuesta:

```json
{
  "data": {
    "userId": "b42f53fa-7b30-4b91-8d36-dc1c6ef27611",
    "period": "month",
    "totalWorkouts": 1,
    "completedWorkouts": 0,
    "completionRate": 0,
    "averageWeight": 40,
    "topCategories": [
      { "category": "pecho", "count": 1 },
      { "category": "brazo", "count": 1 }
    ],
    "generatedAt": "2026-09-21T17:42:45.550Z"
  }
}
```

Estados:
- 200 OK

---

## Ejecutar la API

```bash
npm install
npm run dev
```

La app quedará disponible en:

```text
http://localhost:8000
```

---

## Ejemplo en Postman

### 1) Configuración inicial

1. Abre Postman.
2. Crea una nueva request.
3. Selecciona el método `POST`.
4. En la URL escribe:

```text
http://localhost:8000/api/v1/users
```

5. En la pestaña `Body`, selecciona `raw` y `JSON`.
6. Pega este JSON:

```json
{
  "name": "Ana Gómez",
  "email": "ana@example.com",
  "role": "user"
}
```

7. Haz clic en `Send`.

Respuesta esperada:

```json
{
  "id": "1757851234567",
  "name": "Ana Gómez",
  "email": "ana@example.com",
  "role": "user",
  "createdAt": "2026-09-21T00:00:00.000Z"
}
```

### 2) Crear un entrenamiento con ejercicios

1. Método: `POST`
2. URL:

```text
http://localhost:8000/api/v1/users/b42f53fa-7b30-4b91-8d36-dc1c6ef27611/workouts
```

3. Body JSON:

```json
{
  "name": "Tren Superior - Día 1",
  "description": "Rutina enfocada en pecho y tríceps",
  "scheduledAt": "2026-09-20T07:00:00Z",
  "exercises": [
    {
      "exerciseId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "sets": 4,
      "reps": 12,
      "weight": 60
    },
    {
      "exerciseId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "sets": 3,
      "reps": 15,
      "weight": 20
    }
  ],
  "comments": "Aumentar peso en la próxima semana."
}
```

4. Click en `Send`.

Respuesta esperada:

```json
{
  "data": {
    "id": "w-1758530000000",
    "userId": "b42f53fa-7b30-4b91-8d36-dc1c6ef27611",
    "name": "Tren Superior - Día 1",
    "description": "Rutina enfocada en pecho y tríceps",
    "scheduledAt": "2026-09-20T07:00:00Z",
    "status": "pending",
    "exercises": [
      {
        "exerciseId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "sets": 4,
        "reps": 12,
        "weight": 60,
        "name": "Press de Banca"
      },
      {
        "exerciseId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "sets": 3,
        "reps": 15,
        "weight": 20,
        "name": "Extensiones de Tríceps"
      }
    ],
    "comments": "Aumentar peso en la próxima semana.",
    "createdAt": "2026-09-21T00:00:00.000Z"
  }
}
```

---

## Estructura final del proyecto

- [src/app.js](src/app.js): arranque del servidor Express
- [src/routes/index.js](src/routes/index.js): montaje de la API
- [src/routes/v1/index.js](src/routes/v1/index.js): rutas versionadas
- [src/routes/v1/users.routes.js](src/routes/v1/users.routes.js): endpoints de usuarios
- [src/routes/v1/exercises.routes.js](src/routes/v1/exercises.routes.js): catálogo de ejercicios
- [src/routes/v1/users/workouts.routes.js](src/routes/v1/users/workouts.routes.js): CRUD de workouts
- [src/routes/v1/users/progress.routes.js](src/routes/v1/users/progress.routes.js): progreso del usuario
- [src/controllers](src/controllers): lógica de negocio por recurso

---

## Resumen

Esta API ya tiene la base funcional de un backend REST para Workout Tracker con:

- gestión de usuarios
- catálogo de ejercicios
- creación y administración de entrenamientos
- resumen de progreso por usuario
- respuesta JSON estandarizada
- manejo de estados HTTP

Si quieres, puedo dejar una última versión aún más profesional con una sección de "Buenas prácticas" y una tabla de ejemplo de errores con formato exacto.

## Estructura del proyecto

- [src/app.js](src/app.js): configuración principal del servidor
- [src/routes/index.js](src/routes/index.js): montaje global de rutas
- [src/routes/v1/index.js](src/routes/v1/index.js): montaje de rutas versionadas
- [src/routes/v1/users.routes.js](src/routes/v1/users.routes.js): rutas de usuarios
- [src/routes/v1/exercises.routes.js](src/routes/v1/exercises.routes.js): rutas de ejercicios
- [src/routes/v1/users/workouts.routes.js](src/routes/v1/users/workouts.routes.js): rutas de workouts
- [src/routes/v1/users/progress.routes.js](src/routes/v1/users/progress.routes.js): rutas de progreso
- [src/controllers](src/controllers): lógica de negocio por recurso
