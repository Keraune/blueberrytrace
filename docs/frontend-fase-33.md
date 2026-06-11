# BlueberryTrace — Fase 33

## Resumen

Fase final de pulido para APF3 orientada a estabilidad funcional con backend y MySQL.
Se corrige la vista de trazabilidad por lote, se agrega eliminación de registros de siembra y se refuerza la validación del formato de fechas en la interfaz.

## Cambios principales

- Corrección de trazabilidad por lote: el último evento se muestra como texto operativo y la fecha se calcula desde los movimientos reales.
- Protección de formato de fecha en frontend para evitar errores visuales cuando el backend devuelve etiquetas operativas.
- Nuevo endpoint `DELETE /api/v1/siembras/{id}` para eliminar registros de siembra desde MySQL.
- Acción de eliminación en la tabla de siembras recientes con confirmación.
- Maven Wrapper de raíz restaurado para ejecución backend desde los scripts del workspace.

## Enfoque APF3

Esta fase deja el sistema listo para demostrar:

- módulos conectados al backend,
- persistencia en MySQL,
- control de versiones,
- arquitectura por capas,
- operaciones CRUD reales,
- trazabilidad por lote.
