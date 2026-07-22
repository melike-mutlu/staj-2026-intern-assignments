---
name: integration-qa
description: Backend, web ve Expo mobil istemcisinin aynı gerçek API sözleşmesini kullandığını doğrular. API entegrasyonu eklendiğinde, endpoint veya OpenAPI sözleşmesi değiştiğinde, kritik alışveriş akışı güncellendiğinde ve PR öncesi regresyon kontrolü istendiğinde kullan.
---

# Integration QA

Backend, web ve mobil katmanlarını tek teslimat olarak denetle. Mock verinin aktif uygulama koduna geri dönmesini, API sözleşmesi uyuşmazlıklarını ve kritik akış regresyonlarını erken yakala.

## Hızlı doğrulama

1. Repo kökünde bağımlılıkların kurulu olduğunu kontrol et.
2. `bash .claude/skills/integration-qa/scripts/run-integration-qa.sh` komutunu çalıştır.
3. İlk hata noktasında dur, çıktıyı ilgili katmana göre sınıflandır ve kök nedeni düzelt.
4. Script tamamen geçene kadar yeniden çalıştır.

Script şu kontrolleri sırayla yapar:

- Backend `pytest` paketi.
- Web lint ve production build.
- Mobil TypeScript kontrolü ve Expo web export.
- Web ve mobil çalışma kodunda mock ürün importu bulunmaması.

## Tam E2E doğrulama

Hızlı doğrulama geçtikten sonra izole test veritabanıyla backend ve web sunucularını başlat. Rate limit davranışı pytest ile ayrıca doğrulandığı için tam tarayıcı paketinde `RATE_LIMIT_REQUESTS=10000` kullan. `frontend/web` içinde `npm run test:e2e` çalıştır ve servisleri her durumda kapat.

Mobil için Expo web önizlemesini gerçek test API adresiyle aç. Şu akışı canlı doğrula:

1. Ürün listesinin API'den gelmesi.
2. Ürün detayının açılması.
3. Demo kullanıcıyla giriş.
4. Ürünü sepete ekleme.
5. Kayıtlı adresle checkout.
6. Sipariş onayının görünmesi.
7. Tarayıcı konsolunda hata olmaması.

## Sözleşme kontrolü

- Web base URL'sinin `/api/v1` ile bittiğini doğrula.
- Mobil base URL'sinin hem API kökünü hem `/api/v1` içeren değeri normalize ettiğini doğrula.
- 401 cevabında refresh token rotasyonunun iki istemcide de oturumu güncellediğini kontrol et.
- Sepet, adres ve sipariş istek alanlarını `backend/openapi.json` ile karşılaştır.
- Kart verisinin backend'e gönderilmediğini doğrula; yalnızca `payment_method: "simulation"` gönder.

## Raporlama

Sonucu katman, komut, test sayısı ve durum içeren kısa bir tabloyla raporla. Başarısızlık varsa ilk kök nedeni, etkilenen akışı ve yeniden üretme adımını yaz. Geçen kontrolleri yalnızca gerçek komut çıktısına dayanarak PASS işaretle.
