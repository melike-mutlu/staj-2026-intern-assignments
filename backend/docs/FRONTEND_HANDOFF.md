# Frontend Handoff Rehberi

Bu dokuman frontend veya React Native/Expo tarafini yazan ekip arkadasinin backend API'ye hizli, dogru ve minimum soru ile baglanmasi icin hazirlandi.

Backend zaten Swagger/OpenAPI ile dokumante ediliyor. Bu dosya ise pratik entegrasyon rehberidir: hangi endpoint ne zaman kullanilir, token nasil saklanir, hata nasil islenir, sepet/checkout/favoriler akisi nasil baglanir?

## En Kisa Ozet

| Konu | Deger |
| --- | --- |
| API Base URL | `http://localhost:8000` |
| Swagger | `http://localhost:8000/docs` |
| OpenAPI JSON | `http://localhost:8000/openapi.json` |
| Repo contract | `backend/openapi.json` |
| Demo email | `demo@eticaret.com` |
| Demo sifre | `DemoPass123` |
| Auth tipi | Bearer token |
| Health check | `GET /health` |
| Meta/version | `GET /api/v1/meta` |

## Backend'i Calistirma

Backend klasorunde:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

Calistigini kontrol et:

```text
http://localhost:8000/health
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

Swagger:

```text
http://localhost:8000/docs
```

## Base URL Secimi

Frontend hangi ortamda calisiyorsa base URL ona gore secilmeli.

| Ortam | Base URL |
| --- | --- |
| React Web / Vite / Next local | `http://localhost:8000` |
| Expo Web | `http://localhost:8000` |
| iOS Simulator | `http://localhost:8000` |
| Android Emulator | `http://10.0.2.2:8000` |
| Gercek telefon | `http://<bilgisayar-lan-ip>:8000` |

Gercek telefon ile test edilecekse backend su sekilde baslatilmali:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Expo icin env ornegi:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

Android emulator icin:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000
```

Vite icin:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Next.js icin:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Onerilen Frontend Dosya Yapisi

React, Next, Vite veya Expo fark etmez; API katmanini UI'dan ayri tutmak iyi olur.

```text
src/
  api/
    client.ts
    auth.ts
    products.ts
    cart.ts
    favorites.ts
    orders.ts
    users.ts
    types.ts
  store/
    auth-store.ts
    cart-store.ts
  screens/ veya pages/
```

Ama proje kucukse tek bir `api.ts` dosyasi ile baslamak da kabul edilebilir.

## TypeScript Tipleri

Backend OpenAPI contract dosyasi:

```text
backend/openapi.json
```

Tip uretmek istersen:

```bash
npx openapi-typescript backend/openapi.json -o src/api/types.ts
```

Bu sart degil ama tavsiye edilir. Tip uretmezsen response modellerini manuel tanimlayabilirsin.

## Ortak API Client

Frontend tarafinda butun istekleri tek yerden gecirmek iyi olur. Boylece token, hata, refresh ve base URL tek dosyada yonetilir.

```ts
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.VITE_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
};

export class ApiError extends Error {
  status: number;
  problem?: ProblemDetails;

  constructor(status: number, message: string, problem?: ProblemDetails) {
    super(message);
    this.status = status;
    this.problem = problem;
  }
}

