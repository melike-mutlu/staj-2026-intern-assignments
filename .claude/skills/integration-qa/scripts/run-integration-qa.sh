#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
BACKEND_PYTHON="${BACKEND_PYTHON:-python3}"

if [[ -x "${REPO_ROOT}/backend/.venv/bin/python" ]]; then
  BACKEND_PYTHON="${REPO_ROOT}/backend/.venv/bin/python"
fi

echo "[1/6] OpenAPI contract types"
npm --prefix "${REPO_ROOT}/tools/api-contract" run generate
git -C "${REPO_ROOT}" diff --exit-code -- \
  frontend/web/src/types/openapi.d.ts \
  frontend/mobile/src/types/openapi.d.ts

echo "[2/6] Backend tests"
(
  cd "${REPO_ROOT}/backend"
  "${BACKEND_PYTHON}" -m pytest -q
)

echo "[3/6] Web lint"
npm --prefix "${REPO_ROOT}/frontend/web" run lint

echo "[4/6] Web production build"
npm --prefix "${REPO_ROOT}/frontend/web" run build

echo "[5/6] Mobile typecheck and Expo export"
(
  cd "${REPO_ROOT}/frontend/mobile"
  npx tsc --noEmit
  EXPO_NO_TELEMETRY=1 npx expo export --platform web
)

echo "[6/6] Real API usage guard"
if rg -n "mocks/products|MOCK_PRODUCTS|MOCK_CATEGORIES" \
  "${REPO_ROOT}/frontend/web/src" \
  "${REPO_ROOT}/frontend/mobile/src/app" \
  "${REPO_ROOT}/frontend/mobile/src/services"; then
  echo "Active frontend code still references mock product data."
  exit 1
fi

echo "Integration QA: PASS"
