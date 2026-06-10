# BlueberryTrace - Fase 23

## Objetivo

Corregir la experiencia visual principal del frontend React y preparar el sistema para funcionalidades reales conectadas a datos de MySQL mediante la API Spring Boot.

## Cambios aplicados

- El buscador fijo del topbar fue reemplazado por un botón de búsqueda que abre el centro de búsqueda global.
- `Ctrl + K` se mantiene como acceso rápido al centro de búsqueda.
- El centro de búsqueda ahora muestra módulos y registros reales cargados desde la API: lotes, camas, siembras, procesos, clasificaciones, despachos y usuarios.
- El botón de notificaciones dejó de ser decorativo y ahora abre un panel con eventos derivados de datos reales ya cargados en memoria desde el backend.
- El avatar abre un menú de perfil con nombre, correo, usuario y rol.
- Se retiró el dock flotante visual para que la búsqueda aparezca solo cuando el usuario la solicite.
- El dashboard dejó de generar series falsas y ahora calcula tendencias desde siembras y despachos reales.
- La actividad reciente del dashboard se genera desde registros reales del sistema.
- Se mejoró el centrado, tamaño máximo, footer sticky y comportamiento responsive de modales.
- Se agregaron estados vacíos para gráficas sin datos suficientes.

## Verificación de limpieza API-first

- No existen templates Thymeleaf en `backend/src/main/resources/templates`.
- No existe carpeta `backend/src/main/resources/static`.
- No existe paquete MVC legacy `controller`.
- El backend se mantiene como API-first.
- `application.properties` se conserva porque Spring Boot lo necesita.

## Validación frontend

```bash
cd frontend
npm ci
npm run build
```

El build de React/Vite compila correctamente.

## Pendiente para fases siguientes

- CRUD completo de usuarios desde React.
- Perfil editable y avatar real.
- Notificaciones persistentes en base de datos.
- Dashboard con endpoints agregados desde backend para métricas avanzadas.
- Búsqueda global consultando directamente a la API.
