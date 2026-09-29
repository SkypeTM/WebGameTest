"use client";
import { useState } from "react";
import LivingBackdrop from "./LivingBackdrop";
import { originRegions } from "../../lib/prologue";
import { originBenefits } from "../../lib/progression";
import type { Game, Action } from "../../lib/game";
import scenes from "../../data/prologue_scenes.json";
import design from "../../data/faction_start_design_v1.json";
import npcs from "../../data/story_npcs.json";
import { dialogueArt } from "../../lib/story-art";
import "../prologue.css";
const introductions: Record<string, string[]> = {
  AR: [
    "봉화는 사흘째 꺼지지 않았습니다. 정상이라는 마지막 보고와 현장의 경보가 서로 맞지 않아요.",
    "명령서와 현장을 함께 확인하겠습니다. 돌아오지 못한 사람부터 찾죠.",
  ],
  VR: [
    "입항하지 않은 배에 정박료가 청구됐습니다. 서명은 남았지만 책임질 사람은 없습니다.",
    "계약서와 부두를 대조하죠. 없는 배의 비용을 누가 내고 있는지부터요.",
  ],
  BC: [
    "서고에서 문서의 내용만 사라졌습니다. 젖은 흔적보다 먼저 생긴 빈칸이에요.",
    "빈 문서도 증거입니다. 원본을 보존하고 지워진 이름을 찾아보죠.",
  ],
  BK: [
    "공개 색인에 없는 회랑을 찾았습니다. 잠긴 것은 문이 아니라 누군가의 증언일지도 몰라요.",
    "먼저 서고의 기록과 대조하겠습니다. 모르는 이야기를 결론부터 정하지 않겠어요.",
  ],
  WS: [
    "성가는 끊기지 않는데 아무도 노래의 끝을 기억하지 못합니다. 환자들의 목소리가 묻히고 있어요.",
    "노래를 멈추기 전에 사람들의 이야기를 듣겠습니다. 무엇을 잃었는지 알아야 해요.",
  ],
  DS: [
    "외곽 장치가 같은 목소리를 반복합니다. 작동 기록에는 발화 명령이 없습니다.",
    "동력과 기록을 분리하죠. 멈추게 하되 남은 목소리까지 지우지는 않겠습니다.",
  ],
  GO: [
    "관측 시계는 멎었지만 별은 움직였습니다. 오래된 보고서와 오늘의 하늘이 다릅니다.",
    "직접 다시 관측하겠습니다. 눈앞의 증거를 남긴 뒤 기록과 비교하죠.",
  ],
  EF: [
    "피난민을 위한 자리를 비워 뒀습니다. 요새에는 실종자 명단이, 항구에는 귀환선 기록이 남아 있어요.",
    "우리가 갈 길을 정하죠. 요새에서 명단을 찾거나 항구에서 배를 수소문하겠습니다.",
  ],
};
export default function FactionPrologue({
  game,
  locked,
  act,
}: {
  game: Game;
  locked: boolean;
  act: (a: Action) => unknown;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const p = game.prologue!;
  const index = Object.keys(p.profile.answers).length;
  const faction = design.factions.find((f) => f.code === game.originFaction);
  const npc = faction ? npcs[faction.code as keyof typeof npcs] : null;
  const scene = scenes[index];
  return (
    <main className="prologue-screen live-scene-panel">
      <LivingBackdrop
        region={
          game.originFaction
            ? originRegions[game.originFaction]
            : [
                "fortress",
                "harbor",
                "archive",
                "chapel",
                "laboratory",
                "observatory",
                "palace",
              ][Math.min(index, 6)]
        }
      />
      <small>종이 멎은 밤 · {game.rebirths + 1}번째 이야기</small>
      {p.stage === "questions" && scene ? (
        <>
          <h1>{scene.title}</h1>
          <progress max={7} value={index} />
          <p>기억 {index + 1} / 7 · 선택은 계정에 저장됩니다.</p>
          <div className="memory-scene">{scene.scene.replace(/^> /gm, "")}</div>
          <div className="memory-choices">
            {scene.choices.map((c, i) => (
              <button
                disabled={locked}
                key={i}
                onClick={() =>
                  act({
                    type: "prologue",
                    choice: "answer",
                    id: scene.id,
                    target: "ABCD"[i],
                  })
                }
              >
                <strong>{c.label}</strong>
                <span>{c.line}</span>
              </button>
            ))}
          </div>
        </>
      ) : p.stage === "origin" ? (
        <>
          <h1>어디에서 이야기를 시작하시겠습니까?</h1>
          <p>
            당신은 아직 어느 세력에도 속하지 않았습니다. 성향은 관점의 거리이며,
            시작을 제한하지 않습니다.
          </p>
          <p>
            가장 가까운 관점:{" "}
            {p.profile.closest
              .map((c) => design.factions.find((f) => f.code === c)?.name)
              .join(" · ")}
            <br />
            가장 거리가 먼 관점:{" "}
            {p.profile.farthest
              .map((c) => design.factions.find((f) => f.code === c)?.name)
              .join(" · ")}{" "}
            — 틀린 선택이라는 뜻은 아닙니다.
          </p>
          <div className="origin-grid">
            {design.factions.map((f) => (
              <button
                key={f.code}
                aria-pressed={selected === f.code}
                onClick={() => setSelected(f.code)}
              >
                <h2>{f.name}</h2>
                <meter
                  min={0}
                  max={100}
                  value={p.profile.affinity[f.code] || 0}
                />
                <span>
                  {Math.round(p.profile.affinity[f.code] || 0)}% · {f.core}
                </span>
                <p>
                  {f.start_region}
                  <br />
                  {f.q0}
                </p>
                <small>{f.combat}</small>
                {selected === f.code && (
                  <>
                    <p>강점: {f.strength}</p>
                    <p>약점: {f.weakness}</p>
                    <p>{f.theme}</p>
                    <small>
                      파티는 해당 팩션의 4명으로 시작합니다.{" "}
                      {originBenefits[f.code]?.label}
                    </small>
                  </>
                )}
              </button>
            ))}
          </div>
          <button
            className="primary"
            disabled={locked || !selected}
            onClick={() =>
              act({ type: "prologue", choice: "origin", id: selected! })
            }
          >
            선택한 팩션으로 시작
          </button>
        </>
      ) : faction && npc ? (
        <>
          <h1>{faction.q0}</h1>
          <img
            className="prologue-npc"
            src={dialogueArt(faction.code, "explain", true)}
            alt={npc.name}
          />
          <p>
            <strong>{npc.name}</strong> — {introductions[faction.code][0]}
          </p>
          <p>
            <strong>탐사대 대표</strong> — {introductions[faction.code][1]}
          </p>
          {faction.code === "EF" ? (
            <div className="memory-choices">
              {["fortress", "harbor"].map((r, i) => (
                <button
                  disabled={locked}
                  key={r}
                  onClick={() =>
                    act({ type: "prologue", choice: "begin", target: r })
                  }
                >
                  {i === 0 ? "변경 요새로" : "심연 항구로"}
                </button>
              ))}
            </div>
          ) : (
            <button
              disabled={locked}
              className="primary"
              onClick={() => act({ type: "prologue", choice: "begin" })}
            >
              첫 조사를 수락한다
            </button>
          )}
        </>
      ) : null}
    </main>
  );
}
