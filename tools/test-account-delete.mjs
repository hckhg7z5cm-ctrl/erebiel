// tools/test-account-delete.mjs
// FAZ 4 (dondur/sil) için SAHTE (gerçek Postgres/Supabase OLMAYAN) bir veritabanı modeliyle test.
// supabase/migrations/0004_dondur_sil.sql'deki üç fonksiyonun MANTIĞINI, gerçek bir Supabase projesine
// dokunmadan doğrular: account_data_counts yetki kontrolü, delete_my_account'un cascade silmesi, silme
// sonrası kalan kayıt SAYISININ (içerik değil) 0 olması, ve run_account_retention_sweep'in "30 gün giriş
// yoksa" kuralı. Gerçek SQL değildir — fonksiyonların davranışını JS'de yeniden üretir; gerçek davranış
// migration Supabase'de çalıştırıldıktan sonra supabase/tests/ altındaki gibi gerçek bir istemciyle de
// doğrulanmalı (bu dosya onun YERİNE geçmez, ondan ÖNCE hızlı bir mantık kontrolüdür).

import assert from "node:assert/strict";

function makeFakeDb() {
  return {
    authUsers: new Map(), // id -> {id, last_sign_in_at}
    profiles: new Map(), // id -> {id, frozen_until}
    sohbetler: new Map(), // id -> {id, user_id}
    mesajlar: new Map(), // id -> {id, user_id, sohbet_id}
    user_memories: new Map(), // id -> {id, user_id}
  };
}

// "on delete cascade references auth.users(id)" davranışının taklidi.
function deleteAuthUser(db, uid) {
  if (!db.authUsers.has(uid)) return;
  db.authUsers.delete(uid);
  db.profiles.delete(uid);
  for (const [k, v] of db.sohbetler) if (v.user_id === uid) db.sohbetler.delete(k);
  for (const [k, v] of db.mesajlar) if (v.user_id === uid) db.mesajlar.delete(k);
  for (const [k, v] of db.user_memories) if (v.user_id === uid) db.user_memories.delete(k);
}

// account_data_counts(target): auth.uid() (callerUid) === target değilse ve service_role değilse reddeder.
function accountDataCounts(db, callerUid, callerIsServiceRole, target) {
  if (!target || (callerUid !== target && !callerIsServiceRole)) throw new Error("not authorized");
  let sohbetler = 0, mesajlar = 0, user_memories = 0;
  for (const v of db.sohbetler.values()) if (v.user_id === target) sohbetler++;
  for (const v of db.mesajlar.values()) if (v.user_id === target) mesajlar++;
  for (const v of db.user_memories.values()) if (v.user_id === target) user_memories++;
  return { profiles: db.profiles.has(target) ? 1 : 0, sohbetler, mesajlar, user_memories };
}

function deleteMyAccount(db, callerUid) {
  if (!callerUid) throw new Error("not authenticated");
  deleteAuthUser(db, callerUid);
}

// run_account_retention_sweep: frozen_until 30+ gün önce geçmiş VE o tarihten sonra giriş yapılmamışsa sil.
function runSweep(db, now) {
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const dead = [];
  for (const p of db.profiles.values()) {
    if (!p.frozen_until) continue;
    if (now - p.frozen_until < THIRTY_DAYS) continue;
    const u = db.authUsers.get(p.id);
    if (u?.last_sign_in_at && u.last_sign_in_at >= p.frozen_until) continue; // frozen_until'dan sonra giriş yaptı
    dead.push(p.id);
  }
  for (const id of dead) deleteAuthUser(db, id);
  return dead;
}

function seedUser(db, id, { frozen_until = null, last_sign_in_at = Date.now() } = {}) {
  db.authUsers.set(id, { id, last_sign_in_at });
  db.profiles.set(id, { id, frozen_until });
}

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("ok  -", name); }
  catch (e) { console.error("FAIL -", name, "\n     ", e.message); process.exitCode = 1; }
}

