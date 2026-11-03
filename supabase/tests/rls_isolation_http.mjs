// supabase/tests/rls_isolation_http.mjs
// PLAN B: gerçek Supabase anahtarların VARSA, aynı testi gerçek HTTP istekleriyle (iki gerçek kullanıcı
// token'ıyla) tekrarlar. Anahtarın yoksa bunu atla, rls_isolation.sql yeterli (API anahtarı istemez).
//
// Kullanım:
//   1) İki gerçek test hesabı aç (uygulamanın kendi kayıt ekranından, ya da aşağıdaki gibi doğrudan Auth API'siyle).
//   2) SUPABASE_URL ve SUPABASE_ANON_KEY'i ortam değişkeni olarak ver (.env.local'daki aynı değerler).
//   3) node supabase/tests/rls_isolation_http.mjs
//
// Script, iki e-posta/şifre ile signUp+signIn yapar (yoksa oluşturur), sonra A'nın token'ıyla bir sohbet açar,
// B'nin token'ıyla aynı sohbeti okumaya/mesaj eklemeye çalışır — hiçbiri görünmemeli/eklenememeli.
// NOT: Supabase projende "confirm email" açıksa signUp sonrası e-posta doğrulanana kadar signIn başarısız
// olur; test projesinde bu ayarı kapatman (ya da gerçek bir gelen kutusuyla doğrulaman) gerekir.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("SUPABASE_URL / SUPABASE_ANON_KEY yok — bu test atlanıyor (rls_isolation.sql'i SQL Editor'de çalıştır).");
  process.exit(0);
}

const rand = Math.random().toString(36).slice(2, 8);
const USER_A = { email: `rls-test-a-${rand}@example.com`, password: "rls-test-not-a-real-password", username: `rlsa${rand}`, birth_year: 1990 };
const USER_B = { email: `rls-test-b-${rand}@example.com`, password: "rls-test-not-a-real-password", username: `rlsb${rand}`, birth_year: 1990 };

async function signUpAndIn(u) {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  const { error: suError } = await client.auth.signUp({ email: u.email, password: u.password, options: { data: { username: u.username, birth_year: u.birth_year } } });
  if (suError) throw new Error(`signUp (${u.email}) başarısız: ${suError.message}`);
  const { data, error: siError } = await client.auth.signInWithPassword({ email: u.email, password: u.password });
  if (siError) throw new Error(`signIn (${u.email}) başarısız — e-posta doğrulaması açık olabilir: ${siError.message}`);
  const authed = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { headers: { Authorization: `Bearer ${data.session.access_token}` } }, auth: { persistSession: false } });
  return { client: authed, userId: data.user.id };
}

let failed = false;
function check(name, cond) { console.log(cond ? "OK  " : "FAIL", name); if (!cond) failed = true; }

const { client: a, userId: userIdA } = await signUpAndIn(USER_A);
const { client: b, userId: userIdB } = await signUpAndIn(USER_B);

// user_id'yi açıkça auth.uid() ile AYNI yazıyoruz: RLS'nin with check'i (auth.uid() = user_id) ancak böyle
// geçer — tıpkı api/_supabase.js'deki saveTurnPg'nin gerçek kodda yaptığı gibi.
const { data: sohbet, error: insErr } = await a.from("sohbetler").insert({ user_id: userIdA, persona: "archon", title: "A'nın sohbeti" }).select("id").single();
check("A sohbet açabildi", !insErr && sohbet?.id);
const sohbetId = sohbet?.id;

const { data: bSeesIt } = await b.from("sohbetler").select("id").eq("id", sohbetId);
check("B, A'nın sohbetini GÖREMİYOR", !bSeesIt || bSeesIt.length === 0);

// B kendi user_id'siyle (auth.uid()=user_id, with check'in BİRİNCİ şartı geçer) ama A'nın sohbetine
// (EXISTS...sohbetler.user_id=auth.uid() şartı B için YANLIŞ) mesaj eklemeye çalışıyor — bu reddedilmeli.
const { error: bInsertErr } = await b.from("mesajlar").insert({ sohbet_id: sohbetId, user_id: userIdB, role: "user", content: "sizma-denemesi" });
check("B, A'nın sohbetine mesaj EKLEYEMİYOR", Boolean(bInsertErr));

const { data: aSeesOwn } = await a.from("sohbetler").select("id").eq("id", sohbetId);
check("A kendi sohbetini görebiliyor (pozitif kontrol)", aSeesOwn?.length === 1);

// temizlik
await a.from("sohbetler").delete().eq("id", sohbetId);

console.log(failed ? "\nSONUÇ: BAZI KONTROLLER BAŞARISIZ" : "\nSONUÇ: HEPSİ GEÇTİ");
process.exit(failed ? 1 : 0);
