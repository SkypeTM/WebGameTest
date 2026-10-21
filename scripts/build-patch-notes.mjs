import { execFileSync } from "node:child_process";
import { readFile, mkdir, writeFile } from "node:fs/promises";

// Only version-controlled patch documents are public; never scan local drafts.
const tracked = execFileSync("git", ["ls-files", "PATCH_HISTORY"], {
  encoding: "utf8",
})
  .trim()
  .split(/\r?\n/);
const files = [...new Set(tracked)].filter((file) =>
  /^PATCH_HISTORY\/\d{3}-[^/]+\.md$/.test(file),
);
const notes = await Promise.all(
  files.map(async (file) => {
    const body = (await readFile(file, "utf8")).replace(/^\uFEFF/, "").trim();
    return {
      id: file.slice(14, 17),
      title:
        body
          .split(/\r?\n/)
          .find((line) => /^#\s/.test(line))
          ?.replace(/^#\s+/, "") || file,
      body,
      source: `https://github.com/SkypeTM/WebGameTest/blob/main/${file}`,
    };
  }),
);
notes.sort((a, b) => b.id.localeCompare(a.id));
await mkdir("public/updates", { recursive: true });
await writeFile(
  "public/updates/patch-notes.json",
  JSON.stringify(notes, null, 2) + "\n",
);
console.log(`Published ${notes.length} tracked patch notes.`);
