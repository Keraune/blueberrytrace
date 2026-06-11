# Matriz de cumplimiento APF3 - BlueberryTrace

Esta matriz resume dónde se evidencia cada punto solicitado para el tercer avance del proyecto BlueberryTrace.

| Punto solicitado | Dónde se aplica en el proyecto | Archivos o módulos relacionados | Evidencia para mostrar en exposición | Estado |
|---|---|---|---|---|
| Arquitectura MVC/API REST | React cumple la capa de vista; Spring Boot expone controladores REST; servicios concentran negocio; repositorios JPA acceden a MySQL. | `frontend/src/pages/*`, `backend/src/main/java/com/keraune/vlvblueberrysystem/api/controller/*`, `service/*`, `repository/*` | Mostrar una pantalla del frontend y luego el endpoint equivalente en `ApiOperationsController`. | Cumple |
| DAO/JPA | Cada tabla principal tiene entidad JPA y repositorio Spring Data. | `entity/*`, `repository/*` | Abrir `LoteRepository`, `CamaRepository`, `SiembraRepository`, `UserRepository` y comparar con tablas MySQL. | Cumple |
| SOLID | Separación por responsabilidad: controladores no contienen reglas de negocio; servicios procesan operaciones; mappers convierten entidades a DTOs. | `LoteService`, `CamaService`, `ProcesoOperativoService`, `ApiRecordMapper`, `ApiOperationsController` | Explicar que una operación de lote pasa de React a Controller, Service, Repository y MySQL. | Cumple |
| TDD / pruebas | Se agregaron pruebas unitarias mínimas para normalización de login y carga de clase principal. | `backend/src/test/java/com/keraune/vlvblueberrysystem/security/LoginIdentifierTest.java`, `VlvBlueberrySystemApplicationTests.java` | Ejecutar o mostrar `npm run backend:test`; si no hay Maven local, mostrar las pruebas y explicar su propósito. | Parcial |
| Seguridad | Login JSON con Spring Security, sesión, CSRF, CORS controlado y usuario activo. Login acepta usuario o correo. | `SecurityConfig`, `CustomUserDetailsService`, `LoginIdentifier`, `ApiAuthController`, `AccountService` | Mostrar login con `admin` y con `admin@vlv.com`; abrir `CustomUserDetailsService`. | Cumple |
| Recursos Java | Uso de Spring Boot, Spring Security, Spring Data JPA, Hibernate, Jackson, Logback, Maven y MySQL Connector/J. | `backend/pom.xml`, `application.properties`, `entity/*`, `repository/*` | Abrir `pom.xml` y señalar dependencias principales. | Cumple |
| Git/GitHub | Workspace preparado con README, scripts, estructura separada y commit recomendado. | `README.md`, `package.json`, `scripts/*` | Mostrar repositorio GitHub, historial de commits y ramas. | Cumple |
| Interfaces UX/UI | Interfaz React con login, dashboard, sidebar, topbar, tablas, cards, modales, formularios, estados visuales y toasts. | `frontend/src/pages/*`, `frontend/src/components/*`, `frontend/src/index.css` | Recorrer módulos principales y mostrar formularios/modales conectados a API. | Cumple |
| Producto funcional | Frontend consume `/api/v1/**`; backend persiste en MySQL; módulos operativos tienen CRUD o actualización real. | `frontend/src/lib/api.ts`, `ApiOperationsController`, servicios y repositorios | Crear o editar lote/cama/siembra; validar el registro en MySQL. | Cumple |
| Coherencia documentación-código | README actualizado, matriz APF3 y guía de exposición práctica. | `README.md`, `docs/APF3_MATRIZ_CUMPLIMIENTO.md`, `docs/GUIA_EXPOSICION_PRACTICA.md` | Mostrar documentación junto al código. | Cumple |
| Usuarios y roles | CRUD de usuarios, roles activos y credenciales iniciales. | `AccountService`, `UserRepository`, `RoleRepository`, `DataInitializer`, `UsuariosPage.tsx` | Mostrar módulo Usuarios y tablas `usuarios`, `roles`. | Cumple |
| Lotes | CRUD y cambio de estado por API REST. | `Lote`, `LoteForm`, `LoteService`, `LoteRepository`, `LotesPage.tsx` | Crear/editar lote y consultar tabla `lotes`. | Cumple |
| Camas | Registro y edición de camas asociadas a lote. | `Cama`, `CamaForm`, `CamaService`, `CamaRepository`, `CamasPage.tsx` | Mostrar camas por lote y tabla `camas`. | Cumple |
| Siembra | Registro, edición, estado y eliminación de siembras. | `Siembra`, `SiembraForm`, `SiembraService`, `SiembraRepository`, `SiembrasPage.tsx` | Registrar una siembra y consultar `siembras`. | Cumple |
| Uniformización y formalización | Procesos operativos agrupados bajo `/api/v1/procesos`. | `Uniformizacion`, `Formalizacion`, `ProcesoOperativoService`, `ProcesosPage.tsx` | Mostrar pestañas de procesos y tablas `uniformizaciones`, `formalizaciones`. | Cumple |
| Clasificación | Registro, edición y cambio de estado de clasificación. | `Clasificacion`, `ClasificacionService`, `ClasificacionRepository`, `ClasificacionPage.tsx` | Validar una clasificación y consultar `clasificaciones`. | Cumple |
| Despacho | Registro, edición y estado de despacho con modalidad y validación de calidad. | `Despacho`, `DespachoService`, `DespachoRepository`, `DespachoPage.tsx` | Registrar despacho y consultar `despachos`. | Cumple |
| Trazabilidad | Reporte consolidado por lote con conteos operativos y último evento. | `TrazabilidadQueryService`, `ApiRecordMapper`, `TrazabilidadPage.tsx`, `ReportesPage.tsx` | Abrir trazabilidad por lote y comparar con tablas relacionadas. | Cumple |
| Reportes | Reporte de trazabilidad y exportación desde frontend. | `ReportesPage.tsx`, `frontend/src/lib/export.ts`, `/api/v1/reportes/trazabilidad` | Exportar CSV o mostrar reporte filtrado. | Cumple |

## Observaciones técnicas

- El ZIP recibido no conservaba los archivos `.java` del backend en `src/main/java`; por eso se reconstruyó la capa backend manteniendo el package base `com.keraune.vlvblueberrysystem`, endpoints `/api/v1/**` y contratos consumidos por React.
- No se eliminaron clases por “no usages” de IDE. En Spring, muchas clases se usan por anotaciones, inyección de dependencias, JPA, reflexión o escaneo de componentes.
- El frontend no usa datos simulados para módulos operativos: consume `frontend/src/lib/api.ts`, que apunta a los endpoints REST reales.
- Las pruebas backend quedan como evidencia inicial de TDD, pero se recomienda ampliarlas con pruebas de servicios y controladores cuando Maven esté disponible localmente.
