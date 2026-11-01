"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { characterBaseArt } from "../../lib/character-art";
import type { companionStories } from "../../lib/companion-stories";
import HubDialog from "./HubDialog";
import styles from "./CompanionStoryDialog.module.css";

type Story = ReturnType<typeof companionStories>[number];

/** Keep later colons in dialogue (times, quotations, and explanations) intact. */
function parseLine(line: string) {
  const separator = line.indexOf(":");
  if (separator <= 0 || !line.slice(0, separator).trim()) {
    return { speaker: "서술", text: line.trim(), narration: true };
  }
  return {
    speaker: line.slice(0, separator).trim(),
    text: line.slice(separator + 1).trim(),
    narration: false,
  };
}

export default function CompanionStoryDialog({ characterId, characterName, stories, locked, onComplete, onClose }: {
  characterId: string;
  characterName: string;
  stories: Story[];
  locked: boolean;
  onComplete: (id: string) => Promise<boolean>;
  onClose: () => void;
}) {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [lineIndex, setLineIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const storyButtons = useRef(new Map<string, HTMLButtonElement>());
  const returnFocusId = useRef<string | null>(null);
  const titleId = useId();
  // Recheck the current unlock result before every render, including restored UI state.
  const activeStory = stories.find(story => story.id === activeStoryId && story.unlocked && story.lines.length > 0);
  const visibleStoryId = activeStory?.id;
  const currentIndex = activeStory ? Math.min(lineIndex, activeStory.lines.length - 1) : 0;
  const line = activeStory ? parseLine(activeStory.lines[currentIndex]) : null;
  const art = characterBaseArt(characterId);
  const companionSpeaking = line?.speaker === characterName;

  useEffect(() => {
    if (visibleStoryId) {
      titleRef.current?.focus({ preventScroll: true });
    } else if (returnFocusId.current) {
      storyButtons.current.get(returnFocusId.current)?.focus({ preventScroll: true });
      returnFocusId.current = null;
    }
  }, [visibleStoryId]);

  function openStory(story: Story) {
    if (!story.unlocked || !story.lines.length) return;
    returnFocusId.current = story.id;
    setLineIndex(0);
    setSaveError("");
    setActiveStoryId(story.id);
  }

  function returnToList() {
    setActiveStoryId(null);
    setLineIndex(0);
    setSaveError("");
  }

  async function finishStory() {
    if (!activeStory || activeStory.completed || saving || locked || currentIndex !== activeStory.lines.length - 1) return;
    setSaving(true);
    setSaveError("");
    try {
      if (!await onComplete(activeStory.id)) setSaveError("읽음 기록을 저장하지 못했습니다. 연결과 조작권을 확인한 뒤 다시 시도하세요.");
    } catch {
      setSaveError("읽음 기록을 저장하지 못했습니다. 잠시 후 다시 시도하세요.");
    } finally {
      setSaving(false);
    }
  }

  function handleReadingKeys(event: KeyboardEvent<HTMLElement>) {
    if (!activeStory || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      setLineIndex(Math.max(0, Math.min(activeStory.lines.length - 1, currentIndex + direction)));
    }
  }

  return <HubDialog onClose={onClose} label={`${characterName}의 개인 이야기`}>
    <section className={styles.reader} aria-labelledby={titleId} onKeyDown={handleReadingKeys}>
      <header className={styles.header}>
        <div><span className={styles.eyebrow}>주점 · 동료 이야기</span><h2 id={titleId}>{characterName}의 이야기</h2></div>
        <button type="button" autoFocus className={styles.closeButton} onClick={onClose} aria-label="개인 이야기 닫기">닫기 <span aria-hidden="true">×</span></button>
      </header>

      {activeStory && line ? <>
        <div className={styles.chapterHeading}>
          <h3 ref={titleRef} tabIndex={-1}>{activeStory.title}</h3>
          <span aria-label={`전체 ${activeStory.lines.length}개 대사 중 ${currentIndex + 1}번째`}>{currentIndex + 1} / {activeStory.lines.length}</span>
        </div>
        <div className={styles.scene}>
          <figure className={`${styles.portrait} ${companionSpeaking ? styles.speaking : styles.listening}`}>
            {art ? <img src={art} alt={`${characterName} 상반신`} draggable={false} /> : <div className={styles.portraitFallback}>{characterName}</div>}
            <figcaption>{characterName}<small>{companionSpeaking ? "이야기하는 중" : "함께하는 동료"}</small></figcaption>
          </figure>
          <div className={`${styles.dialogue} ${line.narration ? styles.narration : line.speaker === "나" ? styles.playerLine : ""}`}>
            <div className={styles.dialogueText} aria-live="polite" aria-atomic="true">
              <span className={styles.srOnly}>{currentIndex + 1}번째 대사. </span>
              <strong className={styles.speaker}>{line.speaker}</strong>
              <p>{line.text}</p>
            </div>
            <small className={styles.keyHint}>좌우 방향키로 대사를 넘길 수 있습니다.</small>
          </div>
        </div>
        <footer className={styles.controls}>
          <button type="button" className={styles.listButton} disabled={saving} onClick={returnToList}>이야기 목록</button>
          <div className={styles.pageControls} aria-label="대사 이동">
            <button type="button" onClick={()=>setLineIndex(currentIndex - 1)} disabled={currentIndex === 0}><span aria-hidden="true">← </span>이전 대사</button>
            {currentIndex < activeStory.lines.length - 1
              ? <button type="button" onClick={()=>setLineIndex(currentIndex + 1)}>다음 대사<span aria-hidden="true"> →</span></button>
              : <button type="button" className={styles.finishButton} disabled={activeStory.completed || saving || locked} onClick={finishStory}>{saving ? "저장 중…" : activeStory.completed ? "읽음 기록됨 ✓" : "이야기 마치기 ✓"}</button>}
          </div>
        </footer>
        <p className={styles.readStatus} role="status">{saveError || (activeStory.completed ? "읽음 기록이 계정에 저장되어 있습니다. 언제든 다시 읽을 수 있습니다." : locked && !saving ? "읽기는 계속할 수 있습니다. 기록을 저장하려면 연결과 이 기기의 조작권이 필요합니다." : "마지막 대사에서 ‘이야기 마치기’를 누르면 읽음 기록을 계정에 저장합니다.")}</p>
      </> : <>
        <p className={styles.intro}>동료와 나누고 싶은 이야기를 고르세요.</p>
        {stories.length ? <ul className={styles.storyList}>{stories.map((story, index) => <li key={story.id} className={styles.storyItem}>
          {story.unlocked && story.lines.length ? <button type="button" className={styles.storyButton}
            ref={node => { if (node) storyButtons.current.set(story.id, node); else storyButtons.current.delete(story.id); }}
            onClick={()=>openStory(story)}>
            <span className={styles.chapterNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.storySummary}><strong>{story.title}</strong><small>{story.lines.length}개 대사 · {story.completed ? "읽음 ✓ · 다시 읽기" : "아직 읽지 않은 이야기"}</small></span>
            <span aria-hidden="true">→</span>
          </button> : <div className={styles.lockedStory}>
            <span className={styles.chapterNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div className={styles.storySummary}><h3>{story.title}</h3><small>{story.unlocked ? "이야기 준비 중" : "잠긴 이야기"}</small><p>{story.unlocked ? "이 동료의 다음 이야기를 준비하고 있습니다." : story.requirement}</p></div>
            <span aria-hidden="true">{story.unlocked ? "…" : "◇"}</span>
          </div>}
        </li>)}</ul> : <p className={styles.empty}>이 동료의 개인 이야기는 준비 중입니다.</p>}
      </>}
    </section>
  </HubDialog>;
}
