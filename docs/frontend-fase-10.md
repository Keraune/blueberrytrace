# Fase 10 - Navegación React, mutaciones API y flujo de desarrollo

## Objetivo

Avanzar la separación progresiva hacia React/Vue sin retirar Thymeleaf, agregando navegación real del cliente React, operaciones de escritura iniciales por API y mejoras para ejecutar el backend cuando el puerto 8080 esté ocupado.

## Cambios principales

- Navegación del frontend con History API y rutas limpias como `/dashboard`, `/lotes` y `/camas`.
- Sidebar React basado en enlaces internos, sin recargar la aplicación.
- Endpoint API de escritura para lotes e invernaderos.
- Endpoint API de escritura para camas productivas.
- Formularios React conectados con CSRF para crear lotes y camas.
- Acciones React para cambiar estado de lotes/camas y eliminación lógica de lotes.
- Manejador de errores JSON para validaciones de API.
- Configuración de puerto del backend mediante variable `SERVER_PORT`.
- Scripts raíz actualizados para ejecutar backend y frontend desde el workspace.

## Endpoints nuevos

```text
POST   /api/v1/lotes
PUT    /api/v1/lotes/{id}
PATCH  /api/v1/lotes/{id}/estado
DELETE /api/v1/lotes/{id}
POST   /api/v1/camas
PUT    /api/v1/camas/{id}
PATCH  /api/v1/camas/{id}/estado
```

## Ejecución recomendada

Backend normal:

```bash
npm run backend:run
```

Backend si el puerto 8080 está ocupado:

```bash
npm run backend:run:alt
```

Equivalente manual:

```bash
SERVER_PORT=8081 ./mvnw -pl backend spring-boot:run
```

Frontend:

```bash
npm run frontend:dev
```

## Error de puerto ocupado

El error `java.net.BindException: La dirección ya se está usando` indica que otro proceso ya está usando el puerto 8080. No es un error de código del proyecto. Se puede solucionar cerrando el proceso activo o ejecutando el backend con otro puerto.

Comandos útiles en Arch Linux:

```bash
ss -ltnp 'sport = :8080'
fuser -k 8080/tcp
```

## Estado de la migración

Thymeleaf + HTMX se mantiene como panel estable. React ya consume datos y ahora puede crear registros iniciales a través de la API protegida por sesión y CSRF.
