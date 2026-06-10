# Fase 16 - Arranque local estable y permisos del workspace

## Objetivo

Evitar errores de ejecución al extraer el ZIP en Linux/Arch Linux, especialmente:

```text
./mvnw: Permiso denegado
scripts/run-backend.sh: línea 14: ./mvnw: Permiso denegado
```

## Cambios aplicados

- `scripts/run-backend.sh` ahora detecta la raíz del workspace antes de ejecutar Maven.
- El backend se ejecuta con `bash ./mvnw` para no depender del bit de ejecución del ZIP.
- Se agregaron scripts de diagnóstico y restauración de permisos.
- Los scripts de `package.json` usan `bash ./mvnw` para evitar errores si el wrapper pierde permisos.
- El ZIP se genera manteniendo permisos `755` en `mvnw` y `scripts/*.sh`.

## Scripts nuevos

```bash
npm run setup:permissions
npm run doctor
```

## Scripts actualizados

```bash
npm run backend:run
npm run backend:run:alt
npm run backend:run:legacy
npm run backend:test
npm run backend:package
```

## Flujo recomendado después de extraer el ZIP

```bash
npm run setup:permissions
npm run doctor
npm run backend:run
```

En otra terminal:

```bash
npm run frontend:dev
```

## Si el puerto 8080 está ocupado

```bash
npm run backend:port
npm run backend:kill
npm run backend:run
```

O ejecutar en puerto alternativo:

```bash
npm run backend:run:alt
```

## Notas

El proyecto conserva `mvnw` en la raíz porque el backend vive como módulo Maven dentro del workspace. Por eso el comando recomendado desde la raíz es:

```bash
bash ./mvnw -pl backend spring-boot:run
```


## Maven seguro

El workspace incluye `scripts/maven.sh`, que prefiere Maven instalado en el sistema y usa `./mvnw` como respaldo. Esto evita problemas de permisos o descarga del wrapper en entornos donde Maven ya está instalado.

```bash
npm run maven -- -pl backend clean package
```
