param([int]$Port = 3000)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) { $gameNode = $nodeCommand.Source }
else { $gameNode = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' }
if (-not (Test-Path -LiteralPath $gameNode)) { throw 'Node.js 24.15 이상을 설치하고 다시 실행하세요.' }
if (-not (Test-Path 'node_modules/next/dist/bin/next')) { throw '먼저 pnpm install --frozen-lockfile을 실행하세요.' }
$env:NEXT_TELEMETRY_DISABLED = '1'
if ($Port -ne 3000 -and -not $env:BETTER_AUTH_URL) {
  $env:BETTER_AUTH_URL = "http://localhost:$Port"
  $env:TRUSTED_ORIGINS = "http://localhost:$Port"
}
& $gameNode --env-file-if-exists=.env.local --import tsx scripts/migrate.ts
if ($LASTEXITCODE -ne 0) { throw 'DB 마이그레이션에 실패했습니다.' }
& $gameNode node_modules/next/dist/bin/next dev --hostname 0.0.0.0 --port $Port
