param(
  [int]$Port = 3100,
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)
$ErrorActionPreference = 'Stop'
Set-Location $ProjectRoot

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
  $node = $nodeCommand.Source
} else {
  $node = Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
}
if (-not (Test-Path -LiteralPath $node)) {
  throw 'Node.js 24.15 이상을 설치하거나 Codex Node 런타임을 준비하세요.'
}

$env:TEST_SERVER_COMMAND = "`"$node`" scripts/e2e-server.mjs"
$env:TEST_PORT = "$Port"
$env:TEST_URL = "http://localhost:$Port"
$playwright = Join-Path $ProjectRoot 'node_modules/@playwright/test/cli.js'
if (-not (Test-Path -LiteralPath $playwright)) {
  throw 'node_modules가 없습니다. 의존성을 먼저 설치하세요.'
}
& $node $playwright test @args
exit $LASTEXITCODE
