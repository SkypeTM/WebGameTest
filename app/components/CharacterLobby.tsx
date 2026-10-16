"use client";

const facilities = [
  ["party", "탐사대", "편성 · 장비"],
  ["quests", "의뢰", "이야기 · 지역"],
  ["roster", "주점", "동료 모집"],
  ["growth", "거점 시설", "제작 · 훈련 · 치료"],
  ["market", "시장", "거래 · 암시장"],
  ["storage", "기록", "전리품 · 로그"],
];

export default function CharacterLobby({
  name,
  portrait,
  region,
  summary,
  open,
}: {
  name: string;
  portrait?: string;
  region: string;
  summary?: string | null;
  open: (facility: string) => void;
}) {
  return (
    <div className="character-lobby">
      <div className="lobby-character">
        {portrait && (
          <img src={portrait} alt={`${name} 대표 캐릭터`} draggable={false} />
        )}
        <div className="lobby-name">
          <span>이번 탐사의 선봉</span>
          <strong>{name}</strong>
        </div>
      </div>
      <section className="lobby-departure" aria-label="다음 탐사 준비">
        <span className="lobby-kicker">다음 목적지</span>
        <h2>{region}</h2>
        <p>
          동료의 장비와 덱을 확인하고,
          <br />
          종소리가 멎은 곳으로 향하세요.
        </p>
        <button
          className="lobby-departure-button"
          onClick={() => open("party")}
        >
          출정 준비 <span aria-hidden="true">→</span>
        </button>
        <button className="lobby-story-button" onClick={() => open("quests")}>
          진행 중인 이야기 보기
        </button>
        {summary && <p className="lobby-last-record">{summary}</p>}
      </section>
      <nav className="lobby-dock" aria-label="거점 시설">
        {facilities.map(([id, label, description]) => (
          <button key={id} onClick={() => open(id)}>
            <strong>{label}</strong>
            <small>{description}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}
