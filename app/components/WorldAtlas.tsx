"use client";
import { useState } from "react";
import { regionCatalog, storyQuests, unlockedRegions, type RegionId } from "../../lib/game";
import { preparationSceneAsset } from "../../lib/scenery";

const locations = [[22,63],[47,84],[53,55],[26,33],[83,42],[57,17],[86,23]] as const;
const districts = ["0,350 350,350 380,510 240,560 0,560", "0,560 240,560 380,510 680,500 740,700 0,700", "350,270 650,270 680,500 380,510 350,350", "0,0 380,0 350,270 350,350 0,350", "650,270 700,210 1000,210 1000,700 740,700 680,500", "380,0 710,0 700,210 650,270 350,270", "710,0 1000,0 1000,210 700,210"];

export default function WorldAtlas({ completedQuests, initialRegion, prepare }: {
  completedQuests: string[]; initialRegion: string; prepare: (region: RegionId) => void;
}) {
  const [selected, setSelected] = useState<string>(initialRegion);
  const region = regionCatalog.find(r => r.id === selected) || regionCatalog[0];
  const available = unlockedRegions(completedQuests);
  const unlocked = available.includes(region.id);
  const requirement = storyQuests.find(q => "unlockRegion" in q && q.unlockRegion === region.id);
  return <section className="atlas-layout" aria-label="전체 탐사 지역">
    <div className="atlas-scroll">
      <div className="atlas-chart">
        <img className="atlas-world-art" src="/assets/world-map-districts-v4.png" width={1536} height={1024} alt="종탑과 검은 조류의 항구를 연결하는 일곱 탐사 구역" />
        <span className="atlas-heading">침묵의 땅 · 탐사 지도</span>
        <svg viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
          <defs><filter id="atlas-gray"><feColorMatrix type="saturate" values="0" /></filter>{districts.map((points,i)=><clipPath key={i} id={`atlas-district-${i}`}><polygon points={points}/></clipPath>)}</defs>
          {regionCatalog.map((r,i)=>!available.includes(r.id) && <g key={r.id} clipPath={`url(#atlas-district-${i})`}><image href="/assets/world-map-districts-v4.png" width="1000" height="700" preserveAspectRatio="none" filter="url(#atlas-gray)"/><polygon points={districts[i]} fill="#565b60" fillOpacity=".68"/></g>)}
          {regionCatalog.map((r,i)=>r.id===selected && <polygon key={r.id} className="atlas-selected-boundary" points={districts[i]}/>)}
          {locations.slice(1).map(([x,y],i) => <line key={i} className={available.includes(regionCatalog[i+1].id) ? "atlas-route open" : "atlas-route"} x1={locations[i][0]*10} y1={locations[i][1]*7} x2={x*10} y2={y*7} />)}
          <text x="845" y="600" className="atlas-compass">✧</text><text x="864" y="550" className="atlas-north">N</text>
        </svg>
        {regionCatalog.map((r,i) => <button key={r.id} className={`atlas-pin ${available.includes(r.id) ? "open" : "locked"}`} aria-pressed={r.id === selected} aria-describedby={!available.includes(r.id) ? `atlas-hint-${r.id}` : undefined}
          data-hint-above={locations[i][1] > 65} data-hint-edge={locations[i][0] > 75 ? "right" : locations[i][0] < 25 ? "left" : undefined}
          style={{left:`${locations[i][0]}%`,top:`${locations[i][1]}%`}} onClick={() => setSelected(r.id)}>
          <span aria-hidden="true">{available.includes(r.id) ? "◆" : "◇"}</span><strong>{r.name}</strong><small>{available.includes(r.id) ? "탐사 가능" : "미개방"}</small>
          {!available.includes(r.id) && <span role="tooltip" id={`atlas-hint-${r.id}`} className="atlas-unlock-hint">해금 조건: 「{storyQuests.find(q=>"unlockRegion" in q && q.unlockRegion===r.id)?.title || "선행 이야기"}」 완료</span>}
        </button>)}
      </div>
    </div>
    <aside className="atlas-detail" aria-live="polite">
      <img src={preparationSceneAsset(region.id)} alt={`${region.name} 전경`} />
      <div><span className="eyebrow">{unlocked ? "탐사 가능 지역" : "잠긴 지역"}</span><h2>{region.name}</h2><p>{region.description}</p>
        {!unlocked && <p className="atlas-lock">해금 조건: {requirement ? `「${requirement.title}」 완료` : "선행 이야기 완료"}</p>}
        <button className="lobby-departure-button" disabled={!unlocked} onClick={() => prepare(region.id)}>{unlocked ? "이 지역으로 파티 준비 →" : "지역 미개방"}</button>
        <small>지역을 고른 뒤 편성·장비와 퀵슬롯을 확인합니다.</small>
      </div>
    </aside>
  </section>;
}
