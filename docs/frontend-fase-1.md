# BlueberryTrace · Auditoría y preparación frontend · Fase 1

## Objetivo de la fase

Preparar el proyecto para una modernización progresiva con Thymeleaf, Tailwind CSS y HTMX sin romper la arquitectura Spring MVC existente, la autenticación con Spring Security ni las rutas actuales.

Esta fase no rediseña todos los módulos. Su propósito es dejar una base reutilizable para que las siguientes fases puedan trabajar sobre layout, dashboard, tablas, formularios y componentes con menor duplicación.

## Estructura actual detectada

```text
blueberrytrace/
├── pom.xml
├── mvnw / mvnw.cmd
├── script_bd_blueberrytrace.sql
├── src/
│   ├── main/
│   │   ├── java/com/keraune/vlvblueberrysystem/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── enums/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   └── service/
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── static/
│   │       │   ├── css/style.css
│   │       │   ├── js/app.js
│   │       │   ├── js/tailwind.config.js
│   │       │   └── img/vlv/
│   │       └── templates/
│   │           ├── admin/
│   │           ├── auth/
│   │           ├── camas/
│   │           ├── clasificacion/
│   │           ├── cuenta/
│   │           ├── dashboard/
│   │           ├── despacho/
│   │           ├── fragments/
│   │           ├── lotes/
│   │           ├── procesos/
│   │           ├── reportes/
│   │           ├── siembra/
│   │           └── usuarios/
│   └── test/
└── README.md
```

## Plantillas Thymeleaf existentes

```text
templates/admin/gestion.html
templates/auth/login.html
templates/auth/register.html
templates/camas/lista.html
templates/clasificacion/index.html
templates/cuenta/ajustes.html
templates/dashboard/index.html
templates/despacho/index.html
templates/fragments/app-shell.html
templates/fragments/layout.html
templates/lotes/form.html
templates/lotes/lista.html
templates/procesos/index.html
templates/reportes/index.html
templates/siembra/index.html
templates/usuarios/lista.html
```

## CSS y JavaScript actuales

- `static/css/style.css`: hoja principal del sistema. Ya contiene la mayor parte del diseño visual actual: layout, sidebar, topbar, cards, tablas, formularios, login, dashboard, estados y responsive.
- `static/js/app.js`: microinteracciones actuales: animaciones suaves, menú de cuenta, búsqueda rápida de módulos, smooth scroll, ripple en botones y estado de carga en formularios.
- `static/js/tailwind.config.js`: nuevo archivo de configuración inicial para Tailwind Play CDN con tokens visuales de BlueberryTrace.

## Preparación realizada para Tailwind CSS

- Se centralizó el `<head>` en `templates/fragments/layout.html`.
- Se agregó Tailwind Play CDN para prototipado académico y transición progresiva.
- Se creó `static/js/tailwind.config.js` con colores relacionados al sistema: verde agroindustrial, berry, blueberry, superficies, sombras, radios y fuente Inter.
- Se mantiene `style.css` como fuente visual principal para no romper la interfaz actual.

> Nota: Tailwind Play CDN es útil para desarrollo, prototipos y APF3. Para producción o entrega final, se recomienda migrar a un build local con Tailwind CLI, PostCSS o integración Maven/npm controlada.

## Preparación realizada para HTMX

- Se centralizó la carga de scripts en `templates/fragments/layout.html` mediante el fragmento `scripts`.
- Se agregó HTMX 2.x por CDN para futuras interacciones parciales.
- Se añadieron metadatos CSRF en el head para que HTMX pueda enviar formularios protegidos por Spring Security.
- Se actualizó `app.js` para inyectar automáticamente el token CSRF en peticiones HTMX.
- Se añadieron estados visuales base para `htmx-request`, `htmx-swapping`, `htmx-settling` y `.htmx-indicator`.

## Estado de preparación

El proyecto queda preparado para Tailwind + HTMX en un nivel inicial y seguro:

- Thymeleaf sigue siendo el motor principal de vistas.
- Spring MVC mantiene las rutas existentes.
- Spring Security mantiene CSRF y login tradicional.
- CSS actual no fue eliminado.
- JavaScript actual fue reorganizado para soportar recargas parciales futuras.
- Las vistas ya comparten head y scripts, reduciendo duplicación.

## Recomendación de siguiente fase

La siguiente fase recomendada es la **Fase 2: Layout principal moderno**.

Prioridades sugeridas:

1. Convertir el `app-shell` en una base visual más limpia y reutilizable.
2. Mejorar sidebar y topbar con componentes consistentes.
3. Crear clases/componentes base para cards, botones, badges, tablas y formularios.
4. Mantener el backend intacto.
5. No activar todavía HTMX en formularios críticos hasta tener fragmentos parciales preparados.
