"use client";
import { useState } from "react";
import { characters, hero, heroStats, type Game } from "../../lib/game";
import { companionStories } from "../../lib/companion-stories";
import poses from "../../data/renewal_actor_manifest.json";
import CompanionStoryDialog from "./CompanionStoryDialog";
import CharacterSkillTree from "./CharacterSkillTree";
import { promotionStage } from "../../lib/promotion";
import { characterBaseArt } from "../../lib/character-art";
export default function TavernDossier({game, locked, onCompleteStory}:{game:Game; locked:boolean; onCompleteStory:(id:string)=>Promise<boolean>}) {
  const [selected,setSelected]=useState(game.party[0] || game.roster[0]?.id || "AR1");
  const [storyOpen,setStoryOpen]=useState(false);
  const character=characters.find(c=>c.id===selected)!;
  const member=game.roster.find(h=>h.id===selected) || hero(selected);
  const stats=heroStats(member);
  const art=characterBaseArt(selected) || poses.find(p=>p.id===selected && p.pose==="ready")?.path;
  const stories=companionStories(game,selected);
  return <section className="tavern-dossier" aria-label="동료 상세 기록">
    <nav className="tavern-roster" aria-label="동료 선택">{game.roster.map(h=><button key={h.id} aria-pressed={selected===h.id} onClick={()=>{setSelected(h.id);setStoryOpen(false);}}>{characters.find(c=>c.id===h.id)?.name}</button>)}</nav>
    <div className="tavern-character">{art && <img src={art} alt={`${character.name} 전신 원화`} />}<h2>{character.name} <small>Lv.{member.level}</small></h2></div>
    <div className="tavern-dossier-body"><span className="eyebrow">{character.faction} · {character.role}</span><h3>전투 능력</h3>
      <dl className="tavern-stat-grid">{Object.entries({HP:stats.maxHp,MP:stats.maxMana,공격:stats.attack,방어:stats.defense,주문:stats.spell,"치명타 %":stats.crit}).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <h3>고유 능력과 카드 해금</h3><ol className="tavern-skill-path"><li><strong>{stats.trait}</strong><p>{stats.traitDescription}</p></li><li><strong>{stats.skill}</strong><p>{stats.skillDescription}</p></li><li aria-label={member.level>=3 ? "해금됨" : "잠김"}>Lv.3 · 방어 카드 보존 {member.level>=3 ? "✓" : "🔒"}</li><li>Lv.5 · 전용 스킬 발견 {member.level>=5 ? "✓" : "🔒"}</li><li>상위 전직 · 전용 스킬 생성 {member.promotion ? "✓" : "🔒"}</li></ol>
      <p>승급 {promotionStage(member)}/3단계 · {promotionStage(member)===3 ? "계승 완료 · 역할 능력 강화" : "훈련장에서 승급 의뢰 확인"}</p>
      <button className="secondary" aria-label={`${character.name} 개인 이야기 열기`} onClick={()=>setStoryOpen(true)}>▤ 개인 이야기 · {stories.filter(s=>s.unlocked).length}/{stories.length} 해금 · {stories.filter(s=>s.completed).length}편 읽음</button>
    </div>
    <div className="tavern-growth-tree"><CharacterSkillTree member={member} characterName={character.name} /></div>
    {storyOpen && <CompanionStoryDialog key={selected} characterId={selected} characterName={character.name} stories={stories} locked={locked} onComplete={onCompleteStory} onClose={()=>setStoryOpen(false)} />}
  </section>;
}
