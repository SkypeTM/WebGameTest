"use client";
import { useEffect, useRef, useState } from "react";
import { type Game, type Action, storyQuests, characters } from "../../lib/game";
import { achievementInfo } from "../../lib/achievement-labels";
import HubDialog from "./HubDialog";
import { progressAchievements, achievementProgress } from "../../lib/progress-achievements";

export function AchievementNotice({ ids }: { ids: string[] }) {
  const previous = useRef<Set<string> | null>(null);
  const [queue, setQueue] = useState<string[]>([]);
  useEffect(() => {
    if (previous.current) {
      const fresh = ids.filter(id => !previous.current!.has(id));
      if (fresh.length) setQueue(q => [...q, ...fresh]);
    }
    previous.current = new Set(ids);
  }, [ids]);
  useEffect(() => {
    if (!queue.length) return;
    const timer = setTimeout(() => setQueue(q => q.slice(1)), 5000);
    return () => clearTimeout(timer);
  }, [queue]);
  if (!queue.length) return null;
  const info = achievementInfo(queue[0]);
  return <aside className="achievement-notice" role="status" aria-live="polite"><span>업적 달성 · {info.tier}</span><strong>{info.name}</strong><button onClick={()=>setQueue(q=>q.slice(1))} aria-label="업적 알림 닫기">×</button></aside>;
}

export default function PlayerProfile({ game, name, locked, act, close }: { game: Game; name: string; locked: boolean; act: (a: Action) => unknown; close: () => void }) {
  const title = game.selectedTitle ? achievementInfo(game.selectedTitle).name : "귀환자";
  return <HubDialog onClose={close}>
    <header className="overlay-heading"><div><span className="eyebrow">EXPLORER PROFILE</span><h2>{name} · {title}</h2></div><button autoFocus onClick={close}>닫기 ×</button></header>
    <div className="profile-grid">
      <section className="panel"><h3>탐사 기록</h3><p>귀환 {game.runs}회 · 이야기 {game.completedQuests.filter(id=>storyQuests.some(q=>q.id===id)).length}/{storyQuests.length}</p><p>은화 ◈ {game.gold} · 동료 {game.roster.length}명</p><h4>진행 중인 의뢰</h4><p>{storyQuests.find(q=>q.id===game.activeQuest)?.title || "진행 중인 의뢰 없음"}</p><h4>완료한 이야기</h4>{game.completedQuests.map(id=><p key={id}>{storyQuests.find(q=>q.id===id)?.title || (id.startsWith("Q00-") ? "기원의 기억" : "탐사 기록")}</p>)}</section>
      <section className="panel"><h3>팩션 우호도</h3>{Object.entries(game.reputation).map(([id,value])=><p key={id}>{characters.find(c=>c.id.startsWith(id))?.faction || id} <strong>{value}</strong></p>)}</section>
      <section className="panel"><h3>창고와 수집품</h3>{Object.entries(game.materials).map(([id,n])=><p key={id}>{id} × {n}</p>)}{Object.entries(game.codex).map(([id,items])=><p key={id}>{({characters:"인물",items:"아이템",monsters:"몬스터",cards:"카드",relics:"성물"} as Record<string,string>)[id] || id} · {items.length}종 발견</p>)}</section>
      <section className="panel"><h3>업적과 칭호</h3><button disabled={locked} onClick={()=>act({type:"selectTitle",id:""})}>기본 칭호 · 귀환자</button>{["브론즈","실버","골드","전설"].map(tier=><div key={tier}><h4>{tier}</h4>{game.achievements.filter(id=>achievementInfo(id).tier===tier).map(id=><button className="profile-achievement" key={id} disabled={locked} aria-pressed={game.selectedTitle===id} onClick={()=>act({type:"selectTitle",id})}>{achievementInfo(id).name}{game.selectedTitle===id ? " · 사용 중" : " · 칭호 적용"}</button>)}</div>)}</section>
      <section className="panel"><h3>다음 업적 목표</h3>{progressAchievements.filter(item=>!game.achievements.includes(item.id)).map(item=><div key={item.id} className="achievement-goal"><strong>{item.tier} · {item.name}</strong><p>{achievementProgress(game,item.metric)} / {item.goal}</p><progress aria-label={`${item.name} 진행도`} value={Math.min(item.goal,achievementProgress(game,item.metric))} max={item.goal}/></div>)}</section>
    </div>
  </HubDialog>;
}
