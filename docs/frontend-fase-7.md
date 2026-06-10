# Frontend fase 7 · Cliente React/Vite inicial

## Objetivo

Separar progresivamente la interfaz de BlueberryTrace preparando un cliente React/Vite independiente, sin retirar el panel actual en Thymeleaf + HTMX.

## Alcance aplicado

- Se agregó el directorio `/frontend` con una aplicación React + TypeScript + Vite.
- El cliente consume endpoints JSON existentes bajo `/api/v1/**`.
- Se reutilizó la paleta visual productiva del panel actual: verde oscuro, verde principal, azul arándano, morado, lima, naranja, blanco y fondo suave.
- Se creó un dashboard inicial con sidebar, topbar, cards KPI, progreso operativo y tablas de invernaderos/camas.
- Se agregó un endpoint público para obtener CSRF desde clientes externos autorizados.
- Se configuró la respuesta `401 Unauthorized` para llamadas `/api/**` no autenticadas, evitando que un frontend externo reciba HTML del login como si fuera JSON.
- Se amplió CORS para `/api/**`, `/login` y `/logout` en desarrollo local.

## Estructura nueva

```text
frontend
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── .env.example
├── README.md
└── src
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components
    ├── lib
    ├── pages
    └── types
```

## Endpoints usados por React

```text
GET /api/v1/auth/csrf
GET /api/v1/frontend/bootstrap
GET /api/v1/session/me
GET /api/v1/dashboard/summary
GET /api/v1/lotes
GET /api/v1/camas
```

## Seguridad

La API sigue protegida por Spring Security. Para usar el cliente React durante desarrollo:

1. Iniciar el backend en `http://localhost:8080`.
2. Iniciar sesión con el formulario actual de Spring Security.
3. Abrir el frontend en `http://localhost:5173`.
4. React consume la sesión existente con `credentials: include`.

## Comandos frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm run preview
```

## Estrategia de migración recomendada

1. Mantener Thymeleaf + HTMX como panel estable.
2. Usar React para dashboard y vistas de lectura primero.
3. Migrar formularios después de definir contratos POST/PUT/PATCH en `/api/v1/**`.
4. Extraer DTOs de request para crear registros sin exponer entidades JPA.
5. Mantener CORS por ambiente y endurecerlo antes de producción.
