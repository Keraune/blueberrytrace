# BlueberryTrace - Fase 20

## Objetivo

Consolidar la arquitectura API-first retirando del backend el frontend legado basado en Thymeleaf/HTML.

## Cambios realizados

- Eliminación de `backend/src/main/resources/templates`.
- Eliminación de assets estáticos antiguos en `backend/src/main/resources/static`.
- Eliminación del paquete MVC legado `com.keraune.vlvblueberrysystem.controller`.
- Eliminación de dependencias Thymeleaf en `backend/pom.xml`.
- Simplificación de `SecurityConfig` a una sola cadena de seguridad para API.
- Eliminación del script `backend:run:legacy`.
- Documentación de la nueva estructura API-first.

## Resultado

El backend queda enfocado en:

- API REST.
- Seguridad con sesión Spring Security para React.
- JPA/Hibernate.
- Servicios y repositorios.
- MySQL.

La interfaz principal queda en:

- `frontend/` con React/Vite.

## Importante

`backend/src/main/resources/application.properties` no se elimina porque Spring Boot lo necesita para configuración de servidor, base de datos, JPA y seguridad.
