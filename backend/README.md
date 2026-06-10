# BlueberryTrace Backend

Aplicación Spring Boot del sistema BlueberryTrace. Por defecto funciona como backend API-first para React/Vue y expone `/api/v1/**`. El panel Thymeleaf + HTMX queda disponible solo con el perfil `legacy-mvc`.

## Ejecutar desde backend

```bash
../mvnw -pl backend spring-boot:run
```

## Ejecutar desde la raíz del repositorio

```bash
../mvnw -pl backend spring-boot:run
```

O desde la raíz:

```bash
./mvnw -pl backend spring-boot:run
```

## Build y pruebas

```bash
./mvnw clean package
./mvnw test
```

Desde la raíz:

```bash
./mvnw -pl backend clean package
./mvnw -pl backend test
```

## IntelliJ IDEA

Abre el repositorio desde la raíz `blueberrytrace/` y carga el `pom.xml` raíz. El backend quedará registrado como módulo Maven y `backend/src/main/java` será detectado como source root.

Si IntelliJ no lo detecta:

```text
Clic derecho en backend/pom.xml → Add as Maven Project
```

Luego usa **Reload All Maven Projects**.

## Puerto ocupado

Si aparece `java.net.BindException: La dirección ya se está usando`, otro proceso ya está utilizando el puerto 8080. Ejecuta el backend con otro puerto desde la raíz del workspace:

```bash
SERVER_PORT=8081 ./mvnw -pl backend spring-boot:run
```

O identifica y cierra el proceso en Arch Linux:

```bash
ss -ltnp 'sport = :8080'
fuser -k 8080/tcp
```


## Scripts recomendados desde la raíz

```bash
npm run backend:run
npm run backend:run:alt
npm run backend:port
npm run backend:kill
```

La configuración de MySQL acepta variables de entorno:

```bash
DB_USERNAME=root DB_PASSWORD=12345678 npm run backend:run
```

## Autenticación API para React

El backend expone autenticación JSON para el frontend separado:

```http
GET  /api/v1/auth/csrf
POST /api/v1/auth/login
POST /api/v1/auth/logout
```

`/api/v1/frontend/bootstrap` es público para que React pueda inicializar configuración visual antes de requerir sesión. Los demás endpoints API continúan protegidos por Spring Security.

## Perfil legacy MVC

Para abrir temporalmente el panel Thymeleaf/HTMX antiguo:

```bash
SPRING_PROFILES_ACTIVE=legacy-mvc ../mvnw -pl backend spring-boot:run
```

Desde la raíz también puedes usar:

```bash
npm run backend:run:legacy
```

Sin ese perfil, los controladores MVC no se cargan y el backend queda orientado a API.
