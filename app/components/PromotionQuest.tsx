import { promotionQuest } from "../../lib/promotion";
import { storyQuests, type Hero } from "../../lib/game";

export default function PromotionQuest({member,completed,gold,locked,onPromote}:{member:Hero;completed:string[];gold:number;locked:boolean;onPromote:()=>void}) {
  const q=promotionQuest(member,completed);
  const story=storyQuests.find(s=>s.id===q.quest);
  return <fieldset className="promotion-quest"><legend>승급 · {q.stage}/3단계</legend>
    {q.complete ? <p>계승 완료 · 역할 능력 강화 적용</p> : <>
      <strong>{q.title}</strong>
      <ul>{q.requirements.map((r,i)=><li key={r.label}>{r.met ? "✓" : "○"} {i===1 ? `「${story?.title || q.quest}」 완료` : r.label}</li>)}</ul>
      <p>{q.next===2 ? "전용 스킬에 생성 키워드 추가" : "수호 방어 +3 · 공격 공격력 +4 · 지원/제어 주문 +4"}</p>
      <button className="mini" disabled={locked || !q.eligible || gold<q.cost} onClick={onPromote}>{q.next}단계 승급 · ◈{q.cost}</button>
    </>}
  </fieldset>;
}
