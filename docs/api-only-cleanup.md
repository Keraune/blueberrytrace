# Limpieza API-only

## Estado actual

BlueberryTrace ahora usa arquitectura separada:

```text
backend/   -> API Spring Boot
frontend/  -> React/Vite
```

## Qué se eliminó del backend

```text
backend/src/main/resources/templates/
backend/src/main/resources/static/
backend/src/main/java/com/keraune/vlvblueberrysystem/controller/
```

## Qué se mantiene en backend

```text
backend/src/main/java/com/keraune/vlvblueberrysystem/api/
backend/src/main/java/com/keraune/vlvblueberrysystem/service/
backend/src/main/java/com/keraune/vlvblueberrysystem/repository/
backend/src/main/java/com/keraune/vlvblueberrysystem/model/
backend/src/main/resources/application.properties
```

## Por qué se hizo

El frontend React ya es la interfaz principal. Mantener HTML Thymeleaf duplicaba responsabilidades, hacía más difícil mantener el diseño moderno y confundía la separación entre backend y frontend.

## Cómo ejecutar

Backend:

```bash
npm run backend:run
```

Frontend:

```bash
npm run frontend:dev
```
