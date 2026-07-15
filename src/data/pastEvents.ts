export type PastEvent = {
  id: number;
  title: string;
  date: string;
  venue: string;
};

export const pastEvents: PastEvent[] = [
  { id: 1, title: "뉴진스 팬미팅", date: "2026.06.15", venue: "KSPO DOME" },
  { id: 2, title: "세븐틴 콘서트", date: "2026.05.28", venue: "고척스카이돔" },
  { id: 3, title: "아이브 팝업스토어", date: "2026.05.10", venue: "더현대 서울" },
  { id: 4, title: "보이넥스트도어 팬사인회", date: "2026.04.19", venue: "상암 누리꿈스퀘어" },
  { id: 5, title: "NCT DREAM 콘서트", date: "2026.03.22", venue: "인스파이어 아레나" },
  { id: 6, title: "르세라핌 팝업", date: "2026.02.14", venue: "성수 프로젝트 렌트" },
  { id: 7, title: "aespa LIVE TOUR", date: "2026.01.31", venue: "잠실실내체육관" },
  { id: 8, title: "2025 SBS 가요대전", date: "2025.12.25", venue: "인스파이어 아레나" },
  { id: 9, title: "투모로우바이투게더 콘서트", date: "2025.11.08", venue: "KSPO DOME" },
  { id: 10, title: "아이유 데뷔 기념 전시", date: "2025.09.18", venue: "더 서울라이티움" },
  { id: 11, title: "제로베이스원 팬콘", date: "2025.08.03", venue: "고척스카이돔" },
  { id: 12, title: "워터밤 서울 2025", date: "2025.07.06", venue: "킨텍스 야외 글로벌 스테이지" },
];
