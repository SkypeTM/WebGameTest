'use client';
import { useEffect, useState } from 'react';
import FullBodyActor from '../components/FullBodyActor';
import FrameSampler from './FrameSampler';
import poses from '../../data/renewal_actor_manifest.json';
import '../renewal-combat.css';
import './preview.css';
const heroes = { AR1: '레오나', AR2: '세린', AR3: '마리엔', AR4: '에델' };
const labels: Record<string,string> = { ready:'대기', windup:'공격 준비', swing:'중간 동작', strike:'타격', recover:'회수', hit:'피격', guard:'방패 반격', heal:'응급 회복', skill:'전용 스킬' };
export default function Preview() {
  const [id,setId] = useState<keyof typeof heroes>('AR1');
  const [motion,setMotion] = useState('motion-strike');
  const [frame,setFrame] = useState<string|null>(null);
  const [replay,setReplay] = useState(0);
  const [speed,setSpeed] = useState(1);
  const [loop,setLoop] = useState(false);
  const [loadedId,setLoadedId] = useState('');
  const [loadError,setLoadError] = useState(false);
  const [loadAttempt,setLoadAttempt] = useState(0);
  const assetsReady = loadedId===id;
  useEffect(()=>{
    let active=true;
    setLoadedId('');setLoadError(false);
    const jobs=poses.filter(p=>p.id===id).map(p=>{
      const image=new Image();image.src=p.path;return image.decode();
    });
    void Promise.allSettled(jobs).then(results=>{
      if(!active)return;
      if(results.some(r=>r.status==='rejected'))setLoadError(true);
      else setLoadedId(id);
    });
    return ()=>{active=false;};
  },[id,loadAttempt]);
  useEffect(()=>{
    if (!assetsReady || !loop || frame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer=window.setTimeout(()=>setReplay(n=>n+1),1200/speed);
    return ()=>window.clearTimeout(timer);
  },[loop,frame,speed,replay,id,motion,assetsReady]);
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
        {!assetsReady ? <div className="preview-loading" role="status">{loadError?'원화를 불러오지 못했습니다.':'원화를 준비하고 있습니다.'}{loadError&&<button onClick={()=>setLoadAttempt(n=>n+1)}>다시 불러오기</button>}</div> : selected ? <img src={selected.path} width={selected.width} height={selected.height} alt={`${heroes[id]} ${labels[selected.pose]}`} /> : <FullBodyActor key={`${id}-${replay}-${speed}`} id={id} motion={motion} playbackRate={speed}/>}
      </section>
      <section className="preview-controls" aria-label="연출 조작">
        <label>캐릭터<select value={id} onChange={e=>{setId(e.target.value as keyof typeof heroes);setFrame(null);setMotion('motion-strike');}}>{Object.entries(heroes).map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label>
        <h2>동작 재생</h2>
        <div className="preview-buttons">{[['motion-strike','기본 공격'],['motion-hit','피격'],[skill,'전용 스킬']].map(([value,label])=><button key={value} aria-pressed={!frame&&motion===value} onClick={()=>play(value)}>{label}</button>)}</div>
        <button onClick={()=>play(motion)}>다시 재생</button>
        <label>재생 속도<select aria-label="재생 속도" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value={1}>1배속</option><option value={.5}>0.5배속</option><option value={.25}>0.25배속</option></select></label>
        <label className="preview-loop"><input type="checkbox" checked={loop} onChange={e=>setLoop(e.target.checked)}/> 반복 재생</label>
        <h2>개별 자세</h2>
        <div className="preview-buttons">{entries.map(p=><button key={p.pose} aria-pressed={frame===p.pose} onClick={()=>setFrame(p.pose)}>{labels[p.pose]}</button>)}</div>
        <p>1배속 동작은 약 0.9초 후 대기로 돌아옵니다. 개별 자세 선택 시 반복은 멈춥니다. 운영체제의 동작 줄이기가 켜져 있으면 개별 자세로 확인하세요.</p>
        <small>현재는 자세 전환 방식입니다. 연속 리깅과 실제 전투 전체 검증은 진행 중입니다.</small>
        <FrameSampler />
      </section>
    </div>
  </main>;
}