test("account_data_counts: başka birinin verisini sayamaz", () => {
  const db = makeFakeDb();
  seedUser(db, "alice");
  seedUser(db, "bob");
  assert.throws(() => accountDataCounts(db, "bob", false, "alice"), /not authorized/);
});

test("account_data_counts: kendi verisini sayabilir", () => {
  const db = makeFakeDb();
  seedUser(db, "alice");
  db.sohbetler.set("s1", { id: "s1", user_id: "alice" });
  db.mesajlar.set("m1", { id: "m1", user_id: "alice", sohbet_id: "s1" });
  db.mesajlar.set("m2", { id: "m2", user_id: "alice", sohbet_id: "s1" });
  db.user_memories.set("n1", { id: "n1", user_id: "alice" });
  const counts = accountDataCounts(db, "alice", false, "alice");
  assert.deepEqual(counts, { profiles: 1, sohbetler: 1, mesajlar: 2, user_memories: 1 });
});

test("delete_my_account: cascade ile HER ŞEYİ siler, kalan sayı 0", () => {
  const db = makeFakeDb();
  seedUser(db, "alice");
  seedUser(db, "bob"); // bob'a dokunulmamalı
  db.sohbetler.set("s1", { id: "s1", user_id: "alice" });
  db.mesajlar.set("m1", { id: "m1", user_id: "alice", sohbet_id: "s1" });
  db.user_memories.set("n1", { id: "n1", user_id: "alice" });
  db.sohbetler.set("s2", { id: "s2", user_id: "bob" });

  deleteMyAccount(db, "alice");

  // Silme SONRASI, aynı JWT'yle (auth.uid()==="alice") kalan sayı kontrolü — satır gitti ama JWT hâlâ geçerli.
  const after = accountDataCounts(db, "alice", false, "alice");
  assert.deepEqual(after, { profiles: 0, sohbetler: 0, mesajlar: 0, user_memories: 0 });
  // bob'un verisi dokunulmadan duruyor.
  assert.equal(db.sohbetler.has("s2"), true);
  assert.equal(db.profiles.has("bob"), true);
});

test("delete_my_account: kimliksiz çağrı reddedilir", () => {
  const db = makeFakeDb();
  assert.throws(() => deleteMyAccount(db, null), /not authenticated/);
});

test("sweep: dondurma 30+ gün önce bitmiş ve giriş yoksa siler", () => {
  const db = makeFakeDb();
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  seedUser(db, "stale", { frozen_until: now - 31 * DAY, last_sign_in_at: now - 400 * DAY });
  const dead = runSweep(db, now);
  assert.deepEqual(dead, ["stale"]);
  assert.equal(db.authUsers.has("stale"), false);
});

test("sweep: dondurma süresi henüz 30 günü doldurmadıysa dokunmaz", () => {
  const db = makeFakeDb();
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  seedUser(db, "recent", { frozen_until: now - 10 * DAY, last_sign_in_at: now - 400 * DAY });
  const dead = runSweep(db, now);
  assert.deepEqual(dead, []);
  assert.equal(db.authUsers.has("recent"), true);
});

test("sweep: dondurulduktan SONRA giriş yapan (dondurmayı açmasa bile) silinmez", () => {
  const db = makeFakeDb();
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  const frozenAt = now - 40 * DAY;
  seedUser(db, "cameBack", { frozen_until: frozenAt, last_sign_in_at: frozenAt + 5 * DAY });
  const dead = runSweep(db, now);
  assert.deepEqual(dead, []);
  assert.equal(db.authUsers.has("cameBack"), true);
});

test("sweep: hiç dondurulmamış hesaba dokunmaz", () => {
  const db = makeFakeDb();
  seedUser(db, "normal", { frozen_until: null });
  const dead = runSweep(db, Date.now());
  assert.deepEqual(dead, []);
});

console.log(`\n${passed} test geçti.`);
if (process.exitCode) { console.error("BAŞARISIZ test(ler) var."); process.exit(1); }
