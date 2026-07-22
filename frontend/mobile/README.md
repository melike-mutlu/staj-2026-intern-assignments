# SHOP Mobil Uygulaması

Expo Router + React Native ile iOS, Android ve web üzerinde çalışan e-ticaret istemcisidir. Ürün, kullanıcı, sepet, adres ve sipariş verileri mock dosyadan değil FastAPI backend'inden gelir.

## Özellikler

- Gerçek API'den ürün listesi, kategori filtresi, arama ve ürün detayı
- Login, register, güvenli oturum saklama ve otomatik refresh token
- Sunucu taraflı sepet, miktar/stok kontrolü
- Adres seçme veya yeni adres oluşturma
- Simülasyon ödeme ile checkout ve sipariş onayı
- Sipariş geçmişi ve çıkış
- Yükleniyor, boş liste ve hata durumları

## Kurulum

Önce backend'i repo kökünden başlatın:

```bash
cd backend
cp .env.example .env
docker compose up --build
```

Sonra mobil bağımlılıklarını kurun:

```bash
cd frontend/mobile
npm ci
cp .env.example .env.local
npm start
```

Expo terminalinden `i` ile iOS, `a` ile Android, `w` ile web açılabilir.

## API Adresi

`EXPO_PUBLIC_API_BASE_URL` hem `http://...:8000` hem de `http://...:8000/api/v1` kabul eder. İstemci `/api/v1` bölümünü otomatik tamamlar.

| Çalışma ortamı | Örnek değer |
| --- | --- |
| iOS Simulator / Expo Web | `http://localhost:8000` |
| Android Emulator | `http://10.0.2.2:8000` |
| Gerçek telefon | `http://BILGISAYARIN_YEREL_IP_ADRESI:8000` |

Gerçek telefonda bilgisayar ve telefon aynı Wi-Fi ağına bağlı olmalı. Backend ağdan erişilebilir şekilde çalışmalı ve güvenlik duvarı 8000 portuna izin vermelidir.

## Demo Hesabı

```text
E-posta: demo@eticaret.com
Şifre: DemoPass123
```

Demo kullanıcının checkout için hazır bir teslimat adresi vardır.

## Kritik Akış

1. Ana sayfada API'den gelen ürünü açın.
2. Giriş yapın.
3. Ürünü sepete ekleyin.
4. Sepetten ödeme ekranına geçin.
5. Kayıtlı adresi seçin veya yeni adres ekleyin.
6. `Siparişi tamamla` ile simülasyon siparişi oluşturun.
7. Sipariş onayını ve Hesabım sayfasındaki sipariş geçmişini kontrol edin.

## Kalite Kontrolleri

```bash
npx tsc --noEmit
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000 npx expo export --platform web
```

Tüm proje için ortak kontrol repo kökünde çalıştırılır:

```bash
bash .claude/skills/integration-qa/scripts/run-integration-qa.sh
```

## Klasör Yapısı

| Klasör | Sorumluluk |
| --- | --- |
| `src/app` | Expo Router ekranları |
| `src/services` | FastAPI istekleri ve token yenileme |
| `src/stores` | Oturum durumu |
| `src/lib` | Güvenli saklama ve React Query ayarları |
| `src/components` | Ortak UI ve ürün bileşenleri |
| `src/types` | API veri tipleri |
