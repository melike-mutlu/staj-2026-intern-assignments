# Frontend ve Mobil Entegrasyon Rehberi

Bu dokuman Web + Mobil ekibinin backend API'yi hizli ve dogru baglamasi icin hazirlandi. Backend tarafinda sozlesme kaynagi Swagger/OpenAPI'dir.

## Hizarli Bilgiler

| Alan | Deger |
| --- | --- |
| Local API | `http://localhost:8000` |
| Swagger UI | `http://localhost:8000/docs` |
| OpenAPI JSON | `http://localhost:8000/openapi.json` |
| Demo email | `demo@eticaret.com` |
| Demo sifre | `DemoPass123` |
| Auth tipi | Bearer token |
| Meta endpoint | `GET /api/v1/meta` |

## Expo / React Native Base URL

Ortama gore API base URL farkli olabilir:

| Ortam | API Base URL |
| --- | --- |
| Expo Web | `http://localhost:8000` |
| iOS Simulator | `http://localhost:8000` |
| Android Emulator | `http://10.0.2.2:8000` |
| Gercek telefon | `http://<bilgisayar-lan-ip>:8000` |

Gercek telefondan test ederken backend'i sadece `127.0.0.1` ile degil, agdan erisilebilir sekilde baslatin:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Expo tarafinda onerilen env:

```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

Android emulator icin:

```bash
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000
```

## Auth Akisi

1. Kullanici register veya login olur.
2. Backend `access_token`, `refresh_token`, `token_type` ve `user` doner.
3. Korumali endpointlerde header eklenir.
4. Access token gecersiz olursa `/auth/refresh` ile yeni token alinir.
5. Refresh token rotate edilir; eski refresh token tekrar kullanilmamalidir.

Header:

```http
Authorization: Bearer <access_token>
```

Login request:

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "demo@eticaret.com",
  "password": "DemoPass123"
}
```

