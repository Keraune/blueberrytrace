# BlueberryTrace

Sistema web interno para el control, clasificación y trazabilidad de plantas de arándano para exportación en el área de frutales de **Vivero Los Viñedos**.

BlueberryTrace permite centralizar la información operativa del proceso productivo, reduciendo la dependencia de registros manuales, hojas de cálculo dispersas y consultas lentas de información histórica. El sistema permite gestionar lotes, camas, siembras, procesos productivos, clasificación, despacho, reportes y trazabilidad por lote.

---

## Descripción general

BlueberryTrace está orientado a mejorar el control operativo del proceso de plantas de arándano, desde el registro inicial del lote hasta el despacho final. La solución permite registrar información real, consultar el historial de cada lote y generar reportes útiles para la supervisión del área de frutales.

El sistema utiliza una arquitectura web desacoplada:

* **Frontend:** React, Vite, TypeScript, HTML y CSS.
* **Backend:** Java 21, Spring Boot, Spring Security y API REST.
* **Persistencia:** Spring Data JPA, Hibernate y MySQL.
* **Gestión del proyecto:** Maven, Git y GitHub.

---

## Estructura del proyecto

```text
blueberrytrace/
├── pom.xml               # agregador Maven
├── package.json          # scripts de workspace
├── backend/              # API REST con Spring Boot, seguridad, servicios, JPA y MySQL
├── frontend/             # interfaz web con React, TypeScript y Vite
├── docs/                 # documentación técnica y funcional
├── scripts/              # utilidades de ejecución y mantenimiento
└── README.md
```

---

## Arquitectura del sistema

BlueberryTrace trabaja bajo una arquitectura **API REST desacoplada**, donde el frontend y el backend se ejecutan como capas independientes.

### Frontend

La interfaz principal está desarrollada con React, Vite y TypeScript. Esta capa se encarga de mostrar las pantallas del sistema, formularios, tablas, dashboard, reportes, trazabilidad, modales, notificaciones y navegación interna.

### Backend

El backend está desarrollado con Java 21 y Spring Boot. Expone servicios REST bajo la ruta `/api/v1/**`, gestiona reglas de negocio, validaciones, autenticación, autorización y comunicación con la base de datos.

### Base de datos

La información se almacena en MySQL mediante Spring Data JPA e Hibernate. Las entidades principales del sistema están relacionadas para conservar trazabilidad entre usuarios, lotes, camas, siembras, procesos, clasificaciones y despachos.

---

## Módulos principales

BlueberryTrace incluye los siguientes módulos:

* Inicio de sesión seguro.
* Panel operativo con indicadores principales.
* Gestión de usuarios y roles.
* Gestión de lotes e invernaderos.
* Gestión de camas.
* Registro de siembra.
* Uniformización y formalización.
* Control de clasificación.
* Seguimiento de despacho.
* Reportes operativos.
* Trazabilidad por lote.
* Perfil de usuario.
* Notificaciones operativas.
* Exportación CSV e impresión desde navegador.

---

## Tecnologías utilizadas

### Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* MySQL Connector/J
* Jackson
* Logback
* Maven

### Frontend

* React
* TypeScript
* Vite
* Lucide React
* HTML
* CSS

### Herramientas de desarrollo

* Git
* GitHub
* Maven Wrapper
* npm

---

## Requisitos

Antes de ejecutar el proyecto, se requiere tener instalado:

* Java 21
* Node.js
* npm
* MySQL
* Git

---

## Configuración de base de datos

Crear la base de datos en MySQL:

