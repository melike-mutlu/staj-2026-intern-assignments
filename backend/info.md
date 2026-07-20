1.⁠ ⁠Genel Özet: Neler Yapmalısınız?
E-Ticaret projesinde sizden beklenen temel akış ve isterler şunlardır:

Ekip Bildirimi: İlk iş olarak VB10'un reposunda bir Issue açarak ekibinizi (3 kişi olduğunuzu) ve seçtiğiniz projeyi (E-Ticaret) bildirmelisiniz.
Uçtan Uca Akış (MVP):
Ürün listeleme ve arama.
Sepete ekleme/çıkarma.
Ödeme adımları (Checkout) ve sipariş oluşturma.
Tasarım (Design System): Google Stitch ve Claude kullanarak modern renk, tipografi ve boşluk (spacing) token'ları belirleyip arayüz tasarlamak.
2026 Özel İsteri (AI Agent/Skill): Geliştirme sürecinizde tekrarlayan bir işi (örneğin otomatik test koşturma, PR açıklaması yazma veya API dokümantasyonu üretme) birer custom skill veya agent haline getirmelisiniz.
Test (QA): API testleri ve Playwright/Cypress ile uçtan uca (E2E) UI testleri yazılması.
Teslimat:
Çalışan projenin ekran görüntülerini içeren detaylı bir README.md hazırlamak.
Uygulamanın çalıştığını gösteren, YouTube'a yüklenmiş bir Demo Videosu çekmek.
Projeyi ana repoya fork'layıp submissions/ekip-isminiz şeklinde bir Pull Request (PR) açmak.
2.⁠ ⁠3 Kişilik Takım İçin Rol ve Görev Dağılımı Önerisi
Ekibiniz 3 kişi olduğu için her üyenin birden fazla rolü üstlenmesi (T-Shaped model) gerekecektir. En dengeli dağılım şu şekildedir:

👥 1. Üye: Backend Developer & QA (Veri ve Güvenlik Odaklı)
Roller: Backend + QA + Database Designer
Görevleri:
Veritabanı şemasını tasarlamak (Ürünler, Sepet, Siparişler, Kullanıcılar).
REST API'leri yazmak (Node.js/NestJS, .NET veya Python FastAPI ile).
Kullanıcı yetkilendirmesini (JWT Authentication ve Refresh Token) kurmak.
Backend birim testlerini (Unit Tests) ve API testlerini (Bruno/Postman) hazırlamak.
👥 2. Üye: Frontend Developer & Designer (Kullanıcı Deneyimi Odaklı)
Roller: Frontend + UI/UX Design
Görevleri:
Google Stitch + Figma + Claude yardımıyla tasarım dilini (Design System) belirlemek.
React / Next.js veya Angular kullanarak web arayüzünü kodlamak.
API entegrasyonlarını yapmak ve state management (Zustand, Redux vb.) yapısını kurmak.
Responsive (mobil uyumlu) CSS yazmak ve mikro-animasyonlar eklemek.
👥 3. Üye: Fullstack Developer & PM / DevOps (Entegrasyon ve Süreç Odaklı)
Roller: Fullstack + Project Manager + DevOps & AI Engineer
Görevleri:
GitHub Projects veya Trello üzerinden iş takip board'unu kurmak ve yönetmek (PM).
Frontend ile Backend arasındaki köprüyü kurmak (Entegrasyon).
Playwright veya Cypress ile uçtan uca (E2E) UI testlerini yazmak (QA).
CI/CD pipeline (GitHub Actions) kurarak testlerin otomatik çalışmasını sağlamak.
2026 AI Agent/Skill isterini üstlenip geliştirme sürecini kolaylaştıracak bir tool üretmek.
Son aşamada YouTube demo videosunu kaydetmek ve README dokümantasyonunu tamamlamak.
📅 2 Haftalık Yol Haritası Önerisi
1.⁠ ⁠ve 2. Gün (Hazırlık): Ekip olarak toplanıp teknoloji seçimi yapın (örneğin: NestJS + React + PostgreSQL). GitHub issue'sunu açın ve Trello board'unu hazırlayın.
2.⁠ ⁠ve 4. Gün (Tasarım ve API Tasarımı): UI tasarımlarını Stitch/Figma ile netleştirin. Backend API uçlarını (endpoints) ve veri modellerini sözleşme (contract-first) olarak tanımlayın.
3.⁠ ⁠- 10. Gün (Geliştirme & Test): Backend ve Frontend paralel olarak kodlanır. Her PR'da test yazılmasına özen gösterin.
4.⁠ ⁠- 12. Gün (Entegrasyon & AI Skill): Frontend ve Backend'i birleştirin. Kendi AI Skill/Agent aracınızı yazın.
5.⁠ ⁠- 14. Gün (Cila & Teslimat): Hataları giderin, UI testlerini koşturun, demo videosunu çekin ve PR'ı gönderin!


