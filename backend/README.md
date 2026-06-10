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
