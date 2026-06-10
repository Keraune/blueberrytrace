# Fase 6 · Separación progresiva para React/Vue

Esta fase prepara BlueberryTrace para una futura separación frontend/backend sin retirar Thymeleaf ni convertir el sistema en SPA todavía.

## Objetivo técnico

Mantener el panel actual con Spring MVC + Thymeleaf + HTMX, pero agregar una capa JSON estable bajo `/api/v1/**` para que un cliente React o Vue pueda consumir datos reales del sistema cuando se decida iniciar la migración.

## Criterios aplicados

- No se modificaron rutas MVC existentes.
- No se retiró Thymeleaf.
- No se cambió la autenticación existente de Spring Security.
- No se expusieron entidades JPA directamente como JSON.
- Los endpoints usan DTOs/records de salida para evitar acoplar React/Vue al modelo de persistencia.
- Las rutas API quedan protegidas por la sesión autenticada actual.
- Se habilitó CORS configurable para clientes locales de desarrollo.

## Nuevas capas creadas

```text
src/main/java/com/keraune/vlvblueberrysystem/api
├── controller
├── dto
└── mapper
```

### DTOs API

Archivo principal:

```text
src/main/java/com/keraune/vlvblueberrysystem/api/dto/ApiPayloads.java
```

Contiene records para:

- Respuesta estándar `ApiResponse<T>`.
- Listados `ListResponse<T>`.
- Referencias de lote, cama y usuario.
- Lotes.
- Camas.
- Siembras.
- Uniformizaciones.
- Formalizaciones.
- Clasificaciones.
- Despachos.
- Trazabilidad.
- Bootstrap frontend.
- Paleta visual.
- Módulos del sistema.

### Mapper API

Archivo:

```text
src/main/java/com/keraune/vlvblueberrysystem/api/mapper/ApiRecordMapper.java
```

Convierte entidades JPA a DTOs seguros para JSON. Esto evita enviar relaciones completas, contraseñas, datos internos o ciclos de serialización.

## Endpoints preparados

```text
GET /api/v1/frontend/bootstrap
GET /api/v1/session/me
GET /api/v1/dashboard/summary
GET /api/v1/catalogs/operations
GET /api/v1/lotes
GET /api/v1/camas
GET /api/v1/siembras
GET /api/v1/procesos
GET /api/v1/procesos/uniformizaciones
GET /api/v1/procesos/formalizaciones
GET /api/v1/clasificaciones
GET /api/v1/despachos
GET /api/v1/reportes/trazabilidad
GET /api/v1/usuarios
```

## Bootstrap frontend

`/api/v1/frontend/bootstrap` entrega información útil para un futuro cliente React/Vue:

- Nombre de la aplicación.
- Versión de API.
- Estrategia de separación progresiva.
- Frontends soportados.
- Módulos con ruta MVC y ruta API equivalente.
- Paleta de colores usada por el panel.
- Catálogo de endpoints iniciales.

## Cliente JavaScript puente

Archivo:

```text
src/main/resources/static/js/api-client.js
```

Expone en navegador:

```js
window.BlueberryTraceApi
```

Incluye:

- Endpoints centralizados.
- Helper `get`.
- Helpers `post`, `put`, `patch` y `delete`.
- Lectura automática de CSRF desde metatags Thymeleaf.
- Soporte de credenciales same-origin.

Este archivo no reemplaza HTMX. Solo deja listo un contrato ligero para que módulos futuros puedan consumir `/api/v1/**` sin duplicar lógica de fetch.

## CORS para desarrollo local

Se agregó:

```text
src/main/java/com/keraune/vlvblueberrysystem/config/ApiCorsConfig.java
```

Propiedad configurable:

```properties
blueberrytrace.api.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

Esto prepara el backend para un cliente Vite/React/Vue local sin abrir el API de forma indiscriminada.

## Ruta recomendada para la siguiente etapa

1. Mantener Thymeleaf como shell productivo.
2. Crear un prototipo React o Vue separado en `/frontend` o en otro repositorio.
3. Consumir primero:
   - `/api/v1/frontend/bootstrap`
   - `/api/v1/session/me`
   - `/api/v1/dashboard/summary`
4. Después migrar módulo por módulo.
5. Mantener formularios transaccionales en Spring MVC hasta que existan endpoints POST/PUT/PATCH validados para API.

## Estado actual de separación

```text
Thymeleaf: activo y estable
HTMX: activo para recargas parciales
API JSON: preparada en modo lectura
React/Vue: listo para iniciar integración externa
SPA completa: todavía no aplicada
```
