# E-Commerce Project Frontend

This project is a modern, responsive e-commerce web application built with React, TypeScript, and Vite. It connects to a FastAPI backend.

## 🚀 Technologies

- **React 19**
- **TypeScript**
- **Vite**
- **React Router** for routing
- **TanStack Query** (React Query) for API data fetching and caching
- **Zustand** for global state management (Auth & Cart)
- **React Hook Form & Zod** for robust form validation
- **Vanilla CSS** with CSS Modules for styling
- **Playwright** for end-to-end (E2E) testing

## 🏗️ Architecture

The frontend follows a component-driven architecture:
- `src/components/ui`: Reusable, generic UI components (Button, Input, Card).
- `src/components/domain`: Feature-specific components (ProductCard, CartItem, AddressForm).
- `src/components/layout`: Layout-related components (Navbar, PageContainer).
- `src/pages`: Top-level route components.
- `src/hooks`: Custom React hooks (e.g., `useCart`, `useFavorites`).
- `src/services`: API interaction layer using Axios.
- `src/stores`: Global state stores (Zustand).

## 🛠️ Setup & Installation

1. Clone the repository and navigate to `frontend/web`.
2. Ensure you have **Node.js 20+** installed.
3. Install dependencies:
   ```bash
   npm install
   ```

## ⚙️ Environment Variables

Create a `.env.local` file in `frontend/web` (if running separately from default setup):
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## 🏃‍♂️ Running the Project (Development)

First, start the **backend** (from the `backend` directory):
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Then, start the **frontend**:
```bash
cd frontend/web
npm run dev
```

## 🔐 Demo User & Test Payment Data

**Demo User (Read-Only testing):**
- **Email:** `demo@eticaret.com`
- **Password:** `DemoPass123`

**Test Credit Card (For simulated checkout):**
- **Name:** Demo Kullanıcı
- **Card Number:** `4242 4242 4242 4242`
- **Expiry:** `12/30`
- **CVV:** `123`

*Note: Card data is **never** sent to the backend. The API only receives a `payment_method: "simulation"` flag. The test card form is entirely validated on the client side.*

## 🧪 Testing

The project includes comprehensive testing:

### 1. Backend Tests (Pytest)
```bash
cd backend
.\.venv\Scripts\python.exe -m pytest -v
```

### 2. Frontend Lint & Build
```bash
cd frontend/web
npm run lint
npm run build
```

### 3. End-to-End (E2E) Tests with Playwright

Install Playwright browsers (first time only):
```bash
npx playwright install chromium
```

**Running E2E tests locally (Isolated Environment):**

To prevent interference with your development database (`commerce.db`), the E2E tests use an isolated database (`e2e.db`).

1. Reset the E2E database:
   ```bash
   npm run test:e2e:reset-db
   ```

2. Start the backend in test mode (in a new terminal):
   ```bash
   cd backend
   $env:ENVIRONMENT="test"
   $env:DATABASE_URL="sqlite:///./e2e.db"
   $env:JWT_SECRET="e2e-only-secret-not-for-production"
   $env:BACKEND_CORS_ORIGINS="http://127.0.0.1:5173,http://localhost:5173"
   $env:RATE_LIMIT_REQUESTS="10000"
   .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8001
   ```

3. Start the frontend pointing to the E2E backend (in a new terminal):
   ```bash
   cd frontend/web
   $env:VITE_API_BASE_URL="http://127.0.0.1:8001/api/v1"
   npm run dev -- --port 5173 --host 127.0.0.1
   ```
   *(Note: The CI pipeline uses `npx vite` directly, but `npm run dev` works locally).*

4. Run the tests:
   - Headless mode (default):
     ```bash
     npm run test:e2e
     ```
   - Headed mode (watch the browser):
     ```bash
     npm run test:e2e:headed
     ```
   - UI mode (interactive test runner):
     ```bash
     npm run test:e2e:ui
     ```

## 🔄 GitHub Actions CI

The project uses a unified GitHub Actions workflow (`.github/workflows/ci.yml`) which runs on every push and pull request. It includes 3 jobs:
1. **Backend Tests:** Runs `pytest`.
2. **Frontend Lint & Build:** Runs `npm run lint` and `npm run build`.
3. **E2E Tests:** Sets up both backend (with isolated `e2e.db`) and frontend, waits for them to be healthy, and executes the Playwright test suite.

## ⚠️ Known Limitations
- The backend rate limit is intentionally raised to `10000` during E2E tests to prevent `429 Too Many Requests` due to the speed of automated tests.
- E2E tests must be run against a clean database state to guarantee determinism. Do not use the `commerce.db` for E2E tests.
