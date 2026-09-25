"use client";

import GamePage from "../page";

/** Portable route. The game state and API remain shared with the desktop route. */
export default function MobileGamePage() {
  return (
    <div className="mobile-page" data-platform="portable">
      <div className="mobile-route-banner" role="status">
        <span>♧ 모바일 탐사 모드</span>
        <small>가로 화면에서 전투와 손패를 넓게 볼 수 있습니다.</small>
        <a href="/?desktop=1">데스크톱 화면</a>
      </div>
      <GamePage />
    </div>
  );
}
