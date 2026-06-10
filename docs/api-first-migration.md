# Migración API-first

BlueberryTrace queda dividido en:

```text
backend/  -> Spring Boot API, seguridad, servicios, JPA y MySQL
frontend/ -> React/Vite, UI, formularios y consumo de /api/v1/**
```

## Estado actual

La migración API-first ya fue consolidada en la Fase 20.

El backend ya no contiene:

```text
backend/src/main/resources/templates/
backend/src/main/resources/static/
backend/src/main/java/com/keraune/vlvblueberrysystem/controller/
```

El frontend React es la interfaz principal.

## Comandos

Backend:

```bash
npm run backend:run
```

Frontend:

```bash
npm run frontend:dev
```

## Nota

`backend/src/main/resources/application.properties` se conserva porque Spring Boot lo usa para configuración del servidor, base de datos, JPA y seguridad.
