import MobileFrame from "@/components/layout/MobileFrame";
import {
  ArrowDownUp,
  ArrowLeft,
  Bike,
  CarFront,
  ChevronDown,
  Clock3,
  Footprints,
  Navigation,
  TrainFront,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Bus from "../assets/Bus.svg";
import Train from "../assets/Train.svg";
import HomeIcon from "../assets/HomeIcon.svg";

type RouteOption = {
  id: "safe" | "fast";
  badge: string;
  duration: string;
  departure: string;
  arrival: string;
  fare: string;
  walkBefore: string;
  transitTime: string;
  walkAfter: string;
  line: string;
  origin: string;
  firstRide: string;
  transfer: string;
  secondRide: string;
  destination: string;
  lastDeparture: string;
};

const routeOptions: RouteOption[] = [
  {
    id: "safe",
    badge: "최적",
    duration: "1시간 7분",
    departure: "오후 9:40",
    arrival: "오후 10:47",
    fare: "1,500원",
    walkBefore: "12분",
    transitTime: "51분",
    walkAfter: "4분",
    line: "5호선",
    origin: "올림픽공원역",
    firstRide: "방화행 · 8개 역",
    transfer: "왕십리역에서 2호선 환승",
    secondRide: "내선순환 · 4개 역",
    destination: "한빛아파트",
    lastDeparture: "22:36",
  },
  {
    id: "fast",
    badge: "가장 빠른 경로",
    duration: "58분",
    departure: "오후 9:40",
    arrival: "오후 10:38",
    fare: "1,500원",
    walkBefore: "12분",
    transitTime: "42분",
    walkAfter: "4분",
    line: "9호선",
    origin: "올림픽공원역",
    firstRide: "중앙보훈병원행 · 4개 역",
    transfer: "종합운동장역에서 2호선 환승",
    secondRide: "내선순환 · 6개 역",
    destination: "한빛아파트",
    lastDeparture: "22:45",
  },
];

const transitFilters = ["전체", "버스+지하철", "지하철", "버스"];

export default function ReturnPlanner() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("전체");
  const [selectedRouteId, setSelectedRouteId] =
    useState<RouteOption["id"]>("safe");

  return (
    <MobileFrame className="map-planner-frame">
      <div className="flex h-screen flex-col bg-white">
        <header className="flex items-center gap-3 px-5 pb-3 pt-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
            className="grid h-9 w-9 place-items-center rounded-full text-[#0F172A]"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="mt-0.5 text-lg font-extrabold text-[#0F172A]">
              귀가 플래너
            </h1>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto pb-9 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <section className="px-5">
            <div className="rounded-2xl border border-[#DCE9E6] bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
              <div className="grid grid-cols-[18px_1fr_32px] items-center gap-x-2 gap-y-3">
                <span className="grid h-4 w-4 place-items-center rounded-full border-2 border-[#22B8AD]">
                  <i className="h-1.5 w-1.5 rounded-full bg-[#22B8AD]" />
                </span>
                <div className="border-b border-[#E7EEEC] pb-3">
                  <small className="block text-[9px] text-[#94A3B8]">
                    출발
                  </small>
                  <strong className="mt-0.5 block truncate text-sm text-[#0F172A]">
                    KSPO DOME
                  </strong>
                </div>
                <button
                  type="button"
                  aria-label="출발지와 도착지 바꾸기"
                  className="row-span-2 grid h-8 w-8 place-items-center rounded-full bg-[#F5FBFA] text-[#64748B]"
                >
                  <ArrowDownUp size={15} />
                </button>

                <span className="grid h-4 w-4 place-items-center rounded-full border-2 border-[#EF4444]">
                  <i className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
                </span>
                <div>
                  <small className="block text-[9px] text-[#94A3B8]">
                    도착
                  </small>
                  <strong className="mt-0.5 block truncate text-sm text-[#0F172A]">
                    우리 집
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <button
                type="button"
                className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl bg-[#38D9C7] text-[#063F3A] shadow-[0_7px_18px_rgba(34,184,173,0.2)]"
              >
                <TrainFront size={18} />
                <span className="text-[10px] font-extrabold">1시간 7분</span>
              </button>
              <div className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl bg-[#F8FAFC] text-[#64748B]">
                <CarFront size={18} />
                <span className="text-[10px] font-bold">52분</span>
              </div>
              <div className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl bg-[#F8FAFC] text-[#64748B]">
                <Footprints size={18} />
                <span className="text-[10px] font-bold">3시간 18분</span>
              </div>
              <div className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl bg-[#F8FAFC] text-[#64748B]">
                <Bike size={18} />
                <span className="text-[10px] font-bold">1시간 6분</span>
              </div>
            </div>
          </section>

          <section className="mt-4 border-y border-[#DCE9E6] bg-white">
            <div className="flex gap-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {transitFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`relative h-12 shrink-0 text-xs font-bold ${
                    activeFilter === filter
                      ? "text-[#0F172A]"
                      : "text-[#94A3B8]"
                  }`}
                >
                  {filter}
                  {activeFilter === filter && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#22B8AD]" />
                  )}
                </button>
              ))}
            </div>
            <div className="flex h-12 items-center justify-between border-t border-[#E7EEEC] px-5 text-[11px] font-bold">
              <button
                type="button"
                className="flex items-center gap-1 text-[#138A80]"
              >
                오늘 21:40 출발 <ChevronDown size={13} />
              </button>
              <button
                type="button"
                className="flex items-center gap-1 text-[#64748B]"
              >
                최적 경로순 <ChevronDown size={13} />
              </button>
            </div>
          </section>

          <div className="px-5 pt-4">
            <aside className="mb-3 flex items-center gap-2 rounded-xl bg-[#DDF8F4] px-3.5 py-3 text-[11px] text-[#138A80]">
              <strong>막차까지 2시간 18분 여유 있어요.</strong>
              <span className="ml-auto text-[9px] text-[#64748B]">
                23:48 막차
              </span>
            </aside>

            <div className="space-y-3">
              {routeOptions.map((route) => {
                const isSelected = selectedRouteId === route.id;

                return (
                  <article
                    key={route.id}
                    className={`overflow-hidden rounded-[22px] border bg-white shadow-[0_4px_14px_rgba(15,23,42,0.05)] transition-colors ${
                      isSelected ? "border-[#22B8AD]" : "border-[#DCE9E6]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedRouteId(route.id)}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-[#138A80]">
                            {route.badge}
                          </span>
                          <div className="mt-1 flex items-end gap-1.5">
                            <strong className="text-[27px] leading-none tracking-[-0.04em] text-[#0F172A]">
                              {route.duration}
                            </strong>
                          </div>
                          <p className="mt-2 text-[11px] text-[#64748B]">
                            {route.departure} - {route.arrival} · {route.fare}
                          </p>
                        </div>
                        <span
                          className={`grid h-6 w-6 place-items-center rounded-full border-2 ${
                            isSelected
                              ? "border-[#22B8AD] bg-[#22B8AD] text-white"
                              : "border-[#CBD5E1] text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </div>

                      <div className="mt-4 flex h-6 items-center overflow-hidden rounded-full bg-[#E7EEEC] text-[9px] font-bold">
                        <span className="grid h-full w-[18%] place-items-center text-[#64748B]">
                          도보 {route.walkBefore}
                        </span>
                        <span className="grid h-full w-[70%] place-items-center rounded-full bg-[#38D9C7] text-[#063F3A]">
                          대중교통 {route.transitTime}
                        </span>
                        <span className="grid h-full w-[12%] place-items-center text-[#64748B]">
                          {route.walkAfter}
                        </span>
                      </div>
                    </button>

                    <div className="border-t border-[#E7EEEC] px-4 py-4">
                      <div className="grid grid-cols-[34px_minmax(0,1fr)] gap-x-3">
                        <span className="relative z-10 grid h-8 w-8 place-items-center rounded-lg text-[#138A80]">
                          <img src={Train} alt="" />
                        </span>
                        <div className="min-w-0 pb-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="shrink-0 rounded-md bg-[#22B8AD] px-2 py-1 text-[9px] font-extrabold text-white">
                              {route.line}
                            </span>
                            <strong className="truncate text-xs text-[#0F172A]">
                              {route.origin}
                            </strong>
                          </div>
                          <p className="mt-2 flex min-w-0 items-center gap-1.5 text-[10px] text-[#64748B]">
                            <img src={Bus} alt="버스" />
                            <span className="truncate">{route.firstRide}</span>
                          </p>
                        </div>

                        <span className="flex min-h-14 justify-center">
                          <i className="w-px bg-[#BDEBE5]" />
                        </span>
                        <div className="min-w-0 py-2">
                          <p className="text-[10px] font-bold text-[#0F172A]">
                            {route.transfer}
                          </p>
                          <p className="mt-1 text-[10px] text-[#64748B]">
                            {route.secondRide}
                          </p>
                        </div>

                        <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full  text-white">
                          <img src={HomeIcon} alt="집" />
                        </span>
                        <div className="flex min-w-0 items-center justify-between gap-2 pt-1">
                          <strong className="flex min-w-0 items-center gap-1.5 text-xs text-[#0F172A]">
                            <span className="truncate">
                              {route.destination}
                            </span>
                          </strong>
                          <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[9px] font-bold text-[#64748B]">
                            <Clock3 size={11} /> 안전 출발 {route.lastDeparture}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-xs font-extrabold ${
                          isSelected
                            ? "bg-[#38D9C7] text-[#063F3A]"
                            : "border border-[#DCE9E6] text-[#64748B]"
                        }`}
                      >
                        <Navigation size={15} /> 이 경로로 안내 시작
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </MobileFrame>
  );
}
