# Frontend Fase 4 · Interactividad progresiva con HTMX

## Objetivo

Incorporar interacciones parciales en los módulos operativos sin convertir BlueberryTrace en una SPA y sin modificar la arquitectura MVC principal.

## Alcance aplicado

- Se agregó soporte backend para detectar solicitudes HTMX mediante el encabezado `HX-Request`.
- Se incorporaron fragmentos `moduleContent` en las vistas operativas para reemplazar únicamente el contenido del módulo.
- Se activaron formularios y acciones con `hx-post` en módulos de trazabilidad.
- Se activó consulta parcial con `hx-get` en reportes.
- Se mantiene `action`, `method` y `href` originales como fallback cuando HTMX no esté disponible.
- Se reutilizan los tokens CSRF ya publicados por Thymeleaf en el `<head>`.

## Módulos con actualización parcial

- Lotes e invernaderos: cambio de estado y eliminación lógica.
- Camas: creación, edición, cambio de estado y carga de formulario de edición.
- Siembra: creación y cambio de estado.
- Uniformización/Formalización: creación y cambio de estado.
- Clasificación: creación y cambio de estado.
- Despacho: creación y cambio de estado.
- Reportes: búsqueda y limpieza de filtros por actualización parcial.
- Usuarios: vista preparada como fragmento consultable.

## Decisión técnica

La fase mantiene Spring MVC + Thymeleaf como render principal. HTMX solo mejora la experiencia evitando recargas completas en operaciones frecuentes. Si JavaScript falla o HTMX no carga, los formularios siguen funcionando por el flujo tradicional de Spring MVC.

## Estructura agregada

```text
src/main/java/com/keraune/vlvblueberrysystem/web/HtmxRequestSupport.java
```

Este helper centraliza la detección de solicitudes HTMX y evita duplicar lógica en controladores.

## UX aplicada

- Indicador de carga superior dentro del módulo.
- Animación suave durante swaps parciales.
- Mensajes de éxito renderizados en la misma sección.
- Restauración de botones de envío después de solicitudes dinámicas.
- Toast de error para fallos de red o respuestas inválidas.

## Pruebas sugeridas

1. Iniciar sesión como administrador.
2. Entrar a Camas.
3. Crear una cama y verificar que no se recarga toda la página.
4. Editar una cama desde el icono de edición y verificar que el formulario se carga en la misma vista.
5. Cambiar estado de un invernadero desde Lotes.
6. Registrar una siembra, clasificación o despacho y revisar que las métricas se actualicen.
7. Usar filtros en Reportes y confirmar que la URL cambia sin reemplazar todo el layout.
