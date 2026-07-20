# Backend + QA Yol Haritasi

Bu dokuman 9 gunluk ekip planinda bizim sorumlulugumuzu netlestirir: Backend API, Swagger sozlesmesi, seed veri, Docker, otomatik API testleri, sistem QA dokumani ve CI.

## Rolumuz

Backend + Test/QA uyesi olarak amacimiz frontend ve mobil ekibinin guvenle tuketecegi, dokumante ve testlerle korunan bir API saglamaktir.

## Gunluk Faz Plani

| Gun | Faz | Backend Ciktisi | QA Ciktisi |
| --- | --- | --- | --- |
| 1 | Sozlesme ve iskelet | FastAPI proje yapisi, Swagger/OpenAPI, temel modeller | Kritik akis listesi |
| 2 | Auth ve katalog | Register, login, refresh token, product/category endpointleri | Auth ve katalog API testleri |
| 3 | Sepet | Cart add/update/delete/clear endpointleri | Sepet edge-case testleri |
| 4 | Checkout | Siparis olusturma, stok dusme, siparis gecmisi | Checkout happy path ve empty cart testleri |
| 5 | Profil/adres | Profil ve adres CRUD | Yetki ve validation testleri |
| 6 | Docker ve seed | Dockerfile, compose, demo kullanici, seed urunler | Manuel smoke test listesi |
| 7 | Entegrasyon | Frontend/mobil icin API notlari, CORS, Postman koleksiyonu | Entegrasyon hata raporlari |
| 8 | CI ve regresyon | GitHub Actions backend test workflow | PR oncesi smoke test seti |
| 9 | Teslim | README, endpoint listesi, demo hazirligi | Test raporu ve QA kapanis kontrolu |

## Backend Definition of Done

- API Swagger UI uzerinden gorulebilir.
- OpenAPI JSON frontend/mobil tarafina verilebilir.
- Tum endpointler tutarli path yapisi kullanir: `/api/v1/...`.
- JWT access token ve refresh token calisir.
- Refresh token rotate edilir.
- Sifreler hashlenir, repoya secret yazilmaz.
- Favoriler API'si auth ile korunur.
- Rate limit asiminda 429 Problem Details doner.
- Para hesaplamalari Decimal ile yapilir.
- Schema degisiklikleri Alembic migration altyapisiyla takip edilebilir.
- Seed veriyle urun listesi bos gelmez.
- Docker ile calistirilabilir.
- API testleri lokal ve CI ortaminda gecer.

## QA Definition of Done

- Kritik akislari kapsayan otomatik API testleri vardir.
- Bos sepet, yetkisiz istek, stok asimi gibi hata senaryolari test edilir.
- Hatalar `application/problem+json` formatinda doner.
- Manuel smoke test adimlari yazilidir.
- Postman koleksiyonu paylasilmistir.
- PR acilmadan once `pytest` calistirilir.

## Frontend ve Mobil Ekibine Verilecek Bilgiler

- API base URL: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`
- Demo kullanici: `demo@eticaret.com` / `DemoPass123`
- Auth header: `Authorization: Bearer <access_token>`

## Kritik Akis

1. Kullanici register/login olur.
2. Urun listesi ve detay sayfasi API'den cekilir.
3. Kullanici urunu sepete ekler.
4. Kullanici adres olusturur veya mevcut adresini kullanir.
5. Checkout istegi gonderilir.
6. Siparis olusur, sepet bosalir, stok azalir.
7. Siparis gecmisi listelenir.

Bu akis demo videosunda mutlaka gosterilmelidir.
