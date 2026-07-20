# Eticaret Backend

Bu klasor, e-ticaret projesinin **Backend + QA** tarafidir. Frontend ve mobil ekiplerinin kullanacagi API burada calisir.

Backend; kullanici girisi, urun listeleme, arama/filtreleme, sepet, favoriler, checkout, siparis gecmisi, profil/adres yonetimi, Swagger dokumani, API testleri, rate limit ve migration altyapisini icerir.

## Hizli Ozet

| Alan | Bilgi |
| --- | --- |
| Framework | FastAPI |
| Dil | Python |
| ORM | SQLModel / SQLAlchemy |
| Veritabani | SQLite, PostgreSQL'e gecise uygun |
| Auth | JWT access token + refresh token |
| API dokumani | Swagger / OpenAPI 3.1 |
| Test | pytest |
| Migration | Alembic |
| Docker | Dockerfile + docker-compose |
| Demo kullanici | `demo@eticaret.com` / `DemoPass123` |

## Neden Bu Teknolojiler?

FastAPI secildi cunku otomatik Swagger/OpenAPI dokumani uretir. Bu sayede frontend ve mobil ekipleri backend tamamlanmadan bile API sozlesmesini gorup paralel ilerleyebilir.

SQLModel, tipli Python modelleriyle hem veritabani hem API tarafini okunabilir tutar. SQLite hizli demo ve gelistirme icin yeterlidir; SQLAlchemy altyapisi sayesinde PostgreSQL'e gecmek kolaydir.

pytest ve FastAPI TestClient ile auth, katalog, sepet, favoriler ve checkout gibi kritik akislari otomatik test ediyoruz. Alembic migration altyapisi da schema degisikliklerini daha profesyonel sekilde takip etmek icin eklendi.

## Proje Yapisi

```text
backend/
  app/
    api/routes/           API endpoint dosyalari
    core/                 config, database, security, rate limit
    main.py               FastAPI app girisi
    models.py             veritabani modelleri
    schemas.py            request/response semalari
    seed.py               demo kategori, urun, kullanici ve adres verisi
  tests/                  otomatik API ve E2E API testleri
  qa/                     test plani ve test raporu
  docs/                   entegrasyon, guvenlik, Docker, contract dokumanlari
  migrations/             Alembic migration dosyalari
  scripts/export_openapi.py
  openapi.json            export edilmis API sozlesmesi
  Dockerfile
  docker-compose.yml
  requirements.txt
```

## Kurulum

Backend klasorune gir:

```bash
cd backend
```

Sanal ortam olustur:

```bash
python3 -m venv .venv
```

Sanal ortami aktif et:

```bash
source .venv/bin/activate
```

Paketleri kur:

```bash
pip install -r requirements.txt
```

Ortam dosyasini olustur:

```bash
cp .env.example .env
```

API'yi baslat:

```bash
uvicorn app.main:app --reload
```

Calistigini kontrol et:

```text
http://localhost:8000/health
```

Swagger dokumani:

```text
http://localhost:8000/docs
```

OpenAPI JSON:

```text
http://localhost:8000/openapi.json
```

## Demo Verileri

Uygulama baslarken seed verisi otomatik eklenir. Bu sayede frontend ve mobil ekipleri bos urun listesiyle ugrasmaz.

Demo kullanici:

```text
Email: demo@eticaret.com
Sifre: DemoPass123
```

Seed icerigi:

- Kategoriler: telefon, bilgisayar, aksesuar
- Ornek urunler
- Demo kullanici
- Demo kullanici adresi

## Environment Ayarlari

`.env.example` dosyasindan `.env` olusturulur.

Onemli alanlar:

```env
APP_NAME=Eticaret API
APP_VERSION=0.2.0
ENVIRONMENT=development
DATABASE_URL=sqlite:///./commerce.db
JWT_SECRET=change-this-secret-before-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
RATE_LIMIT_REQUESTS=120
RATE_LIMIT_WINDOW_SECONDS=60
BACKEND_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost:8081,http://127.0.0.1:8081
```

Gercek deploy ortaminda `JWT_SECRET` mutlaka degistirilmelidir.

## Ana Kullanici Akisi

Backend su kritik e-ticaret akisini destekler:

1. Kullanici register veya login olur.
2. Urunleri listeler, arar ve filtreler.
3. Urun detayini acar.
4. Urunu sepete ekler.
5. Isterse urunu favorilere ekler.
6. Adres bilgisini olusturur veya mevcut adresini kullanir.
7. Checkout yapar.
8. Siparis olusur, sepet bosalir, urun stogu azalir.
9. Kullanici siparis gecmisini gorur.

## API Endpointleri

### Health ve Meta

| Method | Endpoint | Aciklama |
| --- | --- | --- |
| GET | `/health` | API ayakta mi kontrolu |
| GET | `/api/v1/meta` | version, docs ve OpenAPI link bilgisi |

### Auth

| Method | Endpoint | Aciklama |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Yeni kullanici kaydi |
| POST | `/api/v1/auth/login` | Kullanici girisi |
| POST | `/api/v1/auth/refresh` | Access token yenileme |

