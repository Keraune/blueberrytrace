# BlueberryTrace Frontend

Cliente React/Vite/TypeScript para BlueberryTrace. Consume la API REST del backend Spring Boot y muestra la interfaz operativa del sistema.

## Stack

- React
- TypeScript
- Vite
- Lucide React
- CSS propio

## Variables

Crear `frontend/.env` usando `frontend/.env.example` como referencia:

```env
VITE_BLUEBERRYTRACE_API_BASE=http://localhost:8080/api/v1
VITE_BLUEBERRYTRACE_BACKEND_ORIGIN=http://localhost:8080
```

## Ejecutar

```bash
npm run frontend:dev
```

Abrir:

```text
http://localhost:5173
```

## Build

```bash
npm run frontend:build
```

## Módulos integrados

- Login con usuario o correo.
- Dashboard.
- Lotes.
- Camas.
- Siembras.
- Uniformización y formalización.
- Clasificación.
- Despacho.
- Trazabilidad.
- Reportes.
- Usuarios y roles.

## API consumida

```text
/api/v1/frontend/bootstrap
/api/v1/session/me
/api/v1/dashboard/summary
/api/v1/catalogs/operations
/api/v1/lotes
/api/v1/camas
/api/v1/siembras
/api/v1/procesos
/api/v1/clasificaciones
/api/v1/despachos
/api/v1/reportes/trazabilidad
/api/v1/usuarios
```
