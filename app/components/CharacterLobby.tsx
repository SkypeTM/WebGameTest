"use client";
const facilities = [
  ["guild", "길드", "의뢰 · 동료 모집", 24, 27],
  ["party", "탐사대 숙소", "편성 · 장비", 16, 60],
  ["tavern", "주점", "이야기 · 탐사식량", 45, 67],
  ["forge", "대장간", "장비 제작", 75, 66],
  ["training", "훈련장", "캐릭터 훈련", 84, 37],
  ["infirmary", "교회", "캐릭터 치료", 51, 23],
  ["market", "상점", "재료 구매 · 판매", 66, 45],
] as const;
export default function CharacterLobby({ open }: {
  name: string; portrait?: string; region: string; summary?: string | null;
  open: (facility: string) => void;
}) {
  return <div className="estate-lobby">
    <header className="estate-caption"><span>THE LAST REFUGE</span><h2>침묵의 영지</h2><p>불빛이 켜진 시설을 선택하세요.</p></header>
    <nav className="estate-districts" aria-label="영지 시설 지도">
      {facilities.map(([id,name,description,x,y]) => <button key={id} className="estate-site" style={{left:`${x}%`,top:`${y}%`}} onClick={()=>open(id)}><span aria-hidden="true">◇</span><strong>{name}</strong><small>{description}</small></button>)}
    </nav>
    <footer className="estate-actions"><button onClick={()=>open('storage')}>출정 기록 · 전리품</button><button className="lobby-departure-button" onClick={()=>open('world')}>세계 지도 · 출정 준비 →</button></footer>
  </div>;
}
