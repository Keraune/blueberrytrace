# BlueberryTrace - Fase 3 Frontend

## Objetivo

Consolidar el diseño operativo del panel para que las pantallas principales mantengan el mismo lenguaje visual: métricas superiores, tarjetas limpias, tablas productivas, filtros rápidos, formularios claros y acciones visibles.

## Alcance implementado

- Lotes e invernaderos.
- Camas de cultivo.
- Registro de siembra.
- Uniformización y formalización.
- Clasificación.
- Despacho.
- Usuarios.
- Reportes y trazabilidad.
- Ajustes menores en cuenta y gestión administrativa.

## Decisiones técnicas

- Se mantuvo Spring MVC con Thymeleaf.
- No se modificaron controladores, servicios, repositorios, entidades ni configuración de seguridad.
- Las búsquedas de tablas se implementaron en JavaScript local sin cambiar endpoints.
- Los filtros visuales por estado trabajan sobre filas ya renderizadas por Thymeleaf.
- Se mantuvo HTMX disponible para la siguiente fase.
- Se agregó el archivo de configuración faltante del Maven Wrapper.

## Pruebas sugeridas

1. Iniciar sesión.
2. Abrir las vistas principales desde el sidebar.
3. Probar búsqueda rápida dentro de tablas.
4. Probar filtros por estado en invernaderos y camas.
5. Registrar siembra, clasificación, despacho y procesos operativos.
6. Cambiar estados desde las acciones existentes.
7. Confirmar que las rutas anteriores siguen respondiendo.
