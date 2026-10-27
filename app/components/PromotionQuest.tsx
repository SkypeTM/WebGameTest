"use client";
import art from "../../data/promotion_art.json";
import HubDialog from "./HubDialog";
import { promotionQuest } from "../../lib/promotion";
import { storyQuests, type Hero } from "../../lib/game";

export default function PromotionQuest({member,completed,gold,locked,onPromote}:{member:Hero;completed:string[];gold:number;locked:boolean;onPromote:()=>void}) {
  const q=promotionQuest(member,completed);
  const [open,setOpen]=useState(false);
  const [artOpen,setArtOpen]=useState(false);
  const sheet=(art as Record<string,{path:string;description:string}>)[member.id];
  const lines=(dialogues as Record<string,Record<string,string[][]>>)[member.id]?.[String(q.next)];
  const story=storyQuests.find(s=>s.id===q.quest);
  return <fieldset className="promotion-quest"><legend>승급 · {q.stage}/3단계</legend>
    {q.complete ? <><p>계승 완료 · 역할 능력 강화 적용</p>{lines && <button type="button" className="mini" onClick={()=>setOpen(true)}>계승 이야기 다시 읽기</button>}</> : <>
      <strong>{q.title}</strong>
      {lines && <button type="button" className="mini" onClick={()=>setOpen(true)}>승급 의뢰 이야기</button>}
      <ul>{q.requirements.map((r,i)=><li key={r.label}>{r.met ? "✓" : "○"} {i===1 ? `「${story?.title || q.quest}」 완료` : r.label}</li>)}</ul>
      <p>{q.next===2 ? "전용 스킬에 생성 키워드 추가" : "수호 방어 +3 · 공격 공격력 +4 · 지원/제어 주문 +4"}</p>
      <button className="mini" disabled={locked || !q.eligible || gold<q.cost} onClick={onPromote}>{q.next}단계 승급 · ◈{q.cost}</button>
    </>}
    {sheet && <button type="button" className="mini" onClick={()=>setArtOpen(true)}>승급 의상 미리보기</button>}
    {artOpen && sheet && <HubDialog label="승급 의상 미리보기" onClose={()=>setArtOpen(false)}><header className="overlay-heading"><h2>승급 의상 미리보기</h2><button autoFocus onClick={()=>setArtOpen(false)}>닫기 ×</button></header><img style={{display:"block",width:"100%",height:"auto"}} src={sheet.path} alt={sheet.description}/><p>{sheet.description}</p><p>왼쪽부터 1·2·3단계 디자인입니다. 전투 모습에는 아직 반영되지 않았습니다.</p></HubDialog>}
    {open && lines && <PromotionConversation key={`${member.id}-${q.next}`} heroId={member.id} title={q.title} lines={lines} eligible={q.eligible} completed={q.complete} onClose={()=>setOpen(false)} />}
  </fieldset>;
}

import { useState } from "react";
import dialogues from "../../data/promotion_dialogues.json";
import PromotionConversation from "./PromotionConversation";
