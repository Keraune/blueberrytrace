# Git y GitHub — Evidencias APF3

## 1. Objetivo

Preparar las evidencias necesarias para demostrar control de versiones, avance colaborativo y publicación del proyecto en GitHub.

## 2. Comandos básicos

```bash
git status
git log --oneline --decorate --graph --all -n 20
git branch -a
git remote -v
```

## 3. Flujo recomendado por integrante

### Integrante 1 — Ramón

```bash
git switch -c feature/frontend-apf3
# realizar cambios visuales o documentación frontend
git add .
git commit -m "feat: preparar interfaz y evidencias visuales para APF3"
git push -u origin feature/frontend-apf3
```

### Integrante 2 — Rodrigo

```bash
git switch -c feature/backend-apf3
# realizar cambios backend, documentación técnica o validaciones
git add .
git commit -m "feat: documentar arquitectura backend y avance APF3"
git push -u origin feature/backend-apf3
```

## 4. Merge recomendado

```bash
git switch main
git pull origin main
git merge feature/frontend-apf3
git merge feature/backend-apf3
git push origin main
```

## 5. Evidencias que deben capturar

| Evidencia | Comando o pantalla |
| --- | --- |
| Configuración Git | `git config --list` |
| Repositorio local | `git status` |
| Historial de commits | `git log --oneline --decorate --graph --all` |
| Ramas creadas | `git branch -a` |
| Repositorio remoto | `git remote -v` y página de GitHub |
| README actualizado | Vista del archivo en GitHub |
| Participación del equipo | Commits por autor en GitHub |
| Avance funcional | Capturas de frontend y API ejecutándose |

## 6. Script automático de evidencia

Desde la raíz del proyecto:

```bash
npm run apf3:evidence
```

El script genera archivos `.txt` en:

```text
docs/apf3/evidencias/
```

## 7. Commits sugeridos para APF3

```bash
git add .
git commit -m "docs: preparar entregables tecnicos para APF3"

git add .
git commit -m "feat: consolidar avance funcional de BlueberryTrace"

git add .
git commit -m "docs: agregar evidencias de arquitectura y control de versiones"
```
