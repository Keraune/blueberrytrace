#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${SERVER_PORT:-8080}"
PROFILE="${SPRING_PROFILES_ACTIVE:-default}"

cd "${ROOT_DIR}"

if command -v ss >/dev/null 2>&1 && ss -ltn "sport = :${PORT}" | grep -q ":${PORT}"; then
  echo "El puerto ${PORT} ya está en uso."
  echo "Opciones:"
  echo "  1) Liberar puerto: npm run backend:kill"
  echo "  2) Usar puerto alternativo: SERVER_PORT=8081 npm run backend:run"
  echo "  3) Ver proceso actual: npm run backend:port"
  exit 1
fi

if [ ! -f "${ROOT_DIR}/mvnw" ]; then
  echo "No se encontró mvnw en la raíz del proyecto."
  echo "Abre la carpeta blueberrrytrace completa o restaura el Maven Wrapper."
  exit 1
fi

if [ ! -x "${ROOT_DIR}/mvnw" ]; then
  chmod +x "${ROOT_DIR}/mvnw" 2>/dev/null || true
fi

for script in "${ROOT_DIR}"/scripts/*.sh; do
  [ -f "${script}" ] && chmod +x "${script}" 2>/dev/null || true
done

echo "Iniciando BlueberryTrace backend"
echo "  Perfil: ${PROFILE}"
echo "  Puerto: ${PORT}"
echo "  Proyecto: ${ROOT_DIR}"

# Se usa un wrapper seguro que prefiere Maven del sistema y cae a Maven Wrapper.
bash "${ROOT_DIR}/scripts/maven.sh" -pl backend spring-boot:run
