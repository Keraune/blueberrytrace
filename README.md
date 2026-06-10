# BlueberryTrace

Sistema web interno para el control, clasificación y trazabilidad de plantas de arándano en el área de frutales de Vivero Los Viñedos.

## Módulos backend implementados

El proyecto mantiene arquitectura MVC con Spring Boot, Thymeleaf, Spring Security, JPA y MySQL.

### Base operativa

- Usuarios y roles.
- Lotes / invernaderos.
- Camas por invernadero.

### Procesos de trazabilidad

- Siembra y ubicación en cama.
- Uniformización.
- Formalización.
- Clasificación de plantas.
- Despacho.
- Reportes consolidados de trazabilidad.
- Dashboard con KPIs calculados desde la base de datos.

## Flujo de trazabilidad

```text
Lote / Invernadero → Cama → Siembra → Uniformización → Formalización → Clasificación → Despacho → Reportes
```

Cada registro operativo queda asociado a:

- Invernadero.
- Cama, cuando corresponde.
- Usuario autenticado.
- Fecha del proceso.
- Estado operativo.
- Observaciones.

## Credenciales iniciales

El inicializador crea un usuario administrador si no existe:

```text
Usuario: admin
Contraseña: admin123
```

## Base de datos

Crear la base de datos antes de ejecutar:

```sql
CREATE DATABASE vlv_blueberry_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Revisar credenciales en:

```text
src/main/resources/application.properties
```

## Ejecución

Con Maven Wrapper:

```bash
./mvnw spring-boot:run
```

O con Maven instalado:

```bash
mvn spring-boot:run
```

Luego abrir:

```text
http://localhost:8080
```

## Estructura principal

```text
src/main/java/com/keraune/vlvblueberrysystem
├── config
├── controller
├── dto
├── entity
├── repository
├── security
└── service
```

## Nota técnica

El proyecto incluye `.mvn/wrapper/maven-wrapper.properties` para que el script `mvnw` pueda descargar Maven automáticamente en un entorno con conexión a internet.

## Corrección aplicada

Se corrigió el mapeo de la entidad `Despacho` para usar la columna persistente `modalidad_despacho`. Esto evita el error de MySQL:

```text
Field 'modalidad_despacho' doesn't have a default value
```

El formulario y el código Java pueden seguir usando la propiedad `modalidad`; JPA la persiste correctamente en la columna `modalidad_despacho`. Además, se agregó compatibilidad con la columna `modalidad` en caso de que Hibernate la haya creado durante una ejecución previa fallida con `ddl-auto=update`.

## Nota de compatibilidad de base de datos

El módulo de despacho mantiene compatibilidad con esquemas locales creados durante versiones anteriores del proyecto.
La entidad `Despacho` sincroniza los campos actuales `modalidad_despacho` y `cantidad_despachada` con las columnas heredadas `modalidad` y `cantidad`, evitando errores `Field ... doesn't have a default value` cuando MySQL conserva columnas antiguas como `NOT NULL`.

Si deseas limpiar completamente la base de datos durante desarrollo, puedes recrear el esquema `vlv_blueberry_system` y ejecutar nuevamente la aplicación.


## Interfaz productiva

Se agregó una capa visual moderna para operación interna:

- Login dividido con panel institucional y formulario limpio.
- Sidebar fija con navegación por grupos funcionales.
- Topbar compacta con búsqueda, notificaciones y acceso de perfil.
- Dashboard claro con métricas, gráficos visuales y accesos rápidos.
- Tablas, formularios, botones y badges con estilos consistentes.
- Microinteracciones suaves, búsqueda rápida de módulos y efecto ripple en botones.

## Base frontend · Tailwind + HTMX

Se preparó la base frontend para una modernización progresiva sin migrar a SPA y sin romper Spring MVC:

- Centralización del `<head>` en `templates/fragments/layout.html`.
- Centralización de scripts en el fragmento `fragments/layout :: scripts`.
- Integración inicial de Tailwind Play CDN para prototipado visual.
- Configuración de tokens visuales en `static/js/tailwind.config.js`.
- Integración inicial de HTMX 2.x por CDN para futuras recargas parciales.
- Metadatos CSRF disponibles para peticiones dinámicas protegidas por Spring Security.
- `app.js` preparado para reinicializar microinteracciones después de swaps parciales de HTMX.
- Estilos base para indicadores y estados HTMX en `style.css`.

Documentación de auditoría: `docs/frontend-fase-1.md`.

### Comandos principales

```bash
./mvnw spring-boot:run
./mvnw clean package
./mvnw test
```

