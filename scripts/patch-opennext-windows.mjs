import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

if (process.platform === "win32") {
  const require = createRequire(import.meta.url);
  const copyPath = require.resolve("@opennextjs/aws/build/copyTracedFiles.js", {
    paths: [require.resolve("@opennextjs/cloudflare")],
  });
  let copy = readFileSync(copyPath, "utf8");
  copy = copy.replace(
    "symlinkSync(symlink, to);",
    'if (process.platform === "win32") { const sourceTarget = path.resolve(path.dirname(from), symlink); const relativeTarget = path.relative(path.join(process.cwd(), "node_modules"), sourceTarget); symlinkSync(path.join(outputDir, packagePath, "node_modules", relativeTarget), to, "junction"); } else { symlinkSync(symlink, to); }',
  );
  copy = copy.replace(
    "srcPath.match(getCrossPlatformPathRegex(",
    'srcPath.replaceAll("\\\\", "/").match(getCrossPlatformPathRegex(',
  );
  copy = copy.replace(
    "return nonLinuxPlatformRegex.test(srcPath);",
    'return nonLinuxPlatformRegex.test(srcPath.replaceAll("\\\\", "/"));',
  );
  writeFileSync(copyPath, copy);

  const cloudflareRoot = require.resolve("@opennextjs/cloudflare");
  const bundlePath = new URL(
    "../cli/build/open-next/createServerBundle.js",
    `file:///${cloudflareRoot.replaceAll("\\", "/")}`,
  );
  if (existsSync(bundlePath)) {
    let bundle = readFileSync(bundlePath, "utf8");
    const needle =
      "    const additionalCodePatches = codeCustomization?.additionalCodePatches ?? [];";
    if (!bundle.includes('entry.startsWith("sharp@")')) {
      bundle = bundle.replace(
        needle,
        `    if (process.platform === "win32") {
        const pnpmDir = path.join(outPackagePath, "node_modules", ".pnpm");
        if (fs.existsSync(pnpmDir)) {
            for (const entry of fs.readdirSync(pnpmDir)) {
                if (entry.startsWith("sharp@") || entry.startsWith("@img+sharp-")) {
                    fs.rmSync(path.join(pnpmDir, entry), { recursive: true, force: true });
                }
            }
        }
    }
${needle}`,
      );
      writeFileSync(bundlePath, bundle);
    }
  }
}
