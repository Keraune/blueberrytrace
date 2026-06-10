# BlueberryTrace - Fase 24

## Objetivo

Completar una fase funcional y visual enfocada en corregir el comportamiento de los modales y avanzar el módulo de usuarios hacia una administración real conectada con Spring Boot y MySQL.

## Cambios principales

- Los modales, confirmaciones y drawers ahora se renderizan mediante portal en `document.body`.
- Se corrigió el desplazamiento visual de los modales causado por contenedores con transformaciones y layout interno.
- Se compactó el tamaño de los modales y se mejoró el centrado real en desktop.
- En móvil, los modales mantienen comportamiento tipo bottom sheet.
- Se agregó CRUD funcional para usuarios corporativos desde React.
- Se agregaron endpoints backend para crear, editar y activar/desactivar usuarios.
- Se agregaron roles activos al catálogo operacional.
- Se validan correos empresariales con dominio `@vlv.com`.
- Se actualizaron usuarios demo a correos corporativos.

## Backend

Endpoints nuevos o ampliados:

- `GET /api/v1/roles`
- `GET /api/v1/usuarios`
- `POST /api/v1/usuarios`
- `PUT /api/v1/usuarios/{id}`
- `PATCH /api/v1/usuarios/{id}/estado`

Validaciones aplicadas:

- Username único.
- Email único.
- Email corporativo `@vlv.com`.
- Rol existente.
- Contraseña inicial mínima de 8 caracteres.

## Frontend

Componentes nuevos:

- `UserForm.tsx`

Módulo actualizado:

- `UsuariosPage.tsx`

Ahora el módulo permite:

- Crear usuario.
- Editar usuario.
- Activar/desactivar usuario.
- Ver detalle en drawer.
- Usar roles provenientes del backend.
- Mostrar fechas reales de creación o actualización.

## Validación

Frontend validado con:

```bash
cd frontend
npm ci
npm run build
```

Maven no pudo validarse dentro del sandbox porque no existe `mvn` del sistema y el wrapper no puede descargar Maven sin internet. En una máquina local con Maven instalado se recomienda ejecutar:

```bash
mvn -pl backend -DskipTests compile
```