type ApiOptions = RequestInit & {
  accessToken?: string | null;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => undefined);
    throw new ApiError(
      response.status,
      problem?.detail ?? `API request failed with ${response.status}`,
      problem
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
```

## Auth Akisi

Backend auth sistemi JWT access token + refresh token ile calisir.

Akis:

1. Kullanici register veya login olur.
2. Backend `access_token`, `refresh_token`, `token_type`, `user` doner.
3. `access_token` korumali endpointlerde header olarak kullanilir.
4. Access token gecersiz olursa refresh token ile yeni token alinir.
5. Refresh token rotate edilir. Eski refresh token tekrar kullanilmaz.

### Login

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "demo@eticaret.com",
  "password": "DemoPass123"
}
```

Response:

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

### Register

```http
POST /api/v1/auth/register
```

Request:

```json
{
  "email": "new-user@example.com",
  "full_name": "New User",
  "password": "StrongPass123"
}
```

### Refresh Token

```http
POST /api/v1/auth/refresh
```

Request:

```json
{
  "refresh_token": "REFRESH_TOKEN"
}
```

Yeni `access_token` ve yeni `refresh_token` doner.

## Token Saklama

Web icin:

- Basit demo: `localStorage`
- Daha iyi yaklasim: memory + refresh kontrolu

Expo / React Native icin:

- Demo: AsyncStorage
- Daha iyi yaklasim: SecureStore

Token saklarken en az su alanlar tutulmali:

```ts
type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: number;
    email: string;
    full_name: string;
  } | null;
};
```

Logout yaparken ikisi de temizlenmeli:

- `accessToken`
- `refreshToken`

## 401 Durumu Nasil Ele Alinmali?

Korumali endpointten `401` gelirse:

1. Refresh token varsa `/api/v1/auth/refresh` cagrilir.
2. Basarili olursa yeni tokenlar saklanir.
3. Ilk istek yeni access token ile tekrar denenir.
4. Refresh de 401 donerse logout yapilir.

Basit mantik:

```ts
try {
  return await apiFetch(path, { accessToken });
} catch (error) {
  if (error instanceof ApiError && error.status === 401 && refreshToken) {
    const refreshed = await refreshAuth(refreshToken);
    saveTokens(refreshed.access_token, refreshed.refresh_token);
    return apiFetch(path, { accessToken: refreshed.access_token });
  }
  throw error;
}
```

## Hata Formati

Backend kontrollu hatalari `application/problem+json` formatinda dondurur.

Ornek:

```json
{
  "type": "https://eticaret.local/problems/conflict",
  "title": "Conflict",
  "status": 409,
  "detail": "Cart is empty",
  "instance": "/api/v1/orders"
}
```

Frontend tarafinda:

- Kullaniciya genelde `detail` gosterilebilir.
- `status` ile UI karari verilebilir.
- `401`: login/refresh akisi
- `409`: is kurali hatasi, sepet bos veya stok yetersiz
- `422`: form validasyonu
- `429`: kisa bekleme veya tekrar deneme mesaji

## Urun Listeleme

```http
GET /api/v1/products
```

Query parametreleri:

| Parametre | Tip | Aciklama |
| --- | --- | --- |
| `page` | number | Sayfa, varsayilan 1 |
| `size` | number | Sayfa boyutu, max 50 |
| `q` | string | Arama metni, min 2 karakter |
| `category` | string | Kategori slug |
| `minPrice` | number | Minimum fiyat |
| `maxPrice` | number | Maksimum fiyat |

Ornek:

```text
GET /api/v1/products?page=1&size=12&q=Nova&category=telefon
```

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

ID veya slug ile calisir.

```http
GET /api/v1/products/1
GET /api/v1/products/nova-x-pro
```

Urun detay ekraninda kullan:

- isim
- aciklama
- fiyat
- stok
- rating
- image_url
- kategori

Stok `0` ise sepete ekle butonu kapatilmali.

## Kategoriler

```http
GET /api/v1/categories
```

Kategori filtre chipleri veya dropdown icin kullanilir.

## Sepet

Sepet endpointleri auth ister.

### Sepeti Getir

```http
GET /api/v1/cart
Authorization: Bearer ACCESS_TOKEN
```

Response:

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

### Sepete Urun Ekle

```http
POST /api/v1/cart/items
```

Request:

```json
{
  "product_id": 1,
  "quantity": 2
}
```

### Miktar Guncelle

```http
PATCH /api/v1/cart/items/1
```

Request:

```json
{
  "quantity": 3
}
```

### Urunu Sepetten Sil

```http
DELETE /api/v1/cart/items/1
```

Basarili cevap:

```text
204 No Content
```

### Sepeti Temizle

```http
DELETE /api/v1/cart
```

## Sepet UI Kurallari

- Sepet bos ise checkout butonu kapali olmali.
- Quantity `1` altina dusmemeli.
- Quantity `stock` degerinden fazla olmamali.
- API `409 Requested quantity exceeds stock` donerse kullaniciya stok uyarisi gosterilmeli.

## Favoriler

Favori endpointleri auth ister.

### Favorileri Listele

```http
GET /api/v1/favorites
```

### Favoriye Ekle

```http
POST /api/v1/favorites/1
```

### Favoriden Cikar

```http
DELETE /api/v1/favorites/1
```

Basarili silme cevabi:

```text
204 No Content
```

UI onerisi:

- Kullanici login degilse favori butonu login sayfasina yonlendirebilir.
- Favori ekle tekrar cagrilirsa duplicate olusmaz.
- Product card uzerinde kalp/favori butonu icin kullanilabilir.

## Adresler

Checkout icin adres gerekir.

### Adresleri Listele

```http
GET /api/v1/users/me/addresses
```

### Adres Olustur

```http
POST /api/v1/users/me/addresses
```

Request:

```json
{
  "title": "Ev",
  "city": "Istanbul",
  "district": "Kadikoy",
  "line1": "Moda Caddesi No: 10",
  "postal_code": "34710"
}
```

Adres alanlari icin UI validasyonu:

- `title`: min 2 karakter
- `city`: min 2 karakter
- `district`: min 2 karakter
- `line1`: min 5 karakter
- `postal_code`: opsiyonel

## Checkout

Checkout icin once:

1. Kullanici login olmali.
2. Sepet bos olmamali.
3. Kullanici adresi olmali.

Request:

```http
POST /api/v1/orders
Authorization: Bearer ACCESS_TOKEN
```

```json
{
  "shipping_address_id": 1,
  "payment_method": "simulation"
}
```

Response:

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

Checkout basarili olunca:

- Order confirmation ekranina gidilebilir.
- Sepet state'i temizlenmeli.
- Siparis gecmisi invalidate/refetch edilmeli.
- Urun stoklari yeniden cekilebilir.

Checkout hatalari:

| Durum | Status | UI davranisi |
| --- | --- | --- |
| Sepet bos | 409 | Checkout butonunu kapat, sepet bos mesaji goster |
| Adres yok | 404 | Adres ekleme ekranina yonlendir |
| Stok yetersiz | 409 | Sepeti yeniden cek, stok uyarisi goster |
| Token yok | 401 | Login ekranina yonlendir |

## Siparis Gecmisi

```http
GET /api/v1/orders
```

Siparis detay:

```http
GET /api/v1/orders/{order_id}
```

Profil veya "Siparislerim" ekraninda kullanilir.

## Profil

```http
GET /api/v1/users/me
```

Profil adini guncelle:

```http
PATCH /api/v1/users/me
```

Request:

```json
{
  "full_name": "Yeni Ad Soyad"
}
```

## Meta Endpoint

Frontend debug veya app settings icin:

```http
GET /api/v1/meta
```

Response:

```json
{
  "app_name": "Eticaret API",
  "version": "0.2.0",
  "environment": "development",
  "docs_url": "/docs",
  "openapi_url": "/openapi.json",
  "health": "/health"
}
```

## Ekran - Endpoint Eslesmesi

| Ekran | Endpointler |
| --- | --- |
| Login | `POST /api/v1/auth/login` |
| Register | `POST /api/v1/auth/register` |
| Home/Product Grid | `GET /api/v1/products`, `GET /api/v1/categories` |
| Search/Filter | `GET /api/v1/products?q=&category=&minPrice=&maxPrice=` |
| Product Detail | `GET /api/v1/products/{slug}` |
| Cart | `GET /api/v1/cart`, `PATCH /api/v1/cart/items/{product_id}`, `DELETE /api/v1/cart/items/{product_id}` |
| Favorites | `GET /api/v1/favorites`, `POST /api/v1/favorites/{product_id}`, `DELETE /api/v1/favorites/{product_id}` |
| Checkout | `GET /api/v1/users/me/addresses`, `POST /api/v1/orders` |
| Order Success | `GET /api/v1/orders/{order_id}` |
| Orders | `GET /api/v1/orders` |
| Profile | `GET /api/v1/users/me`, `PATCH /api/v1/users/me` |
| Addresses | `GET/POST/PATCH/DELETE /api/v1/users/me/addresses` |

## State Management Onerisi

Auth state:

- `user`
- `accessToken`
- `refreshToken`
- `isAuthenticated`

Cart state:

- API'den gelen cart response tutulabilir.
- Add/update/delete sonrasi backend response'u cart state'e yazilabilir.

Favorites state:

- Favori product id listesi tutulabilir.
- Product card uzerindeki favori ikonlari bu listeye gore aktif/pasif olabilir.

Server state icin:

- React Query / TanStack Query kullaniliyorsa urun, sepet, siparis ve favoriler query olarak tutulabilir.
- Sepet ve favori mutation sonrasi ilgili query invalidate edilebilir.

## Para Degerleri

Backend para hesaplamalarini Decimal ile yapar. API JSON response tarafinda number doner.

Frontend gosterimde para formatla:

```ts
export function formatTRY(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(value);
}
```

## Image URL Kullanimi

Seed urunlerde `image_url` alanlari remote URL'dir. Web tarafinda direkt kullanilabilir.

React Native/Expo tarafinda:

```tsx
<Image source={{ uri: product.image_url }} />
```

Gorsel yuklenemezse fallback placeholder gosterilmeli.

## Loading, Empty, Error State

Frontend ekranlarinda bu durumlar mutlaka olmali:

- Product list loading
- Product list empty
- Search no result
- Cart empty
- Favorites empty
- Orders empty
- Checkout error
- 401 login required
- 429 too many requests

## Rate Limit

Backend demo icin IP bazli rate limit uygular:

```text
120 request / 60 saniye
```

429 gelirse response header:

```http
Retry-After: 60
```

UI tarafinda:

- Buton tekrar tekrar tiklanmasin diye loading state kullan.
- 429 durumunda "Cok fazla istek gonderildi, biraz sonra tekrar deneyin." mesaji goster.

## Entegrasyon Smoke Test

Frontend baglantisi tamamlandiginda su akisi elle test edin:

1. Login ol: `demo@eticaret.com / DemoPass123`
2. Home ekraninda urunleri gor.
3. Arama yap: `Nova`
4. Urun detayina git.
5. Urunu favorilere ekle.
6. Urunu sepete ekle.
7. Sepette miktar guncelle.
8. Adres sec veya ekle.
9. Checkout yap.
10. Order success ekranini gor.
11. Siparis gecmisinde siparisi gor.
12. Logout yap.

## Sik Sorunlar

| Sorun | Muhtemel sebep | Cozum |
| --- | --- | --- |
| Network request failed | Yanlis base URL | Android emulator icin `10.0.2.2` kullan |
| CORS hatasi | Origin env'de yok | Backend `.env` CORS listesine frontend origin ekle |
| 401 Unauthorized | Token yok/gecersiz | Login ol veya refresh akisini calistir |
| Refresh sonrasi yine 401 | Eski refresh token tekrar kullanildi | Logout yap, kullaniciyi login'e yonlendir |
| 409 Cart is empty | Sepet bos | Checkout butonunu bos sepette kapat |
| 409 stock | Stoktan fazla miktar | Quantity stepper'i `stock` ile sinirla |
| 422 validation | Form eksik veya format hatali | Form validasyonunu schema'ya gore yap |
| 429 rate limit | Cok fazla istek | Loading/debounce ekle, tekrar denemeyi geciktir |

## Frontend Bitmeden Once Kontrol Listesi

- API base URL env'den okunuyor.
- Login/register calisiyor.
- Tokenlar saklaniyor.
- Protected endpointlere Bearer token gidiyor.
- 401 durumunda refresh veya logout akisi var.
- Product list/search/filter calisiyor.
- Product detail slug ile aciliyor.
- Cart add/update/delete calisiyor.
- Favori add/delete calisiyor.
- Address create/list calisiyor.
- Checkout basarili.
- Checkout sonrasi cart temizleniyor.
- Orders list calisiyor.
- Empty/loading/error state'leri var.
- 409/422/429 hata mesajlari UI'da duzgun gorunuyor.
- Expo Android kullaniliyorsa base URL `10.0.2.2`.

## Backend Ekibinden Istenen Bilgiler

Entegrasyon sirasinda backend ekibine sorun bildirirken sunlari yaz:

- Hangi endpoint?
- Request body neydi?
- Status code ne geldi?
- Response body ne geldi?
- Hangi ortam? Web, iOS simulator, Android emulator, gercek cihaz?
- Kullanilan base URL ne?

Ornek bug notu:

```text
Endpoint: POST /api/v1/orders
Status: 409
Response: {"detail":"Cart is empty"}
Ortam: Expo Android Emulator
Base URL: http://10.0.2.2:8000
Adimlar: Login -> sepete urun eklemeden checkout
Beklenen: Checkout butonu kapali olmali
```