Login ornegi:

```json
{
  "email": "demo@eticaret.com",
  "password": "DemoPass123"
}
```

Basarili cevapta `access_token`, `refresh_token`, `token_type` ve `user` doner.

Korumali endpointlerde header:

```http
Authorization: Bearer ACCESS_TOKEN
```

Refresh token rotate edilir. Yani refresh token kullanildiktan sonra eski refresh token tekrar kullanilamaz.

### Katalog

| Method | Endpoint | Aciklama |
| --- | --- | --- |
| GET | `/api/v1/categories` | Kategorileri listeler |
| GET | `/api/v1/categories/{slug}` | Kategori detayini getirir |
| GET | `/api/v1/products` | Urunleri sayfali listeler |
| GET | `/api/v1/products/{id-or-slug}` | Urun detayini getirir |

Urun listeleme query parametreleri:

```text
page=1
size=12
q=Nova
category=telefon
minPrice=1000
maxPrice=50000
```

Ornek:

```text
GET /api/v1/products?page=1&size=12&q=Nova&category=telefon
```

### Sepet

Sepet endpointleri auth ister.

| Method | Endpoint | Aciklama |
| --- | --- | --- |
| GET | `/api/v1/cart` | Sepeti getirir |
| POST | `/api/v1/cart/items` | Sepete urun ekler |
| PATCH | `/api/v1/cart/items/{product_id}` | Sepetteki miktari gunceller |
| DELETE | `/api/v1/cart/items/{product_id}` | Urunu sepetten siler |
| DELETE | `/api/v1/cart` | Sepeti temizler |

Sepete ekleme ornegi:

```json
{
  "product_id": 1,
  "quantity": 2
}
```

Stoktan fazla urun eklenirse `409 Conflict` doner.

### Favoriler

Favori endpointleri auth ister.

| Method | Endpoint | Aciklama |
| --- | --- | --- |
| GET | `/api/v1/favorites` | Favori urunleri listeler |
| POST | `/api/v1/favorites/{product_id}` | Urunu favorilere ekler |
| DELETE | `/api/v1/favorites/{product_id}` | Urunu favorilerden siler |

Favori ekleme ayni urun icin tekrarlandiginda duplicate kayit olusmaz.

### Kullanici ve Adres

Kullanici endpointleri auth ister.

| Method | Endpoint | Aciklama |
| --- | --- | --- |
| GET | `/api/v1/users/me` | Profil bilgisini getirir |
| PATCH | `/api/v1/users/me` | Profil adini gunceller |
| GET | `/api/v1/users/me/addresses` | Adresleri listeler |
| POST | `/api/v1/users/me/addresses` | Adres olusturur |
| PATCH | `/api/v1/users/me/addresses/{address_id}` | Adresi gunceller |
| DELETE | `/api/v1/users/me/addresses/{address_id}` | Adresi siler |

Adres olusturma ornegi:

```json
{
  "title": "Ev",
  "city": "Istanbul",
  "district": "Kadikoy",
  "line1": "Moda Caddesi No: 10",
  "postal_code": "34710"
}
```

### Checkout ve Siparis

Siparis endpointleri auth ister.

| Method | Endpoint | Aciklama |
| --- | --- | --- |
| POST | `/api/v1/orders` | Checkout yapar ve siparis olusturur |
| GET | `/api/v1/orders` | Siparis gecmisini listeler |
| GET | `/api/v1/orders/{order_id}` | Siparis detayini getirir |

Checkout request:

```json
{
  "shipping_address_id": 1,
  "payment_method": "simulation"
}
```

Checkout sonrasi:

- Siparis `paid` status ile olusur.
- Payment status `simulated` olur.
- Sepet bosalir.
- Urun stogu azalir.

Bos sepetle checkout yapilirsa `409 Conflict` doner.

## Hata Formati

Kontrollu hatalar `application/problem+json` formatinda doner.

Ornek:

```json
{
  "type": "https://eticaret.local/problems/unauthorized",
  "title": "Unauthorized",
  "status": 401,
  "detail": "Authentication required",
  "instance": "/api/v1/cart"
}
```

Yaygin hata kodlari:

| Kod | Anlam |
| --- | --- |
| 401 | Token yok, gecersiz veya suresi dolmus |
| 404 | Kaynak bulunamadi |
| 409 | Is kurali hatasi, bos sepet, stok yetersiz |
| 422 | Request validasyon hatasi |
| 429 | Rate limit asildi |

Swagger/OpenAPI icinde `ProblemDetails` semasi hata cevaplari icin dokumante edilir.

## Para Hesaplama

E-ticarette para hesaplari `float` ile yapilmamalidir. Bu projede fiyat, ara toplam ve siparis toplam alanlari backend icinde `Decimal` ile hesaplanir.

Veritabani tarafinda:

```text
NUMERIC(12, 2)
```

API response tarafinda frontend ve mobil kolay kullansin diye JSON number doner:

