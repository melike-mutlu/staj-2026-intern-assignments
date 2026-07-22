# PR Başlığı

`feat: deliver full-stack e-commerce app with automated QA`

# PR Açıklaması

## Özet

Bu PR, FastAPI backend'i gerçek olarak tüketen React web ve Expo mobil e-ticaret uygulamasını uçtan uca tamamlar. Ürün, arama/filtre, auth, favori, sepet, adres, simülasyon checkout ve sipariş geçmişi akışları seed edilmiş ortak API'ye bağlıdır.

## Öne Çıkanlar

- Swagger/OpenAPI 3.1, Problem Details hata formatı, JWT refresh, rate limit ve Docker desteği
- Web ve mobilde gerçek API entegrasyonu; aktif kodda mock veri bulunmaması
- `openapi-typescript` ile web ve mobil tip üretimi ve CI contract drift kontrolü
- Pytest backend paketi, Playwright kritik akış E2E'leri ve Expo smoke/type/export kontrolleri
- Integration QA skill ve uzman agent tanımı
- Mobil 90, masaüstü 100 Lighthouse performance; her iki profilde accessibility/best-practices/SEO 100
- Backend, frontend handoff, QA, güvenlik, PM ve teslim dokümantasyonu

## Doğrulama

```bash
bash .claude/skills/integration-qa/scripts/run-integration-qa.sh
```

Bu kapı OpenAPI tip üretimi, backend testleri, web lint/build, mobil TypeScript/Expo export ve mock guard kontrollerini çalıştırır. İzole Playwright E2E paketi ürün -> sepet -> checkout dahil kritik akışları doğrular.

## Kanıtlar

- Ekran görüntüleri ve kurulum: `README.md`
- Lighthouse: `docs/LIGHTHOUSE_REPORT.md`
- QA raporu: `backend/qa/TEST_REPORT.md`
- PM board/retrospektif: `PM_NOTES.md`
- Skill/agent: `SKILLS.md`

## Teslim Öncesi Takım Aksiyonları

- [ ] Figma design system paylaşım bağlantısını ekle
- [ ] YouTube demo videosunu yayınla ve README/PR'a ekle

Teknik kapsam, otomasyon, belgeler ve upstream PR teslimi tamamlanmıştır; yukarıdaki iki bağlantı ekip sahipleri tarafından sağlanacaktır.
