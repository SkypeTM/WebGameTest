import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { parseAudioPatch } from "../lib/audio-preferences";
test("audio settings reject invalid inputs while preserving zero volume and mute", () => {
  assert.deepEqual(parseAudioPatch({ music: false, sfxVolume: 0 }), {
    music: false,
    sfxVolume: 0,
  });
  for (const input of [
    null,
    [],
    { music: "false" },
    { sfxVolume: 1.1 },
    { musicVolume: -1 },
    { musicVolume: NaN },
    { account_id: "other" },
  ])
    assert.throws(() => parseAudioPatch(input));
});
test("account settings merge individual device edits without touching another account", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(
    "CREATE TABLE user(id TEXT PRIMARY KEY); INSERT INTO user VALUES('a'),('b');",
  );
  db.exec(readFileSync("migrations/0002_account_preferences.sql", "utf8"));
  const save = db.prepare(
    "INSERT INTO account_preferences(account_id,audio,updated_at) VALUES(?,?,?) ON CONFLICT(account_id) DO UPDATE SET audio=json_patch(account_preferences.audio,excluded.audio),updated_at=excluded.updated_at",
  );
  save.run("a", JSON.stringify({ music: false, musicVolume: 0 }), "1");
  save.run("b", JSON.stringify({ music: true }), "1");
  save.run("a", JSON.stringify({ sfx: false }), "2");
  const get = (id: string) =>
    JSON.parse(
      (
        db
          .prepare("SELECT audio FROM account_preferences WHERE account_id=?")
          .get(id) as { audio: string }
      ).audio,
    );
  assert.deepEqual(get("a"), { music: false, musicVolume: 0, sfx: false });
  assert.deepEqual(get("b"), { music: true });
  db.close();
});
