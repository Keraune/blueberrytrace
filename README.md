# BlueberryTrace

BlueberryTrace es un sistema web interno para el control, clasificación y trazabilidad de plantas de arándano para exportación en el área de frutales de **Vivero Los Viñedos**.

La solución permite registrar y consultar información operativa desde el lote inicial hasta el despacho final, manteniendo relación entre usuarios, roles, lotes, camas, siembras, uniformizaciones, formalizaciones, clasificaciones, despachos, reportes y trazabilidad.

---

## Stack tecnológico

### Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL Connector/J
- Jackson
- Logback
- Maven

### Frontend

- React
- Vite
- TypeScript
- HTML
- CSS
- Lucide React

### Base de datos y control de versiones

- MySQL
- Git
- GitHub

---

## Arquitectura

El proyecto usa una arquitectura web desacoplada:

- **Frontend React:** capa visual y experiencia de usuario.
- **Backend Spring Boot API REST:** controladores, servicios, seguridad y reglas de negocio.
- **Spring Data JPA / Hibernate:** capa DAO/JPA para persistencia.
- **MySQL:** almacenamiento transaccional de la operación.

La API principal se expone bajo:

```text
/api/v1/**
```

El backend no utiliza vistas Thymeleaf ni HTML del lado servidor. La interfaz final es el cliente React.

---

## Estructura del proyecto

```text
blueberrytrace/
├── backend/                    # API REST Java 21 + Spring Boot
│   ├── src/main/java/           # controladores, servicios, entidades, repositorios, seguridad
│   ├── src/main/resources/      # application.properties
│   ├── src/test/java/           # pruebas unitarias mínimas
│   ├── pom.xml
│   └── script_bd_blueberrytrace.sql
├── frontend/                   # cliente React + Vite + TypeScript
│   ├── src/components/
│   ├── src/pages/
│   ├── src/lib/
│   ├── src/types/
│   ├── package.json
│   └── .env.example
├── docs/                       # matriz APF3 y guía de exposición práctica
├── scripts/                    # utilidades de ejecución y diagnóstico
├── pom.xml                     # agregador Maven
├── package.json                # scripts de workspace
└── README.md
```

---

## Requisitos

- Java 21
- Node.js y npm
- MySQL 8 o compatible
- Git
- Maven o Maven Wrapper funcional

---

## Configuración de MySQL

Crear la base de datos:

```sql
CREATE DATABASE IF NOT EXISTS `vlv_blueberry_system`
DEFAULT CHARACTER SET = utf8mb4
DEFAULT COLLATE = utf8mb4_unicode_ci;
```

También puedes ejecutar el script base completo:

```text
backend/script_bd_blueberrytrace.sql
```

En DBeaver, HeidiSQL o clientes similares, ejecútalo como **script completo**. Si el cliente intenta correr todo como una sola sentencia y marca error cerca de `USE`, usa la opción de ejecutar script, no la opción de ejecutar solo la sentencia actual.

Si tu servidor local es MariaDB, el proyecto ya usa `MariaDBDialect` por defecto para evitar advertencias de Hibernate 7. En MySQL Server puro puedes sobrescribirlo con `JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQLDialect`.

