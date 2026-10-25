"use client";
import { useState } from "react";
import { regionCatalog, storyQuests, unlockedRegions, type RegionId } from "../../lib/game";
import { sceneAsset } from "../../lib/scenery";

const locations = [[19,72],[39,83],[52,61],[29,39],[69,44],[66,19],[85,22]] as const;

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
        <span className="atlas-heading">침묵의 땅 · 탐사 지도</span>
        <svg viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
          <defs><pattern id="atlas-grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="#e7d09b" strokeOpacity=".08" /></pattern></defs>
          <rect width="1000" height="700" fill="url(#atlas-grid)" />
          <path className="atlas-land" d="M105 600L80 470 145 380 120 280 240 190 345 220 440 90 560 115 660 65 805 90 935 200 870 320 910 420 795 490 690 455 605 560 455 535 410 650 290 595 220 640Z" />
          <path className="atlas-river" d="M550 110Q430 280 560 390T420 620" />
          {locations.slice(1).map(([x,y],i) => <line key={i} className={available.includes(regionCatalog[i+1].id) ? "atlas-route open" : "atlas-route"} x1={locations[i][0]*10} y1={locations[i][1]*7} x2={x*10} y2={y*7} />)}
          <text x="845" y="600" className="atlas-compass">✧</text><text x="864" y="550" className="atlas-north">N</text>
        </svg>
        {regionCatalog.map((r,i) => <button key={r.id} className={`atlas-pin ${available.includes(r.id) ? "open" : "locked"}`} aria-pressed={r.id === selected}
          style={{left:`${locations[i][0]}%`,top:`${locations[i][1]}%`}} onClick={() => setSelected(r.id)}>
          <span aria-hidden="true">{available.includes(r.id) ? "◆" : "◇"}</span><strong>{r.name}</strong><small>{available.includes(r.id) ? "탐사 가능" : "미개방"}</small>
        </button>)}
      </div>
    </div>
    <aside className="atlas-detail" aria-live="polite">
      <img src={sceneAsset(region.id)} alt={`${region.name} 전경`} />
      <div><span className="eyebrow">{unlocked ? "탐사 가능 지역" : "잠긴 지역"}</span><h2>{region.name}</h2><p>{region.description}</p>
        {!unlocked && <p className="atlas-lock">해금 조건: {requirement ? `「${requirement.title}」 완료` : "선행 이야기 완료"}</p>}
        <button className="lobby-departure-button" disabled={!unlocked} onClick={() => prepare(region.id)}>{unlocked ? "이 지역으로 파티 준비 →" : "지역 미개방"}</button>
        <small>지역을 고른 뒤 편성·장비와 퀵슬롯을 확인합니다.</small>
      </div>
    </aside>
  </section>;
}
