import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const started = Date.now();
const run = spawnSync(process.execPath, [
  '--import', './scripts/register-tsx.mjs', '--test', '--test-reporter=tap',
  'tests/game.test.ts', 'tests/store.test.ts',
], { cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 });
const log = [run.stdout, run.stderr, run.error?.message].filter(Boolean).join('\n');
const count = (name) => Number(log.match(new RegExp(`^# ${name} (\\d+)$`, 'm'))?.[1] || 0);
const report = {
  at: new Date().toISOString(),
  passed: run.status === 0 && count('tests') > 0 && count('fail') === 0,
  tests: count('tests'), pass: count('pass'), fail: count('fail'),
  durationMs: Date.now() - started,
  exitCode: run.status, signal: run.signal,
  scope: 'Game rules and isolated SQLite storage: facilities, crafting, quests, market, save conflicts',
  browserVerified: false,
  log: 'storage/qa/hub-latest.log',
};
const output = path.join(root, 'storage/qa');
await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'hub-latest.log'), log);
await writeFile(path.join(output, 'hub-latest.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
process.exitCode = report.passed ? 0 : 1;
