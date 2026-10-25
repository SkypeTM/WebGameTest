<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# GameTest Project Instructions

## Project state

GameTest is an actively developed and incomplete browser game.

Major unfinished areas may include:

* main storyline and progression
* gameplay systems
* 2D to 3D character migration
* character presentation and animation
* BGM
* sound effects
* balancing
* UI/UX
* integration and regression testing

Do not assume that incomplete or missing behavior is necessarily a bug.

Before replacing, deleting, or rewriting an incomplete system, determine whether it is:

* an intentional placeholder
* an unfinished implementation
* a legacy compatibility path
* a temporary fallback
* or an actual defect

Preserve working behavior unless the current task explicitly requires changing it.

## Context efficiency

Use the smallest reasonable context first.

Do not recursively inspect the entire repository as the first step.

Start with files directly related to the requested task and expand the investigation only when required.

Correctness, gameplay behavior, and reliable validation take priority over token savings.

## Investigation order

For implementation and debugging, prefer this order:

1. directly relevant source files
2. directly imported modules
3. relevant game data
4. relevant manifest files
5. relevant assets
6. related generation or migration scripts
7. broader repository investigation only when necessary

Do not repeatedly re-read large unchanged files unless new evidence requires it.

## Generated and dependency directories

Do not recursively inspect these directories during normal development:

* `node_modules/`
* `.next/`
* `.open-next/`
* `.pnpm-store/`
* `.wrangler/`
* `playwright-report/`
* `test-results/`

These directories may contain large amounts of generated or dependency content.

### Next.js exception

The generated Next.js instructions at the top of this file take priority.

For Next.js implementation work, read the relevant documentation under:

* `node_modules/next/dist/docs/`

when required by the Next.js agent rules.

Do not use this exception as permission to recursively inspect all of `node_modules/`.

Inspect dependency implementation source only when application code, project configuration, type definitions, or the required Next.js documentation are insufficient to diagnose the issue.

## Game assets

Game assets are valid project context and may be inspected when relevant.

Do not recursively inspect all assets by default.

Prefer manifests, identifiers, filenames, and known mappings before opening or scanning large asset collections.

Relevant project areas may include:

* `art-source/`
* `public/assets/`
* `data/`
* asset generation or conversion scripts under `scripts/`

For coding tasks unrelated to visuals or audio, avoid scanning large asset collections.

For visual, 3D, animation, audio, or runtime asset problems, inspect the specific assets needed to complete and validate the task.

## Asset lookup

Prefer manifest-driven lookup before recursively searching asset directories.

Use relevant manifest files under `data/` to locate character, environment, monster, audio, and generated assets when possible.

After locating the required asset, inspect only the relevant files unless broader comparison is necessary.

## 2D to 3D migration

The project is actively migrating character presentation from 2D assets to 3D characters.

Do not assume that existing 2D systems are obsolete.

When working on character rendering or migration:

1. identify the existing 2D behavior
2. identify the intended 3D replacement
3. inspect the relevant character/data/asset mappings
4. determine whether fallback or legacy paths are still required
5. preserve compatibility when still needed
6. validate the resulting behavior in actual gameplay

Do not delete 2D assets, mappings, rendering paths, or fallback logic merely because a 3D replacement exists.

Remove legacy behavior only when the task explicitly requires it or when its usage has been verified to be obsolete.

## Story and gameplay development

The main storyline and several gameplay systems are still under development.

When implementing new story or gameplay functionality:

* inspect existing project conventions before creating new architecture
* reuse existing systems when reasonable
* avoid broad rewrites unless required
* preserve save data, state transitions, progression, and existing gameplay behavior where applicable
* distinguish unfinished content from broken content

For large new features, establish the relevant existing architecture before editing.

## Audio development

BGM and sound-effect work is an active part of the project.

For audio-related tasks:

* inspect relevant audio data, manifests, runtime code, and generation scripts
* avoid scanning unrelated visual assets
* preserve existing audio behavior unless the task changes it
* validate playback, transitions, looping, volume behavior, and trigger timing when relevant

Do not treat placeholder audio as final content unless the project data indicates that it is final.

## Risk-based validation

Validation scope should match the risk of the change.

For small isolated changes:

* run targeted checks
* avoid unnecessary full-game regression testing

For UI or visual changes:

* inspect the affected screen or state

For character, 2D, 3D, animation, or asset changes:

* validate the affected character, scene, or gameplay flow

For audio changes:

* validate the affected BGM or SFX trigger and playback behavior

For gameplay changes:

* play through the affected gameplay flow

For major integration changes:

* perform broader regression testing

## Gameplay testing

When asked to test the game, prioritize observed runtime behavior over assumptions from source code.

Whenever practical:

1. reproduce the issue before editing
2. observe the exact failure
3. inspect browser/runtime errors when relevant
4. inspect failed asset or network requests when relevant
5. trace the failure to the relevant code, data, or asset
6. make the smallest appropriate fix
7. replay the affected scenario
8. confirm that the problem is resolved

If runtime evidence points outside the initial investigation scope, expand the scope as needed.

Do not remain artificially constrained when broader context is required to diagnose a real gameplay problem.

## Browser and integration checks

For meaningful gameplay, rendering, UI, asset, or audio changes, perform integration validation when practical.

Relevant checks may include:

* starting the development server
* opening the game
* navigating through the affected flow
* checking browser console errors
* checking failed network requests
* checking missing assets
* checking visual regressions
* checking 2D and 3D character presentation
* checking interaction behavior
* checking combat behavior
* checking BGM and SFX behavior

Do not perform unrelated broad testing after every trivial change.

## Editing discipline

Prefer the smallest defensible change that fully solves the task.

Avoid unrelated refactoring during bug fixes.

Do not regenerate large asset sets unless the task requires it.

Do not modify generated build output as a substitute for modifying source files.

Do not delete legacy code or assets until their current usage has been verified.

## Response style

Keep implementation updates concise.

After completing development or debugging work, report:

* root cause or implementation objective
* files changed
* important behavior changes
* tests or gameplay validation performed
* remaining known issues

Do not provide long tutorials unless requested.

## 전 인물·게임 표현 공통 제작 규칙 (2026-10-25)
캐릭터, NPC, 상인, 적, 카드 속 인물, 배경과 UI를 생성·수정하기 전에 data/CARTOON_ART_DIRECTION_KO.md 및 data/art_generation_policy.json을 읽고 적용한다.
사용자가 말한 “AI요소 감소”는 생성 사실을 숨기는 것이 아니라 반복 장식, 구조 오류, 무의미한 디테일, 획일적인 얼굴·문장·레이아웃을 줄이는 품질 요구다.
머리카락은 큰 덩어리·모근·흐름을 설계하고 반복 컬/가닥을 피한다. 의상은 재단·봉제·장비 고정 구조를 설명할 수 있어야 하며 떠 있는 끈·버클과 무작위 문양을 추가하지 않는다.
캐릭터별 고유 얼굴·헤어·피부색·나이·팩션색을 보존하고 시점·모션 간 일치시킨다. 새 자산은 검수 상태와 실제 적용 여부를 분리하여 기록한다.
전 캐릭터가 수정됐다고 보고하려면 모든 해당 manifest의 적용 상태가 확인되어야 한다. 정책 반영만으로 기존 원화가 수정됐다고 표시하지 않는다.
