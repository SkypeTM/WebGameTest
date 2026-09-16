"use client";
import { useEffect, useRef, useState } from "react";
import {
  characters,
  monsters,
  rooms,
  cardInfo,
  relations,
  balance,
  type Game,
  type Action,
  type Card,
} from "../lib/game";
import assetManifest from "../data/asset_manifest.json";
type MarketListing = {
  id: string;
  seller: string;
  item: string;
  quantity: number;
  price: number;
  status: "open" | "sold" | "cancelled";
  expiresAt: string;
  fee: number;
};
type MarketHistory = {
  item: string;
  quantity: number;
  price: number;
  fee: number;
  status: "sold" | "cancelled" | "expired";
};
const char = (id: string) => characters.find((c) => c.id === id)!;
const symbols: Record<string, string> = {
  수호: "◇",
  공격: "↗",
  지원: "✦",
  제어: "◎",
};
function Crest({ id, large = false, motion = "" }: { id: string; large?: boolean; motion?: string }) {
  const [failed, setFailed] = useState(false);
  const asset = assetManifest.find((a) => a.id === id);
  const monster = id.startsWith("M");
  if (asset?.path && !failed)
    return (
      <div className={`${large ? "crest large" : "crest"} ${motion}`}>
        <img
          src={String(asset.path)}
          alt={id}
          className="concept-art"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: id.startsWith("M") ? "0% 0%" : "16% 50%",
          }}
          onError={() => setFailed(true)}
        />
      </div>
    );
  return (
    <div
      className={`crest ${large ? "large" : ""} ${monster ? "machine" : "person"} ${motion}`}
      aria-label={`${id} 임시 자산`}
    >
      <svg viewBox="0 0 120 120" role="img">
        <title>{id} 임시 실루엣</title>
        {monster ? (
          <>
            <path d="M24 54 13 40 19 30 40 39M96 54l11-14-6-10-21 9" />
            <rect x="29" y="34" width="62" height="58" rx="22" />
            <path d="M40 93v10M80 93v10M51 25h18M60 25v9" />
            <circle cx="47" cy="58" r="5" />
            <circle cx="73" cy="58" r="5" />
            <path d="M45 77h30" />
          </>
        ) : (
          <>
            <path d="M19 108c3-33 15-43 41-43s38 10 41 43M34 68 60 97 87 68M41 81l-7 27M79 81l7 27" />
            <ellipse cx="60" cy="43" rx="22" ry="26" />
            <path d="M37 39c-1-30 49-38 49 6L73 25 39 43M49 49h2M69 49h2M56 61h9" />
          </>
        )}
      </svg>
      <span>{id}</span>
    </div>
  );
}
function CardArt({ kind, role }: { kind: Card["kind"]; role: string }) {
  return (
    <span className={`card-art art-${kind}`} aria-hidden="true">
      <svg viewBox="0 0 80 56" role="img">
        {kind === "strike" && <><path d="M12 44 48 8l8 8-36 36Z" /><path d="m50 18 15 15M58 10l12 12" /></>}
        {kind === "guard" && <><path d="M40 6 68 16v16c0 12-11 18-28 24C21 50 12 44 12 32V16Z" /><path d="m25 30 10 10 20-22" /></>}
        {kind === "heavy" && <><path d="M18 48 40 8l22 40" /><path d="M30 31h20M40 8v40" /></>}
        {kind === "skill" && <><circle cx="40" cy="28" r="18" /><path d="M40 7v42M19 28h42M25 13l30 30M55 13 25 43" /></>}
      </svg>
      <small>{role}</small>
    </span>
  );
}
function Meter({ value, max }: { value: number; max: number }) {
  return (
    <div className="meter">
      <i style={{ width: `${Math.max(0, (value / max) * 100)}%` }} />
    </div>
  );
}
export default function Page() {
  const [game, setGame] = useState<Game | null>(null),
    [market, setMarket] = useState<MarketListing[]>([]),
    [marketHistory, setMarketHistory] = useState<MarketHistory[]>([]),
    [account, setAccount] = useState(""),
    [name, setName] = useState(""),
    [control, setControl] = useState(false),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [offline, setOffline] = useState(false),
    [register, setRegister] = useState(false),
    [tab, setTab] = useState("party"),
    [overlayOpen, setOverlayOpen] = useState(true),
    [filter, setFilter] = useState("전체"),
    [inheritance, setInheritance] = useState<string[]>([]),
    [selected, setSelected] = useState<Card | null>(null),
    [previewTarget, setPreviewTarget] = useState("");
  const client = useRef(""),
    pending = useRef<Record<string, unknown> | null>(null),
    working = useRef(false);
  const accept = (data: { state: Game; control: boolean; name: string; account?: string; market?: MarketListing[]; marketHistory?: MarketHistory[] }) => {
    setGame((previous) =>
      previous && previous.version > data.state.version ? previous : data.state,
    );
    setControl(data.control);
    setName(data.name);
    if (data.account) setAccount(data.account);
    if (data.market) setMarket(data.market);
    if (data.marketHistory) setMarketHistory(data.marketHistory);
  };
  async function api(body?: unknown) {
    const response = await fetch("/api/game", {
      method: body ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
        "x-game-client": client.current,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json();
    if (!response.ok)
      throw Object.assign(new Error(data.error), { status: response.status });
    return data;
  }
  async function load() {
    try {
      const data = await api();
      accept(data);
      setOffline(false);
      setError("");
    } catch (e) {
      const err = e as Error & { status?: number };
      if (err.status === 401) {
        setGame(null);
        setControl(false);
      } else {
        setError(err.message);
        setOffline(true);
      }
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    client.current =
      sessionStorage.getItem("bell-client") || crypto.randomUUID();
    sessionStorage.setItem("bell-client", client.current);
    const saved = sessionStorage.getItem("bell-pending");
    if (saved) {
      try {
        pending.current = JSON.parse(saved);
        setOffline(true);
        setError("미확인 행동이 있습니다. 같은 요청으로 결과를 확인하세요.");
      } catch {
        sessionStorage.removeItem("bell-pending");
      }
    }
    void load();
    const timer = setInterval(() => {
      if (!working.current && !pending.current)
        void api()
          .then(accept)
          .catch((e) => {
            if (e.status === 401) {
              setGame(null);
              setControl(false);
            } else {
              setOffline(true);
              setError(
                "연결을 확인하세요. 마지막 저장 상태에서 입력을 멈췄습니다.",
              );
            }
          });
    }, 8000);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  async function takeControl() {
    setBusy(true);
    try {
      accept(await api({ type: "claim" }));
      setError("");
      setOffline(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function act(action?: Action) {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setError("");
    try {
      if (action) {
        pending.current = {
          requestId: crypto.randomUUID(),
          version: game!.version,
          action,
        };
        sessionStorage.setItem("bell-pending", JSON.stringify(pending.current));
      }
      if (!pending.current) return;
      accept(await api(pending.current));
      pending.current = null;
      sessionStorage.removeItem("bell-pending");
      setSelected(null);
      setOffline(false);
    } catch (e) {
      const err = e as Error & { status?: number };
      setError(err.message);
      if (err.status && err.status < 500) {
        pending.current = null;
        sessionStorage.removeItem("bell-pending");
        if (err.status === 423) setControl(false);
        if (err.status === 409) await load();
        if (err.status === 401) setGame(null);
      } else setOffline(true);
    } finally {
      setBusy(false);
      working.current = false;
    }
  }
  async function authenticate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(event.currentTarget);
    try {
      const response = await fetch(
        `/api/auth/${register ? "sign-up" : "sign-in"}/email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: f.get("email"),
            password: f.get("password"),
            ...(register ? { name: f.get("name") } : {}),
          }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "로그인에 실패했습니다.");
      pending.current = null;
      sessionStorage.removeItem("bell-pending");
      accept(await api({ type: "claim" }));
      setOffline(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const locked = busy || offline || !control || !!pending.current;
  const run = game?.run,
    battle = run?.battle,
    fx = run?.combatFx;
  const motionFor = (id: string, side: "hero" | "enemy") => {
    if (!fx) return "";
    if (fx.actor === id && side === "hero") return fx.kind === "hero-guard" ? "motion-guard" : fx.kind === "hero-heal" ? "motion-heal" : "motion-strike";
    if (fx.actor === id && side === "enemy") return "motion-strike";
    if (fx.target === id && side === "hero" && fx.kind === "enemy-attack") return "motion-hit";
    if (fx.target === id && side === "enemy" && fx.kind === "hero-attack") return "motion-hit";
    return "";
  };
  function target(id: string) {
    if (selected) void act({ type: "play", id: selected.id, target: id });
  }
  function previewFor(id: string) {
    if (!selected || !battle) return "";
    const info = cardInfo(selected);
    if (info.target === "enemy") {
      const enemy = battle.enemies.find((item) => item.id === id);
      if (!enemy) return "";
      const owner = run?.heroes.find((hero) => hero.id === selected.owner);
      const damage = info.power + (owner?.equipment === "blade" ? 2 : 0) + Math.max(0, (owner?.level || 1) - 1) + enemy.mark;
      const retaliation = ["M06", "M07"].includes(enemy.id) ? " · 반격 예상 5~6" : "";
      return `예상 피해 ${Math.max(0, damage - enemy.shield)}${retaliation}`;
    }
    return "아군 효과 " + info.description;
  }
  if (loading)
    return (
      <main className="loading">
        <div className="bell-mark">♧</div>
        <p>마지막 탐사 기록을 불러오는 중…</p>
      </main>
    );
  if (!game)
    return (
      <main className="login">
        <div className="login-art">
          <div className="moon" />
          <div className="tower one" />
          <div className="tower two" />
          <div className="tower three" />
          <div className="login-story">
            <span className="eyebrow">BENEATH THE SILENT BELL</span>
            <h1>
              침묵의
              <br />종 아래
            </h1>
            <p>
              종은 멈췄다.
              <br />그 아래에서, 누군가 당신을 기다린다.
            </p>
            <span className="small">CHAPTER 01 — 변경 요새</span>
          </div>
        </div>
        <section className="login-form">
          <span className="eyebrow">탐사대 기록 보관소</span>
          <h2>{register ? "새로운 여정을 기록하다" : "다시, 종 아래로"}</h2>
          <p className="muted">
            당신의 파티와 마지막 전투가 계정에 저장됩니다.
          </p>
          <form onSubmit={authenticate}>
            {register && (
              <label>
                탐사대장 이름
                <input
                  name="name"
                  required
                  minLength={2}
                  maxLength={30}
                  autoComplete="nickname"
                  placeholder="탐사대장"
                />
              </label>
            )}
            <label>
              이메일
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label>
              비밀번호
              <input
                name="password"
                type="password"
                minLength={8}
                maxLength={128}
                autoComplete={register ? "new-password" : "current-password"}
                required
                placeholder="8자 이상"
              />
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="primary full" disabled={busy}>
              {busy
                ? "기록 확인 중…"
                : register
                  ? "계정 만들고 시작"
                  : "로그인하여 이어하기"}{" "}
              <span>→</span>
            </button>
          </form>
          <button
            className="text-button"
            onClick={() => {
              setRegister(!register);
              setError("");
            }}
          >
            {register
              ? "이미 계정이 있나요? 로그인"
              : "처음 오셨나요? 탐사대 등록"}
          </button>
          <div className="login-note">
            첫 플레이 버전 0.1
            <br />
            계정별 서버 저장 · PC / 모바일 지원
            <br />
            그림은 교체 예정인 임시 실루엣입니다.
          </div>
        </section>
      </main>
    );
  return (
    <div className="shell">
      <header className="header">
        <a className="brand" href="/">
          ♧{" "}
          <span>
            침묵의 종 아래<small>BENEATH THE SILENT BELL</small>
          </span>
        </a>
        <div className="account">
          <span className="save-dot" />
          <span className="save-label">
            {busy
              ? "저장 중"
              : offline
                ? "연결 중단"
                : `저장됨 · v${game.version}`}
          </span>
          <span className="wallet">◈ {game.gold}</span>
          <span className="username">{name}</span>
          <button
            className="mini"
            onClick={async () => {
              await fetch("/api/auth/sign-out", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: "{}",
              });
              setGame(null);
              setControl(false);
            }}
          >
            로그아웃
          </button>
        </div>
      </header>
      <div className="status" role="status">
        {!control ? (
          <>
            <span>다른 기기에서 플레이 중이거나 조작권 확인이 필요합니다.</span>
            <button disabled={busy} onClick={takeControl}>
              이 기기에서 이어하기
            </button>
          </>
        ) : error || offline || pending.current ? (
          <>
            <span>{error || "결과가 확인되지 않은 행동이 있습니다."}</span>
            <button
              disabled={busy}
              onClick={() => (pending.current ? void act() : void load())}
            >
              {pending.current ? "같은 요청으로 재연결" : "저장 상태 새로고침"}
            </button>
          </>
        ) : (
          <>
            <span>
              ✧{" "}
              {run
                ? "탐사 진행 중 · 모든 확정 행동이 자동 저장됩니다."
                : "거점 · 다음 탐사를 준비하세요."}
            </span>
            <span className="build-label">FIRST EXPEDITION / 0.1</span>
          </>
        )}
      </div>
      <main className="main">
        <div className="page-heading">
          <div>
            <span className="eyebrow">
              {run ? "THE FRONTIER FORTRESS" : "EXPLORER’S REFUGE"}
            </span>
            <h1>{run ? rooms[run.room].name : "귀환자의 거점"}</h1>
            <p>
              {run
                ? "끊긴 봉화 너머, 실종된 탐사대의 흔적을 찾아서."
                : "함께 내려갈 동료를 정하고, 다시 떠날 준비를 하세요."}
            </p>
          </div>
          <div className="chapter-tag">
            {run ? `탐사 ${game.runs + 1}` : `귀환 ${game.runs}회`}
            <small>{run ? `확보 대기 ◈ ${run.gold}` : "변경 요새 개방"}</small>
          </div>
        </div>
        {!run ? (
          <>
            <section className="town-map" aria-label="거점 장소">
              <div className="town-skyline"><span>THE LAST REFUGE</span><b>종이 멈춘 뒤에도, 마을은 살아 있다</b></div>
              <div className="town-locations">
              {[
                ["party", "작전실", "편성 · 장비"],
                ["roster", "주점", "동료 모집"],
                ["growth", "대장간", "훈련 · 치료"],
                ["market", "시장 골목", "거래 · 암시장"],
                ["storage", "기록 보관소", "전리품 · 로그"],
              ].map(([id, label, subtitle]) => (
                <button
                  key={id}
                  className={`town-location ${tab === id && overlayOpen ? "active" : ""}`}
                  aria-label={label}
                  onClick={() => { setTab(id); setOverlayOpen(true); }}
                >
                  <span className={`town-icon town-${id}`} aria-hidden="true" />
                  <strong>{label}</strong>
                  <small>{subtitle}</small>
                </button>
              ))}
              </div>
            </section>
            {overlayOpen && <section className="hub-overlay">
              <div className="overlay-heading">
                <div><span className="eyebrow">HAMLET / {tab?.toUpperCase()}</span><h2>{({ party: "작전실", roster: "주점", growth: "대장간", market: "시장 골목", storage: "기록 보관소" } as Record<string, string>)[tab] || "거점"}</h2></div>
                <button className="mini" onClick={() => setOverlayOpen(false)}>오버레이 닫기 ×</button>
              </div>
            {game.summary && <div className="summary">✦ {game.summary}</div>}
            {game.endingUnlocked && !game.ending && (
              <section className="panel ending-panel">
                <span className="eyebrow">THE LAST BELL</span>
                <h2>최종 결말을 선택하세요</h2>
                <p className="muted">이번 기록의 방향을 정하면 계정에 엔딩이 남습니다.</p>
                <div className="ending-actions">
                  {[["kingdom", "왕국의 새벽"], ["republic", "공화의 항로"], ["union", "조합의 망치"], ["liberation", "해방의 종소리"]].map(([id, label]) => (
                    <button className="primary" key={id} disabled={locked} onClick={() => void act({ type: "chooseEnding", choice: id })}>{label}</button>
                  ))}
                </div>
              </section>
            )}
            {game.ending && (
              <section className="panel ending-panel">
                <span className="eyebrow">ENDING RECORDED</span>
                <h2>{game.ending} 엔딩</h2>
                <p className="muted">환생은 선택 사항입니다. 보관 재료 중 최대 3개만 계승할 수 있습니다.</p>
                <div className="ending-actions">
                  {Object.keys(game.materials).map((item) => (
                    <button key={item} className={inheritance.includes(item) ? "selected-button" : "secondary"} disabled={locked || (!inheritance.includes(item) && inheritance.length >= 3)} onClick={() => setInheritance((current) => current.includes(item) ? current.filter((x) => x !== item) : [...current, item])}>{item}</button>
                  ))}
                </div>
                <button className="primary" disabled={locked} onClick={() => void act({ type: "rebirth", ids: inheritance })}>선택한 계승품으로 환생</button>
              </section>
            )}
            {tab === "party" ? (
              <div className="hub-grid">
                <section>
                  <div className="section-heading">
                    <h2>
                      당신의 탐사대 <span>{game.party.length} / 4</span>
                    </h2>
                    <span className="muted small">
                      캐릭터당 4장 · 최대 16장 덱
                    </span>
                  </div>
                  <div className="party-grid">
                    {game.roster.map((h) => (
                      <article
                        className={`hero-card ${game.party.includes(h.id) ? "chosen" : ""}`}
                        key={h.id}
                      >
                        <div className="hero-top">
                          <span>{char(h.id).faction}</span>
                          <b>
                            {symbols[char(h.id).role]} {char(h.id).role}
                          </b>
                        </div>
                        <Crest id={h.id} large />
                        <div className="hero-body">
                          <div className="hero-title">
                            <h3>{char(h.id).name}</h3>
                            <span>Lv.{h.level}</span>
                          </div>
                          <p className="muted small">{char(h.id).signature}</p>
                          <p className="small">
                            HP {h.maxHp} · 경험치 {h.xp}
                            {h.injury ? " · 부상" : ""}
                          </p>
                          <label className="equip-label">
                            장비
                            <select
                              aria-label={`${char(h.id).name} 장비`}
                              value={h.equipment}
                              disabled={locked}
                              onChange={(e) =>
                                void act({
                                  type: "equip",
                                  id: h.id,
                                  choice: e.target.value,
                                })
                              }
                            >
                              <option value="blade">
                                훈련용 무기 · 피해 +2
                              </option>
                              <option value="ward">
                                호신 부적 · 턴 보호막 +3
                              </option>
                            </select>
                          </label>
                          <button
                            className={
                              game.party.includes(h.id)
                                ? "selected-button"
                                : "secondary"
                            }
                            disabled={
                              locked ||
                              (game.party.includes(h.id)
                                ? game.party.length === 1
                                : game.party.length === 4)
                            }
                            onClick={() =>
                              void act({
                                type: "party",
                                ids: game.party.includes(h.id)
                                  ? game.party.filter((id) => id !== h.id)
                                  : [...game.party, h.id],
                              })
                            }
                          >
                            {game.party.includes(h.id)
                              ? "✓ 편성 중 · 해제"
                              : "파티에 편성"}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
                <aside className="expedition-panel">
                  <div className="fortress-art">
                    <div className="moon" />
                    <div className="tower one" />
                    <div className="tower two" />
                    <div className="tower three" />
                    <span>01 / FRONTIER</span>
                  </div>
                  <div className="expedition-copy">
                    <span className="eyebrow">다음 탐사</span>
                    <h2>변경 요새</h2>
                    <p>
                      종소리가 사라진 밤, 성문을 지키던 기계들이 다시 움직이기
                      시작했다.
                    </p>
                    <div className="facts">
                      <span>분기 경로</span>
                      <strong>전투 · 휴식 · 사건</strong>
                      <span>최종 위협</span>
                      <strong>캐슬 타이탄</strong>
                      <span>파티 방어</span>
                      <strong>
                        +{Math.round(relations(game.party).defense * 100)}%
                      </strong>
                      <span>관계 효과</span>
                      <strong>
                        보호막 {relations(game.party).shield} / 스트레스 +
                        {relations(game.party).stress}
                      </strong>
                    </div>
                    <button
                      className="primary full"
                      disabled={locked}
                      onClick={() => void act({ type: "enter" })}
                    >
                      던전 입장 <span>→</span>
                    </button>
                    <p className="small muted">
                      전투가 끝난 방에서 언제든 안전 귀환할 수 있습니다.
                    </p>
                  </div>
                </aside>
              </div>
            ) : tab === "roster" ? (
              <section>
                <div className="section-heading">
                  <h2>
                    팩션의 동료들 <span>32명</span>
                  </h2>
                  <span className="muted small">
                    첫 버전 영입 비용 ◈ {balance.recruitCost}
                  </span>
                </div>
                <div className="filters">
                  {["전체", ...new Set(characters.map((c) => c.faction))].map(
                    (f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        aria-pressed={filter === f}
                      >
                        {f}
                      </button>
                    ),
                  )}
                </div>
                <div className="recruit-grid">
                  {characters
                    .filter((c) => filter === "전체" || c.faction === filter)
                    .map((c) => (
                      <article className="recruit" key={c.id}>
                        <Crest id={c.id} />
                        <div>
                          <span className="eyebrow">
                            {c.id} / {c.role}
                          </span>
                          <h3>
                            {c.name}{" "}
                            <small>
                              {c.age}세 · {c.heightCm}cm
                            </small>
                          </h3>
                          <p>{c.faction}</p>
                          <details>
                            <summary>인물 기록</summary>
                            <p>
                              {c.body} · {c.face} · {c.skin}
                              <br />
                              {c.signature}
                              <br />
                              {c.design}
                              <br />
                              기획 카드: {c.cards}
                              <br />첫 버전: 역할 공통 카드 적용
                            </p>
                          </details>
                          <button
                            disabled={
                              locked ||
                              game.roster.some((h) => h.id === c.id) ||
                              game.gold < balance.recruitCost
                            }
                            onClick={() =>
                              void act({ type: "recruit", id: c.id })
                            }
                          >
                            {game.roster.some((h) => h.id === c.id)
                              ? "영입 완료"
                              : `영입 · ◈ ${balance.recruitCost}`}
                          </button>
                        </div>
                      </article>
                    ))}
                </div>
              </section>
            ) : tab === "growth" ? (
              <div className="storage-grid">
                <section className="panel">
                  <div className="section-heading">
                    <h2>거점 시설</h2>
                    <span className="muted small">은화 ◈ {game.gold}</span>
                  </div>
                  <p className="muted small">
                    시설은 최대 3단계까지 올릴 수 있으며 다음 탐사에도 효과가 남습니다.
                  </p>
                  {(
                    [
                      ["forge", "대장간", "훈련용 무기의 피해 보정"],
                      ["training", "훈련장", "훈련 경험치 증가"],
                      ["infirmary", "치료실", "부상 치료 비용 감소"],
                      ["canteen", "식당", "탐사 후 스트레스 회복 준비"],
                    ] as const
                  ).map(([id, label, description]) => {
                    const level = game.facilities[id];
                    const cost = balance.facilityUpgradeCost * (level + 1);
                    return (
                      <div className="inventory-row" key={id}>
                        <span>
                          <strong>{label} Lv.{level}</strong>
                          <small className="muted"> · {description}</small>
                        </span>
                        <button
                          className="mini"
                          disabled={locked || level >= 3 || game.gold < cost}
                          onClick={() => void act({ type: "upgradeFacility", id })}
                        >
                          {level >= 3 ? "최고 단계" : `강화 · ◈ ${cost}`}
                        </button>
                      </div>
                    );
                  })}
                  <h3>업적</h3>
                  {game.achievements.length ? (
                    game.achievements.map((id) => (
                      <p className="log-line" key={id}>✦ {id}</p>
                    ))
                  ) : (
                    <p className="muted">아직 달성한 업적이 없습니다.</p>
                  )}
                </section>
                <section className="panel">
                  <h2>동료 성장</h2>
                  <p className="muted small">
                    훈련은 경험치를 올리고, 부상은 치료실에서 회복합니다.
                  </p>
                  {game.roster.map((h) => (
                    <div className="growth-row" key={h.id}>
                      <div>
                        <strong>{char(h.id).name}</strong>
                        <p className="muted small">
                          Lv.{h.level} · 경험치 {h.xp}{h.injury ? " · 부상" : ""}
                        </p>
                      </div>
                      <div className="growth-actions">
                        <button
                          className="mini"
                          disabled={locked || game.gold < balance.trainingCost + game.facilities.training * 4}
                          onClick={() => void act({ type: "train", id: h.id })}
                        >
                          훈련 · ◈ {balance.trainingCost + game.facilities.training * 4}
                        </button>
                        <button
                          className="mini"
                          disabled={locked || !h.injury || game.gold < Math.max(1, balance.healingCost - game.facilities.infirmary * 2)}
                          onClick={() => void act({ type: "heal", id: h.id })}
                        >
                          {h.injury ? `치료 · ◈ ${Math.max(1, balance.healingCost - game.facilities.infirmary * 2)}` : "건강"}
                        </button>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            ) : tab === "market" ? (
              <div className="storage-grid">
                <section className="panel">
                  <h2>재료 등록</h2>
                  <p className="muted small">실제 계정이 보유한 재료만 등록할 수 있습니다.</p>
                  <label>
                    재료
                    <select id="market-item" defaultValue={Object.keys(game.materials)[0] || ""}>
                      {Object.keys(game.materials).map((item) => (
                        <option value={item} key={item}>{item} · {game.materials[item]}개</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    수량
                    <input id="market-quantity" type="number" min="1" defaultValue="1" />
                  </label>
                  <label>
                    가격
                    <input id="market-price" type="number" min="1" defaultValue="20" />
                  </label>
                  <button
                    className="primary full"
                    disabled={locked || !Object.keys(game.materials).length}
                    onClick={() => {
                      const item = (document.getElementById("market-item") as HTMLSelectElement).value;
                      const quantity = Number((document.getElementById("market-quantity") as HTMLInputElement).value);
                      const price = Number((document.getElementById("market-price") as HTMLInputElement).value);
                      void act({ type: "marketList", item, quantity, price });
                    }}
                  >
                    매물 등록
                  </button>
                </section>
                <section className="panel">
                  <h2>열린 매물</h2>
                  {market.length ? market.map((listing) => (
                    <div className="inventory-row" key={listing.id}>
                      <span><strong>{listing.item} × {listing.quantity}</strong><small className="muted"> · 판매자 {listing.seller} · 만료 {new Date(listing.expiresAt).toLocaleDateString("ko-KR")}</small></span>
                      {listing.seller === account ? (
                        <button className="mini" disabled={locked} onClick={() => void act({ type: "marketCancel", id: listing.id })}>취소</button>
                      ) : (
                        <button className="mini" disabled={locked || game.gold < listing.price} onClick={() => void act({ type: "marketBuy", id: listing.id })}>구매 · ◈ {listing.price}</button>
                      )}
                    </div>
                  )) : <p className="muted">현재 열린 매물이 없습니다.</p>}
                                    <h3>내 거래 내역</h3>
                                    {marketHistory.length ? marketHistory.map((entry, index) => (
                                      <p className="log-line" key={`${entry.item}-${entry.status}-${index}`}>
                                        {entry.status === "sold" ? "판매 완료" : entry.status === "expired" ? "만료 회수" : "매물 취소"} · {entry.item} × {entry.quantity} · ◈ {entry.price} {entry.fee ? `(수수료 ${entry.fee})` : ""}
                                      </p>
                                    )) : <p className="muted">아직 거래 내역이 없습니다.</p>}
                  <h3>팩션 상점</h3>
                  <p className="muted small">우호도 10과 은화 25로 보급품을 교환합니다.</p>
                  {Object.entries(game.reputation).map(([faction, reputation]) => (
                    <button
                      className="mini"
                      key={faction}
                      disabled={locked || reputation < 10 || game.gold < 25}
                      onClick={() => void act({ type: "factionShop", choice: faction })}
                    >
                      {faction} 상점 · 우호도 {reputation}
                    </button>
                  ))}
                  <h3>암시장</h3>
                  <p className="muted small">선택형 계약입니다. 빈 왕관 파편과 은화 30을 지불합니다.</p>
                  <button
                    className="secondary"
                    disabled={locked || !game.materials["빈 왕관 파편"] || game.gold < 30}
                    onClick={() => void act({ type: "darkMarket", choice: "token" })}
                  >
                    암시장 증표 교환
                  </button>
                </section>
              </div>
            ) : (
              <div className="storage-grid">
                <section className="panel">
                  <h2>안전하게 보관한 전리품</h2>
                  <p>
                    은화 <strong>{game.gold}</strong>
                  </p>
                  {Object.keys(game.materials).length ? (
                    Object.entries(game.materials).map(([m, n]) => (
                      <p className="inventory-row" key={m}>
                        <span>◇ {m}</span>
                        <strong>× {n}</strong>
                      </p>
                    ))
                  ) : (
                    <p className="muted">
                      아직 재료가 없습니다. 탐사에서 전리품을 얻고 귀환하세요.
                    </p>
                  )}
                  <h3>팩션 우호도</h3>
                  {Object.entries(game.reputation).map(([f, n]) => (
                    <p key={f} className="inventory-row">
                      <span>
                        {characters.find((c) => c.id.startsWith(f))!.faction}
                      </span>
                      <strong>{n}</strong>
                    </p>
                  ))}
                </section>
                <section className="panel">
                  <h2>탐사 기록</h2>
                  {game.log.map((l, i) => (
                    <p key={i} className="log-line">
                      {l}
                    </p>
                  ))}
                </section>
              </div>
            )}
            </section>}
          </>
        ) : (
          <>
            {run.mode === "battle" && battle ? (
              <>
                <div className="battle-toolbar">
                  <div>
                    <span className="eyebrow">
                      TURN {battle.turn.toString().padStart(2, "0")} / {balance.maxBattleTurns}
                    </span>
                    <h2>
                      행동 자원{" "}
                      <span className="energy">
                        {"◆".repeat(battle.energy)}
                        {"◇".repeat(4 - battle.energy)}
                      </span>
                    </h2>
                  </div>
                  <div className="deck-count">
                    뽑을 카드 {battle.deck.length} · 버린 카드{" "}
                    {battle.discard.length}
                    <button
                      className="secondary"
                      disabled={locked || battle.turn >= balance.maxBattleTurns}
                      onClick={() => void act({ type: "endTurn" })}
                    >
                      턴 종료 →
                    </button>
                  </div>
                </div>
                <div className="battlefield">
                  <section className="allies">
                    <h3 className="field-label">
                      탐사대 <span>아군 대상 선택</span>
                    </h3>
                    {run.heroes.map((h, index) => (
                      <button
                        key={h.id}
                        className={`ally rank-${index + 1} ${h.hp === 0 ? "fallen" : ""} ${selected && cardInfo(selected).target === "ally" ? "targetable" : ""}`}
                        disabled={
                          locked ||
                          !selected ||
                          cardInfo(selected).target !== "ally" ||
                          h.hp === 0
                        }
                        onClick={() => target(h.id)}
                        onDragOver={(event) => { event.preventDefault(); setPreviewTarget(h.id); }}
                        onDrop={(event) => { event.preventDefault(); target(h.id); setPreviewTarget(""); }}
                      >
                        <span className="rank-badge">{index + 1}</span>
                        <Crest id={h.id} motion={motionFor(h.id, "hero")} />
                        <div>
                          <h3>
                            {char(h.id).name} <small>{char(h.id).role}</small>
                          </h3>
                          <Meter value={h.hp} max={h.maxHp} />
                          <p>
                            HP {h.hp}/{h.maxHp} <span>◇ {h.shield}</span>
                          </p>
                          <small className="equipment-line">{h.equipment === "blade" ? "⚔ 훈련용 무기 +2" : "▣ 호신 부적 +3"}</small>
                          <small>
                            {h.hp === 0
                              ? "전투 불능"
                              : `스트레스 ${h.stress} · Lv.${h.level}`}
                          </small>
                              {h.stress > 0 && <span className="status-chip stress-chip">☾ 스트레스 {h.stress}</span>}
                              {h.injury && <span className="status-chip debuff-chip">부상</span>}
                              {previewTarget === h.id && <strong className="combat-preview">{previewFor(h.id)}</strong>}
                        </div>
                      </button>
                    ))}
                  </section>
                  <section className="enemies">
                    <h3 className="field-label">
                      적의 의도 <span>공격할 대상 선택</span>
                    </h3>
                    <div className="enemy-grid">
                      {battle.enemies.map((e) => (
                        <article
                          key={e.id}
                          className={`enemy ${e.hp === 0 ? "fallen" : ""}`}
                        >
                          <div className="intent">
                            {e.hp === 0 ? "처치 완료" : e.intent}
                            {e.hp > 0 &&
                              ["M02", "M05", "M07"].includes(e.id) && (
                                <small>대상: {char(e.target)?.name}</small>
                              )}
                          </div>
                          <button
                            className={`enemy-target ${selected && cardInfo(selected).target === "enemy" ? "targetable" : ""}`}
                            disabled={
                              locked ||
                              !selected ||
                              cardInfo(selected).target !== "enemy" ||
                              e.hp === 0
                            }
                            onClick={() => target(e.id)}
                            onDragOver={(event) => { event.preventDefault(); setPreviewTarget(e.id); }}
                            onDrop={(event) => { event.preventDefault(); target(e.id); setPreviewTarget(""); }}
                          >
                            <Crest id={e.id} large motion={motionFor(e.id, "enemy")} />
                            <h3>{monsters.find((m) => m.id === e.id)!.name}</h3>
                            <Meter value={e.hp} max={e.maxHp} />
                            <p>
                              HP {e.hp}/{e.maxHp} · ◇ {e.shield}
                            </p>
                            {e.mark > 0 && <span className="status-chip debuff-chip">표식 +{e.mark}</span>}
                            {e.stun > 0 && <span className="status-chip stun-chip">기절</span>}
                            {previewTarget === e.id && <strong className="combat-preview enemy-preview">{previewFor(e.id)}</strong>}
                          </button>
                          {e.tower > 0 && (
                            <button
                              className="tower-target"
                              disabled={
                                locked ||
                                !selected ||
                                cardInfo(selected).target !== "enemy"
                              }
                              onClick={() => target("M08:tower")}
                            >
                              성탑 파괴 {e.tower}/30
                            </button>
                          )}
                          <details>
                            <summary>공략 단서</summary>
                            <p>
                              {monsters.find((m) => m.id === e.id)!.counter}
                            </p>
                          </details>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>
                <section className="hand-section">
                  <div className="section-heading">
                    <h2>
                      손패 <span>{battle.hand.length} / 6</span>
                    </h2>
                    <span className="selection-hint" aria-live="polite">
                      {selected
                        ? `${cardInfo(selected).name} 선택됨 → ${cardInfo(selected).target === "ally" ? "아군" : "적"}을 선택하세요`
                        : "카드를 선택한 뒤 대상을 누르세요"}
                    </span>
                  </div>
                  <div className="hand">
                    {battle.hand.map((c) => {
                      const info = cardInfo(c),
                        disabled =
                          locked ||
                          battle.energy < info.cost ||
                          !run.heroes.some((h) => h.id === c.owner && h.hp > 0);
                      return (
                        <button
                          key={c.id}
                          aria-pressed={selected?.id === c.id}
                          aria-label={`${char(c.owner).name} ${info.name}`}
                          className={`play-card ${c.kind}`}
                          draggable={!disabled}
                          disabled={disabled}
                          onDragStart={() => { setSelected(c); setPreviewTarget(""); }}
                          onDragEnd={() => setPreviewTarget("")}
                          onClick={() =>
                            setSelected(selected?.id === c.id ? null : c)
                          }
                        >
                          <span className="card-cost">{info.cost}</span>
                          <span className="card-owner">
                            {char(c.owner).name}
                          </span>
                          <CardArt kind={c.kind} role={info.role} />
                          <strong>{info.name}</strong>
                          <span className="card-desc">{info.description}</span>
                          <small>
                            {info.target === "ally" ? "아군 대상" : "적 대상"} ·{" "}
                            {run.heroes.find((h) => h.id === c.owner)
                              ?.equipment === "blade"
                              ? "무기 +2"
                              : "호신 부적"}
                          </small>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </>
            ) : (
              <div className="explore-grid">
                <section className="map-panel">
                  <div className="section-heading">
                    <h2>탐사 경로</h2>
                    <span className="small muted">변경 요새</span>
                  </div>
                  <div className="route-map">
                    {["entrance", ...run.visited, ...rooms[run.room].next]
                      .filter((id, i, all) => all.indexOf(id) === i)
                      .map((id) => (
                      <div className="route-row" key={id}>
                          <button
                            key={id}
                            className={`room ${run.room === id ? "current" : ""} ${run.visited.includes(id) ? "visited" : ""}`}
                            disabled={
                              locked ||
                              run.mode !== "map" ||
                              !rooms[run.room].next.includes(id)
                            }
                            onClick={() => void act({ type: "move", id })}
                          >
                            <span>
                              {rooms[id].kind === "battle"
                                ? "⚔"
                                : rooms[id].kind === "rest"
                                  ? "✦"
                                  : rooms[id].kind === "puzzle"
                                    ? "◎"
                                    : rooms[id].kind === "exit"
                                      ? "⌂"
                                      : "◇"}
                            </span>
                            {rooms[id].name}
                            <small>
                              {run.room === id
                                ? "현재 위치"
                                : run.visited.includes(id)
                                  ? "탐사 완료"
                                  : rooms[run.room].next.includes(id)
                                    ? "이동 가능"
                                    : "미탐사"}
                            </small>
                          </button>
                      </div>
                    ))}
                  </div>
                </section>
                <section className="room-panel panel">
                  <span className="eyebrow">EXPEDITION JOURNAL</span>
                  <h2>
                    {run.mode === "reward"
                      ? "전투 승리"
                      : run.mode === "defeat"
                        ? "꺼져가는 등불"
                        : rooms[run.room].name}
                  </h2>
                  {run.mode === "reward" && run.reward ? (
                    <>
                      <div className="reward-emblem">✦</div>
                      <p>
                        적의 움직임이 멎었습니다.
                        <br />
                        흩어진 물품을 챙겨 탐사를 이어가세요.
                      </p>
                      <div className="reward-box">
                        <strong>◈ 은화 {run.reward.gold}</strong>
                        {run.reward.materials.map((m, i) => (
                          <span key={i}>◇ {m}</span>
                        ))}
                        <span>생존 동료 경험치 +{balance.battleXP}</span>
                      </div>
                      <button
                        className="primary full"
                        disabled={locked}
                        onClick={() => void act({ type: "claim" })}
                      >
                        보상 획득
                      </button>
                      <p className="small muted">
                        획득 후 귀환해야 창고에 안전하게 보관됩니다.
                      </p>
                    </>
                  ) : run.mode === "defeat" ? (
                    <>
                      <p>
                        전리품을 잃었습니다. 동료들은 부상을 입었지만 모두
                        귀환할 수 있습니다.
                      </p>
                      <button
                        className="primary full"
                        disabled={locked}
                        onClick={() => void act({ type: "return" })}
                      >
                        부상 입고 귀환
                      </button>
                    </>
                  ) : run.mode === "event" ? (
                    <>
                      {rooms[run.room].kind === "rest" ? (
                        <>
                          <p>
                            희미한 모닥불이 남아 있습니다. 잠시 숨을 고릅니다.
                          </p>
                          <p>생존 동료 체력 +24 · 스트레스 -4</p>
                          <button
                            disabled={locked}
                            className="primary full"
                            onClick={() =>
                              void act({ type: "event", choice: "rest" })
                            }
                          >
                            야영지에서 휴식
                          </button>
                        </>
                      ) : rooms[run.room].kind === "puzzle" ? (
                        <>
                          <p>봉인 위에 세 문양이 새겨져 있습니다.</p>
                          <blockquote>
                            “소리 없이도 시간을 알리던 것.
                            <br />
                            침묵한 지금도 그 이름은 남는다.”
                          </blockquote>
                          <div className="choices">
                            {[
                              ["crown", "왕관"],
                              ["star", "별"],
                              ["bell", "종"],
                            ].map(([id, label]) => (
                              <button
                                key={id}
                                disabled={locked}
                                onClick={() =>
                                  void act({ type: "event", choice: id })
                                }
                              >
                                {label} 문양
                              </button>
                            ))}
                          </div>
                          <p className="small muted">
                            단서: 이 탐사의 제목에 답이 있습니다. 틀려도
                            재시도할 수 있습니다.
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            왕국 정찰대가 붕괴된 통로를 지키고 있습니다. 남은
                            보급품을 건넵니다.
                          </p>
                          <p>생존 동료 체력 +15 · 왕국 우호도 +5</p>
                          <button
                            disabled={locked}
                            className="primary full"
                            onClick={() =>
                              void act({ type: "event", choice: "accept" })
                            }
                          >
                            보급을 받는다
                          </button>
                          <button
                            disabled={locked}
                            className="full"
                            onClick={() =>
                              void act({ type: "event", choice: "leave" })
                            }
                          >
                            조용히 지나간다
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="reward-emblem">♧</div>
                      <p>
                        {run.cleared
                          ? "캐슬 타이탄이 멈췄습니다. 요새의 침묵 속에서 돌아갈 길이 열립니다."
                          : "다음 방을 선택하세요. 갈림길에서는 한 경로만 탐사할 수 있습니다."}
                      </p>
                      <div className="reward-box">
                        <span>배낭 은화 ◈ {run.gold}</span>
                        <span>미확보 재료 {run.materials.length}개</span>
                      </div>
                      <button
                        disabled={locked}
                        className="primary full"
                        onClick={() => void act({ type: "return" })}
                      >
                        거점으로 귀환 →
                      </button>
                    </>
                  )}
                  <div className="run-party">
                    {run.heroes.map((h) => (
                      <div key={h.id}>
                        <span>{char(h.id).name}</span>
                        <Meter value={h.hp} max={h.maxHp} />
                        <small>
                          {h.hp}/{h.maxHp}
                        </small>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
            <section className="battle-log">
              <span className="eyebrow">최근 기록</span>
              <p aria-live="polite">{game.log.at(-1)}</p>
            </section>
          </>
        )}
        <footer>
          <span>침묵의 종 아래 · 첫 플레이 버전</span>
          <span>임시 실루엣 자산 / 서버 자동 저장</span>
        </footer>
      </main>
    </div>
  );
}
