// tools/verify-protected-chat.mjs
// api/chat.js içindeki kriz/güvenlik ve dil kuralı bölümlerinin birebir aynı kaldığını
// doğrular. Bu bölümler asla değiştirilmemeli (kullanıcı talimatı); yalnızca etraflarına
// yeni, katkılı mantık (örn. yaş katmanına göre ek metin) eklenebilir.
//
// Kullanım:
//   node tools/verify-protected-chat.mjs save   -> şu anki içerikten taban (baseline) kaydeder
//   node tools/verify-protected-chat.mjs check  -> taban ile şu anki içeriği karşılaştırır
//
// "save" sadece BİR KERE, bu bölümlere dokunulmadığı bilinen bir anda çalıştırılmalı
// (ilk çalıştırma: FAZ 6'dan önce, 2026-11-10 gecesi). Sonraki her chat.js değişikliğinden
// sonra "check" çalıştırılır.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHAT_PATH = path.join(__dirname, "..", "api", "chat.js");
const BASELINE_PATH = path.join(__dirname, "protected-chat-baseline.json");

// Her blok, sabit bir const tanımının gövdesini (template literal dahil) ya da adı verilen
// fonksiyonun tam gövdesini, kaynak metinden regex ile çıkarır. Satır numarasına değil, içeriğe
// bağlı olduğu için dosyanın başka yerine eklenen/silinen satırlar bu kontrolü bozmaz.
const BLOCKS = {
  CRISIS_GUIDE: /const CRISIS_GUIDE = `[\s\S]*?`;/,
  CRISIS_CONDUCT: /const CRISIS_CONDUCT = `[\s\S]*?`;/,
  COMMON: /const COMMON = `[\s\S]*?`;/,
  ARCHON_SAFETY: /GÜVENLİK \(HER ŞEYİN ÜSTÜNDE\):\n- Kişi kendine zarardan, intihardan, umutsuzluktan[\s\S]*?\$\{CRISIS_GUIDE\}/,
  MULTIVAC_SAFETY: /GÜVENLİK \(HER ŞEYİN ÜSTÜNDE\):\n- Kişi kendine zarardan, intihardan ya da bir krizden söz ederse: önce insanı[\s\S]*?\$\{CRISIS_GUIDE\}/,
  MIRROR_SAFETY: /GÜVENLİK \(HER ŞEYİN ÜSTÜNDE\):\n- Kendine zarar, intihar ya da kriz sinyali varsa[\s\S]*?\$\{CRISIS_GUIDE\}/,
  CRISIS_HINT: /const CRISIS_HINT = \/[\s\S]*?\/i;/,
  pickThinking: /function pickThinking\([\s\S]*?\n\}/,
  systemBlocks: /function systemBlocks\([\s\S]*?\n\}/,
};

function extract(src) {
  const out = {};
  for (const [name, re] of Object.entries(BLOCKS)) {
    const m = src.match(re);
    if (!m) { out[name] = null; continue; }
    out[name] = createHash("sha256").update(m[0]).digest("hex");
  }
  return out;
}

function main() {
  const mode = process.argv[2];
  const src = readFileSync(CHAT_PATH, "utf8");
  const current = extract(src);

  if (mode === "save") {
    for (const [name, hash] of Object.entries(current)) {
      if (hash === null) { console.error(`UYARI: "${name}" bloğu bulunamadı, taban KAYDEDİLMEDİ.`); process.exit(1); }
    }
    writeFileSync(BASELINE_PATH, JSON.stringify(current, null, 2) + "\n");
    console.log("Taban kaydedildi:", BASELINE_PATH);
    return;
  }

  if (mode === "check") {
    if (!existsSync(BASELINE_PATH)) { console.error("Taban yok. Önce: node tools/verify-protected-chat.mjs save"); process.exit(1); }
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
    let ok = true;
    for (const name of Object.keys(BLOCKS)) {
      if (baseline[name] === undefined) { console.error(`UYARI: taban dosyasında "${name}" yok.`); ok = false; continue; }
      if (current[name] === null) { console.error(`HATA: "${name}" bloğu artık bulunamıyor (silinmiş/çok değişmiş olabilir).`); ok = false; continue; }
      if (current[name] !== baseline[name]) { console.error(`HATA: "${name}" bloğu değişti — kriz/güvenlik/dil kuralı birebir aynı kalmalıydı.`); ok = false; }
    }
    if (ok) { console.log("OK: tüm korumalı bloklar birebir aynı."); return; }
    process.exit(1);
  }

  console.error("Kullanım: node tools/verify-protected-chat.mjs save|check");
  process.exit(1);
}

main();
