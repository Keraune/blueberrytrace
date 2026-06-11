# Avance de Proyecto Final 3 — BlueberryTrace

## 1. Datos generales

**Curso:** Integrador I: Sistemas Software  
**Proyecto:** Sistema de información para el control, clasificación y trazabilidad de plantas de arándano para exportación en el área de frutales de Vivero Los Viñedos  
**Equipo:** Ramón Franschescoli Jiménez Vásquez y Rodrigo William Pisconte Ríos  
**Unidad:** Desarrollo  
**Entrega:** APF3

## 2. Resumen del avance

En el APF3, BlueberryTrace presenta una evolución desde el diseño preliminar hacia una aplicación funcional con arquitectura separada en backend y frontend. El sistema se encuentra organizado como una solución web interna orientada al registro, control y trazabilidad de plantas de arándano.

El backend trabaja como API REST con Java 21, Spring Boot, Spring Security, JPA/Hibernate, Maven y MySQL. El frontend funciona con React, Vite y TypeScript, consumiendo la API del backend. Esta separación permite mantener una arquitectura API-first, facilita la escalabilidad y evita que el backend dependa de vistas HTML internas.

## 3. Avance funcional del sistema

### 3.1 Funcionalidades implementadas

| Módulo | Estado del avance | Evidencia funcional |
| --- | --- | --- |
| Login y sesión | Implementado | Acceso con usuario y contraseña mediante API. |
| Dashboard | Implementado | Métricas operativas basadas en datos del sistema. |
| Gestión de usuarios | Implementado parcial/avanzado | Registro, edición, activación/inactivación y roles. |
| Lotes e invernaderos | Implementado | CRUD y control de estado. |
| Camas | Implementado | Registro asociado a lotes. |
| Registro de siembra | Implementado | Wizard con lote, cama, fecha y cantidad. |
| Uniformización | Implementado | Registro y seguimiento por lote/cama. |
| Formalización | Implementado | Registro de bandejas y plantas formalizadas. |
| Clasificación | Implementado | Registro de calidad, estado, tamaño y condición. |
| Despacho | Implementado | Registro de modalidad, cantidad y validación. |
| Reportes | Implementado inicial | Trazabilidad, filtros y exportación CSV. |
| Perfil corporativo | Implementado | Edición de datos, color/avatar y cambio de contraseña. |

## 4. Arquitectura del proyecto

BlueberryTrace está organizado como un workspace con dos aplicaciones principales:

```text
blueberrytrace/
├── backend/   → API REST Spring Boot
├── frontend/  → Interfaz React/Vite/TypeScript
├── docs/      → Documentación técnica y académica
└── scripts/   → Scripts de ejecución y evidencia
```

### 4.1 Backend

El backend contiene las capas:

| Capa | Paquete | Responsabilidad |
| --- | --- | --- |
| Controladores API | `api/controller` | Exponer endpoints REST JSON. |
| DTO y formularios | `api/dto`, `dto` | Transportar datos entre frontend y backend. |
| Servicios | `service` | Reglas de negocio y validaciones. |
| Repositorios | `repository` | Acceso a datos mediante Spring Data JPA. |
| Entidades | `entity` | Modelo persistente del dominio. |
| Seguridad | `security`, `config` | Autenticación, sesión, CSRF, CORS y permisos. |

### 4.2 Frontend

El frontend se organiza por componentes, páginas, librerías auxiliares, hooks y tipos:

| Carpeta | Responsabilidad |
| --- | --- |
| `components/` | Modales, tablas, sidebar, topbar, formularios y badges. |
| `pages/` | Pantallas principales del sistema. |
| `lib/` | API client, rutas, exportaciones y utilidades. |
| `types/` | Contratos TypeScript alineados con la API. |

## 5. Recursos Java aplicados

| Recurso | Aplicación en BlueberryTrace |
| --- | --- |
| Java 21 | Lenguaje base del backend. |
| Spring Boot | Estructura principal de la aplicación API. |
| Spring Web MVC | Controladores REST y endpoints JSON. |
| Spring Security | Login, sesión, CSRF y protección de rutas. |
| Spring Data JPA | Repositorios para acceso a datos. |
| Hibernate | Mapeo objeto-relacional. |
| Bean Validation | Validación de formularios y DTO. |
| MySQL Connector/J | Conexión con base de datos MySQL. |
| Maven | Gestión de dependencias, compilación y ejecución. |
| Logback | Registro de eventos mediante el stack de Spring Boot. |

## 6. Aplicación de MVC/API-first

Aunque el diseño inicial hablaba de MVC tradicional, el desarrollo actual aplica una variante moderna API-first:

| Concepto MVC | Implementación actual |
| --- | --- |
| Modelo | Entidades JPA, DTO, servicios y repositorios. |
| Vista | Frontend React/Vite independiente. |
| Controlador | Controladores REST en Spring Boot. |

Esta decisión permite separar completamente la interfaz del backend, facilitar pruebas, mejorar mantenibilidad y preparar el sistema para futuras integraciones.

## 7. Diseño DAO aplicado con JPA

En BlueberryTrace, el patrón DAO se implementa mediante repositorios de Spring Data JPA. Estos repositorios encapsulan la persistencia y evitan que los servicios accedan directamente a SQL.

