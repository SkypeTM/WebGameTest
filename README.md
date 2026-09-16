# 침묵의 종 아래

명세 1.1의 **1단계 기반과 한 판**을 플레이할 수 있는 첫 버전입니다. 로그인 → 1~4명 편성·장비 → 변경 요새 탐사 → 카드 전투 → 보상 → 귀환 → 계정 상태 이어하기가 실제 서버 저장과 연결되어 있습니다. 전체 게임 완성 버전은 아닙니다.

## 바로 실행

이 작업 환경에서는 의존성과 DB 초기화가 끝나 있습니다. 프로젝트 폴더에서 PowerShell로 실행합니다.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1
```

[게임 열기](http://localhost:3000). 첫 화면에서 **탐사대 등록**을 눌러 이메일 형식의 ID, 이름, 8자 이상 비밀번호로 로컬 계정을 만드세요. 실제 메일 발송/인증은 없습니다. 로그인 후 다른 기기/탭으로 전환하면 기존 기기의 변경 요청은 거절됩니다. 같은 브라우저 새로고침은 조작권과 전투를 유지합니다.

실행 스크립트는 PATH의 Node 또는 Codex가 제공한 Node를 찾고, DB 마이그레이션 후 개발 서버를 시작합니다. 종료는 Ctrl+C입니다. 다른 포트는 `-Port 3002`를 사용합니다.

### 새 개발 환경

Node.js **24.15 이상** 및 pnpm이 필요합니다. 실제 검증은 Node 24.19.0 / pnpm 11.19.0에서 했습니다. 버전은 package.json과 pnpm-lock.yaml에 고정되어 있습니다.

```sh
pnpm install --frozen-lockfile
pnpm db:migrate
pnpm dev
```

최초 실행 시 `storage/game.sqlite`와 개발용 무작위 인증 비밀값 `storage/development-secret`을 만듭니다. 계정 생성 후 처음 게임 상태를 읽을 때 AR1~AR4, 은화 100, 기본 장비를 지급합니다. 공용 테스트 비밀번호나 고정 관리자 계정은 없습니다. 테스트는 자체 계정을 생성합니다.

### 운영 빌드

`.env.example`을 `.env.local`로 복사하고 직접 생성한 충분히 긴 `BETTER_AUTH_SECRET`을 입력하세요. 비밀값은 커밋하지 않습니다.

```sh
pnpm db:migrate
pnpm build
pnpm start
```

현재 구조는 **영구 디스크가 있는 단일 Node 서버**에서 실행하는 로컬 우선 버전입니다. 정적 호스팅만으로는 동작하지 않습니다. 외부 서비스에는 배포하지 않았습니다. 실제 서비스 전 PostgreSQL 전환, HTTPS, 메일 인증·비밀번호 재설정, 백업·운영 모니터링이 필요합니다.

### 같은 Wi-Fi의 휴대폰

서버 PC의 LAN IP가 예를 들어 `192.168.0.10`이면 `.env.local`에 다음과 같이 설정하고 서버를 재시작합니다. 휴대폰도 그 주소로 접속합니다.

```dotenv
BETTER_AUTH_URL=http://192.168.0.10:3000
TRUSTED_ORIGINS=http://192.168.0.10:3000,http://localhost:3000
DATABASE_PATH=storage/game.sqlite
```

Windows 방화벽에서 해당 로컬 개발 서버 연결을 허용해야 할 수 있습니다. 본 검증은 실제 휴대폰 하드웨어 대신 Edge의 390×844 터치·모바일 브라우저 컨텍스트를 사용했습니다.

## 플레이 방법

1. 기본 동료 4명을 그대로 사용하거나 편성에서 해제·추가하세요. 모집 화면에서 동료를 은화 20에 영입할 수 있습니다. 파티 최소 1명, 최대 4명입니다.
2. 캐릭터별 훈련용 무기(피해 +2) 또는 호신 부적(다음 턴 보호막 +3)을 선택합니다. 초기 장비는 캐릭터에게 귀속된 기본 키트입니다.
3. 변경 요새에 입장하고 연결된 다음 방을 선택합니다. 첫 전투 뒤 휴식/퍼즐, 안뜰 뒤 정예/보급 경로를 선택합니다.
4. 카드를 누른 뒤 적 또는 아군 대상을 누릅니다. 턴당 자원 4, 손패 6, 캐릭터당 카드 4장입니다. 비용이 모자라면 턴을 종료하세요. 적의 행동 예고를 먼저 확인하세요.
5. 보스의 별도 **성탑 파괴** 버튼을 대상으로 공격하면 광역 공격을 약화할 수 있습니다.
6. 전투 승리 후 **보상 획득**을 눌러 배낭에 담습니다. 전투가 끝난 방에서 **거점으로 귀환**하면 은화와 재료를 창고에 확정합니다. 전멸하면 미확보 전리품을 잃고 부상 기록이 남습니다.
7. 새로고침·로그아웃·재로그인해도 전투와 거점 상태가 이어집니다. 다른 기기에서는 로그인하거나 **이 기기에서 이어하기**로 조작권을 가져옵니다.

## 실제 구현 범위

| 영역 | 현재 동작 |
| --- | --- |
| 인증 | Better Auth 이메일/비밀번호, DB 세션, HttpOnly 쿠키, 요청 출처 검사 |
| 서버 저장 | 계정별 SQLite 트랜잭션, 저장 버전, 동일 요청 영수증, 기기별 조작권 |
| 복원 | 턴·손패·뽑기/버리기 덱 순서·시드·자원·HP·보호막·표식·기절·성탑·사건·배낭 |
| 편성 | 32명 원본 데이터 열람/영입, 1~4명 선택, 개인 기본 장비 2종 |
| 전투 | 4역할 공통 카드, 비용·대상·전투 불능 검증, 덱 재순환, 승패 |
| 탐사 | 변경 요새 9개 방, 분기 2곳, 휴식·문양 퍼즐·왕국 조우, 보스·귀환 |
| 적 | M01~M08 행동 로직 구현, 나머지 48종은 원본 데이터만 보존 |
| 성장/관계 | 탐사 경험치·기초 레벨 피해 보정, 팩션 쌍 보호막/스트레스·동일 팩션 방어, 왕국 조우 우호도 |
| UI | 한국어, PC 파티/적/손패 구도, 모바일 적/파티/손패 순서, 클릭·터치 |
| 자산 | 88개 ID의 임시 자산 manifest, 실제 이미지 경로로 교체 가능, 로딩 실패 시 실루엣 |

몬스터 구현: M01 보호막과 공격 가로막기, M02 후열 공격과 진영 방어 무시(보호막은 유효), M03 3턴 주기의 충전/전체 폭발, M04 생존 중 공격 강화, M05 마지막 공격자 추적, M06 교대 반격/포격, M07 같은 인물 연속 카드 반격, M08 성탑 방어/왕검 광역 교대와 성탑 부위 파괴. 이들은 명세 행동의 첫 플레이용 구현이며 완성 밸런스는 아닙니다.

## 저장 설계

브라우저는 행동 의도만 전송합니다. 계정 ID는 인증 세션에서 얻으며 요청 본문의 소유권·금액·결과를 신뢰하지 않습니다. `BEGIN IMMEDIATE` 안에서 조작권·버전·요청 ID·카드·대상·비용을 확인한 뒤 상태와 영수증을 함께 커밋합니다. 서로 다른 두 행동이 같은 버전을 제시하면 하나만 성공합니다. 같은 요청을 다시 보내면 저장된 동일 결과를 반환합니다.

서버로부터 응답을 받기 전에는 화면에서 게임 결과를 확정하지 않습니다. 연결이 끊어지면 입력을 잠그고, 탭의 `sessionStorage`에 보관한 **미확인 요청만** 동일 ID로 재전송합니다. 게임 상태는 localStorage/sessionStorage에 저장하지 않습니다. 인증 쿠키와 별도로 탭 ID를 사용해 세션+탭 조작권을 확인합니다. 기존 탭은 최대 8초 주기로 조작권 변경을 표시하고, 그 이전에도 서버가 변경 요청을 거절합니다.

`migrations/001-game.sql`은 게임 테이블을, `scripts/migrate.ts`는 Better Auth 스키마와 게임 스키마를 생성합니다. 첫 마이그레이션 시 Better Auth가 아직 없는 테이블 경고를 먼저 출력할 수 있으며, 뒤이어 생성됩니다. 데이터 백업은 서버를 정상 종료한 뒤 `storage` 폴더를 보관하세요. 인증 비밀값을 변경하면 기존 세션이 무효화될 수 있습니다.

## 테스트 환경

브라우저 테스트는 실행 중인 개발 서버나 개발 DB를 사용하지 않습니다. `pnpm test:e2e`가 테스트 전용 `storage/e2e.sqlite`를 삭제·생성하고 인증·게임 마이그레이션을 실행한 뒤 포트 3100의 Next 개발 서버를 자동으로 시작하고 종료합니다. 테스트 계정과 세션도 매 실행마다 새로 만들어집니다.

```powershell
pnpm typecheck
pnpm test
pnpm test:e2e
```

전역 `pnpm`이 없는 환경에서는 Node 24와 로컬 실행 파일을 사용합니다.

```powershell
$node = "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$env:Path = "$(Split-Path $node);$env:Path"
$env:TEST_SERVER_COMMAND = "`"$node`" --import tsx scripts/e2e-server.ts"
& .\node_modules\.bin\playwright.cmd test
```

