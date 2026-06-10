# Fase 12 - Autenticación React y transición API-first

## Objetivo

Reducir la dependencia del frontend Thymeleaf agregando autenticación por API para el cliente React/Vite, sin eliminar todavía el panel Thymeleaf que funciona como respaldo estable.

## Cambios principales

- Se agregó inicio de sesión JSON en `POST /api/v1/auth/login`.
- Se agregó cierre de sesión JSON en `POST /api/v1/auth/logout`.
- El frontend React ahora muestra una pantalla de login propia cuando la sesión no existe o expira.
- React obtiene CSRF desde `GET /api/v1/auth/csrf` antes de ejecutar mutaciones.
- El topbar React incluye acción de cierre de sesión.
- `GET /api/v1/frontend/bootstrap` queda público para permitir inicialización visual del cliente antes de autenticar al usuario.

## Sobre `resources/templates` y archivos HTML Thymeleaf

No se deben eliminar todavía.

Actualmente siguen cumpliendo estas funciones:

1. Panel Thymeleaf + HTMX estable mientras React termina de migrar todos los módulos.
2. Login tradicional de Spring Security en `/auth/login`.
3. Fallback funcional si React o Vite no están disponibles.
4. Vistas MVC existentes que todavía pueden usarse para validar operaciones durante la transición.

La eliminación debe hacerse después de completar estos pasos:

1. Login React completamente validado en producción local.
2. Formularios React completos para todos los módulos.
3. Endpoints API completos para crear, editar, cambiar estado y consultar.
4. Manejo de roles/permisos desde API.
5. Confirmar que ninguna ruta MVC productiva sigue siendo necesaria.

## Plan recomendado para limpiar Thymeleaf en una fase futura

Cuando React cubra todo el sistema, se puede hacer una fase de limpieza así:

- Mover controladores MVC a un paquete `legacy` o eliminarlos si ya no se usan.
- Eliminar `src/main/resources/templates`.
- Eliminar `src/main/resources/static/css/style.css` y `src/main/resources/static/js/app.js` si solo eran usados por Thymeleaf.
- Mantener `application.properties` y recursos de configuración del backend.
- Mantener imágenes solo si React o la API todavía las utilizan.
- Convertir Spring Boot en backend API-only.

## Endpoints nuevos

```http
GET  /api/v1/auth/csrf
POST /api/v1/auth/login
POST /api/v1/auth/logout
```

## Pruebas locales sugeridas

1. Arrancar backend:

```bash
npm run backend:run
```

2. Arrancar frontend:

```bash
npm run frontend:dev
```

3. Abrir React:

```text
http://localhost:5173
```

4. Sin sesión activa, debe aparecer el login React.
5. Iniciar sesión con credenciales existentes.
6. Validar dashboard y módulos.
7. Cerrar sesión desde el topbar.
8. Confirmar que vuelve al login React.
