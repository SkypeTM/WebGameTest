param(
  [switch]$Remove
)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$hooks = Join-Path (Get-Location) '.git/hooks'
$hook = Join-Path $hooks 'post-commit'
if (-not (Test-Path '.git')) { throw 'Git 저장소 루트에서 실행하세요.' }
if ($Remove) {
  if (Test-Path $hook) { Remove-Item $hook -Force }
  Write-Output 'post-commit 자동 push 훅을 제거했습니다.'
  exit 0
}
New-Item -ItemType Directory -Force $hooks | Out-Null
@'
#!/bin/sh
branch=$(git symbolic-ref --quiet --short HEAD)
if [ -z "$branch" ]; then
  exit 0
fi
printf "[auto-push] pushing %s to origin...\n" "$branch"
git push origin "$branch"
status=$?
if [ $status -ne 0 ]; then
  printf "[auto-push] push failed; local commit is preserved.\n" >&2
fi
exit 0
'@ | Set-Content -Path $hook -Encoding ascii

git config push.autoSetupRemote true
Write-Output 'post-commit 자동 push 훅을 설치했습니다.'
Write-Output '이제 git commit 성공 후 origin/current-branch로 자동 push합니다.'
