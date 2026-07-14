import { useNavigate } from "react-router-dom";
import { loadUserProfile } from "@/lib/profile";
import BottomNav from "@/components/layout/BottomNav";
import MobileFrame from "@/components/layout/MobileFrame";
import Train from "../assets/Train.svg";
import Check from "../assets/Check.svg";
import Umbrella from "../assets/Umbrella.svg";
import Clock from "../assets/Clock.svg";
import { Bell, ChevronRight, House, Sparkles, Star } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const profile = loadUserProfile();
  const nickname = profile?.nickname || "덕민";

  return (
    <MobileFrame>
      <div className="flex h-screen flex-col bg-white">
        <header className="flex h-20 shrink-0 items-center justify-between px-5 pt-2">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-end justify-center gap-0.5 rounded-xl bg-[#38D9C7] px-2 pb-2 shadow-[0_5px_14px_rgba(56,217,199,0.2)]">
              <i className="h-2 w-1 rotate-38 rounded-full bg-white" />
              <i className="h-4 w-1 rotate-38 rounded-full bg-white" />
              <i className="h-3 w-1 rotate-38 rounded-full bg-white" />
            </span>
            <strong className="text-xl font-extrabold tracking-[-0.04em] text-[#0F172A]">
              덕길이
            </strong>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="알림"
              onClick={() => navigate("/notifications")}
              className="relative grid h-10 w-10 place-items-center rounded-full bg-[#F5FBFA] text-[#64748B]"
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
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={`${nickname} 프로필`}
                  className="h-full w-full rounded-full object-cover"
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
                7월 18일 토요일
              </p>
              <h1 className="mt-3 text-[30px] font-medium leading-[1.35] tracking-[-0.045em] text-[#0F172A]">
                {nickname}님, 오늘은
                <br />
                기다리던 날이에요.
              </h1>
            </div>
          </section>

          <button
            type="button"
            onClick={() => navigate("/event/1")}
            className="mt-7 flex w-full items-center gap-3 rounded-2xl border border-[#DCE9E6] bg-white p-3.5 text-left shadow-[0_4px_15px_rgba(15,23,42,0.05)]"
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#0F172A] text-white">
              <Sparkles size={21} fill="white" />
            </span>
            <span className="min-w-0 flex-1">
              <small className="block text-[9px] font-semibold text-[#64748B]">
                오늘의 이벤트
              </small>
              <strong className="mt-1 block truncate text-sm text-[#0F172A]">
                2026 IU WORLD TOUR
              </strong>
              <span className="mt-1 block text-[10px] text-[#64748B]">
                KSPO DOME · 18:00
              </span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-[#94A3B8]" />
          </button>

          <section className="mt-5 rounded-[26px] bg-[#38D9C7] px-6 pb-5 pt-6 text-[#063F3A] shadow-[0_14px_32px_rgba(56,217,199,0.2)]">
            <p className="mt-6 text-sm font-bold">이제 출발할 시간이에요</p>
            <h2 className="mt-2 text-[28px] font-medium leading-[1.35] tracking-[-0.045em]">
              15분 안에 출발하면
              <br />
              여유롭게 도착해요.
            </h2>

            <div className="relative mt-8 flex items-start justify-between">
              <span className="absolute left-5 right-5 top-3 border-t border-dashed border-[#0F766E]/30" />
              <span className="relative z-10 flex flex-col items-center gap-2 text-[9px] font-semibold">
                <i className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#22B8AD] not-italic">
                  <House size={13} />
                </i>
                우리 집
              </span>
              <strong className="relative z-10 mt-2 bg-[#38D9C7] px-2 text-[9px]">
                52분
              </strong>
              <span className="relative z-10 flex flex-col items-center gap-2 text-[9px] font-semibold">
                <i className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#22B8AD] not-italic">
                  <Star size={13} fill="#22B8AD" />
                </i>
                KSPO DOME
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 border-t border-[#0F766E]/20 pt-4">
              <span className="flex flex-col gap-1 text-[10px] font-semibold">
                추천 출발
                <strong className="text-lg">15:40</strong>
              </span>
              <span className="flex flex-col gap-1 border-l border-[#0F766E]/20 pl-5 text-[10px] font-semibold">
                도착 예정
                <strong className="text-lg">16:32</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/schedule/create")}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-extrabold text-[#0F766E]"
            >
              오늘 일정 확인하기
              <ChevronRight size={16} />
            </button>
          </section>

          <section className="mt-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="mt-1 text-lg font-extrabold text-[#0F172A]">
                  오늘, 이것만 기억하세요
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate("/event/1")}
                className="text-[10px] font-semibold text-[#64748B]"
              >
                전체 보기
              </button>
            </div>

            <div className="mt-4 flex items-stretch gap-3">
              <article className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-2xl border border-[#DCE9E6] p-4">
                <div className="min-w-0">
                  <p className="text-[10px] text-[#64748B]">
                    오후 9시부터 비
                  </p>
                  <strong className="mt-1 block text-xs text-[#0F172A]">
                    작은 우산 챙기기
                  </strong>
                </div>
                <img
                  src={Umbrella}
                  alt="우산"
                  className="h-7 w-7 shrink-0 object-contain"
                />
              </article>
              <article className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-2xl border border-[#DCE9E6] p-4">
                <div className="min-w-0">
                  <p className="text-[10px] text-[#64748B]">
                    굿즈 수령 대기
                  </p>
                  <strong className="mt-1 block text-xs text-[#0F172A]">
                    약 20분 예상
                  </strong>
                </div>
                <img
                  src={Clock}
                  alt="시계"
                  className="h-8 w-8 shrink-0 object-contain"
                />
              </article>
            </div>
          </section>

          <section className="mt-5 overflow-hidden rounded-2xl border border-[#DCE9E6]">
            <button
              type="button"
              onClick={() => navigate("/event/1")}
              className="flex min-h-18 w-full items-center gap-3 px-4 text-left"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl">
                <img src={Check} className="w-7" alt="체크리스트" />
              </span>
              <span className="flex-1">
                <small className="block text-[10px] text-[#64748B]">
                  준비물 체크
                </small>
                <strong className="mt-1 block text-xs">5개 중 3개 완료</strong>
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
                <small className="block text-[10px] text-[#64748B]">
                  귀가 플래너
                </small>
                <strong className="mt-1 block text-xs">
                  막차까지 여유 있어요
                </strong>
              </span>
              <ChevronRight size={17} className="text-[#94A3B8]" />
            </button>
          </section>
        </main>

        <BottomNav />
      </div>
    </MobileFrame>
  );
}
