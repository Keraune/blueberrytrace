# Fase 27 - Iconografía corporativa

## Objetivo

Se agregó una capa visual de iconografía consistente en la interfaz React para reforzar la lectura rápida de módulos, métricas, acciones y estados operativos sin cambiar la arquitectura API-first existente.

## Cambios principales

- Se añadió un isotipo SVG propio para BlueberryTrace usado en login y sidebar.
- Se centralizó el mapeo de iconos por módulo para sidebar, topbar y búsqueda global.
- Se incorporaron iconos en encabezados de módulos operativos.
- Se reemplazó el símbolo textual del seguimiento de procesos por un icono real de librería.
- Se añadieron iconos a tarjetas resumen de lotes, camas, usuarios, clasificación y despacho.
- Se mejoró el stepper del registro de siembra con iconos por paso.
- Se actualizó la búsqueda global para mostrar iconos según el módulo de cada resultado.

## Validación

```bash
cd frontend
npm ci
npm run build
```

Resultado: compilación correcta de TypeScript y Vite.
