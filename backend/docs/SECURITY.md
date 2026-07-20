# Guvenlik ve Rate Limit Notlari

Bu dokuman backend tesliminde guvenlik kararlarini ve kalan production notlarini aciklar.

## Uygulanan Guvenlik Kararlari

| Alan | Durum |
| --- | --- |
| Password hash | `bcrypt` kullaniliyor |
| Bcrypt 72 byte limiti | Sifre/token hash oncesi SHA-256 ile normalize ediliyor |
| JWT access token | Var, sure ayari `.env` ile yapiliyor |
| Refresh token | Var, kullanildikca rotate ediliyor |
| Secret yonetimi | `.env`, repoya secret yazilmiyor |
| CORS | Web, Vite ve Expo dev originleri `.env` ile ayarlanabiliyor |
| Hata formati | Problem Details benzeri `application/problem+json` |
| Rate limit | IP bazli in-memory middleware |
| Para hesaplama | `Decimal` ile iki haneli hassas hesaplama |
| Schema yonetimi | Alembic migration altyapisi |

## Rate Limit

Varsayilan ayarlar:

```env
RATE_LIMIT_REQUESTS=120
RATE_LIMIT_WINDOW_SECONDS=60
```

Limit asildiginda cevap:

```json
{
  "type": "https://eticaret.local/problems/rate-limit-exceeded",
  "title": "Rate Limit Exceeded",
  "status": 429,
  "detail": "Too many requests. Please slow down and try again shortly.",
  "instance": "/health"
}
```

Header:

```http
Retry-After: 60
```

## Production Notu

Mevcut rate limit local/demo icin yeterlidir. Production ortaminda birden fazla instance calisacagi icin Redis tabanli rate limit veya API gateway/WAF seviyesi rate limit tercih edilmelidir.

## Auth Guvenlik Akisi

1. Register/login sirasinda sifre hashlenir.
2. Backend access token ve refresh token dondurur.
3. Access token kisa surelidir.
4. Refresh token kullanildiginda yeni refresh token uretilir.
5. Eski refresh token tekrar kullanilirsa 401 doner.

## QA Kontrolleri

- Hatali login 401 donuyor.
- Yetkisiz endpoint 401 donuyor.
- Gecersiz token 401 donuyor.
- Refresh token reuse 401 donuyor.
- Rate limit asimi 429 donuyor.
- Kontrollu hatalar `application/problem+json` ile donuyor.

## Bilinen Sinirlar

- HTTPS local ortamda aktif degil; deploy ortaminda TLS zorunlu olmali.
- Admin yetkilendirmesi henuz yok.
- Refresh token hash'i kullanici tablosunda tutuluyor; daha gelismis audit icin ayri token tablosu eklenebilir.
- Rate limit memory tabanli oldugu icin container restart sonrasi sayaç sifirlanir.
- Checkout tek request icinde commit/rollback mantigi kullanir; yuksek trafik icin veritabani seviyesinde row lock stratejisi eklenebilir.