2026 Ana Proje: E-Ticaret (E-Commerce) Uygulaması
Min. Ekip: 3–4 kişi Takım Yapısı: PM · Design · Backend · Frontend (Web) · Mobil · QA Teknik Seviye: ⭐⭐⭐⭐ Orta–İleri (Uçtan uca, çok takımlı)

Bu yılın amiral gemisi projesi. Geçen sene tek bir alana (login, pet store) odaklanmıştık; bu sene gerçek bir ürünü uçtan uca, tasarımdan teste kadar bir ekip gibi çalışarak çıkaracaksınız. Herkes bir rol üstlenir, kendi alanını sahiplenir ve haftalık olarak entegrasyon yapar.

Proje bir e-ticaret uygulamasıdır: ürün listeleme, arama/filtreleme, ürün detay, sepet, favoriler, checkout (ödeme simülasyonu), sipariş geçmişi ve kullanıcı hesabı.

0.⁠ ⁠Çalışma Modeli (Herkes Okumalı)
Ekip kendi teknoloji stack'ini kendisi seçer. Aşağıdaki ipuçları öneridir, zorunluluk değil. Ama seçiminizin gerekçesini README'de yazın.
Kaynak-doğru geliştirme: Her takım kendi README'sinde "neden bu teknolojiyi seçtim" sorusunu 3-4 cümleyle cevaplar.
Sözleşme (contract) önce gelir: Backend, iş yazmaya başlamadan önce API sözleşmesini (OpenAPI/Swagger) yayınlar. Frontend ve mobil bu sözleşmeye göre mock ile paralel ilerler.
Haftalık ritim:
Hafta 1: Tasarım + API sözleşmesi + iskelet (auth, ürün listesi, detay).
Hafta 2: Sepet + checkout + entegrasyon + testler + demo.
1.⁠ ⁠🎯 PM (Proje Yöneticisi) Rolü
Amaç: Projeyi koordine etmek, kapsamı yönetmek, takımlar arası bağımlılıkları çözmek.

Görevler:

Projeyi epiklere ve story'lere böl (örn: "Kullanıcı ürünleri filtreleyebilir").
Bir board oluştur (GitHub Projects / Trello / Linear). Her story'nin bir sahibi olsun.
Definition of Done (DoD) tanımla: kod merge + test yeşil + demo edilebilir.
Günlük 10 dakikalık stand-up notu tut (kim ne yaptı / engel var mı).
Sprint sonunda demo ve retrospektif yönet.
Teknik İpuçları:

