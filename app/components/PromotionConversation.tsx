"use client";
import { useState } from "react";
import { characters } from "../../lib/game";
import { dialogueArt } from "../../lib/story-art";
import HubDialog from "./HubDialog";

export default function PromotionConversation({heroId,title,lines,eligible,onClose}:{heroId:string;title:string;lines:string[][];eligible:boolean;onClose:()=>void}) {
  const [index,setIndex]=useState(0);
  const [failedArt,setFailedArt]=useState<string[]>([]);
  const character=characters.find(c=>c.id===heroId);
  const [speaker,line]=lines[index];
  const last=index===lines.length-1;
  const speaking=speaker===character?.name;
  const src=dialogueArt(heroId,speaking ? (last ? "resolve" : "explain") : "neutral");
  return <HubDialog label="승급 의뢰 이야기" onClose={onClose}>
    <header className="overlay-heading"><h2>{title}</h2><button autoFocus type="button" onClick={onClose}>닫기 ×</button></header>
    <section className="promotion-conversation">
      <div className={`promotion-portrait ${speaking ? "speaking" : "listening"}`}>
        {src && !failedArt.includes(src) ? <img src={src} alt={`${character?.name || heroId} 대화 초상`} onError={()=>setFailedArt(old=>[...old,src])}/> : <span className="promotion-monogram" aria-hidden="true">{character?.name.slice(0,1) || "◇"}</span>}
        <strong>{character?.name}</strong>
      </div>
      <div className="promotion-speech"><div aria-live="polite" aria-atomic="true"><span className="eyebrow">{speaker}</span><p>{line}</p><small>{index+1} / {lines.length}</small></div>
        {last && <p className="promotion-resolution">{eligible ? "성장 조건 충족 · 훈련장에서 비용을 확인하고 승급할 수 있습니다." : "훈련장에 표시된 성장 조건을 완료하세요."}</p>}
        <nav aria-label="승급 대화 진행"><button type="button" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}>이전</button><button type="button" onClick={()=>last ? onClose() : setIndex(i=>Math.min(lines.length-1,i+1))}>{last ? "조건 확인으로 돌아가기" : "다음 대사 →"}</button></nav>
      </div>
    </section>
  </HubDialog>;
}
