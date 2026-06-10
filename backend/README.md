# BlueberryTrace Backend

Aplicación Spring Boot del sistema BlueberryTrace. Mantiene el panel estable con Thymeleaf + HTMX y expone la API `/api/v1/**` para clientes React/Vue.

## Ejecutar desde backend

```bash
./mvnw spring-boot:run
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