Configuración por defecto del backend:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vlv_blueberry_system?useSSL=false&serverTimezone=America/Lima&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=12345678
```

Puedes sobreescribir credenciales usando variables de entorno:

```bash
DB_USERNAME=root DB_PASSWORD=tu_password npm run backend:run
```

---

## Variables del frontend

Crear o revisar `frontend/.env`:

```env
VITE_BLUEBERRYTRACE_API_BASE=http://localhost:8080/api/v1
VITE_BLUEBERRYTRACE_BACKEND_ORIGIN=http://localhost:8080
```

`VITE_BLUEBERRYTRACE_API_BASE` debe apuntar al backend Spring Boot.

---

## Instalación

Desde la raíz del proyecto:

```bash
npm ci
```

Instalar dependencias solo del frontend:

```bash
npm --prefix frontend ci
```

---

## Ejecución

Ejecutar backend:

```bash
npm run backend:run
```

Ejecutar backend en puerto alternativo:

```bash
SERVER_PORT=8081 npm run backend:run
```

Ejecutar frontend:

```bash
npm run frontend:dev
```

Abrir la aplicación:

```text
http://localhost:5173
```

Verificar estado del backend:

```text
http://localhost:8080/api/v1/health
```

---

## Compilación y pruebas

Compilar frontend:

```bash
npm run frontend:build
```

Ejecutar pruebas backend:

```bash
npm run backend:test
```

Empaquetar backend:

```bash
npm run backend:package
```

---

## Credenciales iniciales

El backend crea un usuario administrador inicial cuando no existe en MySQL:

```text
Usuario: admin
Correo: admin@vlv.com
Contraseña: admin123
```

El inicio de sesión acepta usuario o correo.

---

## Módulos funcionales

- Inicio de sesión seguro con sesión y CSRF.
- Dashboard operativo con indicadores generales.
- Usuarios y roles.
- Lotes e invernaderos.
- Camas productivas.
- Siembras.
- Uniformizaciones y formalizaciones.
- Clasificaciones.
- Despachos.
- Trazabilidad por lote.
- Reportes operativos.
- Perfil de usuario y cambio de contraseña.
- Exportación CSV desde el frontend.

---

## API principal

```text
GET    /api/v1/health
GET    /api/v1/auth/csrf
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/frontend/bootstrap
GET    /api/v1/session/me
PUT    /api/v1/session/me
PATCH  /api/v1/session/me/password
GET    /api/v1/dashboard/summary
GET    /api/v1/catalogs/operations

GET    /api/v1/lotes
POST   /api/v1/lotes
PUT    /api/v1/lotes/{id}
PATCH  /api/v1/lotes/{id}/estado
DELETE /api/v1/lotes/{id}

GET    /api/v1/camas
POST   /api/v1/camas
PUT    /api/v1/camas/{id}
PATCH  /api/v1/camas/{id}/estado

GET    /api/v1/siembras
POST   /api/v1/siembras
PUT    /api/v1/siembras/{id}
PATCH  /api/v1/siembras/{id}/estado
DELETE /api/v1/siembras/{id}

GET    /api/v1/procesos
POST   /api/v1/procesos/uniformizaciones
PUT    /api/v1/procesos/uniformizaciones/{id}
PATCH  /api/v1/procesos/uniformizaciones/{id}/estado
POST   /api/v1/procesos/formalizaciones
PUT    /api/v1/procesos/formalizaciones/{id}
PATCH  /api/v1/procesos/formalizaciones/{id}/estado

GET    /api/v1/clasificaciones
POST   /api/v1/clasificaciones
PUT    /api/v1/clasificaciones/{id}
PATCH  /api/v1/clasificaciones/{id}/estado

GET    /api/v1/despachos
POST   /api/v1/despachos
PUT    /api/v1/despachos/{id}
PATCH  /api/v1/despachos/{id}/estado

GET    /api/v1/reportes/trazabilidad
GET    /api/v1/usuarios
POST   /api/v1/usuarios
PUT    /api/v1/usuarios/{id}
PATCH  /api/v1/usuarios/{id}/estado
GET    /api/v1/roles
```

---

## Base de datos

Tablas principales:

```text
roles
usuarios
lotes
camas
siembras
uniformizaciones
formalizaciones
clasificaciones
despachos
```

El modelo conserva trazabilidad mediante claves foráneas entre lote, cama, usuario responsable y procesos operativos.

Consultas útiles para ver evidencias:

```sql
USE vlv_blueberry_system;
SHOW TABLES;
SELECT id, username, email, estado FROM usuarios;
SELECT id, codigo, estado FROM lotes;
SELECT id, codigo, lote_id, estado FROM camas;
SELECT id, lote_id, cama_id, cantidad_registrada FROM siembras;
SELECT id, lote_id, cantidad_despachada, estado FROM despachos;
```

---

## Control de versiones

Repositorio oficial:

```text
https://github.com/Keraune/blueberrytrace
```

Buenas prácticas recomendadas:

```bash
git status
git add .
git commit -m "Consolida backend API REST y mejora presentación APF3"
git push origin main
```

---

## Autores

- Jiménez Vásquez, Ramón Franschescoli
- Pisconte Ríos, Rodrigo William
