# BlueberryTrace

Sistema web interno para el control, clasificación y trazabilidad de plantas de arándano para exportación en el área de frutales de Vivero Los Viñedos.

El repositorio está organizado como workspace separado para backend y frontend. El backend Spring Boot corre por defecto en modo API-first para React/Vite. El panel Thymeleaf + HTMX queda disponible únicamente como respaldo con el perfil `legacy-mvc`.

## Estructura del repositorio

```text
blueberrytrace/
├── pom.xml               # agregador Maven para que IntelliJ cargue backend como módulo
├── package.json          # scripts de workspace para frontend/backend
├── backend/              # Spring Boot API, seguridad, servicios, JPA y MySQL
├── frontend/             # React + TypeScript + Vite
├── docs/                 # documentación técnica por fase
├── .gitignore
└── README.md
```


## Arranque rápido recomendado

Después de extraer el ZIP en Linux o Arch Linux, ejecuta primero:

```bash
npm run setup:permissions
npm run doctor
```

Luego levanta el backend:

```bash
npm run backend:run
```

En otra terminal, levanta el frontend:

```bash
npm run frontend:dev
```

Si aparece un problema con permisos de `mvnw`, el proyecto ya incluye una corrección defensiva: los scripts usan `bash ./mvnw` y no dependen únicamente del permiso de ejecución del archivo.

## Backend

Stack principal:

- Java 21
- Spring Boot
- Spring Security
- API REST JSON
- Spring Security con sesión y CSRF
- JPA / Hibernate
- MySQL
- Maven Wrapper

Ejecución desde la raíz:

```bash
bash ./mvnw -pl backend spring-boot:run
```

También puedes usar el script del workspace:

```bash
npm run backend:run
```

Si el puerto 8080 está ocupado, ejecuta el backend en 8081:

```bash
SERVER_PORT=8081 ./mvnw -pl backend spring-boot:run
```

o usando script:

```bash
npm run backend:run:alt
```

Para identificar el proceso que usa el puerto en Arch Linux:

```bash
ss -ltnp 'sport = :8080'
fuser -k 8080/tcp
```

Ejecución desde backend:

```bash
cd backend
./mvnw spring-boot:run
```

Verificar API:

```text
http://localhost:8080/api/v1/health
```

Credenciales iniciales:

```text
Usuario: admin
Contraseña: admin123
```

API disponible para clientes externos:

```text
GET /api/v1/auth/csrf
GET /api/v1/frontend/bootstrap
GET /api/v1/session/me
GET /api/v1/dashboard/summary
GET /api/v1/catalogs/operations
GET /api/v1/lotes
POST /api/v1/lotes
PUT /api/v1/lotes/{id}
PATCH /api/v1/lotes/{id}/estado
DELETE /api/v1/lotes/{id}
GET /api/v1/camas
POST /api/v1/camas
PUT /api/v1/camas/{id}
PATCH /api/v1/camas/{id}/estado
GET /api/v1/siembras
POST /api/v1/siembras
PATCH /api/v1/siembras/{id}/estado
GET /api/v1/procesos
GET /api/v1/procesos/uniformizaciones
POST /api/v1/procesos/uniformizaciones
PATCH /api/v1/procesos/uniformizaciones/{id}/estado
GET /api/v1/procesos/formalizaciones
POST /api/v1/procesos/formalizaciones
PATCH /api/v1/procesos/formalizaciones/{id}/estado
GET /api/v1/clasificaciones
POST /api/v1/clasificaciones
PATCH /api/v1/clasificaciones/{id}/estado
GET /api/v1/despachos
POST /api/v1/despachos
PATCH /api/v1/despachos/{id}/estado
GET /api/v1/reportes/trazabilidad
GET /api/v1/usuarios
```

## Frontend

Stack principal:

- React
- TypeScript
- Vite
- CSS por componentes
- Consumo de API `/api/v1/**`

Ejecución:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Abrir:

```text
http://localhost:5173
```

El backend debe estar corriendo en:

```text
http://localhost:8080
```

React ya incluye login propio usando `/api/v1/auth/login`, por eso no necesitas abrir `/auth/login` en el modo normal.


## Modo legacy Thymeleaf/HTMX

El backend conserva las vistas Thymeleaf como respaldo, pero solo se activan con el perfil `legacy-mvc`:

```bash
npm run backend:run:legacy
```

En ese modo vuelven a estar disponibles rutas como `/auth/login`, `/dashboard`, `/lotes`, `/camas`, `/siembra`, `/procesos`, `/clasificacion`, `/despacho`, `/reportes` y `/usuarios`.

En el modo normal recomendado, el uso principal es:

```bash
npm run backend:run
npm run frontend:dev
```

## IntelliJ IDEA