```sql
CREATE DATABASE vlv_blueberry_system
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Configurar credenciales mediante variables de entorno o desde el archivo de configuración del backend.

Ejemplo con variables de entorno:

```bash
DB_USERNAME=root DB_PASSWORD=12345678 npm run backend:run
```

Configuración esperada:

```text
Base de datos: vlv_blueberry_system
Usuario: root
Contraseña: según configuración local
Puerto MySQL: 3306
```

---

## Variables de entorno del frontend

Crear el archivo `.env` dentro de `frontend/` tomando como referencia `.env.example`.

```bash
cd frontend
cp .env.example .env
```

Valores recomendados:

```env
VITE_BLUEBERRYTRACE_API_BASE=http://localhost:8080/api/v1
VITE_BLUEBERRYTRACE_BACKEND_ORIGIN=http://localhost:8080
```

---

## Ejecución del proyecto

Desde la raíz del proyecto, preparar permisos de ejecución:

```bash
npm run setup:permissions
```

Ejecutar backend:

```bash
npm run backend:run
```

Ejecutar frontend:

```bash
npm run frontend:dev
```

Abrir la aplicación:

```text
http://localhost:5173
```

Verificar estado de la API:

```text
http://localhost:8080/api/v1/health
```

---

## Comandos disponibles

### Backend

```bash
npm run backend:run
npm run backend:run:alt
npm run backend:test
npm run backend:package
npm run backend:port
npm run backend:kill
```

### Frontend

```bash
npm run frontend:dev
npm run frontend:build
npm run frontend:preview
```

### Workspace

```bash
npm run setup:permissions
npm run doctor
```

---

## Credenciales iniciales

```text
Usuario: admin
Contraseña: admin123
```

Estas credenciales permiten ingresar al sistema con un usuario administrador inicial.

---

## API principal

```text
GET    /api/v1/health
GET    /api/v1/auth/csrf
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/frontend/bootstrap
GET    /api/v1/session/me
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
POST   /api/v1/procesos/formalizaciones

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
```

---

## Funcionalidades implementadas

### Autenticación y seguridad

* Inicio de sesión desde React.
* Autenticación mediante backend Spring Boot.
* Protección de rutas.
* Gestión de sesión.
* Validación de usuario activo.
* Control de roles.

### Gestión operativa

* Registro y edición de lotes.
* Registro y edición de camas.
* Registro, edición, anulación y eliminación de siembras.
* Registro de uniformizaciones.
* Registro de formalizaciones.
* Registro y validación de clasificaciones.
* Registro y seguimiento de despachos.

### Trazabilidad

* Consulta de historial por lote.
* Relación entre lote, cama, siembra, procesos, clasificación y despacho.
* Visualización de eventos operativos.
* Seguimiento desde el inicio del proceso hasta el despacho.

### Reportes

* Reportes por lote.
* Reportes de siembra.
* Reportes de clasificación.
* Reportes de despacho.
* Exportación CSV compatible con Excel.
* Impresión o guardado como PDF desde navegador.

### Interfaz de usuario

* Dashboard operativo.
* Sidebar corporativo.
* Búsqueda global.
* Notificaciones operativas.
* Modales y drawers responsive.
* Estados visuales con iconos.
* Perfil editable del usuario.
* Diseño moderno orientado a uso interno.

---

## Diseño de base de datos

El modelo de datos está organizado para conservar trazabilidad del proceso productivo. Las tablas principales son:

```text
roles
usuarios
variedades
lotes
camas
siembras
uniformizaciones
formalizaciones
clasificaciones
despachos
auditoria_operacion
```

Cada operación se relaciona con entidades principales como lote, cama y usuario responsable. Esto permite consultar el historial completo del proceso y mantener integridad de la información mediante claves primarias, claves foráneas, restricciones e índices.

---

## Control de versiones

El proyecto utiliza Git y GitHub para registrar la evolución del código fuente, mantener historial de cambios y organizar el trabajo del equipo.

El repositorio incluye:

* Estructura separada de backend y frontend.
* Commits descriptivos.
* Ramas de trabajo.
* README actualizado.
* Documentación técnica.
* Evidencias del desarrollo.

Repositorio oficial:

```text
https://github.com/Keraune/blueberrytrace
```

---

## Documentación

La carpeta `docs/` contiene documentación técnica y funcional del sistema, incluyendo:

* Arquitectura del sistema.
* Diseño de base de datos.
* Validaciones funcionales.
* Evidencias del proyecto.
* Guías de ejecución.
* Diagramas y material de soporte.

---

## Compilación

Compilar frontend:

```bash
npm run frontend:build
```

Compilar backend:

```bash
npm run backend:package
```

Ejecutar pruebas backend:

```bash
npm run backend:test
```

---

## Solución de problemas

### El puerto 8080 está ocupado

Verificar el puerto:

```bash
npm run backend:port
```

Liberar el puerto:

```bash
npm run backend:kill
```

Ejecutar nuevamente:

```bash
npm run backend:run
```

También puede usarse el puerto alternativo:

```bash
npm run backend:run:alt
```

### El frontend no conecta con el backend

Verificar que el backend esté ejecutándose:

```text
http://localhost:8080/api/v1/health
```

Revisar el archivo `.env` del frontend:

```env
VITE_BLUEBERRYTRACE_API_BASE=http://localhost:8080/api/v1
VITE_BLUEBERRYTRACE_BACKEND_ORIGIN=http://localhost:8080
```

### No aparecen tablas en MySQL

Verificar que la base de datos exista:

```sql
SHOW DATABASES;
USE vlv_blueberry_system;
SHOW TABLES;
```

Luego iniciar el backend para que Hibernate cree o actualice las tablas según la configuración del proyecto.

---

## Autoría

Proyecto desarrollado por:

* Jiménez Vásquez, Ramón Franschescoli
* Pisconte Ríos, Rodrigo William

Curso:

```text
Integrador I: Sistemas Software
Universidad Tecnológica del Perú
Ica, Perú
2026
```

---

## Estado del proyecto

BlueberryTrace cuenta con una implementación funcional de sus módulos principales, integrando frontend React, backend Java Spring Boot, API REST, seguridad, persistencia en MySQL, reportes y trazabilidad por lote.
