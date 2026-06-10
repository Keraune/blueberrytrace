# BlueberryTrace Frontend

Cliente React/Vite inicial para la separación progresiva del panel BlueberryTrace.

Este frontend consume la API JSON del backend Spring Boot bajo `/api/v1/**`. El panel Thymeleaf + HTMX sigue funcionando como versión estable mientras la migración se realiza por módulos.

## Requisitos

- Node.js 20 o superior.
- Backend Spring Boot ejecutándose en `http://localhost:8080`.
- Usuario autenticado con la sesión de Spring Security.

## Configuración

```bash
cp .env.example .env
```

Variables principales:

```env
VITE_BLUEBERRYTRACE_API_BASE=http://localhost:8080/api/v1
VITE_BLUEBERRYTRACE_BACKEND_ORIGIN=http://localhost:8080
```

## Ejecución

Desde la raíz del repositorio:

```bash
cd backend
./mvnw spring-boot:run
```

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abrir:

```text
http://localhost:5173
```

Para consumir datos protegidos, inicia sesión primero en el backend:

```text
http://localhost:8080/auth/login
```

## Build

```bash
npm run build
npm run preview
```

## Estrategia

- Consumir primero endpoints GET desde React.
- Migrar módulos por bloques: dashboard, lotes, camas, procesos, clasificación, despacho y reportes.
- Reutilizar los DTOs de `/api/v1/**` sin exponer entidades JPA.
- Mantener el backend como fuente central de seguridad, negocio y persistencia.
