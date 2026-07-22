#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
BACKEND_PYTHON="${BACKEND_PYTHON:-python3}"

if [[ -x "${REPO_ROOT}/backend/.venv/bin/python" ]]; then
  BACKEND_PYTHON="${REPO_ROOT}/backend/.venv/bin/python"
fi

echo "[1/5] Backend tests"
(
  cd "${REPO_ROOT}/backend"
  "${BACKEND_PYTHON}" -m pytest -q
)

echo "[2/5] Web lint"
npm --prefix "${REPO_ROOT}/frontend/web" run lint

echo "[3/5] Web production build"
npm --prefix "${REPO_ROOT}/frontend/web" run build

echo "[4/5] Mobile typecheck and Expo export"
(
  cd "${REPO_ROOT}/frontend/mobile"
  npx tsc --noEmit
  EXPO_NO_TELEMETRY=1 npx expo export --platform web
)

echo "[5/5] Real API usage guard"
if rg -n "mocks/products|MOCK_PRODUCTS|MOCK_CATEGORIES" \
  "${REPO_ROOT}/frontend/web/src" \
  "${REPO_ROOT}/frontend/mobile/src/app" \
  "${REPO_ROOT}/frontend/mobile/src/services"; then
  echo "Active frontend code still references mock product data."
  exit 1
fi

echo "Integration QA: PASS"
