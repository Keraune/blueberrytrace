# BlueberryTrace Frontend

Cliente React/Vite separado para la migración progresiva del panel BlueberryTrace.

## Stack

- React
- TypeScript
- Vite
- Lucide React
- CSS propio con identidad visual BlueberryTrace

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

El login se realiza directamente desde React usando la API del backend.

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

## Rutas React

El frontend separado usa navegación interna con History API. Rutas disponibles:

```text
/dashboard
/lotes
/camas
/siembra
/procesos
/clasificacion
/despacho
/reportes
/usuarios
```

Para entrar directo a una ruta, usa el servidor de Vite:

```text
http://localhost:5173/lotes
```

## Operaciones conectadas a la API

Actualmente el frontend React permite crear lotes, camas, siembras, uniformizaciones, formalizaciones, clasificaciones y despachos usando la API Spring Boot protegida con sesión y CSRF.

## Login React

El cliente React muestra su propia pantalla de acceso y consume:

```http
GET  /api/v1/auth/csrf
POST /api/v1/auth/login
POST /api/v1/auth/logout
```

El backend ya no contiene HTML Thymeleaf; React es la interfaz principal.


## Historial de fases

### Fase 15 - Login React estilo producción

Se rediseñó la pantalla de inicio de sesión del frontend React con panel visual oscuro, formulario limpio, credenciales demo y estilo alineado a las pantallas de referencia del sistema.

## Diagnóstico del workspace

Desde la raíz del repositorio puedes ejecutar:

```bash
npm run setup:permissions
npm run doctor
```

Esto restaura permisos del Maven Wrapper y muestra el estado de Java, Node, npm, puerto 8080 y configuración local.

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


## Fase 20 - Backend API-only

Se retiraron las vistas HTML del backend. El frontend React queda como única interfaz principal del sistema.

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

