import { test, expect, type Page } from "@playwright/test";
import {
  characters,
  monsters,
  cardInfo,
  type Game,
  type Action,
} from "../../lib/game";
const password = "Test-only-Passphrase-472!";
async function state(page: Page): Promise<Game> {
  return page.evaluate(async () => {
    const r = await fetch("/api/game", {
      headers: { "x-game-client": sessionStorage.getItem("bell-client")! },
    });
    return (await r.json()).state;
  });
}
async function clickSave(page: Page, click: () => Promise<unknown>) {
  const response = page.waitForResponse(
    (r) => r.url().endsWith("/api/game") && r.request().method() === "POST",
  );
  await click();
  const r = await response;
  expect(r.ok(), await r.text()).toBeTruthy();
  const data = await r.json();
  await expect(
    page.getByText(`저장됨 · v${data.state.version}`, { exact: true }),
  ).toBeAttached();
}
async function playCard(page: Page, id: string, target: string) {
  const g = await state(page),
    c = g.run!.battle!.hand.find((c) => c.id === id)!,
    info = cardInfo(c);
  await page
    .getByRole("button", {
      name: `${characters.find((h) => h.id === c.owner)!.name} ${info.name}`,
      exact: true,
    })
    .first()
    .click();
  await clickSave(page, () =>
    target === "M08:tower"
      ? page.getByRole("button", { name: /성탑 파괴/ }).click()
      : info.target === "ally"
        ? page
            .locator("button.ally")
            .filter({ hasText: characters.find((c) => c.id === target)!.name })
            .click()
        : page
            .locator("button.enemy-target")
            .filter({ hasText: monsters.find((m) => m.id === target)!.name })
            .click(),
  );
}
async function moveRoom(page: Page, name: RegExp) {
  await page.getByRole("button", { name }).click();
  await clickSave(page, () =>
    page.getByRole("button", { name: "탐사 진행 →", exact: true }).click(),
  );
}
async function fight(page: Page) {
  for (let i = 0; i < 180; i++) {
    const g = await state(page),
      r = g.run!;
    if (r.mode !== "battle") {
      expect(r.mode).toBe("reward");
      return;
    }
    const b = r.battle!,
      cards = b.hand.filter(
        (c) =>
          cardInfo(c).cost <= b.energy &&
          r.heroes.some((h) => h.id === c.owner && h.hp > 0),
      );
    const hurt = r.heroes
      .filter((h) => h.hp > 0)
      .sort((a, b) => a.hp - b.hp)[0];
    const heal = cards.find(
      (c) =>
        c.kind === "skill" &&
        cardInfo(c).role === "지원" &&
        hurt.hp < hurt.maxHp - 16,
    );
    const attack = cards.find((c) => cardInfo(c).target === "enemy");
    const guard = cards.find((c) => cardInfo(c).target === "ally");
    if (heal) await playCard(page, heal.id, hurt.id);
    else if (attack) {
      const e =
        b.enemies.find((e) => e.id === "M03" && e.hp > 0) ||
        b.enemies.find((e) => e.hp > 0)!;
      await playCard(page, attack.id, e.tower > 0 ? "M08:tower" : e.id);
    } else if (guard) await playCard(page, guard.id, hurt.id);
    else
      await clickSave(page, () =>
        page.getByRole("button", { name: "턴 종료 →", exact: true }).click(),
      );
  }
  throw new Error("Battle did not finish");
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
}
test("desktop to mobile: actual login, party, cards, offline retry, rewards, boss, return, relogin", async ({
  browser,
}) => {
  test.setTimeout(360000);
  const desktop = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
    }),
    page = await desktop.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const email = `explorer-${Date.now()}@example.com`;
  await page.goto("/");
  await page
    .getByRole("button", { name: "처음 오셨나요? 탐사대 등록" })
    .click();
  await page.getByLabel("탐사대장 이름").fill("테스트 탐사대");
  await page.getByLabel("이메일").fill(email);
  await page.getByLabel("비밀번호").fill(password);
  await page.getByRole("button", { name: "계정 만들고 시작" }).click();
  await expect(
    page.getByRole("heading", { name: "귀환자의 거점" }),
  ).toBeVisible();
  await noOverflow(page);
  await page.screenshot({
    path: "test-results/desktop-hub.png",
    fullPage: true,
  });
  await clickSave(page, () =>
    page.getByRole("button", { name: "✓ 편성 중 · 해제" }).first().click(),
  );
  expect((await state(page)).party.length).toBe(3);
  await clickSave(page, () =>
    page.getByRole("button", { name: "파티에 편성", exact: true }).click(),
  );
  expect((await state(page)).party.length).toBe(4);
  await page
    .getByRole("button", { name: "레오나 상세 장비와 능력치 보기" })
    .click();
  await expect(
    page.getByRole("heading", { name: /레오나 Lv\.1/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "상세창 닫기" }).click();
  await clickSave(page, () =>
    page.getByRole("button", { name: "던전 입장" }).click(),
  );
  await moveRoom(page, /1계층 전투 구역/);
  await expect(page.getByRole("heading", { name: /손패/ })).toBeVisible();
  const before = await state(page);
  await page.reload();
  await expect(page.getByRole("heading", { name: /손패/ })).toBeVisible();
  expect(await state(page)).toEqual(before);
  await page.screenshot({
    path: "test-results/desktop-battle.png",
    fullPage: true,
  });
  const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    }),
    phone = await mobile.newPage();
  phone.on("pageerror", (e) => errors.push(e.message));
  await phone.goto("/");
  await phone.getByLabel("이메일").fill(email);
  await phone.getByLabel("비밀번호").fill(password);
  await phone.getByRole("button", { name: "로그인하여 이어하기" }).click();
  await expect(phone.getByRole("heading", { name: /손패/ })).toBeVisible();
  expect(await state(phone)).toEqual(before);
  await noOverflow(phone);
  await phone.screenshot({
    path: "test-results/mobile-battle.png",
    fullPage: true,
  });
  // The old device has an authenticated session but may no longer mutate the campaign.
  const denied = await page.evaluate(async (version) => {
    const r = await fetch("/api/game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-game-client": sessionStorage.getItem("bell-client")!,
      },
      body: JSON.stringify({
        requestId: crypto.randomUUID(),
        version,
        action: { type: "endTurn" },
      }),
    });
    return r.status;
  }, before.version);
  expect(denied).toBe(423);
  await page.close();
  await mobile.setOffline(true);
  await phone.getByRole("button", { name: "턴 종료 →" }).click();
  await expect(
    phone.getByRole("button", { name: "같은 요청으로 재연결" }),
  ).toBeVisible();
  await mobile.setOffline(false);
  await clickSave(phone, () =>
    phone.getByRole("button", { name: "같은 요청으로 재연결" }).click(),
  );
  expect((await state(phone)).run!.battle!.turn).toBe(2);
  await fight(phone);
  await clickSave(phone, () =>
    phone.getByRole("button", { name: "보상 획득", exact: true }).click(),
  );
  await moveRoom(phone, /2계층 귀환 야영지/);
  await clickSave(phone, () =>
    phone.getByRole("button", { name: "야영지에서 휴식" }).click(),
  );
  await moveRoom(phone, /3계층 미지의 징후/);
  await clickSave(phone, () =>
    phone.getByRole("button", { name: "안전하게 우회" }).click(),
  );
  await moveRoom(phone, /4계층 귀환 야영지/);
  await clickSave(phone, () =>
    phone.getByRole("button", { name: "야영지에서 휴식" }).click(),
  );
  await moveRoom(phone, /변경 요새의 지배자/);
  await fight(phone);
  await clickSave(phone, () =>
    phone.getByRole("button", { name: "보상 획득", exact: true }).click(),
  );
  await moveRoom(phone, /승전 귀환 야영지/);
  await clickSave(phone, () =>
    phone.getByRole("button", { name: "야영지에서 휴식" }).click(),
  );
  await noOverflow(phone);
  await phone.screenshot({
    path: "test-results/mobile-victory.png",
    fullPage: true,
  });
  await clickSave(phone, () =>
    phone.getByRole("button", { name: "거점으로 귀환 →" }).click(),
  );
  await expect(
    phone.getByRole("heading", { name: "귀환자의 거점" }),
  ).toBeVisible();
  const finished = await state(phone);
  expect(finished.run).toBeNull();
  expect(finished.materials["빈 왕관 파편"]).toBe(1);
  expect(finished.gold).toBeGreaterThan(100);
  await phone.getByRole("button", { name: "로그아웃" }).click();
  await phone.getByLabel("이메일").fill(email);
  await phone.getByLabel("비밀번호").fill(password);
  await phone.getByRole("button", { name: "로그인하여 이어하기" }).click();
  await expect(
    phone.getByRole("heading", { name: "귀환자의 거점" }),
  ).toBeVisible();
  expect(await state(phone)).toEqual(finished);
  await noOverflow(phone);
  expect(errors).toEqual([]);
  await desktop.close();
  await mobile.close();
});
test("HTTP actions: same request in parallel applied once; stale actions, CSRF and account isolation", async ({
  browser,
}) => {
  const context = await browser.newContext(),
    p = await context.newPage();
  await p.goto("/");
  await p.getByRole("button", { name: "처음 오셨나요? 탐사대 등록" }).click();
  await p.getByLabel("탐사대장 이름").fill("경합 테스트");
  await p.getByLabel("이메일").fill(`race-${Date.now()}@example.com`);
  await p.getByLabel("비밀번호").fill(password);
  await p.getByRole("button", { name: "계정 만들고 시작" }).click();
  await expect(p.getByRole("heading", { name: "귀환자의 거점" })).toBeVisible();
  const result = await p.evaluate(async () => {
    const headers = {
      "Content-Type": "application/json",
      "x-game-client": sessionStorage.getItem("bell-client")!,
    };
    const body = {
      requestId: crypto.randomUUID(),
      version: 0,
      action: { type: "enter" },
    };
    const post = async (b: unknown) => {
      const r = await fetch("/api/game", {
        method: "POST",
        headers,
        body: JSON.stringify(b),
      });
      return { status: r.status, data: await r.json() };
    };
    const pair = await Promise.all([post(body), post(body)]);
    const stale = await post({ ...body, requestId: crypto.randomUUID() });
    return { pair, stale };
  });
  expect(result.pair[0].status).toBe(200);
  expect(result.pair[1].data).toEqual(result.pair[0].data);
  expect(result.stale.status).toBe(409);
  const csrf = await context.request.post("/api/game", {
    headers: {
      Origin: "https://untrusted.example",
      "x-game-client": "invalid-client-1234",
    },
    data: { type: "claim" },
  });
  expect(csrf.status()).toBe(403);
  const anonymous = await browser.newContext();
  const unauth = await anonymous.request.get("/api/game", {
    headers: { "x-game-client": "anonymous-client-123" },
  });
  expect(unauth.status()).toBe(401);
  await anonymous.close();
  await context.close();
});
test("hub growth and market surfaces are playable", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "처음 오셨나요? 탐사대 등록" })
    .click();
  await page.getByLabel("탐사대장 이름").fill("성장 시장 테스트");
  await page.getByLabel("이메일").fill(`growth-${Date.now()}@example.com`);
  await page.getByLabel("비밀번호").fill(password);
  await page.getByRole("button", { name: "계정 만들고 시작" }).click();
  await expect(
    page.getByRole("heading", { name: "귀환자의 거점" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "통합 도감 열기" }).click();
  await expect(
    page.getByRole("heading", { name: "침묵의 종 도감" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /캐릭터 4\/32/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "닫기 ×", exact: true }).click();
  await page.getByRole("button", { name: "거점 시설" }).click();
  const facilityDialog = page.getByRole("dialog", { name: "거점 장소 정보" });
  await expect(
    facilityDialog.getByRole("heading", { name: "거점 시설" }).first(),
  ).toBeVisible();
  await facilityDialog.getByRole("button", { name: /강화/ }).first().click();
  await expect(page.getByText("대장간 Lv.1")).toBeVisible();
  await page.getByRole("button", { name: "시장 골목" }).click();
  await expect(page.getByRole("heading", { name: "재료 등록" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "열린 매물" })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("HD portraits, procedural route and full-size combat cut-in render", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "처음 오셨나요? 탐사대 등록" })
    .click();
  await page.getByLabel("탐사대장 이름").fill("시각 패치 테스트");
  await page.getByLabel("이메일").fill(`visual-${Date.now()}@example.com`);
  await page.getByLabel("비밀번호").fill(password);
  await page.getByRole("button", { name: "계정 만들고 시작" }).click();
  await expect(page.getByRole("heading", { name: "귀환자의 거점" })).toBeVisible();

  const portrait = page
    .getByRole("button", { name: "레오나 상세 장비와 능력치 보기" })
    .locator("img")
    .first();
  await expect(portrait).toHaveAttribute("src", /fhd\/portraits\/AR1\.webp/);
  expect(await portrait.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(
    1080,
  );

  await clickSave(page, () =>
    page.getByRole("button", { name: "던전 입장" }).click(),
  );
  await expect(page.locator(".procedural-map .route-row")).toHaveCount(15);
  expect(await page.locator(".route-links line").count()).toBeGreaterThan(16);
  const layerOnePositions = await page
    .locator(".route-layer-1")
    .evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).style.left));
  expect(new Set(layerOnePositions).size).toBe(3);
  await page.screenshot({ path: "test-results/procedural-map.png", fullPage: true });

  await moveRoom(page, /1계층 전투 구역/);
  const game = await state(page);
  const attack = game.run!.battle!.hand.find(
    (card) => cardInfo(card).target === "enemy",
  )!;
  await playCard(page, attack.id, game.run!.battle!.enemies[0].id);
  await expect(page.locator(".combat-cut-in")).toBeAttached();
  await expect(page.locator(".combat-cut-in canvas.actor-3d")).toHaveCount(2);
  await page.screenshot({ path: "test-results/visual-patch.png", fullPage: true });
});
