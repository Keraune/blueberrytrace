# Configuración de IntelliJ IDEA

El repositorio está separado en `backend/` y `frontend/`. Para que IntelliJ compile las clases Java, el proyecto debe cargarse como workspace Maven desde el `pom.xml` raíz.

## Estructura esperada

```text
blueberrytrace/
├── pom.xml              # agregador Maven del workspace
├── backend/pom.xml      # aplicación Spring Boot
├── backend/src/main/java
└── frontend/
```

## Apertura recomendada

1. Cierra el proyecto actual en IntelliJ.
2. Elimina carpetas locales generadas por el IDE si quedaron de una extracción anterior:
   - `.idea/`
   - `*.iml`
3. Abre la carpeta raíz `blueberrytrace/`, no solo `backend/src`.
4. Cuando IntelliJ detecte Maven, selecciona **Load Maven Project**.
5. Abre la ventana **Maven** y ejecuta **Reload All Maven Projects**.

Con el `pom.xml` raíz de tipo `pom` y el módulo `backend`, IntelliJ debe marcar automáticamente:

```text
backend/src/main/java      Source Root
backend/src/main/resources Resources Root
backend/src/test/java      Test Source Root
```

## Si el aviso continúa

Usa una de estas opciones:

- Clic derecho en `backend/pom.xml` → **Add as Maven Project**.
- O ve a **File > Project Structure > Modules** y verifica que exista el módulo `vlv-blueberry-system` apuntando a `backend`.
- En último caso: **File > Invalidate Caches / Restart** y vuelve a abrir el proyecto desde la raíz.

## Comandos desde terminal

Desde la raíz:

```bash
./mvnw -pl backend spring-boot:run
./mvnw -pl backend clean package
./mvnw -pl backend test
```

Desde backend:

```bash
cd backend
./mvnw spring-boot:run
./mvnw clean package
./mvnw test
```
