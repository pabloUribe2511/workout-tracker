# Workout Tracker API

API REST para gestionar usuarios del sistema Workout Tracker.

## Base URL

http://localhost:3000/api/v1

> La API está funcionando con datos en memoria. Al reiniciar el servidor, los usuarios creados se reinician.

## Endpoints

### 1) Listar usuarios

- Method: GET
- URL: /users
- Query params opcionales:
  - role: filtra por rol
  - search: busca por nombre

Request example:

```bash
curl "http://localhost:3000/api/v1/users?role=user&search=Carlos"
```

Response example:

```json
[
  {
    "id": "b42f53fa-7b30-4b91-8d36-dc1c6ef27611",
    "name": "Carlos Navia",
    "email": "carlos@example.com",
    "role": "user",
    "createdAt": "2025-09-12T12:00:00Z"
  }
]
```

Status codes:
- 200 OK

---

### 2) Obtener un usuario por ID

- Method: GET
- URL: /users/:id

Request example:

```bash
curl http://localhost:3000/api/v1/users/b42f53fa-7b30-4b91-8d36-dc1c6ef27611
```

Response example:

```json
{
  "id": "b42f53fa-7b30-4b91-8d36-dc1c6ef27611",
  "name": "Carlos Navia",
  "email": "carlos@example.com",
  "role": "user",
  "createdAt": "2025-09-12T12:00:00Z"
}
```

Status codes:
- 200 OK
- 404 Not Found

Error example:

```json
{
  "error": "Usuario no encontrado"
}
```

---

### 3) Crear usuario

- Method: POST
- URL: /users
- Body:

```json
{
  "name": "Ana Gómez",
  "email": "ana@example.com",
  "role": "admin"
}
```

Request example:

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Gómez",
    "email": "ana@example.com",
    "role": "admin"
  }'
```

Response example:

```json
{
  "id": "1757851234567",
  "name": "Ana Gómez",
  "email": "ana@example.com",
  "role": "admin",
  "createdAt": "2026-09-17T00:00:00.000Z"
}
```

Status codes:
- 201 Created
- 400 Bad Request

Error example:

```json
{
  "error": "Name y email son requeridos"
}
```

---

### 4) Actualizar usuario

- Method: PUT
- URL: /users/:id
- Body:

```json
{
  "name": "Ana Gómez",
  "email": "ana.nueva@example.com",
  "role": "user"
}
```

Request example:

```bash
curl -X PUT http://localhost:3000/api/v1/users/1757851234567 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Gómez",
    "email": "ana.nueva@example.com",
    "role": "user"
  }'
```

Response example:

```json
{
  "id": "1757851234567",
  "name": "Ana Gómez",
  "email": "ana.nueva@example.com",
  "role": "user",
  "createdAt": "2026-09-17T00:00:00.000Z"
}
```

Status codes:
- 200 OK
- 400 Bad Request
- 404 Not Found

---

### 5) Eliminar usuario

- Method: DELETE
- URL: /users/:id

Request example:

```bash
curl -X DELETE http://localhost:3000/api/v1/users/1757851234567
```

Response example:

```json
{
  "deleted": "1757851234567"
}
```

Status codes:
- 200 OK
- 404 Not Found

---

## Resumen de códigos de estado

- 200 OK: solicitud exitosa
- 201 Created: recurso creado correctamente
- 400 Bad Request: faltan campos obligatorios o datos inválidos
- 404 Not Found: usuario no encontrado

## Ejecutar la API

```bash
npm install
npm run dev
```

La app quedará disponible en:

```text
http://localhost:3000
```

## Estructura relevante

- src/app.js: configuración principal del servidor
- src/routes/v1/users.routes.js: endpoints de usuarios
- src/routes/v1/index.js: montaje de rutas v1
