# BlueberryTrace Frontend

Cliente React/Vite separado para la migración progresiva del panel BlueberryTrace.

## Stack

- React
- TypeScript
- Vite
- Lucide React
- CSS propio con la misma paleta del panel Thymeleaf

## Variables

Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

Valor recomendado:

```env
VITE_BLUEBERRYTRACE_API_BASE=http://localhost:8080/api/v1
VITE_BLUEBERRYTRACE_BACKEND_ORIGIN=http://localhost:8080
```

## Ejecutar

Primero inicia sesión en el backend:

```text
http://localhost:8080/auth/login
```

Luego ejecuta el frontend:

```bash
npm install
npm run dev
```

Abrir:

```text
http://localhost:5173
```

## Build

```bash
npm run build
npm run preview
```

## Módulos integrados

El frontend ya consume datos reales para:

- Dashboard
- Lotes e invernaderos
- Camas
- Siembra
- Uniformización y formalización
- Clasificación
- Despacho
- Reportes de trazabilidad
- Usuarios

## API consumida

```text
/api/v1/frontend/bootstrap
/api/v1/session/me
/api/v1/dashboard/summary
/api/v1/lotes
/api/v1/camas
/api/v1/siembras
/api/v1/procesos
/api/v1/clasificaciones
/api/v1/despachos
/api/v1/reportes/trazabilidad
/api/v1/usuarios
```