Login response:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "demo@eticaret.com",
    "full_name": "Demo Kullanici",
    "is_active": true,
    "created_at": "2026-07-18T12:00:00Z"
  }
}
```

## TypeScript API Client Ornegi

```ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type ApiOptions = RequestInit & {
  accessToken?: string;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    throw new Error(problem?.detail ?? `API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
```

## Urun Listeleme

```http
GET /api/v1/products?page=1&size=12&q=Nova&category=telefon&minPrice=1000&maxPrice=50000
```

Tum query parametreleri opsiyoneldir.

Response:

```json
{
  "page": 1,
  "size": 12,
  "total": 1,
  "items": [
    {
      "id": 1,
      "category_id": 1,
      "name": "Nova X Pro",
      "slug": "nova-x-pro",
      "description": "120Hz ekran, 256GB depolama ve uzun pil omru.",
      "price": 32999.9,
      "stock": 12,
      "rating": 4.7,
      "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "is_active": true,
      "category": {
        "id": 1,
        "name": "Telefon",
        "slug": "telefon"
      }
    }
  ]
}
```

## Urun Detay

Slug veya id ile cagirilabilir:

```http
GET /api/v1/products/nova-x-pro
GET /api/v1/products/1
```

## Sepet Akisi

Sepet endpointleri auth ister.

Sepete ekle:

```http
POST /api/v1/cart/items
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "product_id": 1,
  "quantity": 2
}
```

## Favoriler Akisi

Favori endpointleri auth ister.

Favorileri listele:

```http
GET /api/v1/favorites
Authorization: Bearer <access_token>
```

Favoriye ekle:

```http
POST /api/v1/favorites/1
Authorization: Bearer <access_token>
```

Favoriden sil:

```http
DELETE /api/v1/favorites/1
Authorization: Bearer <access_token>
```

Response:

```json
{
  "total": 1,
  "items": [
    {
      "id": 1,
      "category_id": 1,
      "name": "Nova X Pro",
      "slug": "nova-x-pro",
      "description": "120Hz ekran, 256GB depolama ve uzun pil omru.",
      "price": 32999.9,
      "stock": 12,
      "rating": 4.7,
      "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "is_active": true,
      "category": {
        "id": 1,
        "name": "Telefon",
        "slug": "telefon"
      }
    }
  ]
}
```

Miktar guncelle:

```http
PATCH /api/v1/cart/items/1
```

```json
{
  "quantity": 3
}
```

Urunu sepetten sil:

```http
DELETE /api/v1/cart/items/1
```

Sepeti getir:

```http
GET /api/v1/cart
```

Sepet response:

```json
{
  "items": [
    {
      "product_id": 1,
      "product_name": "Nova X Pro",
      "slug": "nova-x-pro",
      "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "unit_price": 32999.9,
      "quantity": 2,
      "line_total": 65999.8,
      "stock": 12
    }
  ],
  "subtotal": 65999.8
}
```

## Adres ve Checkout

Checkout yapmadan once kullanicinin adresi olmali.

Adres olustur:

```http
POST /api/v1/users/me/addresses
```

```json
{
  "title": "Ev",
  "city": "Istanbul",
  "district": "Kadikoy",
  "line1": "Moda Caddesi No: 10",
  "postal_code": "34710"
}
```

Checkout:

```http
POST /api/v1/orders
```

```json
{
  "shipping_address_id": 1,
  "payment_method": "simulation"
}
```

Order response:

```json
{
  "id": 1,
  "status": "paid",
  "payment_status": "simulated",
  "total_amount": 32999.9,
  "shipping_address": "Ev: Moda Caddesi No: 10, Kadikoy/Istanbul 34710",
  "created_at": "2026-07-18T12:00:00Z",
  "items": [
    {
      "product_id": 1,
      "product_name": "Nova X Pro",
      "unit_price": 32999.9,
      "quantity": 1,
      "line_total": 32999.9
    }
  ]
}
```

Checkout sonrasi:

- Siparis olusur.
- Sepet bosalir.
- Urun stogu azalir.
- Siparis gecmisi `GET /api/v1/orders` ile listelenir.

## Hata Formati

Tum kontrollu hatalar `application/problem+json` formatinda doner.

```json
{
  "type": "https://eticaret.local/problems/conflict",
  "title": "Conflict",
  "status": 409,
  "detail": "Cart is empty",
  "instance": "/api/v1/orders"
}
```

Frontend/mobil tarafinda `detail` kullaniciya gosterilebilir; `status` ve `title` debug/analytics icin saklanabilir.

## Sik Karsilasilan Hatalar

| Durum | Status | Cozum |
| --- | --- | --- |
| Token yok | 401 | Login ol, access token header ekle |
| Token gecersiz | 401 | Refresh token ile yenile veya login'e don |
| Bos sepet checkout | 409 | Checkout butonunu sepet bosken disable et |
| Stoktan fazla ekleme | 409 | Quantity stepper'i `stock` degerine gore sinirla |
| Gecersiz form | 422 | Form validasyonunu API semasina gore yap |
| Cok fazla istek | 429 | Kisa sure beklet, `Retry-After` header'ini kullan |

## Onerilen Ekran Veri Akisi

| Ekran | Backend endpoint |
| --- | --- |
| Home/Product Grid | `GET /api/v1/products` |
| Search/Filter | `GET /api/v1/products?q=&category=&minPrice=&maxPrice=` |
| Product Detail | `GET /api/v1/products/{slug}` |
| Favorites | `GET/POST/DELETE /api/v1/favorites` |
| Login | `POST /api/v1/auth/login` |
| Register | `POST /api/v1/auth/register` |
| Cart | `GET /api/v1/cart` |
| Checkout | `POST /api/v1/orders` |
| Orders | `GET /api/v1/orders` |
| Profile | `GET /api/v1/users/me` |
| Addresses | `GET/POST/PATCH/DELETE /api/v1/users/me/addresses` |
| Debug/Version | `GET /api/v1/meta` |

## Entegrasyon Kontrol Listesi

- API base URL env'den okunuyor.
- Login sonrasi access ve refresh token saklaniyor.
- Korumali endpointlerde Bearer token gonderiliyor.
- 401 durumunda refresh veya logout akisi var.
- Sepet bosken checkout butonu kapali.
- Quantity secimi stoktan fazla olamiyor.
- Favori butonu auth durumuna gore calisiyor.
- 429 rate limit durumunda tekrar deneme geciktiriliyor.
- Loading, empty ve error state'leri ekranda var.
- Swagger'daki schema alanlariyla UI modelleri uyumlu.
