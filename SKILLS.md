# Takım Skill ve Agent Rehberi

Bu projede tekrar eden backend + web + mobil entegrasyon kontrolünü otomatikleştirmek için bir skill ve bir uzman agent oluşturuldu.

## `/integration-qa` Skill

Amaç: API sözleşmesi veya istemci kodu değiştiğinde üç katmanı tek seferde doğrulamak ve mock verinin yeniden aktif koda girmesini engellemek.

Çağırma örneği:

```text
/integration-qa ile backend, web ve mobil entegrasyonunu kontrol et.
```

Doğrudan çalışan kontrol:

```bash
bash .claude/skills/integration-qa/scripts/run-integration-qa.sh
```

Ürettiği çıktı OpenAPI tip üretimi ve contract drift kontrolünü, backend pytest sonucunu, web lint/build sonucunu, mobil typecheck/Expo export sonucunu ve gerçek API kullanım kontrolünü içerir.

## `integration-qa` Agent

Amaç: Hızlı testin yanında izole backend, Playwright E2E ve canlı Expo kontrolünü yürüten, hataları API sözleşmesine göre sınıflandıran ayrı bir QA uzmanı sağlamaktır.

Çağırma örneği:

```text
integration-qa agent'ını kullanarak ürün -> sepet -> checkout akışını web ve mobilde doğrula.
```

Agent tanımı: `.claude/agents/integration-qa.md`

## Gerçek Görevde Kullanım

Skill bu entegrasyon çalışmasında kullanıldı. Son doğrulamada 22 backend testi, web lint/build, mobil TypeScript/Expo export, 21 Playwright E2E testi ve mobil canlı checkout akışı kontrol edildi.

Neden işe yaradı: Daha önce farklı klasörlerde elle çalıştırılan kontroller tek ve tekrar kullanılabilir bir kabul kapısına dönüştü. Bir API veya ekran değişikliğinden sonra hangi komutların çalıştırılacağı ekip hafızasına bağlı değil.
