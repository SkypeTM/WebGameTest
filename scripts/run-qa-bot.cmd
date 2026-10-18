@echo off
cd /d "%~dp0.."
node --import ./scripts/register-tsx.mjs scripts/qa-play-bot.ts
set "QA_RESULT=%ERRORLEVEL%"
echo.
echo Report: storage\qa-bot\latest.md
exit /b %QA_RESULT%
