# Guía rápida de arranque local

## 1. Restaurar permisos

Después de extraer el ZIP en Linux:

```bash
npm run setup:permissions
```

## 2. Diagnosticar entorno

```bash
npm run doctor
```

El diagnóstico revisa:

- estructura del workspace
- Java
- Node
- npm
- permisos de `mvnw` y scripts
- puerto del backend
- configuración principal del backend
- existencia de `frontend/.env`

## 3. Arrancar backend

```bash
npm run backend:run
```

Si MySQL usa otra contraseña:

```bash
DB_USERNAME=root DB_PASSWORD=tu_clave npm run backend:run
```

## 4. Arrancar frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## 5. Abrir sistema

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080/api/v1/health
```

## 6. Credenciales demo

```text
Usuario: admin
Contraseña: admin123
```


## Maven seguro

El workspace incluye `scripts/maven.sh`, que prefiere Maven instalado en el sistema y usa `./mvnw` como respaldo. Esto evita problemas de permisos o descarga del wrapper en entornos donde Maven ya está instalado.

```bash
npm run maven -- -pl backend clean package
```
