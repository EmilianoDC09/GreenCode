#!/usr/bin/env bash
# GreenCode: levanta backend (8080) y frontend (5173) desde Git Bash, Linux o macOS.
# Uso: ./iniciar.sh   (Ctrl+C detiene ambos)
set -e
cd "$(dirname "$0")"
command -v mvn >/dev/null || { echo "[ERROR] No se encontró Maven (mvn) en el PATH."; exit 1; }
command -v npm >/dev/null || { echo "[ERROR] No se encontró Node/npm en el PATH."; exit 1; }

(cd frontend && npm install --no-audit --no-fund)

(cd backend && mvn spring-boot:run) &
BACKEND=$!
trap 'kill $BACKEND 2>/dev/null' EXIT INT TERM

echo "Backend:  http://localhost:8080   Frontend: http://localhost:5173"
cd frontend && npm run dev
