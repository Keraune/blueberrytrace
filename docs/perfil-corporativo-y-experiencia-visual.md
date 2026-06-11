# Perfil corporativo y experiencia visual

## Objetivo

Consolidar una experiencia de producto más cercana a un sistema corporativo final para BlueberryTrace, manteniendo el backend como API-first y el frontend como interfaz principal.

## Cambios aplicados

- Perfil editable del trabajador autenticado.
- Cambio de contraseña desde el panel de perfil.
- Avatar corporativo configurable por color.
- Campos de cargo y teléfono corporativo en usuarios.
- Menú de perfil conectado a datos reales de sesión.
- Ajuste visual general inspirado en las pantallas de referencia: sidebar compacto, topbar tipo sistema interno, cards limpias, tablas sobrias y modales centrados.
- Formularios y usuarios preparados para datos persistidos en MySQL.

## Endpoints nuevos

- `PUT /api/v1/session/me`
- `PATCH /api/v1/session/me/password`

## Persistencia

La entidad `User` agrega datos corporativos complementarios:

- `cargo`
- `telefono`
- `avatarColor`

Con Hibernate en modo `update`, MySQL puede crear estas columnas automáticamente al iniciar el backend.
