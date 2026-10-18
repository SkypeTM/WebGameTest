import roadmap from "../../data/roadmap.json";
import "./roadmap.css";

export const metadata = { title: "개발 현황 | 침묵의 종 아래" };
export default function RoadmapPage() {
  return (
    <main className="roadmap-page">
      <nav>
        <a href="/">← 게임으로</a>
        <a href="/animation-preview">전투 연출 미리보기 →</a>
        <span>업데이트 {roadmap.updated}</span>
      </nav>
      <header>
        <p>침묵의 종 아래</p>
        <h1>앞으로의 여정</h1>
        <p>
          완료된 기능과 남은 작업을 구분한 개발 현황입니다. 일정 확약이 아닌
          진행 순서이며, 패치마다 갱신합니다.
        </p>
      </header>
      <section className="roadmap-list" aria-label="개발 작업 목록">
        {roadmap.items.map((item) => (
          <article key={item.id}>
            <span className="roadmap-status">{item.status}</span>
            <h2>
              {item.id} · {item.title}
            </h2>
            <p>{item.detail}</p>
            <details>
              <summary>완료 기준</summary>
              <p>{item.done}</p>
            </details>
          </article>
        ))}
      </section>
      <footer>
        게임 기능 검증은 로컬 플레이 봇을 우선 사용하고, 화면·모션·음향 변경은
        해당 부분만 직접 확인합니다. QA 결과와 개인 저장 데이터는 이 페이지에
        공개하지 않습니다.
      </footer>
    </main>
  );
}
