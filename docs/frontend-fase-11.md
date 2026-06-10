# Fase 11 - Arranque backend estable y formularios React operativos

## Objetivo

Consolidar el arranque del backend Spring Boot después de separar el repositorio en `backend/` y `frontend/`, y ampliar el frontend React para registrar operaciones productivas reales desde la API `/api/v1/**`.

## Cambios backend

- `application.properties` ahora acepta variables de entorno para MySQL:
  - `DB_URL`
  - `DB_USERNAME`
  - `DB_PASSWORD`
- Se agregó `spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect` para evitar fallos de autodetección de dialecto cuando Hibernate no puede leer correctamente los metadatos JDBC del servidor MySQL/MariaDB.
- Se agregaron scripts de diagnóstico para el puerto del backend:
  - `npm run backend:port`
  - `npm run backend:kill`
  - `npm run backend:run`
  - `npm run backend:run:alt`
- Se agregaron endpoints de escritura para:
  - Siembras
  - Uniformizaciones
  - Formalizaciones
  - Clasificaciones
  - Despachos

## Cambios frontend

React ahora puede crear registros para:

- Siembra
- Uniformización
- Formalización
- Clasificación
- Despacho

Además, se agregaron acciones rápidas para cambiar estados desde tablas.

## Arranque recomendado

Desde la raíz del repositorio:

```bash
npm run backend:port
npm run backend:run
```

Si el puerto 8080 está ocupado:

```bash
npm run backend:kill
npm run backend:run
```

O con puerto alternativo:

```bash
npm run backend:run:alt
```

## Variables de entorno MySQL

```bash
DB_USERNAME=root DB_PASSWORD=12345678 npm run backend:run
```

Si necesitas otra URL:

```bash
DB_URL='jdbc:mysql://localhost:3306/vlv_blueberry_system?useSSL=false&serverTimezone=America/Lima&allowPublicKeyRetrieval=true' npm run backend:run
```
