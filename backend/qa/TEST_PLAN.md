# QA Test Plani

## Kapsam

Backend API icin MVP kalitesi: auth, katalog, sepet, checkout, siparis gecmisi, profil/adres ve hata formati.

## Kritik Kullanici Akislari

| ID | Akis | Oncelik | Beklenen Sonuc |
| --- | --- | --- | --- |
| QA-01 | Kullanici kayit olur ve login yapar | P0 | Access/refresh token doner |
| QA-02 | Kullanici urun arar ve kategoriye gore filtreler | P0 | Sayfali urun listesi dogru doner |
| QA-03 | Kullanici urunu sepete ekler, miktar gunceller ve siler | P0 | Sepet toplam tutari dogru hesaplanir |
| QA-04 | Kullanici adres ekler ve checkout yapar | P0 | Siparis paid/simulated status ile olusur |
| QA-05 | Bos sepetle checkout denenir | P0 | 409 Problem Details hatasi doner |
| QA-06 | Yetkisiz kullanici sepet/profil endpointine gider | P0 | 401 Problem Details hatasi doner |
| QA-07 | Stoktan fazla urun sepete eklenir | P1 | 409 hata doner |
| QA-08 | Gecersiz refresh token gonderilir | P1 | 401 hata doner |
| QA-09 | Refresh token tekrar kullanilir | P1 | 401 rotate hatasi doner |
| QA-10 | Sepet urunu guncellenir ve silinir | P1 | Sepet toplam tutari guncellenir |
| QA-11 | Favori eklenir, listelenir ve silinir | P1 | Favori listesi dogru guncellenir |
| QA-12 | Rate limit asilir | P1 | 429 Problem Details doner |
| QA-13 | Meta endpoint cagirilir | P2 | Version ve dokuman linkleri doner |

## Otomasyon

Backend otomasyonu `pytest` ile tutulur.

```bash
cd backend
pytest
```

Test dosyalari:

- `tests/test_auth.py`
- `tests/test_catalog.py`
- `tests/test_cart.py`
- `tests/test_checkout.py`
- `tests/test_e2e_api_flow.py`
- `tests/test_favorites.py`
- `tests/test_meta.py`
- `tests/test_security.py`

## Manuel Smoke Test

1. API'yi calistir.
2. `/docs` sayfasini ac ve Swagger'in yuklendigini kontrol et.
3. Demo kullanici ile login ol.
4. `GET /products` ile seed urunlerini kontrol et.
5. Sepete bir urun ekle.
6. Demo adresi veya yeni adres ile checkout yap.
7. `GET /orders` ile siparisin listelendigini kontrol et.

## Bug Rapor Sablonu

| Alan | Aciklama |
| --- | --- |
| Baslik | Kisa ve davranisi anlatan baslik |
| Ortam | Local/Docker, commit, tarayici veya client |
| Adimlar | Hatayi ureten net adimlar |
| Beklenen | Ne olmaliydi |
| Gerceklesen | Ne oldu |
| Kanit | Ekran goruntusu, log veya response body |
| Severity | Critical/High/Medium/Low |
