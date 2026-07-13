import type { Metadata } from "next";
import "./globals.css";
import "./pages.css";
import "./pages-extra.css";
import "./design-system.css";

export const metadata: Metadata = {
  title: "덕길이 | AI Event Assistant",
  description: "행사 전 준비부터 귀가까지, 가장 적절한 다음 행동을 추천하는 AI 이벤트 비서",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "덕길이 | AI Event Assistant",
    description: "행사 당일, 가장 좋은 다음 행동을 알려드려요",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "덕길이 AI Event Assistant" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "덕길이 | AI Event Assistant",
    description: "행사 당일, 가장 좋은 다음 행동을 알려드려요",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
