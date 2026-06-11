# BlueberryTrace — Fase 31

## Resumen

Esta fase agrega una vista operativa dedicada a la trazabilidad por lote. La pantalla consolida registros reales ya cargados desde la API: lotes, camas, siembras, uniformizaciones, formalizaciones, clasificaciones, despachos y el reporte de trazabilidad.

## Cambios principales

- Nuevo módulo visual "Trazabilidad por lote".
- Selector de lote, búsqueda y orden cronológico.
- Indicadores consolidados de plantas sembradas, plantas despachadas, procesos y clasificaciones.
- Tarjeta de avance del lote seleccionado.
- Flujo por etapas: siembra, uniformización, formalización, clasificación y despacho.
- Línea de tiempo operativa con fecha, estado, responsable, detalle y cantidad.
- Lista lateral de lotes con avance visual.
- Exportación CSV del historial del lote seleccionado.
- Opción de impresión o guardado como PDF desde navegador.
- Integración del módulo en rutas, sidebar, topbar y metadata del backend.

## Enfoque de datos

La vista no inventa datos. Calcula los indicadores desde los arreglos reales cargados por los endpoints actuales y usa el reporte `/api/v1/reportes/trazabilidad` cuando está disponible.
