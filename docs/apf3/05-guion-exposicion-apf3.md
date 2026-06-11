# Guion rápido de exposición APF3

## Diapositiva o sección 1 — Presentación

Buenos días. Somos el equipo de BlueberryTrace. Nuestro proyecto es un sistema web interno para el control, clasificación y trazabilidad de plantas de arándano para exportación en el área de frutales de Vivero Los Viñedos.

## Sección 2 — Problema

El problema principal es que el control de cantidades, ubicación, clasificación y despacho se realiza con registros manuales y luego se traslada a Excel. Esto puede generar demoras, errores de transcripción y baja trazabilidad histórica.

## Sección 3 — Objetivo del APF3

En este avance nos enfocamos en la etapa de desarrollo. Ya no solo presentamos diseño, sino una base funcional del sistema, con backend en Java Spring Boot, frontend en React y conexión preparada para MySQL.

## Sección 4 — Arquitectura

El sistema está separado en dos partes. El backend funciona como API REST con Spring Boot, Spring Security, JPA e Hibernate. El frontend está desarrollado en React, Vite y TypeScript. Esta arquitectura API-first permite separar la interfaz de la lógica de negocio y facilita el mantenimiento.

## Sección 5 — Módulos implementados

Actualmente el sistema cuenta con login, panel operativo, usuarios, lotes e invernaderos, camas, registro de siembra, uniformización, formalización, clasificación, despacho, reportes y perfil corporativo.

## Sección 6 — Recursos Java

En el backend usamos Java 21, Spring Boot, Spring Security, Spring Data JPA, Hibernate, Bean Validation, MySQL Connector y Maven. Estos recursos permiten manejar seguridad, persistencia, validaciones y organización del proyecto.

## Sección 7 — SOLID y DAO

Aplicamos separación de responsabilidades mediante controladores, servicios y repositorios. Los repositorios cumplen la función de DAO usando Spring Data JPA. Cada servicio gestiona una parte específica del negocio, como lotes, siembras, clasificación o despacho.

## Sección 8 — Seguridad

El sistema incluye autenticación, control de sesión, protección CSRF, validaciones y hash de contraseñas con BCrypt. Además, el backend ya no usa vistas Thymeleaf ni HTML interno, lo que refuerza el enfoque API-first.

## Sección 9 — Git y GitHub

El proyecto está preparado para control de versiones con Git y GitHub. Se recomienda evidenciar commits, ramas por integrante, repositorio remoto, README actualizado y capturas del historial.

## Sección 10 — Cierre

Como conclusión, BlueberryTrace ya cuenta con una base funcional y organizada para continuar hacia pruebas, seguridad avanzada, auditoría, despliegue y mantenimiento. El avance cumple con la Unidad 3 porque demuestra desarrollo real, arquitectura definida, recursos Java y control de versiones.
