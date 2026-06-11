# Guía breve de exposición práctica - BlueberryTrace

Duración total recomendada: máximo 10 minutos entre ambos integrantes. Tu compañero explica las diapositivas; tú muestras la aplicación, código y MySQL.

| Punto / diapositiva | Qué mostrar en la aplicación | Qué mostrar en el código | Qué mostrar en MySQL | Frase corta para decir | Tiempo recomendado |
|---|---|---|---|---|---|
| 1. Presentación del sistema | Pantalla de login | `README.md` y estructura `backend/` + `frontend/` | Base `vlv_blueberry_system` | “BlueberryTrace separa frontend React y backend Spring Boot para controlar el proceso de arándanos.” | 40 s |
| 2. Login | Ingresar con `admin` o `admin@vlv.com` | `CustomUserDetailsService`, `LoginIdentifier`, `ApiAuthController` | `SELECT username, email, estado FROM usuarios;` | “El login acepta usuario o correo y valida contra MySQL con Spring Security.” | 50 s |
| 3. Dashboard | Indicadores principales | `ApiDashboardController`, `DashboardMetricsService` | Conteos en `lotes`, `camas`, `siembras`, `despachos` | “El dashboard resume datos reales de la base de datos.” | 50 s |
| 4. Usuarios y roles | Módulo Usuarios | `AccountService`, `UserRepository`, `RoleRepository` | `SELECT * FROM roles;` y `SELECT username, rol_id FROM usuarios;` | “Los usuarios se vinculan a roles y permisos operativos.” | 50 s |
| 5. Lotes | Crear o editar un lote | `LoteService`, `LoteRepository`, `Lote` | `SELECT id, codigo, estado FROM lotes;` | “El lote es el eje de trazabilidad del proceso.” | 45 s |
| 6. Camas | Ver camas asociadas a lote | `CamaService`, `CamaRepository`, `Cama` | `SELECT id, codigo, lote_id, estado FROM camas;` | “Cada cama pertenece a un lote y permite ubicar físicamente las plantas.” | 45 s |
| 7. Siembra | Registrar una siembra | `SiembraService`, `SiembraRepository`, `SiembraForm` | `SELECT lote_id, cama_id, cantidad_registrada FROM siembras;` | “La siembra registra cantidad, lote, cama y responsable.” | 50 s |
| 8. Clasificación | Cambiar estado de clasificación | `ClasificacionService`, `ClasificacionRepository` | `SELECT lote_id, cantidad, estado FROM clasificaciones;` | “La clasificación permite controlar calidad, tamaño y condición de plantas.” | 50 s |
| 9. Despacho | Registrar o revisar despacho | `DespachoService`, `DespachoRepository` | `SELECT lote_id, cantidad_despachada, estado FROM despachos;` | “El despacho cierra el flujo operativo con cantidad, destino y validación.” | 50 s |
| 10. Trazabilidad por lote | Módulo Trazabilidad | `TrazabilidadQueryService`, `ApiRecordMapper` | Consultar tablas relacionadas por `lote_id` | “Aquí se consolida todo el recorrido del lote.” | 55 s |
| 11. Reportes | Reportes y exportación CSV | `ReportesPage.tsx`, `frontend/src/lib/export.ts` | Ver datos base del reporte | “El reporte usa la misma información de trazabilidad y puede exportarse.” | 45 s |
| 12. Código por capas | Abrir paquetes backend | `api/controller`, `service`, `repository`, `entity`, `dto` | No aplica | “Separamos responsabilidades: controlador recibe, servicio procesa y repositorio persiste.” | 60 s |
| 13. `pom.xml` | No aplica | `backend/pom.xml` | No aplica | “Aquí están Spring Boot, Security, JPA, Validation, MySQL y pruebas.” | 35 s |
| 14. GitHub | Repositorio, README, commits, ramas | `README.md`, `docs/` | No aplica | “El avance queda versionado y documentado para revisión.” | 40 s |

## Ruta práctica rápida

1. Abrir `http://localhost:5173`.
2. Iniciar sesión con `admin` o `admin@vlv.com`.
3. Mostrar Dashboard.
4. Mostrar Usuarios/Roles.
5. Crear o editar un Lote.
6. Mostrar Camas del lote.
7. Registrar Siembra.
8. Validar Clasificación.
9. Mostrar Despacho.
10. Abrir Trazabilidad y Reportes.
11. Abrir código por capas.
12. Abrir MySQL y ejecutar consultas simples.
13. Abrir GitHub y README.

## Consultas MySQL sugeridas

```sql
USE vlv_blueberry_system;
SHOW TABLES;
SELECT id, username, email, estado FROM usuarios;
SELECT id, nombre, estado FROM roles;
SELECT id, codigo, estado FROM lotes ORDER BY id DESC;
SELECT id, codigo, lote_id, estado FROM camas ORDER BY id DESC;
SELECT id, lote_id, cama_id, cantidad_registrada FROM siembras ORDER BY id DESC;
SELECT id, lote_id, cantidad, estado FROM clasificaciones ORDER BY id DESC;
SELECT id, lote_id, cantidad_despachada, estado FROM despachos ORDER BY id DESC;
```
