import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadUserProfile } from "@/lib/profile";
import { getUpcomingEvents, type EventSummary } from "@/lib/eventsApi";
import { loadConfirmedSchedule, type ConfirmedSchedule } from "@/lib/scheduleStore";
import BottomNav from "@/components/layout/BottomNav";
import MobileFrame from "@/components/layout/MobileFrame";
import Train from "../assets/Train.svg";
import Check from "../assets/Check.svg";
import Clock from "../assets/Clock.svg";
import TotalLogo from "../assets/TotalLogo.svg";
import { Bell, CalendarDays, ChevronRight, House, Plus, Sparkles, Star } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const profile = loadUserProfile();
  const nickname = profile?.nickname || "덕민";
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [activeEvent, setActiveEvent] = useState<EventSummary | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [confirmedSchedule, setConfirmedSchedule] = useState<ConfirmedSchedule | null>(null);

  useEffect(() => {
    let active = true;
    getUpcomingEvents()
      .then((response) => {
        if (!active) return;
        const events = response.events ?? [];
        const soonest = [...events].sort(
          (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
        )[0];
        setActiveEvent(soonest ?? null);
      })
      .catch(() => active && setActiveEvent(null))
      .finally(() => active && setIsLoadingEvent(false));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setConfirmedSchedule(activeEvent ? loadConfirmedSchedule(activeEvent.eventId) : null);
  }, [activeEvent]);

  const eventDateLabel = activeEvent
    ? new Date(activeEvent.startAt).toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    : "";
  const eventTimeLabel = activeEvent
    ? new Date(activeEvent.startAt).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  const departureItem = confirmedSchedule?.items.find((item) => item.type === "start");
  const mainItem = confirmedSchedule?.items.find((item) => item.type === "main");
  const nextItem = confirmedSchedule?.items.find(
    (item) => new Date(`${new Date().toISOString().slice(0, 10)}T${item.time}:00`).getTime() > Date.now(),
  );
  const completedChecklistCount =
    confirmedSchedule?.checklist.filter((item) => item.checked).length ?? 0;

  return (
    <MobileFrame>
      <div className="flex h-dvh flex-col bg-white">
        <header className="flex h-20 shrink-0 items-center justify-between px-5 pt-2">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex items-center gap-3"
          >
            <img src={TotalLogo} alt="로고" className="w-30" />
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="알림"
              onClick={() => navigate("/notifications")}
              className="relative grid h-10 w-10 place-items-center rounded-full  text-[#64748B]"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#EF4444] ring-1 ring-white" />
            </button>
            <button
              type="button"
              aria-label="마이페이지"
              onClick={() => navigate("/mypage")}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#E6FAF7] text-xs font-extrabold text-[#0F766E]"
            >
              {profile?.image && !imageLoadFailed ? (
                <img
                  src={profile.image}
                  alt={`${nickname} 프로필`}
                  className="h-full w-full rounded-full object-cover"
                  onError={() => setImageLoadFailed(true)}
                />
              ) : (
                nickname.slice(0, 1)
              )}
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-28 pt-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
          <section className="flex items-start justify-between">
            <div>
              <p className="text-xs font-extrabold text-[#22B8AD]">
                {new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}
              </p>
              <h1 className="mt-3 text-[30px] font-medium leading-[1.35] tracking-[-0.045em] text-[#0F172A]">
                {nickname}님, 오늘은
                <br />
                기다리던 날이에요.
              </h1>
            </div>
          </section>

          {isLoadingEvent ? (
            <div className="mt-7 flex h-[86px] items-center justify-center rounded-2xl border border-[#DCE9E6] text-xs text-[#94A3B8]">
              행사를 불러오는 중이에요...
            </div>
          ) : activeEvent ? (
            <button
              type="button"
              onClick={() => navigate(`/event/${activeEvent.eventId}`)}
              className="mt-7 flex w-full items-center gap-3 rounded-2xl border border-[#DCE9E6] bg-white p-3.5 text-left shadow-[0_4px_15px_rgba(15,23,42,0.05)]"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#0F172A] text-white">
                <Sparkles size={21} fill="white" />
              </span>
              <span className="min-w-0 flex-1">
                <small className="block text-[9px] font-semibold text-[#64748B]">
                  다가오는 이벤트
                </small>
                <strong className="mt-1 block truncate text-sm text-[#0F172A]">
                  {activeEvent.title}
                </strong>
                <span className="mt-1 block truncate text-[10px] text-[#64748B]">
                  {activeEvent.placeName || "장소 미정"} · {eventTimeLabel}
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-[#94A3B8]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/event/register")}
              className="mt-7 flex w-full items-center gap-3 rounded-2xl border border-dashed border-[#DCE9E6] bg-white p-3.5 text-left"
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#E6FAF7] text-[#138A80]">
                <Plus size={21} />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-sm text-[#0F172A]">등록된 행사가 없어요</strong>
                <span className="mt-1 block text-[10px] text-[#64748B]">
                  첫 행사를 등록해 보세요.
                </span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-[#94A3B8]" />
            </button>
          )}

          {activeEvent && confirmedSchedule && (
            <>
              <section className="mt-5 rounded-[26px] bg-[#38D9C7] px-6 pb-5 pt-6 text-[#063F3A] shadow-[0_14px_32px_rgba(56,217,199,0.2)]">
                <p className="mt-6 text-sm font-bold">AI 일정이 준비됐어요</p>
                <h2 className="font-deokgil-display mt-2 text-[28px] font-medium leading-[1.35] tracking-[-0.045em]">
                  {eventDateLabel}
                  <br />
                  {activeEvent.title}
                </h2>

                <div className="relative mt-8 flex items-start justify-between">
                  <span className="absolute left-5 right-5 top-3 border-t border-dashed border-[#0F766E]/30" />
                  <span className="relative z-10 flex flex-col items-center gap-2 text-[9px] font-semibold">
                    <i className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#22B8AD] not-italic">
                      <House size={13} />
                    </i>
                    출발
                  </span>
                  <strong className="relative z-10 mt-2 bg-[#38D9C7] px-2 text-[9px]">
                    {mainItem ? "공연 시작" : ""}
                  </strong>
                  <span className="relative z-10 flex flex-col items-center gap-2 text-[9px] font-semibold">
                    <i className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#22B8AD] not-italic">
                      <Star size={13} fill="#22B8AD" />
                    </i>
                    {activeEvent.placeName || "행사장"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 border-t border-[#0F766E]/20 pt-4">
                  <span className="flex flex-col gap-1 text-[10px] font-semibold">
                    출발 일정
                    <strong className="text-lg">{departureItem?.time || "-"}</strong>
                  </span>
                  <span className="flex flex-col gap-1 border-l border-[#0F766E]/20 pl-5 text-[10px] font-semibold">
                    공연 시작
                    <strong className="text-lg">{mainItem?.time || "-"}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/event/${activeEvent.eventId}`)}
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-extrabold text-[#0F766E]"
                >
                  오늘 일정 확인하기
                  <ChevronRight size={16} />
                </button>
              </section>

              {nextItem && (
                <section className="mt-8">
                  <div className="flex items-end justify-between">
                    <h2 className="mt-1 text-lg font-extrabold text-[#0F172A]">다음 일정</h2>
                  </div>

                  <article className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-[#DCE9E6] p-4">
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#64748B]">{nextItem.time}</p>
                      <strong className="mt-1 block text-xs text-[#0F172A]">{nextItem.label}</strong>
                    </div>
                    <img src={Clock} alt="시계" className="h-8 w-8 shrink-0 object-contain" />
                  </article>
                </section>
              )}

              <section className="mt-5 overflow-hidden rounded-2xl border border-[#DCE9E6]">
                <button
                  type="button"
                  onClick={() => navigate(`/event/${activeEvent.eventId}`)}
                  className="flex min-h-18 w-full items-center gap-3 px-4 text-left"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl">
                    <img src={Check} className="w-7" alt="체크리스트" />
                  </span>
                  <span className="flex-1">
                    <small className="block text-[10px] text-[#64748B]">준비물 체크</small>
                    <strong className="mt-1 block text-xs">
                      {confirmedSchedule.checklist.length}개 중 {completedChecklistCount}개 완료
                    </strong>
                  </span>
                  <ChevronRight size={17} className="text-[#94A3B8]" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/return-planner")}
                  className="flex min-h-18 w-full items-center gap-3 border-t border-[#DCE9E6] px-4 text-left"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#E6FAF7] text-[#22B8AD]">
                    <img src={Train} className="w-5" alt="귀가 플래너" />
                  </span>
                  <span className="flex-1">
                    <small className="block text-[10px] text-[#64748B]">귀가 플래너</small>
                    <strong className="mt-1 block text-xs">공연 종료 후 확인해 보세요</strong>
                  </span>
                  <ChevronRight size={17} className="text-[#94A3B8]" />
                </button>
              </section>
            </>
          )}

          {activeEvent && !confirmedSchedule && (
            <button
              type="button"
              onClick={() =>
                navigate("/schedule/create", {
                  state: {
                    eventId: activeEvent.eventId,
                    title: activeEvent.title,
                    startAt: activeEvent.startAt,
                    endAt: activeEvent.endAt,
                    placeName: activeEvent.placeName,
                  },
                })
              }
              className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-dashed border-[#7CEEDF] bg-[#F5FBFA] p-4 text-left"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#E6FAF7] text-[#138A80]">
                <CalendarDays size={19} />
              </span>
              <span className="flex-1">
                <strong className="block text-xs font-extrabold text-[#0F172A]">
                  아직 AI 일정을 만들지 않았어요
                </strong>
                <span className="mt-1 block text-[10px] text-[#64748B]">
                  출발부터 귀가까지 일정을 만들어 보세요.
                </span>
              </span>
              <ChevronRight size={17} className="shrink-0 text-[#94A3B8]" />
            </button>
          )}
        </main>

        <BottomNav />
      </div>
    </MobileFrame>
  );
}
