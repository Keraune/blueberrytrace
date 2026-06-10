# Migración API-first

BlueberryTrace queda dividido en:

```text
backend/  -> Spring Boot API, seguridad, servicios, JPA y MySQL
frontend/ -> React/Vite, UI, formularios y consumo de /api/v1/**
```

## Estado actual

El backend corre en modo API-first por defecto. Thymeleaf/HTMX no desaparece, pero queda limitado al perfil `legacy-mvc`.

## Cuándo eliminar Thymeleaf definitivamente

Eliminar `backend/src/main/resources/templates` recién cuando se cumpla:

1. React tiene login/logout completo.
2. React cubre dashboard, lotes, camas, siembra, procesos, clasificación, despacho, reportes y usuarios.
3. Todas las acciones críticas tienen endpoints API equivalentes.
4. Las rutas MVC ya no se usan para exposición ni pruebas.
5. La seguridad está validada con sesión/CSRF/CORS desde React.

## Comandos

API-first:

```bash
npm run backend:run
```

Legacy MVC temporal:

```bash
npm run backend:run:legacy
```
