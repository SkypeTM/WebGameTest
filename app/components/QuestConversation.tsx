"use client";
import { useEffect, useRef, useState } from "react";
import LivingBackdrop from "./LivingBackdrop";
import conversations from "../../data/story_dialogues.json";
import npcs from "../../data/story_npcs.json";
import { characters, storyQuests } from "../../lib/game";
import { dialogueArt, storyArt, type DialoguePose } from "../../lib/story-art";

export type ConversationRequest = {
  quest: keyof typeof conversations;
  phase: "briefing" | "return";
  accept?: boolean;
};
export default function QuestConversation({
  request,
  playerId,
  onClose,
  onAccept,
  locked,
  onAdvance,
}: {
  request: ConversationRequest;
  playerId: string;
  onClose: () => void;
  onAccept: () => void;
  locked: boolean;
  onAdvance?: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  const chapter = conversations[request.quest];
  const faction = chapter.npc as keyof typeof npcs;
  const npc = npcs[faction];
  const player = characters.find((c) => c.id === playerId) || characters[0];
  useEffect(() => {
    for (const pose of ["neutral", "explain", "resolve"] as const) {
      for (const src of [
        dialogueArt(player.id, pose),
        dialogueArt(faction, pose, true),
      ]) {
        if (src) {
          const image = new Image();
          image.src = src;
        }
      }
    }
  }, [player.id, faction]);
  const lines = chapter[request.phase];
  // Briefings begin with the NPC; return conversations begin with the party.
  const playerSpeaking =
    request.phase === "return" ? index % 2 === 0 : index % 2 === 1;
  const pose: DialoguePose = index >= lines.length - 2 ? "resolve" : "explain";
  const playerPose = playerSpeaking ? pose : "neutral",
    npcPose = playerSpeaking ? "neutral" : pose;
  const playerArt = dialogueArt(player.id, playerPose),
    npcArt = dialogueArt(faction, npcPose, true);
  const final = index === lines.length - 1;
  return (
    <dialog
      ref={dialog}
      className="story-conversation"
      aria-label={`${storyQuests.find((q) => q.id === request.quest)?.title} 대화`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <header>
        <div>
          <small>
            {request.phase === "return" ? "귀환 보고" : "이야기 의뢰"} ·{" "}
            {request.quest}
          </small>
          <h2>{storyQuests.find((q) => q.id === request.quest)?.title}</h2>
        </div>
        <button onClick={onClose}>닫기 ×</button>
      </header>
      <div className="conversation-stage live-scene-panel">
        <LivingBackdrop
          region={storyQuests.find((q) => q.id === request.quest)?.region}
        />
        <figure
          className={`conversation-person player ${playerSpeaking ? "speaking" : ""}`}
        >
          {playerArt && (
            <img
              key={playerArt}
              className={
                storyArt(`hero-${player.id}-${playerPose}`) ||
                storyArt(`hero-${player.id}-neutral`)
                  ? ""
                  : "legacy-dialogue-crop"
              }
              src={playerArt}
              alt={`${player.name} ${playerSpeaking ? "말하는 모습" : "듣는 모습"}`}
            />
          )}
          <figcaption>{player.name} · 탐사대</figcaption>
        </figure>
        <figure
          className={`conversation-person npc ${!playerSpeaking ? "speaking" : ""}`}
        >
          {npcArt ? (
            <img
              key={npcArt}
              src={npcArt}
              alt={`${npc.name} ${!playerSpeaking ? "말하는 모습" : "듣는 모습"}`}
            />
          ) : (
            <div className="portrait-pending">{npc.title}</div>
          )}
          <figcaption>
            {npc.name} · {npc.title}
          </figcaption>
        </figure>
      </div>
      <section
        className={`conversation-line ${playerSpeaking ? "player-line" : "npc-line"}`}
        aria-live="polite"
      >
        <strong>{playerSpeaking ? player.name : npc.name}</strong>
        <p>{lines[index]}</p>
      </section>
      <footer>
        <button
          disabled={index === 0}
          onClick={() => {
            onAdvance?.();
            setIndex((i) => i - 1);
          }}
        >
          ← 이전
        </button>
        <small>
          {index + 1} / {lines.length}
        </small>
        {!final ? (
          <button
            className="primary"
            onClick={() => {
              onAdvance?.();
              setIndex((i) => i + 1);
            }}
          >
            다음 →
          </button>
        ) : request.accept ? (
          <button className="primary" disabled={locked} onClick={onAccept}>
            의뢰 수락
          </button>
        ) : (
          <button className="primary" onClick={onClose}>
            대화 마치기
          </button>
        )}
      </footer>
      {request.accept && (
        <p className="conversation-objective">
          수락 후 해당 지역의 보스를 격파하고 야영지에서 안전 귀환하세요.
        </p>
      )}
    </dialog>
  );
}