Abre la carpeta raíz `blueberrytrace/` y carga el `pom.xml` raíz como proyecto Maven. Ese `pom.xml` es un agregador con el módulo `backend`, por eso IntelliJ debe marcar automáticamente `backend/src/main/java` como source root.

Si aparece el aviso `Java file is located outside of the module source root`, revisa:

```text
docs/intellij-setup.md
```

Solución rápida:

```text
Clic derecho en backend/pom.xml → Add as Maven Project
```

Luego ejecuta **Reload All Maven Projects** desde la ventana Maven.

## Base de datos

Crear la base de datos antes de ejecutar el backend:

```sql
CREATE DATABASE vlv_blueberry_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Revisar credenciales en:

```text
backend/src/main/resources/application.properties
```

También puedes usar variables de entorno sin editar el archivo:

```bash
DB_URL='jdbc:mysql://localhost:3306/vlv_blueberry_system?useSSL=false&serverTimezone=America/Lima&allowPublicKeyRetrieval=true' DB_USERNAME=root DB_PASSWORD=12345678 npm run backend:run
```

## Comandos de build y prueba

Backend desde la raíz:

```bash
bash ./mvnw -pl backend clean package
bash ./mvnw -pl backend test
```

Backend desde la carpeta del módulo:

```bash
cd backend
./mvnw clean package
./mvnw test
```

Frontend:

```bash
cd frontend
npm run build
npm run preview
```

Scripts de workspace desde la raíz:

```bash
npm run frontend:dev
npm run frontend:build
npm run backend:run
npm run backend:run:alt
npm run backend:port
npm run backend:kill
npm run backend:test
npm run backend:package
npm run setup:permissions
npm run doctor
```

## Estrategia de separación

- `backend/` mantiene el sistema productivo actual con Spring MVC, Thymeleaf y HTMX.
- `backend/src/main/java/.../api` expone DTOs seguros para React/Vue sin devolver entidades JPA directamente.
- `frontend/` consume la API con React/Vite.
- La migración puede avanzar módulo por módulo sin retirar todavía las vistas Thymeleaf.

## Flujo operativo principal

```text
Lote / Invernadero → Cama → Siembra → Uniformización → Formalización → Clasificación → Despacho → Reportes
```

## Git recomendado

```bash
git status
git add .
git commit -m "refactor(workspace): registrar backend como modulo Maven"
git push origin main
```

## Fase 12 - Autenticación desde React

El frontend React ya cuenta con login propio usando la API del backend:

```http
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/csrf
```

Los HTML de Thymeleaf en `backend/src/main/resources/templates` se mantienen por ahora como respaldo estable del panel MVC/HTMX y del login tradicional. No conviene eliminarlos hasta que React cubra todos los flujos productivos y el backend pueda pasar a modo API-only.


## Historial de fases

### Fase 15 - Login React estilo producción

Se rediseñó la pantalla de inicio de sesión del frontend React con panel visual oscuro, formulario limpio, credenciales demo y estilo alineado a las pantallas de referencia del sistema.

### Fase 16 - Arranque local estable

Se agregaron scripts de diagnóstico y restauración de permisos para evitar errores al extraer el ZIP en Linux:

```bash
npm run setup:permissions
npm run doctor
```

Además, los comandos backend usan `bash ./mvnw`, por lo que el backend puede arrancar aunque el ZIP haya perdido el bit ejecutable de `mvnw`.


## Maven seguro

El workspace incluye `scripts/maven.sh`, que prefiere Maven instalado en el sistema y usa `./mvnw` como respaldo. Esto evita problemas de permisos o descarga del wrapper en entornos donde Maven ya está instalado.

```bash
npm run maven -- -pl backend clean package
```

## Fase 17 — Refinamiento visual del dashboard React

Se pulió el dashboard interno para acercarlo más al estilo visual definido en los prototipos: tarjetas KPI compactas, gráficos más limpios, donut de estado de lotes, actividad reciente y accesos rápidos con mejor proporción visual.

Documentación: `docs/frontend-fase-17.md`.

## Fase 18 - Pulido visual de módulos internos

Se unificó el diseño de los módulos internos del frontend React con vistas rápidas laterales, tarjetas resumen consistentes y detalles operativos para lotes, camas, usuarios, clasificaciones y despachos.

Validación principal:

```bash
cd frontend
npm ci
npm run build
```


## Fase 19 - Experiencia visual creativa

Se agregó una capa de microinteracciones al frontend React:

- `Ctrl + K` abre el centro de acciones.
- Dock flotante para búsqueda rápida y sincronización.
- Notificaciones toast para sesión, errores y sincronización.
- Transiciones entre módulos.
- Animaciones suaves en modales, drawers, cards, tablas y gráficos.

Los prototipos compartidos se usan como guía visual, no como copia exacta. El diseño mantiene una identidad propia para BlueberryTrace.

