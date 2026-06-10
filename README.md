# BlueberryTrace

Sistema web interno para el control, clasificación y trazabilidad de plantas de arándano para exportación en Vivero Los Viñedos.

El repositorio quedó organizado como workspace separado:

```text
blueberrytrace/
├── pom.xml               # agregador Maven
├── package.json          # scripts de workspace
├── backend/              # Spring Boot API, seguridad, servicios, JPA y MySQL
├── frontend/             # React + TypeScript + Vite
├── docs/                 # documentación técnica por fase
├── scripts/              # utilidades de arranque local
└── README.md
```

## Estado actual

BlueberryTrace ahora trabaja en arquitectura **API-first**:

- `backend/` expone `/api/v1/**` y ya no contiene HTML Thymeleaf.
- `frontend/` es la interfaz principal con React/Vite.
- El login se realiza desde React consumiendo la API de autenticación.
- Los recursos HTML antiguos del backend fueron retirados en la Fase 20.

## Arranque rápido

Después de extraer el ZIP en Linux o Arch Linux:

```bash
npm run setup:permissions
npm run doctor
```

Backend:

```bash
npm run backend:run
```

Frontend:

```bash
npm run frontend:dev
```

Abrir:

```text
http://localhost:5173
```

Verificar API:

```text
http://localhost:8080/api/v1/health
```

## Backend

Stack principal:

- Java 21
- Spring Boot
- Spring Security
- API REST JSON
- Sesión + CSRF para React
- JPA / Hibernate
- MySQL
- Maven Wrapper

Comandos:

```bash
npm run backend:run
npm run backend:run:alt
npm run backend:test
npm run backend:package
npm run backend:port
npm run backend:kill
```

Si el puerto 8080 está ocupado:

```bash
npm run backend:port
npm run backend:kill
npm run backend:run
```

O usa puerto alternativo:

```bash
npm run backend:run:alt
```

Credenciales iniciales:

```text
Usuario: admin
Contraseña: admin123
```

## Frontend

Stack principal:

- React
- TypeScript
- Vite
- Lucide React
- CSS propio
- Consumo de API `/api/v1/**`

Comandos:

```bash
npm run frontend:dev
npm run frontend:build
npm run frontend:preview
```

## Variables de entorno frontend

Copia el ejemplo:

```bash
cd frontend
cp .env.example .env
```

Valores recomendados:

```env
VITE_BLUEBERRYTRACE_API_BASE=http://localhost:8080/api/v1
VITE_BLUEBERRYTRACE_BACKEND_ORIGIN=http://localhost:8080
```

## API principal

```text
GET  /api/v1/health
GET  /api/v1/auth/csrf
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/frontend/bootstrap
GET  /api/v1/session/me
GET  /api/v1/dashboard/summary
GET  /api/v1/catalogs/operations
GET  /api/v1/lotes
POST /api/v1/lotes
PUT  /api/v1/lotes/{id}
PATCH /api/v1/lotes/{id}/estado
DELETE /api/v1/lotes/{id}
GET  /api/v1/camas
POST /api/v1/camas
PUT  /api/v1/camas/{id}
PATCH /api/v1/camas/{id}/estado
GET  /api/v1/siembras
POST /api/v1/siembras
PATCH /api/v1/siembras/{id}/estado
GET  /api/v1/procesos
POST /api/v1/procesos/uniformizaciones
POST /api/v1/procesos/formalizaciones
GET  /api/v1/clasificaciones
POST /api/v1/clasificaciones
PATCH /api/v1/clasificaciones/{id}/estado
GET  /api/v1/despachos
POST /api/v1/despachos
PATCH /api/v1/despachos/{id}/estado
GET  /api/v1/reportes/trazabilidad
GET  /api/v1/usuarios
```

## Limpieza realizada

En la Fase 20 se retiró del backend:

```text
backend/src/main/resources/templates/
backend/src/main/resources/static/
backend/src/main/java/com/keraune/vlvblueberrysystem/controller/
```

También se eliminaron las dependencias Thymeleaf del `backend/pom.xml`.

`backend/src/main/resources/application.properties` se mantiene porque Spring Boot lo necesita para servidor, base de datos, JPA y seguridad.

## IntelliJ IDEA

Abre la carpeta raíz `blueberrytrace/` y carga el `pom.xml` raíz como proyecto Maven.

Si IntelliJ no detecta el módulo:

```text
Clic derecho en backend/pom.xml → Add as Maven Project
```

Luego ejecuta **Reload All Maven Projects**.

## Base de datos

```sql
CREATE DATABASE vlv_blueberry_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

La configuración de MySQL acepta variables de entorno:

```bash
DB_USERNAME=root DB_PASSWORD=12345678 npm run backend:run
```

## Fases recientes

- Fase 17: refinamiento visual del dashboard React.
- Fase 18: vistas rápidas y drawers en módulos internos.
- Fase 19: microinteracciones, centro de acciones y toasts.
- Fase 20: limpieza API-first y retiro de HTML backend.

## Fase 21 - Edición real avanzada desde React

Se reemplazaron acciones visuales por operaciones reales de edición y confirmación:

- Formularios reutilizables con datos iniciales para editar registros existentes.
- Confirmaciones modernas con `ConfirmDialog` en lugar de `window.confirm`.
- Toasts globales para operaciones exitosas, errores y cambios de estado.
- Nuevos endpoints API-first `PUT` para siembras, procesos, clasificaciones y despachos.
- Edición real desde React para lotes, camas, siembras, procesos, clasificación y despacho.

## Fase 22 - Modales responsive y checklist funcional

Se mejoró el sistema de overlays del frontend React:

- Modales con header y footer sticky.
- Cierre con `Escape`.
- Bloqueo de scroll del fondo.
- Confirmaciones responsive.
- Drawers laterales en desktop y bottom sheet en móvil.
- Checklist funcional para validar APF3 en `docs/functional-qa-checklist.md`.

