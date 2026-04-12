#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export SPRING_PROFILES_ACTIVE="${SPRING_PROFILES_ACTIVE:-prod}"
export SERVER_PORT="${SERVER_PORT:-8081}"
export DB_URL="${DB_URL:-jdbc:mysql://localhost:3306/hangang_zip?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul&characterEncoding=UTF-8}"
export DB_USERNAME="${DB_USERNAME:-hangang_zip}"
export DB_PASSWORD="${DB_PASSWORD:-change-me}"
export APP_CORS_ALLOWED_ORIGIN="${APP_CORS_ALLOWED_ORIGIN:-http://localhost:5173}"

cd "$ROOT_DIR"
./gradlew bootRun
