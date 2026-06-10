# Fase 14 — API-first progresivo y legado MVC controlado

## Objetivo

Consolidar la separación `/backend` y `/frontend` para que el backend funcione por defecto como API para React/Vue, sin eliminar todavía el respaldo Thymeleaf/HTMX.

## Cambios aplicados

- Los controladores MVC de Thymeleaf quedaron condicionados al perfil `legacy-mvc`.
- El backend por defecto responde como API-first y ya no depende de `/auth/login` para el frontend React.
- Se agregó `GET /api/v1/health` y respuesta JSON en `/`.
- Se separó la configuración de seguridad en dos perfiles:
  - API-first por defecto.
  - MVC legacy con `SPRING_PROFILES_ACTIVE=legacy-mvc`.
- Se agregó script `npm run backend:run:legacy` para abrir temporalmente el panel Thymeleaf.
- Se limpiaron archivos generados por IDE/build del entregable.

## Modo normal recomendado

```bash
npm run backend:run
npm run frontend:dev
```

Backend:

```text
http://localhost:8080/api/v1/health
```

Frontend React:

```text
http://localhost:5173
```

## Modo legacy opcional

Solo para revisar el panel Thymeleaf/HTMX antiguo:

```bash
npm run backend:run:legacy
```

Rutas legacy disponibles:

```text
/auth/login
/dashboard
/lotes
/camas
/siembra
/procesos
/clasificacion
/despacho
/reportes
/usuarios
```

## Sobre `resources/templates`

No se eliminan aún porque sirven como respaldo si se activa `legacy-mvc`. En una fase final, cuando React tenga CRUD completo y control de roles, se podrán mover o eliminar definitivamente.

## Siguiente limpieza sugerida

- Crear endpoints API faltantes para usuarios/roles.
- Agregar edición completa de procesos, clasificación y despacho desde React.
- Mover `templates` y estáticos legacy fuera de `src/main/resources` cuando ya no se use `legacy-mvc`.
