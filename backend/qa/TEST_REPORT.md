# Backend QA Test Raporu

Rapor tarihi: 2026-07-18

## Ozet

Backend API icin otomatik test paketi genisletildi ve son kosum basariyla tamamlandi.

| Alan | Sonuc |
| --- | --- |
| Test framework | pytest |
| Test sayisi | 21 |
| Basarili | 21 |
| Basarisiz | 0 |
| Son komut | `pytest` |
| Son durum | PASS |

## Kapsanan Alanlar

| Kategori | Kapsam |
| --- | --- |
| Auth | Register, login, duplicate email, wrong password, refresh token, invalid token |
| Security | Refresh token rotation, rate limit 429 Problem Details |
| Catalog | Product list, search, category filter, product detail |
| Cart | Add, update, delete, missing item, stock overflow |
| Favorites | Add, duplicate add idempotency, list, delete, auth requirement, unknown product |
| Checkout | Address create, order create, empty cart reject, order history |
| E2E API | Login -> category -> product -> cart -> checkout -> orders -> stock check |
| Meta/Health | `/health`, `/api/v1/meta`, version and docs links |
| Contract | OpenAPI export, Problem Details hata semasi |
| Migration | Alembic initial schema offline SQL dogrulamasi |

Ek dogrulamalar:

- `alembic heads` -> `20260718_0001 (head)`
- `alembic upgrade head --sql` -> initial schema SQL basariyla uretildi
- `python scripts/export_openapi.py` -> `openapi.json` yeniden uretildi

## Calistirma

```bash
cd backend
source .venv/bin/activate
pytest
```

Beklenen sonuc:

```text
21 passed
```

## Kritik Kabul Kriterleri

- Korumali endpointler token olmadan 401 doner.
- Hatali login 401 doner.
- Refresh token kullanildiktan sonra eski token gecersiz olur.
- Urun listeleme arama ve kategori filtresiyle calisir.
- Sepet toplami urun fiyatlari ve miktara gore hesaplanir.
- Stoktan fazla urun sepete eklenemez.
- Bos sepetle checkout yapilamaz.
- Checkout sonrasi sepet bosalir ve stok azalir.
- Favori ekleme ayni urun icin tekrarlandiginda duplicate kayit olusturmaz.
- Rate limit asildiginda 429 Problem Details doner.
- OpenAPI sozlesmesinde yaygin hata cevaplari ProblemDetails semasi ile gorunur.
- Para hesaplamalari Decimal ile iki ondalik hassasiyette yapilir.

## Docker Durumu

Docker Desktop acikken gercek `docker compose up --build -d` kosumu yapildi ve container basariyla ayaga kalkti.

Dogrulanan endpointler:

- `GET /health`
- `GET /api/v1/meta`
- `GET /api/v1/products?page=1&size=2`
- `POST /api/v1/auth/login`
- `GET /openapi.json`

Detayli Docker adimlari:

- `backend/docs/DOCKER_RUNBOOK.md`

## Kalan QA Riskleri

| Risk | Durum |
| --- | --- |
| UI E2E | Frontend/mobil ekranlari hazir olunca Playwright/Cypress veya Maestro ile kosulacak |
| Production rate limit | Demo icin in-memory; production icin Redis/API gateway onerilir |
| Admin panel | Kapsam disi; urunler seed uzerinden geliyor |
