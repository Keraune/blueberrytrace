# Fase 8 · Separación física backend/frontend

## Objetivo

Organizar BlueberryTrace como un repositorio con workspaces separados para backend y frontend, manteniendo estable el sistema existente y preparando una migración progresiva hacia React o Vue.

## Estructura resultante

```text
blueberrytrace/
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── .mvn/
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docs/
└── README.md
```

## Backend

El backend conserva:

- Spring Boot.
- Spring Security.
- Spring MVC.
- Thymeleaf.
- HTMX.
- JPA/Hibernate.
- MySQL.
- API `/api/v1/**` para clientes externos.

## Frontend

El frontend queda como cliente independiente con:

- React.
- TypeScript.
- Vite.
- Cliente API propio.
- Tipos TypeScript para las respuestas actuales.

## Compatibilidad

No se cambiaron paquetes Java ni rutas HTTP existentes. El cambio principal fue mover archivos de raíz a `backend/` y limpiar artefactos generados para que el repositorio quede más mantenible.

## Comandos principales

Backend:

```bash
cd backend
./mvnw spring-boot:run
./mvnw clean package
./mvnw test
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
npm run build
```
