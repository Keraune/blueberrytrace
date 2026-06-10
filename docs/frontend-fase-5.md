# Frontend Fase 5 · Modales productivos y formularios avanzados

## Objetivo

Mejorar la experiencia operativa del panel BlueberryTrace incorporando modales reutilizables para registros frecuentes, confirmaciones visuales para acciones críticas y formularios más ordenados, manteniendo Spring MVC, Thymeleaf y HTMX.

## Alcance aplicado

- Siembra: creación desde modal con actualización parcial HTMX.
- Camas: creación desde modal y edición automática en modal cuando se abre un registro.
- Uniformización: creación desde modal con campos reales del DTO (`cantidadInicial` y `cantidadUniformizada`).
- Formalización: creación desde modal incluyendo el campo obligatorio `detalle`.
- Clasificación: creación desde modal y confirmación visual para cambios de estado.
- Despacho: creación desde modal y confirmación visual para cambios de estado.
- Acciones críticas: confirmación visual personalizada para operaciones con `hx-confirm`.

## Corrección funcional incluida

La vista `procesos/index.html` usaba la propiedad `cantidadProcesada`, pero el DTO `UniformizacionForm` y la entidad `Uniformizacion` trabajan con `cantidadInicial` y `cantidadUniformizada`. Se corrigió el formulario y la tabla para evitar errores de parseo en Thymeleaf.

También se agregó el campo `detalle` al formulario de formalización, ya que `FormalizacionForm` lo valida como obligatorio.

## Archivos principales

- `src/main/resources/templates/siembra/index.html`
- `src/main/resources/templates/camas/lista.html`
- `src/main/resources/templates/procesos/index.html`
- `src/main/resources/templates/clasificacion/index.html`
- `src/main/resources/templates/despacho/index.html`
- `src/main/resources/static/css/style.css`
- `src/main/resources/static/js/app.js`

## Validación local sugerida

1. Ejecutar la aplicación.
2. Ingresar al panel.
3. Abrir cada módulo operativo.
4. Crear registros desde los botones de acción superior.
5. Verificar que, al guardar, se actualice el contenido del módulo sin recargar toda la página.
6. Probar acciones de estado para validar el modal de confirmación.
7. Probar `/procesos` para confirmar que ya no falla por `cantidadProcesada`.
