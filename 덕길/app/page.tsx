import Link from "next/link";
import { AppHeader, BottomNav, EventPill, MiniIcon, Screen } from "./ui";

export default function TodayPage() {
  return (
    <Screen>
      <AppHeader />
      <main className="screen-body home-body">
        <section className="hello-block">
          <div><p>7월 18일 토요일</p><h1>덕민님, 오늘은<br />기다리던 날이에요.</h1></div>
          <button className="weather-mini"><span>☂</span><strong>24°</strong></button>
        </section>
        <EventPill />
        <section className="next-card">
          <div className="ai-chip"><span>✦</span> AI NEXT ACTION</div>
          <p>이제 출발할 시간이에요</p>
          <h2>15분 안에 출발하면<br />여유롭게 도착해요.</h2>
          <div className="next-route"><span><i>⌂</i> 우리 집</span><b>52분</b><span><i>★</i> KSPO DOME</span></div>
          <div className="next-time"><span>추천 출발 <strong>15:40</strong></span><span>도착 예정 <strong>16:32</strong></span></div>
          <Link className="white-button" href="/schedule">오늘 일정 확인하기 <span>›</span></Link>
        </section>
        <section className="section-block">
          <div className="section-head"><div><small>AI BRIEFING</small><h2>오늘, 이것만 기억하세요</h2></div><Link href="/briefing">전체 보기</Link></div>
          <div className="brief-grid">
            <article><MiniIcon tone="blue">☂</MiniIcon><p>오후 9시부터 비</p><strong>작은 우산 챙기기</strong></article>
            <article><MiniIcon tone="amber">!</MiniIcon><p>굿즈 수령 대기</p><strong>약 20분 예상</strong></article>
          </div>
        </section>
        <section className="quick-list">
          <Link href="/checklist"><MiniIcon tone="green">✓</MiniIcon><div><p>준비물 체크</p><strong>5개 중 3개 완료</strong></div><span>›</span></Link>
          <Link href="/return"><MiniIcon tone="blue">⌁</MiniIcon><div><p>귀가 플래너</p><strong>막차까지 여유 있어요</strong></div><span>›</span></Link>
        </section>
      </main>
      <BottomNav active="today" />
    </Screen>
  );
}
