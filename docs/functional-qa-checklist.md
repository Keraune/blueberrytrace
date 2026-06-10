# Checklist funcional APF3 - BlueberryTrace

## Entorno

- [ ] Ejecutar `npm run setup:permissions`.
- [ ] Ejecutar `npm run doctor`.
- [ ] Levantar backend con `npm run backend:run`.
- [ ] Levantar frontend con `npm run frontend:dev`.
- [ ] Abrir `http://localhost:5173`.
- [ ] Verificar backend en `http://localhost:8080/api/v1/health`.

## Login

- [ ] Iniciar sesión con usuario válido.
- [ ] Probar credenciales inválidas.
- [ ] Cerrar sesión desde la interfaz.
- [ ] Confirmar que la sesión expirada muestra feedback visual.

## Dashboard

- [ ] Verificar tarjetas KPI.
- [ ] Verificar gráfico anual.
- [ ] Verificar donut de estado de lotes.
- [ ] Abrir centro de acciones con `Ctrl + K`.
- [ ] Sincronizar datos desde el dock flotante.

## Lotes

- [ ] Crear lote.
- [ ] Editar lote.
- [ ] Cambiar estado con confirmación moderna.
- [ ] Abrir vista rápida.
- [ ] Verificar filtros por estado.

## Camas

- [ ] Crear cama.
- [ ] Editar cama.
- [ ] Cambiar estado.
- [ ] Abrir detalle en drawer.
- [ ] Revisar responsive en pantalla pequeña.

## Siembra

- [ ] Registrar siembra con wizard.
- [ ] Editar siembra desde modal.
- [ ] Cambiar estado con confirmación.
- [ ] Confirmar que el modal mantenga el footer visible.

## Procesos

- [ ] Crear uniformización.
- [ ] Editar uniformización.
- [ ] Crear formalización.
- [ ] Editar formalización.
- [ ] Cambiar estados con confirmación.

## Clasificación

- [ ] Crear clasificación.
- [ ] Editar clasificación.
- [ ] Validar clasificación.
- [ ] Observar clasificación.
- [ ] Confirmar toasts de éxito/error.

## Despacho

- [ ] Crear despacho.
- [ ] Editar despacho.
- [ ] Cerrar despacho.
- [ ] Observar despacho.
- [ ] Validar tabla en desktop y móvil.

## Reportes

- [ ] Revisar tarjetas de reportes.
- [ ] Revisar parámetros visuales del reporte.
- [ ] Verificar trazabilidad por lote.

## Responsive

- [ ] Probar 1440px desktop.
- [ ] Probar 1024px tablet.
- [ ] Probar 768px tablet vertical.
- [ ] Probar 390px móvil.
- [ ] Confirmar que modales se comporten como bottom sheet en móvil.