GitHub Projects üzerinde issue → PR bağlantısı kurun (Closes #12).
Her PR bir story'ye referans versin; küçük ve gözden geçirilebilir PR'lar açın.
Riskleri erken görün: "Frontend, Backend'in checkout endpoint'ini bekliyor" → mock ile paralelleştir.
Beklenen Çıktı: Doldurulmuş bir proje board'u, sprint planı, retrospektif notları, ve PM_NOTES.md.

2.⁠ ⁠🎨 Design (Tasarım) Rolü
Amaç: Uygulamanın tüm ekranlarını modern, tutarlı ve uygulanabilir şekilde tasarlamak.

Bu Sene Yeni: AI Destekli Tasarım Akışı

Google Stitch (stitch.withgoogle.com) ile prompt'tan ekran üretin. Örnek prompt:
"A modern e-commerce mobile app. Product grid home page with search bar, category chips, product cards with image/price/rating. Clean, minimal, light theme, accessible."

Claude ile tasarım sistemini planlayın: renk paleti, tipografi ölçeği, spacing token'ları, komponent listesi (Button, Input, ProductCard, Badge, EmptyState...).
Çıktıyı Figma'ya taşıyıp bir design system haline getirin (token'lar + yeniden kullanılabilir komponentler). Figma MCP entegrasyonu ile tasarımdan koda köprü kurabilirsiniz.
Teknik İpuçları:

Önce design token'ları (renk/spacing/radius/tipografi) tanımlayın; her ekran bunları kullansın.
En az şu ekranlar: Ana sayfa (ürün grid), Arama/Filtre, Ürün Detay, Sepet, Checkout, Sipariş Onayı, Profil, Login/Register.
Light + Dark tema düşünün. Erişilebilirlik: renk kontrastı (WCAG AA) ve dokunma hedefi ≥ 44px.
Boş durum (empty state), yükleniyor (skeleton) ve hata durumlarını da tasarlayın — sadece "mutlu yol"u değil.
Beklenen Çıktı: Figma dosyası (design system + tüm ekranlar), token dokümanı, ve Frontend/Mobil'in kullanabileceği bir stil rehberi.

3.⁠ ⁠⚙️ Backend Rolü
Amaç: Frontend ve mobilin ihtiyaç duyduğu tüm veri/servis altyapısını, güvenli ve dokümante bir API olarak sağlamak.

Kapsam (API Kaynakları):

auth — register / login / refresh token (JWT)
products — listeleme (sayfalama + filtre + arama), detay
categories
cart — sepete ekle / çıkar / güncelle
orders — sipariş oluştur (ödeme simülasyonu), sipariş geçmişi
users — profil, adres
Teknik İpuçları (birini seçin):

.NET: ASP.NET Core Web API + EF Core + Clean Architecture.
Node.js: NestJS veya Express + TypeScript + Prisma.
Python: FastAPI + SQLAlchemy/SQLModel.
Go: Gin/Fiber + sqlc/GORM (ileri seviye takım için).
2026 Standartları:

API sözleşmesi önce: OpenAPI 3.1 dokümanını gün 1'de yayınlayın (Swagger UI).
Sayfalama (?page=&size=), filtre (?category=&minPrice=), arama (?q=) standardı belirleyin.
Tutarlı hata formatı (RFC 9457 / Problem Details).
JWT + refresh token; şifreleri bcrypt/argon2 ile hashleyin.
.env ile config; secret'ları repoya koymayın.
Docker ile çalıştırılabilir (docker compose up) hale getirin.
Seed verisi (örnek ürünler) sağlayın ki frontend/mobil boş ekranla uğraşmasın.
Beklenen Çıktı: Swagger ile dokümante, seed'li, Docker ile ayağa kalkan, en az 6 kaynakta CRUD/işlem yapan bir API. Postman/Bruno koleksiyonu paylaşın.

4.⁠ ⁠🌐 Frontend (Web) Rolü
Amaç: Design ekibinin tasarımına sadık, API ile entegre, responsive bir web uygulaması.

Kullanıcı Akışları:

Ürünleri gez → ara/filtrele → detayına bak → sepete ekle → checkout → sipariş onayı.
Login/Register, korumalı sayfalar (profil, siparişlerim).
Teknik İpuçları (birini seçin):

React: Vite veya Next.js (App Router) + TypeScript + TanStack Query + Tailwind + Zustand/Context.
Angular: Angular (standalone components) + Signals + RxJS + Angular Material/Tailwind.
Vue: Nuxt + Pinia.
2026 Standartları:

