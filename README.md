# BlueberryTrace

Sistema web interno para el control, clasificación y trazabilidad de plantas de arándano para exportación en el área de frutales de Vivero Los Viñedos.

El proyecto quedó organizado como una base separada para backend y frontend, manteniendo estable el panel actual en Spring MVC + Thymeleaf + HTMX y dejando listo el cliente React/Vite para una migración progresiva.

## Estructura del repositorio

```text
blueberrytrace/
├── backend/              # Spring Boot, Thymeleaf, HTMX, API REST y seguridad
├── frontend/             # React + TypeScript + Vite
├── docs/                 # Documentación técnica por etapa
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

Ejecución:

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
- CSS modular por componentes
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

Backend:

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
git commit -m "refactor(project): separar backend y frontend en workspaces"
git push origin main
```
