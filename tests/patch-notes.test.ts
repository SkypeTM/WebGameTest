import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

test("public patch archive mirrors tracked patch files in descending order", () => {
  const notes = JSON.parse(
    readFileSync("public/updates/patch-notes.json", "utf8"),
  ) as { id: string; title: string; body: string; source: string }[];
  const files = execFileSync("git", ["ls-files", "PATCH_HISTORY"], {
    encoding: "utf8",
  })
    .trim()
    .split(/\r?\n/)
    .filter((file) => /^PATCH_HISTORY\/\d{3}-[^/]+\.md$/.test(file));
  assert.equal(notes.length, files.length);
  assert.equal(new Set(notes.map((note) => note.source)).size, notes.length);
  for (const [i, note] of notes.entries()) {
    assert.ok(note.title && note.body);
    assert.ok(i === 0 || notes[i - 1].id >= note.id);
    const file = note.source.replace(
      "https://github.com/SkypeTM/WebGameTest/blob/main/",
      "",
    );
    assert.ok(files.includes(file), "untracked drafts must not be published");
    assert.equal(
      note.body,
      readFileSync(file, "utf8")
        .replace(/^\uFEFF/, "")
        .trim(),
    );
  }
});
