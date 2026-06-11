# Validación final APF3 — BlueberryTrace

## Estado funcional preparado

- Backend Spring Boot conectado a MySQL mediante variables `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`.
- Interfaz React/Vite consumiendo endpoints REST desde `/api/v1`.
- Módulos operativos principales con datos reales: lotes, camas, siembras, procesos, clasificación, despacho, reportes, usuarios y trazabilidad.
- Trazabilidad por lote corregida para mostrar historial cronológico sin errores por formato de fecha.
- Registro de siembra con crear, editar, cambiar estado y eliminar.

## Demostración recomendada

1. Iniciar sesión.
2. Mostrar panel operativo.
3. Registrar o editar un lote/cama.
4. Registrar una siembra.
5. Editar, anular o eliminar una siembra.
6. Registrar proceso, clasificación o despacho.
7. Abrir trazabilidad por lote y mostrar la línea de tiempo.
8. Exportar CSV o imprimir reporte.

## Comandos

```bash
npm run setup:permissions
npm run backend:run
npm run frontend:dev
```

## Variables MySQL sugeridas

```bash
export DB_URL=jdbc:mysql://localhost:3306/vlv_blueberry_system?useSSL=false&serverTimezone=America/Lima&allowPublicKeyRetrieval=true
export DB_USERNAME=root
export DB_PASSWORD=12345678
```
