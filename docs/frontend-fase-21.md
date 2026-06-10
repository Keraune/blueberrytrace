# BlueberryTrace - Fase 21

## Objetivo

Convertir las acciones visuales del frontend React en operaciones CRUD reales y modernas, evitando confirmaciones nativas del navegador y usando feedback visual propio del sistema.

## Cambios principales

- Edición real de lotes desde React.
- Edición real de camas desde React.
- Edición real de siembras desde React.
- Edición real de uniformizaciones y formalizaciones desde React.
- Edición real de clasificaciones desde React.
- Edición real de despachos desde React.
- Confirmaciones modernas reutilizables con `ConfirmDialog`.
- Toasts globales para creación, edición, cambios de estado y errores.
- Nuevos endpoints `PUT` API-first para módulos que aún no tenían actualización.

## Backend

Se agregaron endpoints:

```http
PUT /api/v1/siembras/{id}
PUT /api/v1/procesos/uniformizaciones/{id}
PUT /api/v1/procesos/formalizaciones/{id}
PUT /api/v1/clasificaciones/{id}
PUT /api/v1/despachos/{id}
```

Los endpoints devuelven la lista actualizada para que React pueda refrescar el estado sin recargar toda la aplicación.

## Frontend

Se agregó:

- `ConfirmDialog.tsx`
- `uiEvents.ts`
- soporte `initialData` en formularios reutilizables
- operaciones update en `blueberryApi`

## Validación

```bash
cd frontend
npm ci
npm run build
```

El build del frontend debe terminar sin errores.
