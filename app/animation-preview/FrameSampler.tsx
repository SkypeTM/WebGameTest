'use client';
import { useEffect, useRef, useState } from 'react';
type Sample = { hz: number; p95: number; slow: number; count: number };
export default function FrameSampler() {
  const request = useRef(0);
  const [running,setRunning] = useState(false);
  const [sample,setSample] = useState<Sample|null>(null);
  const [note,setNote] = useState('반복 재생을 켠 뒤 측정하세요.');
  useEffect(()=>{
    const stop=()=>{if(document.hidden){cancelAnimationFrame(request.current);setRunning(false);setNote('탭이 숨겨져 측정을 중단했습니다. 다시 측정하세요.');}};
    document.addEventListener('visibilitychange',stop);
    return ()=>{cancelAnimationFrame(request.current);document.removeEventListener('visibilitychange',stop);};
  },[]);
  function measure() {
    cancelAnimationFrame(request.current);
    setRunning(true);setSample(null);setNote('3초 동안 이 탭을 열어 두세요.');
    let start=0,previous=0;
    const intervals:number[]=[];
    const tick=(now:number)=>{
      if(!start) start=now;
      if(previous) intervals.push(now-previous);
      previous=now;
      if(now-start<3000){request.current=requestAnimationFrame(tick);return;}
      const sorted=[...intervals].sort((a,b)=>a-b);
      if(sorted.length){
        const average=intervals.reduce((sum,n)=>sum+n,0)/intervals.length;
        setSample({hz:1000/average,p95:sorted[Math.ceil(sorted.length*.95)-1],slow:intervals.filter(n=>n>50).length,count:intervals.length});
        setNote('이 기기·이 화면의 브라우저 콜백 간격입니다. 원화 프레임 수나 실제 렌더 완료 FPS와 다릅니다.');
      } else setNote('측정할 프레임이 없습니다. 다시 시도하세요.');
      setRunning(false);
    };
    request.current=requestAnimationFrame(tick);
  }
  return <section className="frame-sampler" aria-label="재생 성능 측정">
    <h2>재생 성능</h2><button disabled={running} onClick={measure}>{running?'측정 중…':'3초 측정'}</button>
    <div role="status">{sample&&<p>평균 {sample.hz.toFixed(1)} Hz · 95% 간격 {sample.p95.toFixed(1)} ms<br/>50ms 초과 {sample.slow}회 / {sample.count}간격</p>}<small>{note}</small></div>
  </section>;
}
