import type { Metadata } from "next";
import "./style.css";
export const metadata: Metadata = {
  title: "침묵의 종 아래 | 첫 번째 탐사",
  description: "팩션 파티를 이끌고 변경 요새의 침묵을 조사하세요.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
