# Fase 26 — Normalización visual corporativa y limpieza de producto

## Objetivo

Consolidar BlueberryTrace como una interfaz de producto final: visual corporativo consistente, datos reales desde los servicios existentes, estados vacíos profesionales y eliminación de textos técnicos visibles en la experiencia de usuario.

## Cambios principales

- Se normalizó el lenguaje visible de módulos críticos: panel operativo, gestión de usuarios, registro de siembra, control de clasificación, seguimiento de despacho y reportes operativos.
- Se retiraron textos visibles relacionados con credenciales de prueba, servicios técnicos o infraestructura.
- Se agregó un componente reutilizable de estado vacío para evitar números inventados cuando no existen registros.
- Se agregó exportación CSV compatible con Excel para reportes, procesos, clasificación y despacho.
- Se preparó impresión del panel de reportes para usar la opción nativa del navegador como guardado en PDF.
- Se mantuvo el backend como backend de servicios sin plantillas HTML ni recursos estáticos de interfaz.

## Módulos mejorados

### Registro de siembra

- Wizard más limpio con tres pasos: lote y cama, datos de siembra y confirmación.
- Validaciones visibles antes de avanzar entre pasos.
- Estado vacío si faltan lotes o camas para operar.
- Confirmación con lote, cama, fecha, cantidad y observación antes de guardar.

### Uniformización y formalización

- Estado vacío profesional cuando no hay procesos en seguimiento.
- Exportación CSV basada en registros reales de uniformizaciones y formalizaciones.
- Tablas con estados vacíos reutilizables.

### Clasificación

- Cards por calidad calculadas desde condición, estado y tamaño registrados.
- Se eliminó la asignación alternada por índice para evitar cantidades inventadas.
- Tabla más directa con criterio, tamaño, condición, cantidad, responsable y estado.
- Filtros por lote, estado y búsqueda textual.
- Exportación CSV de los registros filtrados.

### Despacho

- Métricas basadas en registros existentes: total despachado, en seguimiento, cerrados y con observación.
- Historial con filtro de estado y exportación CSV.
- Estado vacío con acción para crear el primer despacho.
- Formulario sin valores técnicos inventados cuando los catálogos no llegan cargados.

### Reportes

- Se retiraron series mensuales simuladas.
- Panel de parámetros por tipo de reporte y lote.
- Consolidado basado en trazabilidad real.
- Exportación CSV e impresión/guardado PDF desde navegador.

## Validaciones ejecutadas

```bash
cd frontend
npm ci
npm run build
```

Resultado: compilación TypeScript y build Vite completados correctamente.

## Nota de backend

La validación Maven no pudo completarse en este entorno porque no hay Maven del sistema y el wrapper intentó descargar Maven desde repositorios externos. El backend no recibió cambios funcionales, solo ajustes de etiquetas de módulos y texto de bootstrap.
