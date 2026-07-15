import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";
import MobileFrame from "@/components/layout/MobileFrame";
import { getUpcomingEvents, type EventSummary } from "@/lib/eventsApi";
import { ChevronRight, Plus, Link } from "lucide-react";

const getDayLabel = (startAt: string) => {
  const days = Math.ceil(
    (new Date(startAt).getTime() - new Date().setHours(0, 0, 0, 0)) /
      (24 * 60 * 60 * 1000),
  );
  return days <= 0 ? "D-DAY" : `D-${days}`;
};

export default function Events() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getUpcomingEvents()
      .then((response) => active && setEvents(response.events ?? []))
      .catch(() => active && setEvents([]))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <MobileFrame>
      <div className="flex h-dvh flex-col bg-white">
        <header className="flex items-center justify-between px-5 pb-4 pt-10">
          <h1 className="text-xl font-extrabold text-[#0F172A]">내 이벤트</h1>
        </header>

        <div className="grid h-12 shrink-0 grid-cols-2 border-b border-[#DCE9E6] px-5">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`relative text-sm font-bold ${
              activeTab === "upcoming" ? "text-[#0F172A]" : "text-[#94A3B8]"
            }`}
          >
            다가오는 행사
            <span className="ml-1.5 inline-grid h-5 min-w-5 place-items-center rounded-full bg-[#E6FAF7] px-1 text-[10px] text-[#22B8AD]">
              {events.length}
            </span>
            {activeTab === "upcoming" && (
              <span className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-[#22B8AD]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className={`relative text-sm font-bold ${
              activeTab === "past" ? "text-[#0F172A]" : "text-[#94A3B8]"
            }`}
          >
            지난 행사
            {activeTab === "past" && (
              <span className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-[#22B8AD]" />
            )}
          </button>
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-40 pt-5">
          {activeTab === "upcoming" ? (
            <>
              {isLoading ? (
                <div className="grid min-h-60 place-items-center text-sm text-[#94A3B8]">
                  행사를 불러오는 중이에요.
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((event) => {
                    const date = new Date(event.startAt);
                    return (
                    <button
                      key={event.eventId}
                      type="button"
                      onClick={() => navigate(`/event/${event.eventId}`)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-[#DCE9E6] bg-white p-3.5 text-left"
                    >
                      <span
                        className="flex h-15.5 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#E6FAF7] text-[#0F9F95]"
                      >
                        <strong className="text-2xl leading-none">
                          {String(date.getDate()).padStart(2, "0")}
                        </strong>
                        <small className="mt-1 text-[9px] font-extrabold tracking-wider">
                          {date.toLocaleString("en-US", { month: "short" }).toUpperCase()}
                        </small>
                      </span>
                      <span className="min-w-0 flex-1">
                        <small className="inline-flex rounded-md bg-[#E6FAF7] px-1.5 py-1 text-[9px] font-extrabold text-[#22B8AD]">
                          {getDayLabel(event.startAt)}
                        </small>
                        <strong className="mt-1.5 block truncate text-sm text-[#0F172A]">
                          {event.title}
                        </strong>
                        <span className="mt-1 block truncate text-[11px] text-[#64748B]">
                          {event.placeName || "장소 미정"} · {date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}
                        </span>
                      </span>
                      <ChevronRight
                        size={17}
                        className="shrink-0 text-[#CBD5E1]"
                      />
                    </button>
                  );
                  })}
                </div>
              ) : (
                <div className="grid min-h-60 place-items-center text-center">
                  <p className="text-sm text-[#94A3B8]">
                    등록된 이벤트가 없어요.
                    <br />
                    새로운 이벤트를 등록해 보세요.
                  </p>
                </div>
              )}

              <section className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-[#F5FBFA] px-5 py-5 text-[#64748B]">
                <Link size={19} />
                <p className="text-[11px] leading-relaxed">
                  행사 링크만 붙여넣어도
                  <br />
                  AI가 정보를 자동으로 찾아드려요.
                </p>
              </section>
            </>
          ) : (
            <div className="grid min-h-60 place-items-center text-center">
              <p className="text-sm text-[#94A3B8]">아직 지난 행사가 없어요.</p>
            </div>
          )}
        </main>

        <button
          type="button"
          onClick={() => navigate("/event/register")}
          className="absolute bottom-22 left-5 right-5 z-40 flex h-13 items-center justify-center gap-2 rounded-2xl bg-[#38D9C7] text-sm font-extrabold text-[#083D39] shadow-[0_8px_22px_rgba(34,184,173,0.22)]"
        >
          <Plus size={18} />
          이벤트 등록
        </button>

        <BottomNav />
      </div>
    </MobileFrame>
  );
}
