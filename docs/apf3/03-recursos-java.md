# Recursos Java aplicados en BlueberryTrace

## 1. Objetivo

Este documento resume las librerías y recursos Java aplicados en el avance funcional del sistema, alineados con el taller de recursos Java de la Unidad 3.

## 2. Recursos utilizados

| Recurso | Tipo | Aplicación en BlueberryTrace | Evidencia en el proyecto |
| --- | --- | --- | --- |
| Java 21 | Lenguaje | Desarrollo del backend. | `backend/pom.xml` → `java.version`. |
| Spring Boot | Framework | Arranque, configuración y estructura del backend. | `VlvBlueberrySystemApplication.java`. |
| Spring Web MVC | Librería/framework | Exposición de endpoints REST JSON. | `api/controller`. |
| Spring Security | Seguridad | Login, sesión, CSRF y protección de rutas. | `config/SecurityConfig.java`. |
| Spring Data JPA | Persistencia | Repositorios para CRUD y consultas. | `repository/*Repository.java`. |
| Hibernate | ORM | Mapeo de entidades Java a tablas MySQL. | `entity/*.java`. |
| Bean Validation | Validación | Restricciones en formularios/DTO. | `dto/*Form.java`. |
| MySQL Connector/J | Driver | Conexión con MySQL. | Dependencia `mysql-connector-j`. |
| Maven | Gestión | Dependencias, build y ejecución. | `pom.xml`, `mvnw`, `scripts/maven.sh`. |
| Logback | Logging | Registro de eventos por defecto en Spring Boot. | Integración transitiva de Spring Boot. |

## 3. Relación con el sistema

- **Persistencia:** JPA/Hibernate permite que lotes, camas, siembras, procesos, clasificaciones, despachos y usuarios se almacenen en MySQL.
- **Validaciones:** Bean Validation reduce errores en formularios críticos como siembra, despacho y usuarios.
- **Seguridad:** Spring Security protege la API y evita acceso no autorizado.
- **Mantenibilidad:** Maven permite gestionar dependencias y ejecutar el backend de forma ordenada.
- **Escalabilidad:** La separación entre controladores, servicios y repositorios permite agregar módulos sin romper el sistema existente.

## 4. Librerías del taller y decisión técnica

| Librería del taller | Uso directo en BlueberryTrace | Decisión |
| --- | --- | --- |
| JDBC | No directo | Se usa JPA/Hibernate, que internamente opera sobre JDBC y reduce SQL manual. |
| Gson | No directo | La serialización JSON la realiza Spring/Jackson. |
| Jackson | Sí, vía Spring Boot | Convierte DTO y respuestas REST a JSON. |
| Apache Commons | No requerido aún | Puede evaluarse para utilidades futuras. |
| Lombok | No usado | Se mantiene código explícito para claridad académica. |
| JFreeChart | No usado | El dashboard usa SVG/React y reportes CSV. |
| Log4j | No usado directo | Spring Boot usa Logback por defecto; evita agregar otra librería de logging. |
| Maven | Sí | Gestión de dependencias y ejecución del backend. |

## 5. Comandos de evidencia

```bash
npm run backend:run
npm run frontend:dev
npm run frontend:build
npm run apf3:evidence
```

## 6. Conclusión

BlueberryTrace aplica recursos Java modernos mediante Spring Boot, JPA, Security, Validation, Maven y MySQL. Estas herramientas permiten demostrar persistencia real, seguridad, organización por capas y desarrollo funcional, cumpliendo el propósito del avance de desarrollo.
