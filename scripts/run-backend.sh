#!/usr/bin/env bash
set -euo pipefail

PORT="${SERVER_PORT:-8080}"

if command -v ss >/dev/null 2>&1 && ss -ltn "sport = :${PORT}" | grep -q ":${PORT}"; then
  echo "El puerto ${PORT} ya está en uso."
  echo "Opciones:"
  echo "  1) Liberar puerto: npm run backend:kill"
  echo "  2) Usar puerto alternativo: SERVER_PORT=8081 npm run backend:run"
  exit 1
fi

./mvnw -pl backend spring-boot:run
