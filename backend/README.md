# BlueberryTrace Backend

Backend de BlueberryTrace desarrollado con Spring Boot, Spring Security, Thymeleaf, HTMX, JPA/Hibernate y MySQL.

## Módulos implementados

- Autenticación y autorización.
- Usuarios y roles.
- Lotes / invernaderos.
- Camas por invernadero.
- Siembra.
- Uniformización.
- Formalización.
- Clasificación.
- Despacho.
- Reportes de trazabilidad.
- Dashboard con métricas operativas.
- API `/api/v1/**` para integración con React/Vue.

## Estructura interna

```text
src/main/java/com/keraune/vlvblueberrysystem
├── api              # API JSON para clientes externos
├── config           # Seguridad, CORS e inicialización
├── controller       # Controladores MVC Thymeleaf
├── dto              # Formularios y DTOs internos
├── entity           # Entidades JPA
├── enums            # Estados operativos
├── repository       # Repositorios Spring Data JPA
├── security         # UserDetailsService
├── service          # Reglas de negocio
└── web              # Soporte HTMX
```

## Configuración de base de datos

Crear la base de datos:

```sql
CREATE DATABASE vlv_blueberry_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Editar credenciales en:

```text
src/main/resources/application.properties
```

## Ejecutar

```bash
./mvnw spring-boot:run
```

Abrir:

```text
http://localhost:8080
```

Credenciales iniciales:

```text
Usuario: admin
Contraseña: admin123
```

## Compilar y probar

```bash
./mvnw clean package
./mvnw test
```

## CORS para frontend local

```properties
blueberrytrace.api.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

## Endpoints iniciales para React/Vue

```text
GET /api/v1/auth/csrf
GET /api/v1/frontend/bootstrap
GET /api/v1/session/me
GET /api/v1/dashboard/summary
GET /api/v1/lotes
GET /api/v1/camas
```
