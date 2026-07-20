# API Contract

Backend API sozlesmesi iki sekilde paylasilir:

- Canli Swagger UI: `http://localhost:8000/docs`
- Repo icindeki export: `openapi.json`

## Contract Export

Backend degistikten sonra sozlesmeyi guncelle:

```bash
cd backend
source .venv/bin/activate
python scripts/export_openapi.py
```

Bu komut `backend/openapi.json` dosyasini yeniden uretir.

## Frontend / Mobil Kullanim

Tip uretmek icin OpenAPI dosyasi kullanilabilir. Ornek:

```bash
npx openapi-typescript backend/openapi.json -o src/api/types.ts
```

Mock server veya API client generator kullanan ekipler de ayni dosyayi kaynak olarak alabilir.

## Contract Degisiklik Kurali

- Yeni endpoint eklenirse `openapi.json` yeniden export edilir.
- Response field adi degisirse frontend/mobil ekibine haber verilir.
- Breaking change varsa PR aciklamasinda belirtilir.
- Checkout, cart ve auth semalarinda degisiklik yapmadan once entegrasyon ekibiyle kontrol edilir.
- Para alanlari backend icinde Decimal olarak hesaplanir; API response tarafinda number olarak doner.

## Hata Sozlesmesi

Swagger/OpenAPI sozlesmesinde yaygin hata cevaplari `ProblemDetails` semasi ile dokumante edilir:

- `401` authentication/token hatalari
- `404` kaynak bulunamadi
- `409` stok, bos sepet veya is kurali cakismasi
- `429` rate limit asimi
