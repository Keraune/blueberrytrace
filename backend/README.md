# BlueberryTrace Backend

Backend API REST de BlueberryTrace desarrollado con Java 21, Spring Boot, Spring Security, Spring Data JPA, Hibernate y MySQL.

## Responsabilidades

- Exponer endpoints bajo `/api/v1/**`.
- Autenticar usuarios con username o correo.
- Mantener sesión segura con Spring Security y CSRF.
- Ejecutar reglas de negocio en servicios.
- Persistir datos mediante repositorios JPA.
- Conectar con la base de datos `vlv_blueberry_system`.

## Estructura principal

```text
src/main/java/com/keraune/vlvblueberrysystem/
├── api/controller/   # controladores REST
├── api/dto/          # contratos JSON de la API
├── api/error/        # manejo centralizado de errores
├── api/mapper/       # conversión de entidades a DTOs
├── config/           # seguridad, CORS y datos iniciales
├── dto/              # formularios de entrada
├── entity/           # entidades JPA
├── repository/       # DAO/JPA
├── security/         # carga de usuarios y login flexible
└── service/          # reglas de negocio
```

## Ejecutar

Desde la raíz:

```bash
npm run backend:run
```

Con puerto alternativo:

```bash
SERVER_PORT=8081 npm run backend:run
```

## Pruebas y build

```bash
npm run backend:test
npm run backend:package
```

## Credenciales iniciales

```text
Usuario: admin
Correo: admin@vlv.com
Contraseña: admin123
```

## Endpoints base

```text
GET  /api/v1/health
GET  /api/v1/auth/csrf
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/session/me
```