```json
{
  "price": 32999.9,
  "subtotal": 65999.8
}
```

## Rate Limit

Basit IP bazli rate limit vardir.

Varsayilan:

```text
120 request / 60 saniye
```

Limit asilirsa:

```text
429 Too Many Requests
```

Detaylar:

- `docs/SECURITY.md`

## API Contract

Canli contract:

```text
http://localhost:8000/openapi.json
```

Repo icindeki export:

```text
openapi.json
```

Contract dosyasini yeniden uretmek:

```bash
cd backend
source .venv/bin/activate
python scripts/export_openapi.py
```

Frontend ve mobil ekipleri isterse bu dosyadan TypeScript tipleri uretebilir.

Detay:

- `docs/API_CONTRACT.md`
- `docs/FRONTEND_MOBILE_INTEGRATION.md`

## Test

Testleri calistir:

```bash
cd backend
source .venv/bin/activate
pytest
```

Son dogrulama sonucu:

```text
21 passed
```

Test kapsamindan bazi basliklar:

- Register/login/refresh token
- Duplicate email
- Hatali sifre
- Invalid token
- Product search/filter/detail
- Cart add/update/delete
- Stock overflow
- Favorites add/list/delete
- Empty cart checkout
- Full API E2E checkout flow
- Rate limit
- Meta/health

QA dokumanlari:

- `qa/TEST_PLAN.md`
- `qa/TEST_REPORT.md`

## CI

GitHub Actions workflow dosyasi:

```text
.github/workflows/backend-tests.yml
```

Backend dosyalari degistiginde PR/push uzerinde `pytest` calisir.

## Migration

Alembic altyapisi vardir.

Mevcut head revision:

```text
20260718_0001
```

Migration calistirma:

```bash
cd backend
source .venv/bin/activate
alembic upgrade head
```

Offline SQL kontrolu:

```bash
alembic upgrade head --sql
```

Not: Local demo kolayligi icin uygulama startup sirasinda tablolari da olusturur. Migration altyapisi teslim ve ilerleyen schema degisiklikleri icin hazir tutulmustur.

## Docker

Docker ile calistirma:

```bash
cd backend
cp .env.example .env
docker compose up --build
```

Health kontrolu:

```bash
curl http://localhost:8000/health
```

Beklenen cevap:

```json
{
  "status": "ok",
  "app_name": "Eticaret API",
  "version": "0.2.0",
  "environment": "development"
}
```

Docker build/run testi yapildi. Container `backend-api-1` olarak ayaga kalkti ve su kontroller basarili oldu:

- `GET /health`
- `GET /api/v1/meta`
- `GET /api/v1/products?page=1&size=2`
- `POST /api/v1/auth/login`
- `GET /openapi.json`

Detayli Docker adimlari:

- `docs/DOCKER_RUNBOOK.md`

## Frontend ve Mobil Icin Kisa Notlar

Base URL:

| Ortam | URL |
| --- | --- |
| Web / Expo Web | `http://localhost:8000` |
| iOS Simulator | `http://localhost:8000` |
| Android Emulator | `http://10.0.2.2:8000` |
| Gercek telefon | `http://<bilgisayar-lan-ip>:8000` |

Expo env ornegi:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

Gercek telefondan test ederken:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Detayli entegrasyon rehberi:

- `docs/FRONTEND_MOBILE_INTEGRATION.md`

## Backend + QA Teslim Durumu

Tamamlananlar:

- Swagger/OpenAPI sozlesmesi
- Auth + refresh token
- Product/category API
- Cart API
- Favorites API
- Checkout/order API
- User/profile/address API
- Problem Details hata formati
- Rate limit
- Decimal para hesaplama
- Checkout transaction iyilestirmesi
- Alembic migration
- Seed veri
- Postman koleksiyonu
- API testleri
- Backend API E2E testi
- CI workflow
- Frontend/mobil entegrasyon dokumani
- QA test plani ve test raporu

Dis bagimli kalanlar:

- Frontend/mobil hazir olunca Playwright/Cypress/Maestro UI E2E testi eklenmeli.
- Demo video ve ekran goruntuleri takim teslim asamasinda hazirlanmali.

## Yardimci Dokumanlar

| Dosya | Ne icin? |
| --- | --- |
| `docs/BACKEND_QA_ROADMAP.md` | Backend + QA yol haritasi |
| `docs/FRONTEND_MOBILE_INTEGRATION.md` | Web/mobil entegrasyon rehberi |
| `docs/FRONTEND_HANDOFF.md` | Frontend gelistirici icin detayli API baglanti rehberi |
| `docs/API_CONTRACT.md` | API contract export ve degisiklik kurallari |
| `docs/SECURITY.md` | Guvenlik ve rate limit notlari |
| `docs/DOCKER_RUNBOOK.md` | Docker calistirma ve smoke test |
| `qa/TEST_PLAN.md` | QA test plani |
| `qa/TEST_REPORT.md` | Son test raporu |
| `postman/Eticaret.postman_collection.json` | Postman koleksiyonu |
