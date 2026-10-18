'use client';
import { useState } from 'react';
import FullBodyActor from '../components/FullBodyActor';
import poses from '../../data/renewal_actor_manifest.json';
import '../renewal-combat.css';
import './preview.css';
const heroes = { AR1: '레오나', AR2: '세린', AR3: '마리엔', AR4: '에델' };
const labels: Record<string,string> = { ready:'대기', windup:'공격 준비', strike:'타격', recover:'회수', hit:'피격', guard:'방패 반격', heal:'응급 회복', skill:'전용 스킬' };
export default function Preview() {
  const [id,setId] = useState<keyof typeof heroes>('AR1');
  const [motion,setMotion] = useState('motion-strike');
  const [frame,setFrame] = useState<string|null>(null);
  const [replay,setReplay] = useState(0);
  const entries = poses.filter(p=>p.id===id);
  const selected = entries.find(p=>p.pose===frame);
  const skill = id==='AR1'?'motion-guard':id==='AR3'?'motion-heal':'motion-strike motion-skill';
  function play(value:string) { setFrame(null);setMotion(value);setReplay(n=>n+1); }
  return <main className="actor-preview">
    <nav><a href="/roadmap">← 앞으로의 여정</a><a href="/">게임으로</a></nav>
    <h1>전투 연출 미리보기</h1>
    <p>기본 파티의 전신 자세를 살펴보세요. 게임 진행과 저장 데이터에는 영향을 주지 않습니다.</p>
    <div className="preview-layout">
      <section className="preview-stage" aria-label={`${heroes[id]} ${frame?labels[frame]:'동작 재생'}`}>
        {selected ? <img src={selected.path} width={selected.width} height={selected.height} alt={`${heroes[id]} ${labels[selected.pose]}`} /> : <FullBodyActor key={`${id}-${replay}`} id={id} motion={motion}/>}
      </section>
      <section className="preview-controls" aria-label="연출 조작">
        <label>캐릭터<select value={id} onChange={e=>{setId(e.target.value as keyof typeof heroes);setFrame(null);setMotion('motion-strike');}}>{Object.entries(heroes).map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label>
        <h2>동작 재생</h2>
        <div className="preview-buttons">{[['motion-strike','기본 공격'],['motion-hit','피격'],[skill,'전용 스킬']].map(([value,label])=><button key={value} aria-pressed={!frame&&motion===value} onClick={()=>play(value)}>{label}</button>)}</div>
        <button onClick={()=>play(motion)}>다시 재생</button>
        <h2>개별 자세</h2>
        <div className="preview-buttons">{entries.map(p=><button key={p.pose} aria-pressed={frame===p.pose} onClick={()=>setFrame(p.pose)}>{labels[p.pose]}</button>)}</div>
        <p>동작은 약 0.9초 후 대기로 돌아옵니다. 운영체제의 동작 줄이기가 켜져 있으면 개별 자세로 확인하세요.</p>
        <small>현재는 자세 전환 방식입니다. 연속 리깅과 실제 전투 전체 검증은 진행 중입니다.</small>
      </section>
    </div>
  </main>;
}
