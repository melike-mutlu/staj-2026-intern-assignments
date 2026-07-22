# PM Notları

## Takım ve Sorumluluklar

| Rol | Ana sorumluluk |
| --- | --- |
| PM + Design + Fullstack | Kapsam, tasarım sistemi, bileşen desteği ve ekip koordinasyonu |
| Backend + QA | FastAPI, veri modeli, Swagger/OpenAPI, Docker, güvenlik, otomatik test ve CI |
| Web + Mobil | React web ve Expo mobil ekranları, state yönetimi ve gerçek API entegrasyonu |

## Sprint Hedefi

Seed edilmiş tek backend'i kullanan web ve mobil istemcilerde ürün listeleme, giriş, favoriler, sepet, checkout ve sipariş akışlarını çalışır hale getirmek; sistemi otomatik test, CI, Docker, dokümantasyon ve özel QA agent'ı ile teslim etmektir.

## Dokuz Günlük Plan ve Durum Board'u

| Faz | Çıktı | Sahip | Durum |
| --- | --- | --- | --- |
| 1. Kapsam | Story'ler, API kaynakları, Definition of Done | PM + tüm ekip | Tamamlandı |
| 2. Tasarım | Token'lar, ortak bileşenler, web/mobil ekran akışları | Design + frontend | Kod tarafı tamamlandı; Figma linki beklenecek |
| 3. Contract | OpenAPI 3.1, Swagger, hata formatı, Postman koleksiyonu | Backend + QA | Tamamlandı |
| 4. Backend | Auth, ürün, kategori, favori, sepet, adres, sipariş, health/version | Backend + QA | Tamamlandı |
| 5. Web | Responsive ekranlar ve gerçek API entegrasyonu | Web + fullstack | Tamamlandı |
| 6. Mobil | Expo ekranları ve gerçek API entegrasyonu | Mobil + fullstack | Tamamlandı |
| 7. QA | Pytest, Playwright E2E, mobil smoke, contract drift, Docker | Backend + QA | Tamamlandı |
| 8. Kalite | Lighthouse, güvenlik/rate-limit dokümanı, performans | Backend + QA | Tamamlandı |
| 9. Teslim | README, ekran görüntüleri, PR, demo ve retrospektif | PM + tüm ekip | PR ve belgeler tamamlandı; video linki beklenecek |

Takip edilen işler: [GitHub Issues](https://github.com/melike-mutlu/staj-2026-intern-assignments/issues). Teslim PR'ı: [upstream PR #34](https://github.com/VB10/staj-2026-intern-assignments/pull/34).

## Definition of Done

Bir iş; kodu tamamlanmış, OpenAPI sözleşmesiyle uyumlu, ilgili otomatik kontrolleri yeşil, mock yerine gerçek API ile doğrulanmış ve README/handoff belgesi güncel olduğunda tamamlanmış sayılır. Kullanıcı akışı değişikliklerinde en az bir hata veya boş durum da kontrol edilir.

## Stand-up Özeti

| Gün | Tamamlanan | Engel / karar |
| --- | --- | --- |
| 1-2 | Tasarım token'ları, web ve mobil iskeletleri | Ortak TypeScript ve gerçek API sözleşmesi kullanılmasına karar verildi |
| 3-4 | FastAPI kaynakları, JWT, seed, Swagger ve Docker | Checkout yalnızca `simulation` ödeme yöntemini kabul edecek şekilde sınırlandı |
| 5-6 | Web/mobil auth, ürün, favori, sepet ve checkout entegrasyonu | Tek demo kullanıcı ve seed adresi kritik akışı hızlandırdı |
| 7 | Backend ve Playwright testleri, mobil smoke kontrolleri | E2E için ayrı `e2e.db` kullanılarak test verisi izole edildi |
| 8 | OpenAPI tip üretimi, CI contract kontrolü, Lighthouse düzeltmeleri | Unsplash görselleri küçültüldü; layout shift sıfırlandı |
| 9 | README'ler, ekran görüntüleri, PR metni, retrospektif | Figma ve YouTube bağlantıları ekipten beklenecek |

## Riskler ve Kararlar

| Risk | Önlem |
| --- | --- |
| Web ve mobil modellerinin API'den kopması | `openapi-typescript` üretimi ve CI drift kontrolü |
| Testlerin geliştirme verisini bozması | Ayrı E2E veritabanı ve reset scripti |
| Gerçek kart verisinin yanlışlıkla işlenmesi | Kart alanları yalnızca istemcide doğrulanır; API sadece `simulation` alır |
| Hızlı otomasyonun rate limit'e takılması | Test ortamında limit yükseltilir; production varsayılanı korunur |
| Büyük dış görsellerin web'i yavaşlatması | Responsive Unsplash parametreleri, priority ve lazy loading |

## Retrospektif

İyi gidenler: API sözleşmesinin erken sabitlenmesi web ve mobilin paralel ilerlemesini sağladı. Ortak integration-qa skill'i dağınık kontrolleri tek kabul kapısında birleştirdi. İzole veritabanı E2E sonuçlarını tekrarlanabilir hale getirdi.

Geliştirilecekler: Figma bağlantısı ve demo videosu teknik teslimle aynı gün beklenmeden daha erken hazırlanmalı. Issue'lar küçük PR'lara daha düzenli bağlanmalı. Mobil native E2E için sonraki iterasyonda Maestro eklenebilir.

Sonraki aksiyonlar: ekip Figma paylaşım URL'sini ve YouTube demo URL'sini README ile upstream PR'a ekleyecek; PM demo toplantısında web ve mobil checkout ile `/integration-qa` akışını canlı gösterecek.
