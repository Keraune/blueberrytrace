# BlueberryTrace

Sistema web interno para el control, clasificación y trazabilidad de plantas de arándano para exportación en el área de frutales de Vivero Los Viñedos.

El repositorio está organizado como workspace separado para backend y frontend. El backend Spring Boot mantiene el panel estable con Thymeleaf + HTMX y el frontend React/Vite avanza como cliente desacoplado para la migración progresiva.

## Estructura del repositorio

```text
blueberrytrace/
├── pom.xml               # agregador Maven para que IntelliJ cargue backend como módulo
├── package.json          # scripts de workspace para frontend/backend
├── backend/              # Spring Boot, Thymeleaf, HTMX, API REST, seguridad, JPA y MySQL
├── frontend/             # React + TypeScript + Vite
├── docs/                 # documentación técnica por fase
├── .gitignore
└── README.md
```

## Backend

Stack principal:

- Java 21
- Spring Boot
- Spring Security
- Thymeleaf
- HTMX
- JPA / Hibernate
- MySQL
- Maven Wrapper

Ejecución desde la raíz:

```bash
./mvnw -pl backend spring-boot:run
```

Ejecución desde backend:

```bash
cd backend
./mvnw spring-boot:run
```

Abrir:

```text
http://localhost:8080
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

Para consumir endpoints protegidos desde React, inicia sesión primero en el backend:

```text
http://localhost:8080/auth/login
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

## Comandos de build y prueba

Backend desde la raíz:

```bash
./mvnw -pl backend clean package
./mvnw -pl backend test
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
npm run backend:test
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
