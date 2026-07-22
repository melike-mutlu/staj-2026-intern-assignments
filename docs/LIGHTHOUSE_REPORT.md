# Lighthouse Raporu

Bu rapor 22 Temmuz 2026 tarihinde Lighthouse `13.4.1` ile, Vite production build ve seed edilmiş gerçek FastAPI backend'i kullanılarak oluşturuldu. Ölçüm URL'si yerel production preview olan `http://127.0.0.1:4173/` adresidir.

## Sonuçlar

| Profil | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobil | 90 | 100 | 100 | 100 |
| Masaüstü | 100 | 100 | 100 | 100 |

| Profil | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: |
| Mobil | 1.8 s | 3.4 s | 0 ms | 0 |
| Masaüstü | 0.4 s | 0.8 s | 0 ms | 0 |

## Yapılan İyileştirmeler

- Google Fonts ağ bağımlılığı kaldırıldı ve sistem font zinciri kullanıldı.
- Unsplash ürün görsellerine boyut, sıkıştırma ve modern format parametreleri eklendi.
- İlk görünümdeki ürün görsellerine yükleme önceliği; ekran altındakilere lazy loading eklendi.
- Suspense yükleme alanının yüksekliği sabitlenerek footer kaynaklı layout shift giderildi.
- Başlık sırası, footer kontrastı, sayfa dili, meta description ve `robots.txt` düzeltildi.
- Lighthouse production preview portu örnek backend CORS listesine eklendi.

## Rapor Dosyaları

- [Mobil HTML raporu](./lighthouse/web-mobile.report.html)
- [Mobil JSON raporu](./lighthouse/web-mobile.report.json)
- [Masaüstü HTML raporu](./lighthouse/web-desktop.report.html)
- [Masaüstü JSON raporu](./lighthouse/web-desktop.report.json)

Skorlar ağ ve donanım koşullarına göre birkaç puan değişebilir. Commit edilen JSON dosyaları yukarıdaki tablonun doğrulanabilir ham çıktısıdır.

## Yeniden Çalıştırma

Önce backend'i başlatın, ardından web production build ve preview çalıştırın:

```bash
cd frontend/web
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1 npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Başka bir terminalde:

```bash
npx --yes lighthouse@13.4.1 http://127.0.0.1:4173/ \
  --output=html --output=json \
  --output-path=docs/lighthouse/web-mobile \
  --only-categories=performance,accessibility,best-practices,seo
```

Masaüstü ölçümü için aynı komuta `--preset=desktop` ekleyin.