`node`, `npm`, `pnpm`이 모두 PowerShell PATH에 없다면 프로젝트 실행기를 사용하세요.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-e2e.ps1
```

이 스크립트는 PATH의 Node를 먼저 사용하고, 없으면 Codex가 제공한 Node 런타임을 찾아 로컬 Playwright와 격리 테스트 서버를 직접 실행합니다.

## GitHub 자동 업로드

커밋할 때마다 GitHub에 자동 업로드하려면 프로젝트 루트에서 한 번 실행하세요.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-git-hooks.ps1
```

이후 `git commit`이 성공하면 현재 브랜치가 `origin`으로 자동 push됩니다. GitHub 인증이나 네트워크가 없으면 로컬 커밋은 유지되고 push 실패 메시지가 표시됩니다. 자동 업로드를 끄려면 다음을 실행하세요.

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-git-hooks.ps1 -Remove
```

## 테스트

```sh
pnpm typecheck
pnpm test:e2e
```

브라우저 테스트는 기본적으로 설치된 Microsoft Edge를 사용합니다. 다른 운영체제에서는 Playwright의 Chromium을 설치하고 설정의 channel을 환경에 맞게 조정하세요. 테스트는 로컬 DB에 테스트용 계정을 생성합니다. 운영 DB에 대해 테스트하지 마세요.

테스트 결과와 확인 범위는 `TEST_RESULTS.md`, 전체 명세 대비 후속 작업은 `IMPLEMENTATION_STATUS.md`에 있습니다.

## 주요 파일

- `app/page.tsx`, `app/style.css`: 화면과 반응형 스타일
- `lib/game.ts`: UI와 분리된 결정적 상태 전이 함수
- `lib/store.ts`, `lib/db.ts`: 트랜잭션, 버전, 중복 처리
- `lib/auth.ts`, `app/api`: 인증과 서버 API
- `data/characters.json`, `data/monsters.json`: 원본 ID와 설정 보존
- `data/cards.json`, `data/balance.json`: 카드/초기 밸런스
- `data/asset_manifest.json`, `public/assets/README.md`: 그림 준비 상태와 교체 방법

설치 시 확인한 공식 문서: [Next.js 설치](https://nextjs.org/docs/app/getting-started/installation), [Better Auth Next.js](https://better-auth.com/docs/integrations/next), [Better Auth SQLite](https://better-auth.com/docs/adapters/sqlite), [인증 DB 마이그레이션](https://better-auth.com/docs/concepts/database). 설치 후 동봉된 Next.js 문서와 실제 타입 검사·빌드로 호환성을 추가 확인했습니다.
