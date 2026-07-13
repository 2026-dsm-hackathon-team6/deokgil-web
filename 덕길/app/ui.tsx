import Link from "next/link";
import type { ReactNode } from "react";

export function Mark() { return <span className="logo-mark" aria-hidden="true"><i /><i /><i /></span>; }

export function Screen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mobile-screen ${className}`}>{children}</div>;
}

export function AppHeader({ title, back, action }: { title?: string; back?: string; action?: ReactNode }) {
  if (title) return <header className="page-header">{back ? <Link className="back-button" href={back}>‹</Link> : <span className="header-space" />}<h1>{title}</h1><div className="header-action">{action}</div></header>;
  return <header className="app-header"><Link className="wordmark" href="/"><Mark /><strong>덕길이</strong></Link><div><button className="round-action" aria-label="알림">♢<i /></button><Link className="profile-dot" href="/mypage">민</Link></div></header>;
}

export function EventPill() {
  return <Link className="event-pill" href="/events/iu-world-tour"><span className="event-art">✦</span><div><small>오늘의 이벤트</small><strong>2026 IU WORLD TOUR</strong><p>KSPO DOME · 18:00</p></div><span className="chevron">›</span></Link>;
}

export function MiniIcon({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "green" | "amber" | "red" }) {
  return <span className={`mini-icon ${tone}`}>{children}</span>;
}

export function BottomNav({ active }: { active: "today" | "events" | "schedule" | "map" | "my" }) {
  return <nav className="bottom-nav">
    <Link className={active === "today" ? "active" : ""} href="/"><span>⌂</span><b>오늘</b></Link>
    <Link className={active === "events" ? "active" : ""} href="/events"><span>▦</span><b>이벤트</b></Link>
    <Link className={active === "schedule" ? "active" : ""} href="/schedule"><span>◷</span><b>일정</b></Link>
    <Link className={active === "map" ? "active" : ""} href="/map"><span>⌖</span><b>주변</b></Link>
    <Link className={active === "my" ? "active" : ""} href="/mypage"><span>○</span><b>MY</b></Link>
  </nav>;
}

export function ProgressSteps({ current }: { current: number }) {
  return <div className="progress-steps"><i style={{ width: `${current * 33.33}%` }} /></div>;
}

export const Check = ({ done }: { done?: boolean }) => <span className={`check-box ${done ? "done" : ""}`}>{done ? "✓" : ""}</span>;
