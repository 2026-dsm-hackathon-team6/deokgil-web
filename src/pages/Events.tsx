import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";
import MobileFrame from "@/components/layout/MobileFrame";
import { loadDeletedEventIds } from "@/lib/events";
import { ChevronRight, Plus, Link } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    day: "18",
    month: "JUL",
    title: "2026 IU WORLD TOUR",
    venue: "KSPO DOME",
    time: "18:00",
    status: "D-5",
    dateTone: "bg-[#DDF8F4] text-[#138A80]",
  },
  {
    id: 2,
    day: "02",
    month: "AUG",
    title: "SEVENTEEN FAN MEETING",
    venue: "인스파이어 아레나",
    time: "17:00",
    status: "D-20",
    dateTone: "bg-[#E6FAF7] text-[#0F9F95]",
  },
  {
    id: 3,
    day: "14",
    month: "SEP",
    title: "무신사 뷰티 페스타",
    venue: "성수동 일대",
    time: "11:00",
    status: "D-63",
    dateTone: "bg-[#F0FDFA] text-[#22B8AD]",
  },
];

export default function Events() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [events] = useState(() => {
    const deletedEventIds = new Set(loadDeletedEventIds());
    return upcomingEvents.filter(
      (event) => !deletedEventIds.has(String(event.id)),
    );
  });

  return (
    <MobileFrame>
      <div className="flex h-screen flex-col bg-white">
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
              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => navigate(`/event/${event.id}`)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-[#DCE9E6] bg-white p-3.5 text-left"
                    >
                      <span
                        className={`flex h-15.5 w-14 shrink-0 flex-col items-center justify-center rounded-xl ${event.dateTone}`}
                      >
                        <strong className="text-2xl leading-none">
                          {event.day}
                        </strong>
                        <small className="mt-1 text-[9px] font-extrabold tracking-wider">
                          {event.month}
                        </small>
                      </span>
                      <span className="min-w-0 flex-1">
                        <small className="inline-flex rounded-md bg-[#E6FAF7] px-1.5 py-1 text-[9px] font-extrabold text-[#22B8AD]">
                          {event.status}
                        </small>
                        <strong className="mt-1.5 block truncate text-sm text-[#0F172A]">
                          {event.title}
                        </strong>
                        <span className="mt-1 block truncate text-[11px] text-[#64748B]">
                          {event.venue} · {event.time}
                        </span>
                      </span>
                      <ChevronRight
                        size={17}
                        className="shrink-0 text-[#CBD5E1]"
                      />
                    </button>
                  ))}
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
