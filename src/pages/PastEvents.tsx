import MobileFrame from "@/components/layout/MobileFrame";
import { pastEvents } from "@/data/pastEvents";
import { ArrowLeft, CalendarDays, ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PastEvents() {
  const navigate = useNavigate();

  return (
    <MobileFrame>
      <div className="flex h-dvh flex-col bg-white">
        <header className="flex items-center gap-3 border-b border-[#DCE9E6] px-5 pb-4 pt-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
            className="grid h-9 w-9 place-items-center rounded-full text-[#0F172A]"
          >
            <ArrowLeft size={19} />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-[#0F172A]">과거 일정</h1>
            <p className="mt-0.5 text-[11px] text-[#64748B]">
              지금까지 {pastEvents.length}개의 행사를 함께했어요
            </p>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-5">
          <section className="mb-5 flex items-center gap-3 rounded-2xl bg-[#E6FAF7] px-4 py-3.5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#22B8AD] shadow-sm">
              <CalendarDays size={19} />
            </span>
            <div>
              <p className="text-xs font-extrabold text-[#0F172A]">나의 덕질 기록</p>
              <p className="mt-0.5 text-[11px] text-[#64748B]">
                최근 일정부터 순서대로 모아봤어요.
              </p>
            </div>
          </section>

          <div className="space-y-2.5">
            {pastEvents.map((event) => {
              const [, month, day] = event.date.split(".");

              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => navigate(`/mypage/past-events/${event.id}`)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#DCE9E6] bg-white p-3.5 text-left transition-colors hover:bg-[#F8FCFB]"
                >
                  <time
                    dateTime={event.date.replaceAll(".", "-")}
                    className="flex h-14 w-13 shrink-0 flex-col items-center justify-center rounded-xl bg-[#F5FBFA] text-[#138A80]"
                  >
                    <strong className="text-lg leading-none">{day}</strong>
                    <span className="mt-1 text-[9px] font-extrabold">{month}월</span>
                  </time>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#E6FAF7] px-1.5 py-0.5 text-[9px] font-extrabold text-[#138A80]">
                        완료
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">{event.date}</span>
                    </div>
                    <h2 className="mt-1.5 truncate text-sm font-bold text-[#0F172A]">
                      {event.title}
                    </h2>
                    <p className="mt-1 flex min-w-0 items-center gap-1 text-[11px] text-[#64748B]">
                      <MapPin size={11} className="shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </p>
                  </div>
                  <ChevronRight size={17} className="shrink-0 text-[#CBD5E1]" />
                </button>
              );
            })}
          </div>
        </main>
      </div>
    </MobileFrame>
  );
}
