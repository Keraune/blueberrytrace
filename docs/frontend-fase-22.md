# BlueberryTrace - Fase 22

## Objetivo

Mejorar la experiencia responsive de los modales, drawers y confirmaciones, y preparar una checklist funcional para validar la integración React + API.

## Cambios principales

- Modal base con soporte de tamaños `sm`, `md`, `lg` y `xl`.
- Cierre con tecla `Escape`.
- Bloqueo de scroll del fondo mientras un overlay está abierto.
- Foco inicial en el botón de cierre/cancelación para mejorar accesibilidad.
- Header sticky dentro de modales.
- Footer sticky para formularios largos.
- Modales tipo bottom sheet en pantallas pequeñas.
- Drawers responsive: lateral en desktop y bottom sheet en móvil.
- Confirmaciones responsive con acciones apiladas en móvil.
- Animaciones suaves conservando `prefers-reduced-motion`.

## Archivos principales

- `frontend/src/components/Modal.tsx`
- `frontend/src/components/ConfirmDialog.tsx`
- `frontend/src/components/DetailDrawer.tsx`
- `frontend/src/index.css`

## Validación recomendada

1. Abrir crear/editar lote en desktop.
2. Abrir crear/editar cama en móvil.
3. Abrir editar siembra y revisar scroll interno.
4. Abrir confirmación de cambio de estado.
5. Probar cerrar con `Escape`.
6. Probar cerrar desde el fondo del modal.
7. Verificar que el footer de guardar/cancelar quede visible en formularios largos.
