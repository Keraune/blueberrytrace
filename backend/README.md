# BlueberryTrace Backend

Backend Spring Boot de BlueberryTrace. Desde la Fase 20 funciona como **API-first** y ya no contiene plantillas HTML Thymeleaf.

## Responsabilidades

- Exponer `/api/v1/**`.
- Autenticación JSON para React.
- Seguridad con Spring Security, sesión y CSRF.
- Servicios de negocio.
- Repositorios JPA.
- Conexión MySQL.

## Ejecutar desde la raíz

```bash
npm run backend:run
```

Puerto alternativo:

```bash
npm run backend:run:alt
```

Build y pruebas:

```bash
npm run backend:package
npm run backend:test
```

## Ejecutar con Maven directamente

Desde la raíz:

```bash
bash ./mvnw -pl backend spring-boot:run
bash ./mvnw -pl backend clean package
```

Desde `backend/`:

```bash
../mvnw spring-boot:run
```

## API de autenticación

```http
GET  /api/v1/auth/csrf
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/session/me
```

## Health check

```text
http://localhost:8080/api/v1/health
```

## Recursos del backend

Se mantiene:

```text
backend/src/main/resources/application.properties
```

Se retiró:

```text
backend/src/main/resources/templates/
backend/src/main/resources/static/
```

## Diagnóstico

```bash
npm run setup:permissions
npm run doctor
```

## Maven seguro

El workspace incluye `scripts/maven.sh`, que prefiere Maven instalado en el sistema y usa `./mvnw` como respaldo.

```bash
npm run maven -- -pl backend clean package
```

## Fase 21 - Edición real avanzada desde React

Se reemplazaron acciones visuales por operaciones reales de edición y confirmación:

- Formularios reutilizables con datos iniciales para editar registros existentes.
- Confirmaciones modernas con `ConfirmDialog` en lugar de `window.confirm`.
- Toasts globales para operaciones exitosas, errores y cambios de estado.
- Nuevos endpoints API-first `PUT` para siembras, procesos, clasificaciones y despachos.
- Edición real desde React para lotes, camas, siembras, procesos, clasificación y despacho.

## Fase 24 - Usuarios corporativos y modales por portal

Se corrigió el sistema de overlays del frontend para que los modales, confirmaciones y drawers se rendericen fuera del layout principal mediante portal en `document.body`. Esto evita desplazamientos visuales causados por el sidebar, el topbar o las transiciones de ruta.

También se avanzó el módulo de usuarios con operaciones reales conectadas al backend y MySQL:

- crear usuario corporativo;
- editar usuario;
- activar/desactivar usuario;
- validar correos `@vlv.com`;
- consumir roles activos desde el backend.

