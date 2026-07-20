# Docker Calistirma ve QA Kontrolu

Bu dokuman backend API'nin Docker ile temiz ortamda calistigini dogrulamak icin kullanilir.

## Son Docker Kontrol Sonucu

Bu proje Docker Desktop acikken gercek container ile test edildi.

| Kontrol | Sonuc |
| --- | --- |
| `docker --version` | PASS |
| `docker compose version` | PASS |
| `docker compose up --build -d` | PASS |
| Container status | PASS, `backend-api-1` up |
| `GET /health` | PASS |
| `GET /api/v1/meta` | PASS |
| `GET /api/v1/products?page=1&size=2` | PASS |
| `POST /api/v1/auth/login` | PASS |
| `GET /openapi.json` | PASS |

Not: Docker testinde CORS env parsing problemi yakalandi ve `backend_cors_origins` config'i comma-separated `.env` formatini destekleyecek sekilde duzeltildi.

## On Kosullar

- Docker Desktop veya Docker Engine kurulu olmali.
- Terminalde `docker --version` ve `docker compose version` komutlari calismali.

## Calistirma

```bash
cd backend
cp .env.example .env
docker compose up --build
```

Container ayaga kalkinca beklenen log:

```text
Uvicorn running on http://0.0.0.0:8000
Application startup complete
```

## Health Kontrolu

Yeni terminalde:

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

## Swagger Kontrolu

Tarayicida ac:

```text
http://localhost:8000/docs
```

Kontrol edilecekler:

- `auth`, `products`, `categories`, `cart`, `orders`, `users` tag'leri gorunuyor.
- `favorites` ve `meta` tag'leri gorunuyor.
- `Authorize` butonu ile Bearer token girilebiliyor.
- `GET /api/v1/products` seed urunlerini donduruyor.

## Docker Smoke Test

1. `POST /api/v1/auth/login` ile demo kullanici girisi yap.
2. `GET /api/v1/products` ile urunleri listele.
3. Bearer token ile `POST /api/v1/cart/items` cagir.
4. `GET /api/v1/users/me/addresses` ile demo adresi al.
5. `POST /api/v1/orders` ile checkout yap.
6. `GET /api/v1/orders` ile siparis gecmisini kontrol et.

Demo kullanici:

```text
demo@eticaret.com / DemoPass123
```

## Durdurma

```bash
docker compose down
```

Veri volume'unu da silmek istersen:

```bash
docker compose down -v
```

## Sik Sorunlar

| Sorun | Cozum |
| --- | --- |
| `.env` bulunamadi | `cp .env.example .env` calistir |
| 8000 portu dolu | Eski backend surecini kapat veya compose portunu degistir |
| Urun listesi bos | Container loglarinda seed hatasi var mi kontrol et |
| Mobil cihaz baglanamiyor | Backend'i `0.0.0.0` ile baslat ve LAN IP kullan |
