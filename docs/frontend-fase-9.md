# Fase 9 - Workspace Maven y migración React por módulos

## Objetivo

Corregir la carga del backend en IntelliJ IDEA después de la separación `/backend` y `/frontend`, y continuar la migración progresiva del frontend React consumiendo la API `/api/v1/**`.

## Cambios aplicados

- `pom.xml` raíz convertido en agregador Maven con módulo `backend`.
- Se agregó `package.json` raíz para scripts de workspace frontend/backend.
- Se añadieron vistas React para módulos operativos:
  - Lotes e invernaderos
  - Camas
  - Siembra
  - Uniformización y formalización
  - Clasificación
  - Despacho
  - Reportes
  - Usuarios
- Se amplió el cliente API del frontend para consumir todos los endpoints principales.
- Se añadieron tipos TypeScript para DTOs operativos del backend.
- Se corrigió configuración TypeScript/Vite para builds modernos.
- Se agregó guía específica de IntelliJ IDEA.

## Estado técnico

El backend continúa siendo la aplicación estable con Spring Boot, Thymeleaf y HTMX. El frontend React ya puede navegar por los módulos principales usando datos reales de la API.

## Ejecución recomendada

Backend desde la raíz:

```bash
./mvnw -pl backend spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```