| Repositorio | Entidad gestionada | Operaciones principales |
| --- | --- | --- |
| `UserRepository` | Usuarios | Buscar por usuario/correo, listar y guardar. |
| `RoleRepository` | Roles | Consultar roles y asignación a usuarios. |
| `LoteRepository` | Lotes | Registrar, actualizar, listar y cambiar estado. |
| `CamaRepository` | Camas | Registrar, listar por lote y cambiar estado. |
| `SiembraRepository` | Siembras | Registrar y consultar por lote/cama. |
| `UniformizacionRepository` | Uniformizaciones | Registrar proceso y consultar historial. |
| `FormalizacionRepository` | Formalizaciones | Registrar proceso y consultar historial. |
| `ClasificacionRepository` | Clasificaciones | Registrar calidad y cambiar estado. |
| `DespachoRepository` | Despachos | Registrar salida y consultar historial. |

## 8. Aplicación de SOLID

| Principio | Aplicación en BlueberryTrace | Beneficio |
| --- | --- | --- |
| S — Responsabilidad única | Servicios separados por módulo: usuarios, lotes, siembras, procesos, clasificación y despacho. | Reduce mezcla de lógica y facilita mantenimiento. |
| O — Abierto/Cerrado | Los reportes y módulos pueden ampliarse agregando nuevos servicios o endpoints sin reescribir todo el sistema. | Permite crecimiento gradual. |
| L — Sustitución de Liskov | Se evita herencia innecesaria en entidades; se prioriza composición y relaciones JPA. | Menor riesgo de errores por jerarquías mal usadas. |
| I — Segregación de interfaces | La API se separa por recursos: `/lotes`, `/camas`, `/siembras`, `/procesos`, `/clasificaciones`, `/despachos`. | Los consumidores usan solo lo necesario. |
| D — Inversión de dependencias | Los servicios dependen de repositorios inyectados por Spring, no de instancias manuales. | Reduce acoplamiento y mejora testabilidad. |

## 9. Estrategia TDD inicial

| Funcionalidad crítica | Caso de prueba | Entrada | Resultado esperado |
| --- | --- | --- | --- |
| Login | Credenciales válidas | usuario y contraseña correctos | Sesión iniciada. |
| Login | Credenciales inválidas | contraseña incorrecta | Error controlado. |
| Registro de lote | Código nuevo | datos válidos | Lote almacenado. |
| Registro de lote | Código duplicado | código existente | Advertencia o rechazo. |
| Registro de siembra | Lote y cama válidos | cantidad mayor a cero | Siembra registrada. |
| Registro de siembra | Cantidad inválida | cantidad 0 o negativa | Validación visible. |
| Clasificación | Datos completos | calidad, tamaño y cantidad | Clasificación registrada. |
| Despacho | Cantidad válida | lote, modalidad y cantidad | Despacho almacenado. |
| Reportes | Datos existentes | filtros por lote/fecha | Registros mostrados. |
| Seguridad | Ruta protegida | usuario sin sesión | Acceso denegado. |

## 10. Seguridad desde la arquitectura

| Riesgo | Impacto | Mecanismo aplicado/propuesto |
| --- | --- | --- |
| Acceso no autorizado | Usuarios ingresan sin permisos. | Spring Security, sesión y rutas protegidas. |
| Contraseñas inseguras | Robo de cuentas. | Hash con BCrypt. |
| Manipulación de formularios | Registros alterados. | Validación frontend y backend. |
| CSRF | Acciones no autorizadas desde otro origen. | CSRF token para llamadas desde React. |
| Datos inconsistentes | Duplicidad o registros incompletos. | Validaciones por formulario y reglas de servicio. |
| Exposición de vistas legacy | Superficie innecesaria. | Backend API-first sin Thymeleaf ni HTML interno. |
| Pérdida de trazabilidad | No saber quién registró operaciones. | Usuario responsable y fechas en registros operativos. |

## 11. Evidencias sugeridas para anexos

- Captura del login funcionando.
- Captura del panel operativo.
- Captura de gestión de usuarios.
- Captura de lotes e invernaderos.
- Captura del wizard de siembra.
- Captura de uniformización/formalización.
- Captura de clasificación.
- Captura de despacho.
- Captura de reportes y exportación CSV.
- Captura de estructura del backend.
- Captura de estructura del frontend.
- Captura del historial Git.
- Captura de ramas en GitHub.
- Captura de `npm run build` exitoso.

## 12. Problemas encontrados

| Problema | Solución aplicada |
| --- | --- |
| Dependencia inicial de vistas Thymeleaf | Migración a arquitectura API-first con React. |
| Interfaz inicial básica | Rediseño corporativo moderno. |
| Datos simulados en dashboard/reportes | Reemplazo progresivo por datos reales de API. |
| Formularios con poca validación visual | Validaciones y mensajes en wizard/formularios. |
| Falta de evidencias para APF3 | Se agregó carpeta `docs/apf3` y script de evidencia. |

## 13. Avances pendientes

- Completar pruebas automatizadas de backend.
- Profundizar permisos por rol en frontend y backend.
- Agregar auditoría formal de operaciones.
- Mejorar trazabilidad histórica por lote en una vista dedicada.
- Preparar capturas finales para anexos.
- Publicar y mantener repositorio GitHub con ramas del equipo.

## 14. Conclusiones

BlueberryTrace ya cuenta con una base funcional para el APF3: arquitectura separada, backend Java con Spring Boot, frontend moderno, persistencia en MySQL, seguridad inicial, módulos operativos y documentación técnica. La solución demuestra un avance consistente con la Unidad 3 porque transforma el diseño previo en un sistema funcional organizado por capas, con uso de recursos Java, estructura colaborativa y preparación para control de versiones.
