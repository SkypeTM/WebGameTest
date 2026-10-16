import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.QA_BASE_URL || "http://localhost:3000";
const account = JSON.parse(
  await fs.readFile(
    `storage/qa-${new URL(base).hostname === "localhost" ? "local" : "live"}-account.json`,
    "utf8",
  ),
);
async function login() {
  const r = await fetch(base + "/api/auth/sign-in/email", {
    method: "POST",
    headers: { "content-type": "application/json", origin: base },
    body: JSON.stringify({ email: account.email, password: account.password }),
  });
  assert.equal(r.status, 200);
  return r.headers
    .getSetCookie()
    .map((v) => v.split(";")[0])
    .join("; ");
}
const a = await login(),
  b = await login();
async function call(cookie, patch, origin = base) {
  return fetch(base + "/api/preferences", {
    method: patch ? "PATCH" : "GET",
    headers: { cookie, origin, "content-type": "application/json" },
    body: patch ? JSON.stringify(patch) : undefined,
  });
}
const initial = await call(a);
assert.equal(initial.status, 200);
const before = await initial.json();
try {
  assert.equal((await call("", undefined)).status, 401);
  assert.equal(
    (await call(a, { music: false }, "https://example.invalid")).status,
    403,
  );
  assert.equal((await call(a, { musicVolume: 2 })).status, 400);
  assert.equal(
    (await call(a, { music: false, sfx: false, musicVolume: 0 })).status,
    200,
  );
  const other = await (await call(b)).json();
  assert.equal(other.audio.music, false);
  assert.equal(other.audio.sfx, false);
  assert.equal(other.audio.musicVolume, 0);
  const results = await Promise.all([
    call(a, { musicVolume: 0.35 }),
    call(b, { sfxVolume: 0.55 }),
  ]);
  results.forEach((r) => assert.equal(r.status, 200));
  const latest = await (await call(await login())).json();
  assert.equal(latest.audio.musicVolume, 0.35);
  assert.equal(latest.audio.sfxVolume, 0.55);
  assert.equal(latest.audio.music, false);
  console.log(
    "PASS: auth/origin/input validation, two sessions, mute persistence, partial merge, re-login",
  );
} finally {
  assert.equal((await call(a, before.audio)).status, 200);
}
