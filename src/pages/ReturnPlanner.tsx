import MobileFrame from "@/components/layout/MobileFrame";
import {
  ArrowLeft,
  Clock3,
  Footprints,
  House,
  ShieldCheck,
  TrainFront,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const routes = {
  recommended: {
    duration: "1시간 7분",
    arrival: "22:47",
    transfers: "환승 1회",
    lastDeparture: "22:36",
    steps: [
      { time: "21:40", title: "KSPO DOME", description: "올림픽공원역까지 도보 12분", type: "walk" },
      { time: "21:52", title: "올림픽공원역", description: "5호선 · 방화행", type: "train" },
      { time: "22:31", title: "왕십리역 환승", description: "2호선 · 내선순환", type: "train" },
      { time: "22:47", title: "집 도착", description: "예상 도착 시간", type: "home" },
    ],
  },
  fastest: {
    duration: "58분",
    arrival: "22:38",
    transfers: "환승 2회",
    lastDeparture: "22:45",
    steps: [
      { time: "21:40", title: "KSPO DOME", description: "올림픽공원역까지 도보 12분", type: "walk" },
      { time: "21:52", title: "올림픽공원역", description: "9호선 · 중앙보훈병원행", type: "train" },
      { time: "22:10", title: "종합운동장역 환승", description: "2호선 · 내선순환", type: "train" },
      { time: "22:38", title: "집 도착", description: "예상 도착 시간", type: "home" },
    ],
  },
} as const;

export default function ReturnPlanner() {
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState<keyof typeof routes>("recommended");
  const route = routes[activeRoute];

  return (
    <MobileFrame>
      <div className="flex h-screen flex-col bg-white">
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
            <h1 className="mt-0.5 text-lg font-extrabold text-[#0F172A]">
              귀가 플래너
            </h1>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-10 pt-5">
          <section className="relative overflow-hidden rounded-[26px] bg-[#38D9C7] p-5 text-[#063F3A]">
            <span className="absolute -right-7 -top-8 h-28 w-28 rounded-full bg-white/15" />
            <div className="relative flex items-center gap-2 text-xs font-extrabold">
              <ShieldCheck size={16} /> 안전하게 귀가할 수 있어요
            </div>
            <h2 className="relative mt-4 text-[28px] font-medium leading-[1.3] tracking-[-0.04em]">
              막차까지 2시간 18분
              <br />여유 있어요
            </h2>
            <p className="relative mt-3 text-xs leading-relaxed text-[#0F766E]">
              공연이 30분 늦게 끝나도 안전한 경로예요.
            </p>
            <div className="relative mt-5 flex items-center justify-between rounded-2xl bg-white/75 px-4 py-3">
              <span className="text-[10px] font-bold">예상 귀가 완료</span>
              <strong className="text-xl">{route.arrival}</strong>
            </div>
          </section>

          <div className="mt-5 grid h-11 grid-cols-2 rounded-xl bg-[#F1F5F9] p-1">
            <button
              type="button"
              onClick={() => setActiveRoute("recommended")}
              className={`rounded-lg text-xs font-extrabold ${
                activeRoute === "recommended"
                  ? "bg-white text-[#138A80] shadow-sm"
                  : "text-[#94A3B8]"
              }`}
            >
              추천 경로
            </button>
            <button
              type="button"
              onClick={() => setActiveRoute("fastest")}
              className={`rounded-lg text-xs font-extrabold ${
                activeRoute === "fastest"
                  ? "bg-white text-[#138A80] shadow-sm"
                  : "text-[#94A3B8]"
              }`}
            >
              가장 빠른 경로
            </button>
          </div>

          <section className="mt-4 rounded-2xl border border-[#DCE9E6] p-4">
            <header className="flex items-center justify-between border-b border-[#E7EEEC] pb-4">
              <div>
                <p className="text-[10px] text-[#64748B]">총 소요 시간</p>
                <strong className="mt-1 block text-lg text-[#0F172A]">
                  {route.duration}
                </strong>
              </div>
              <span className="rounded-lg bg-[#E6FAF7] px-2.5 py-1.5 text-[10px] font-extrabold text-[#138A80]">
                {route.transfers}
              </span>
            </header>

            <div className="pt-5">
              {route.steps.map((step, index) => (
                <article
                  key={`${activeRoute}-${step.time}`}
                  className="relative grid min-h-[72px] grid-cols-[48px_34px_1fr] gap-2"
                >
                  <time className="pt-2 text-[11px] font-bold text-[#64748B]">
                    {step.time}
                  </time>
                  <span
                    className={`relative z-10 grid h-8 w-8 place-items-center rounded-full ${
                      step.type === "home"
                        ? "bg-[#22B8AD] text-white"
                        : "bg-[#E6FAF7] text-[#138A80]"
                    }`}
                  >
                    {step.type === "walk" ? (
                      <Footprints size={14} />
                    ) : step.type === "home" ? (
                      <House size={14} />
                    ) : (
                      <TrainFront size={14} />
                    )}
                    {index < route.steps.length - 1 && (
                      <i className="absolute left-1/2 top-8 -z-10 h-10 w-px -translate-x-1/2 bg-[#DCE9E6]" />
                    )}
                  </span>
                  <div className="pt-1.5">
                    <strong className="block text-xs text-[#0F172A]">
                      {step.title}
                    </strong>
                    <p className="mt-1 text-[10px] text-[#64748B]">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <footer className="mt-2 flex items-center justify-between rounded-xl bg-[#F5FBFA] px-4 py-3">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#64748B]">
                <Clock3 size={13} className="text-[#22B8AD]" /> 마지막 안전 출발
              </span>
              <strong className="text-sm text-[#138A80]">
                {route.lastDeparture}
              </strong>
            </footer>
          </section>

          <aside className="mt-4 flex items-start gap-3 rounded-2xl bg-[#FFF7E6] p-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[#D97706]">
              !
            </span>
            <p className="text-[11px] leading-relaxed text-[#64748B]">
              <strong className="text-[#92400E]">막차는 23:48이에요.</strong>
              <br />출발 20분 전에 다시 알려드릴게요.
            </p>
          </aside>
        </main>
      </div>
    </MobileFrame>
  );
}
