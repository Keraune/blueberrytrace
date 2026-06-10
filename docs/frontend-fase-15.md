# BlueberryTrace - Fase 15

## Objetivo

Rediseñar la pantalla de inicio de sesión del frontend React para alinearla con el estilo visual definido para BlueberryTrace: panel de marca oscuro, formulario limpio, credenciales demo visibles y una presentación más profesional para exposición y uso real.

## Cambios principales

- Login React rediseñado en dos columnas.
- Panel izquierdo con fondo verde oscuro, marca, título de alto impacto y acento morado.
- Lista de beneficios operativos con iconos.
- Formulario derecho centrado con inputs limpios y botón principal verde.
- Tarjeta de credenciales demo con acción rápida para autocompletar usuario y contraseña.
- Ajustes CSS responsive para pantallas medianas y pequeñas.

## Credenciales demo

El usuario inicial cargado por `DataInitializer` es:

```text
Usuario: admin
Contraseña: admin123
```

## Archivos modificados

- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/index.css`

## Validación recomendada

```bash
cd frontend
npm ci
npm run build
npm run dev
```

Abrir:

```text
http://localhost:5173
```

Si no existe sesión activa, React mostrará el nuevo login.