Sunucu durumu için TanStack Query (veya benzeri): cache, loading/error state ücretsiz gelir.
API tiplerini backend'in OpenAPI'sinden otomatik üretin (openapi-typescript).
Erişilebilirlik (semantic HTML, klavye navigasyonu), skeleton/loading, optimistic UI (sepet).
Environment değişkeni ile API base URL; .env kullanın.
Lighthouse skoru hedefleyin (performance/accessibility).
Beklenen Çıktı: Deploy edilmiş (Vercel/Netlify) veya kolay çalıştırılabilen, tasarıma sadık, API-entegre bir web uygulaması.

5.⁠ ⁠📱 Mobil Rolü
Amaç: iOS + Android'de çalışan, aynı API'yi tüketen bir mobil uygulama.

Teknik İpuçları:

Flutter: Dart + Riverpod/BLoC + Dio + go_router + freezed.
Alternatif: React Native (Expo) + TypeScript.
2026 Standartları:

Katmanlı mimari (data / domain / presentation) — Clean Architecture.
Ağ katmanı için tipli model + serialization (json_serializable/freezed).
State management ile ayrılmış iş mantığı; UI mümkün olduğunca "aptal".
Offline/hata/yükleniyor durumları; token'ı güvenli sakla (secure storage).
E2E test için Maestro kullanılabilir.
Beklenen Çıktı: Emülatörde çalışan, API entegre, en az şu ekranları olan uygulama: liste, detay, sepet, checkout, login.

💡 Tekrar eden işleri (model üretimi, ağ katmanı, ekran iskeleti...) kendi skill'inize dönüştürün — bkz. team_skills_agents.md.

6.⁠ ⁠🧪 QA (Test) Rolü
Amaç: Ürün kalitesini güvence altına almak — sadece "çalışıyor" değil, "doğru çalışıyor".

Görevler:

Test planı yaz: hangi akışlar kritik (checkout!), hangi kenar durumlar var (boş sepet, stok bitti, geçersiz kupon).
Manuel test senaryoları (test case tablosu) + hata raporları (adım/beklenen/gerçekleşen).
Otomasyon:
Backend: API testleri (xUnit/Jest/pytest) + Postman/Newman koleksiyonu.
Web: E2E ile Playwright veya Cypress (kritik akış: ürün → sepet → checkout).
Mobil: Maestro flow'ları.
Regresyon: Her PR öncesi çalışacak bir smoke test seti.
Teknik İpuçları:

Test piramidini düşünün: çok unit, orta entegrasyon, az E2E.
CI'da testleri çalıştırın (GitHub Actions) — PR yeşil değilse merge yok.
Bug'ları GitHub Issues'da şablonla raporlayın (severity/priority).
Beklenen Çıktı: Test planı, test case dokümanı, en az bir kritik akış için otomatik E2E testi, ve CI entegrasyonu.

7.⁠ ⁠Entegrasyon & Teslim Kriterleri (Definition of Done)
 Backend API Swagger ile dokümante ve Docker ile ayağa kalkıyor.
 Web ve Mobil aynı API'yi gerçekten tüketiyor (mock değil).
 Tasarım Figma design system'e dayanıyor; ekranlar tutarlı.
 En az bir kritik akış (ürün → sepet → checkout) uçtan uca çalışıyor.
 QA test planı + otomatik test mevcut, CI yeşil.
 Her takımın README'si var (kurulum + teknoloji gerekçesi + ekran görüntüsü).
 PM board'u dolu; demo ve retrospektif yapıldı.
 Demo videosu çekilip kendi YouTube kanalınızda yayınlandı; link README'de.
 Teslim: repo clone/fork → PR açıldı veya issue ile proje anlatıldı.
 Bonus (bu yıl zorunlu hedef): Her takım kendi geliştirme akışı için en az 1 özel skill/command veya agent üretti — bkz. team_skills_agents.md.