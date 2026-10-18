const routes: Record<
  string,
  { icon: string; label: string; risk: string; opportunity: string }
> = {
  battle: {
    icon: "⚔",
    label: "전투",
    risk: "적과 교전 · 체력과 마나를 확인하세요",
    opportunity: "승리 후 전리품과 경험치",
  },
  boss: {
    icon: "♛",
    label: "보스",
    risk: "강력한 적 · 덱과 파티 상태를 점검하세요",
    opportunity: "지역의 최종 전투",
  },
  merchant: {
    icon: "◈",
    label: "암상인",
    risk: "거래에는 은화가 필요합니다",
    opportunity: "희귀 물품 · 카드 정비 · 유료 회복",
  },
  question: {
    icon: "?",
    label: "미지의 조우",
    risk: "조사 결과에 따라 손실이 생길 수 있습니다",
    opportunity: "숨은 보상 또는 사건 · 회피 선택 가능",
  },
  rest: {
    icon: "✦",
    label: "야영지",
    risk: "다음 경로로 떠나기 전 정비하세요",
    opportunity: "휴식으로 회복 · 거점 귀환 가능",
  },
  puzzle: {
    icon: "◎",
    label: "수수께끼",
    risk: "단서를 읽고 문양을 선택하세요",
    opportunity: "봉인 해제 시 보상",
  },
  faction: {
    icon: "◇",
    label: "팩션 조우",
    risk: "현장에서 선택지를 확인하세요",
    opportunity: "세력과의 만남",
  },
  exit: {
    icon: "⌂",
    label: "출입구",
    risk: "연결된 경로를 확인하세요",
    opportunity: "탐사의 시작과 마무리",
  },
};

export default function RouteBriefing({
  kind,
  name,
}: {
  kind: string;
  name: string;
}) {
  const route = routes[kind] || routes.faction;
  return (
    <aside className="route-briefing" aria-label="선택 경로 안내">
      <header>
        <span aria-hidden="true">{route.icon}</span>
        <div>
          <small>다음 목적지 · {route.label}</small>
          <h3>{name}</h3>
        </div>
      </header>
      <dl>
        <div>
          <dt>준비</dt>
          <dd>{route.risk}</dd>
        </div>
        <div>
          <dt>기회</dt>
          <dd>{route.opportunity}</dd>
        </div>
      </dl>
    </aside>
  );
}
