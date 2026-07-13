import { useState } from "react";
import BottomNav from "@/components/layout/BottomNav";
import MobileFrame from "@/components/layout/MobileFrame";
import {
  Camera,
  Check,
  ChevronRight,
  House,
  Music,
  ShoppingBag,
  Sparkles,
  TrainFront,
  Utensils,
} from "lucide-react";

const STORAGE_KEY = "deokgil-confirmed-schedule-v1";

type ScheduleItem = {
  time: string;
  label: string;
  description: string;
  type: "start" | "arrival" | "activity" | "main" | "end";
};

type ViewMode = "preferences" | "preview" | "confirmed";

const preferences = [
  {
    id: "goods",
    icon: ShoppingBag,
    label: "굿즈 구매",
    description: "굿즈를 사는 일을 중요하게 생각해요",
  },
  {
    id: "concert",
    icon: Music,
    label: "공연 집중",
    description: "공연에 늦지 않는 것이 가장 중요해요",
  },
  {
    id: "photo",
    icon: Camera,
    label: "포토존",
    description: "포토존을 여유롭게 둘러보고 싶어요",
  },
  {
    id: "home",
    icon: House,
    label: "빠른 귀가",
    description: "공연이 끝난 뒤 빠르게 귀가하고 싶어요",
  },
  {
    id: "food",
    icon: Utensils,
    label: "주변 맛집",
    description: "행사장 근처 맛집도 함께 방문하고 싶어요",
  },
];

const generatedSchedule: ScheduleItem[] = [
  {
    time: "15:40",
    label: "집에서 출발",
    description: "지하철 2호선 · 52분",
    type: "start",
  },
  {
    time: "16:32",
    label: "KSPO DOME 도착",
    description: "올림픽공원역 3번 출구",
    type: "arrival",
  },
  {
    time: "16:40",
    label: "굿즈 현장 수령",
    description: "예상 대기 20분",
    type: "activity",
  },
  {
    time: "17:20",
    label: "입장 대기",
    description: "2-1 게이트",
    type: "activity",
  },
  {
    time: "18:00",
    label: "공연 시작",
    description: "D구역 12열 8번",
    type: "main",
  },
  {
    time: "21:30",
    label: "공연 종료 예정",
    description: "종료 시간은 변경될 수 있어요",
    type: "end",
  },
];

function loadConfirmedSchedule(): ScheduleItem[] | null {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return null;

    const parsedValue = JSON.parse(storedValue) as { items?: ScheduleItem[] };
    return Array.isArray(parsedValue.items) ? parsedValue.items : null;
  } catch {
    return null;
  }
}

export default function ScheduleCreate() {
  const [confirmedItems, setConfirmedItems] = useState<ScheduleItem[] | null>(
    loadConfirmedSchedule,
  );
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    confirmedItems ? "confirmed" : "preferences",
  );
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    "goods",
    "concert",
  ]);

  const togglePreference = (id: string) => {
    setSelectedPreferences((currentPreferences) =>
      currentPreferences.includes(id)
        ? currentPreferences.filter((preference) => preference !== id)
        : [...currentPreferences, id],
    );
  };

  const confirmSchedule = () => {
    const scheduleToSave = generatedSchedule.map((item) => ({ ...item }));
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        eventTitle: "2026 IU WORLD TOUR",
        eventDate: "2026-07-18",
        venue: "KSPO DOME",
        confirmedAt: new Date().toISOString(),
        items: scheduleToSave,
      }),
    );
    setConfirmedItems(scheduleToSave);
    setViewMode("confirmed");
  };

  const resetSchedule = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setConfirmedItems(null);
    setViewMode("preferences");
  };

  if (viewMode === "confirmed" && confirmedItems) {
    return (
      <MobileFrame>
        <div className="flex h-screen flex-col bg-white">
          <header className="flex h-20 shrink-0 items-center justify-between px-5 pt-3">
            <h1 className="text-xl font-extrabold text-[#0F172A]">오늘의 일정</h1>
            <button
              type="button"
              onClick={resetSchedule}
              className="text-xs font-bold text-[#22B8AD]"
            >
              다시 만들기
            </button>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <section className="flex items-center justify-between rounded-2xl bg-[#E6FAF7] p-5">
              <div>
                <p className="text-[10px] font-extrabold text-[#22B8AD]">
                  7월 18일 토요일
                </p>
                <h2 className="mt-2 text-base font-extrabold text-[#0F172A]">
                  2026 IU WORLD TOUR
                </h2>
                <p className="mt-1 text-[11px] text-[#64748B]">
                  KSPO DOME · 18:00
                </p>
              </div>
              <strong className="text-right text-2xl leading-none text-[#22B8AD]">
                4<span className="ml-0.5 text-[10px]">시간</span>
                <br />
                20<span className="ml-0.5 text-[10px]">분</span>
              </strong>
            </section>

            <section className="mt-3 flex items-center gap-3 rounded-xl border border-[#7CEEDF] px-4 py-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#E6FAF7] text-[#22B8AD]">
                <Sparkles size={15} />
              </span>
              <p className="text-[11px] leading-relaxed text-[#64748B]">
                <strong className="text-[#0F172A]">
                  AI가 교통 상황을 반영했어요
                </strong>
                <br />
                출발 시간이 10분 빨라졌어요.
              </p>
            </section>

            <section className="mt-7">
              {confirmedItems.map((item, index) => {
                const isDone = index === 0;
                const isNext = index === 1;

                return (
                  <article
                    key={`${item.time}-${item.label}`}
                    className="relative grid min-h-[78px] grid-cols-[50px_32px_1fr_auto]"
                  >
                    <time
                      className={`pt-0.5 text-[11px] ${
                        isNext ? "font-extrabold text-[#22B8AD]" : "text-[#64748B]"
                      }`}
                    >
                      {item.time}
                    </time>
                    <span
                      className={`relative z-10 grid h-5 w-5 place-items-center rounded-full border text-[9px] ${
                        isDone
                          ? "border-[#22B8AD] bg-[#22B8AD] text-white"
                          : isNext
                            ? "border-4 border-[#7CEEDF] bg-[#22B8AD] text-transparent ring-2 ring-white"
                            : item.type === "main"
                              ? "border-[#22B8AD] bg-[#22B8AD] text-white"
                              : "border-[#CBD5E1] bg-white text-[#94A3B8]"
                      }`}
                    >
                      {isDone ? <Check size={11} /> : index + 1}
                      {index < confirmedItems.length - 1 && (
                        <i className="absolute left-1/2 top-5 -z-10 h-[58px] w-px -translate-x-1/2 bg-[#DCE9E6]" />
                      )}
                    </span>
                    <div className={isDone ? "opacity-45" : ""}>
                      <strong className="text-sm text-[#0F172A]">{item.label}</strong>
                      <p className="mt-1 text-[11px] text-[#64748B]">
                        {item.description}
                      </p>
                    </div>
                    {isNext && (
                      <span className="h-max rounded-md bg-[#E6FAF7] px-2 py-1 text-[9px] font-extrabold text-[#22B8AD]">
                        다음
                      </span>
                    )}
                  </article>
                );
              })}
            </section>

            <button
              type="button"
              className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-[#F5FBFA] p-4 text-left"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#22B8AD]">
                <TrainFront size={18} />
              </span>
              <span className="flex-1">
                <small className="text-[9px] text-[#22B8AD]">공연이 끝난 뒤</small>
                <strong className="mt-1 block text-xs text-[#0F172A]">
                  귀가 일정도 준비했어요
                </strong>
              </span>
              <ChevronRight size={17} className="text-[#22B8AD]" />
            </button>
          </main>

          <BottomNav />
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <div className="flex h-screen flex-col bg-white">
        <header className="flex h-20 shrink-0 items-center px-5 pt-3">
          <div>
            <p className="text-[9px] font-extrabold tracking-[0.15em] text-[#22B8AD]">
              AI SCHEDULE
            </p>
            <h1 className="mt-1 text-xl font-extrabold text-[#0F172A]">
              {viewMode === "preview" ? "추천 일정" : "AI 일정 생성"}
            </h1>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {viewMode === "preferences" ? (
            <>
              <section className="rounded-2xl bg-[#E6FAF7] p-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#22B8AD]">
                  <Sparkles size={15} />
                  AI 취향 분석
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
                  나의 덕질 스타일을 선택하면 AI가 맞춤형 일정을 생성해요.
                  여러 개 선택할 수 있어요.
                </p>
              </section>

              <div className="mt-5 space-y-2.5">
                {preferences.map((preference) => {
                  const Icon = preference.icon;
                  const isSelected = selectedPreferences.includes(preference.id);

                  return (
                    <button
                      key={preference.id}
                      type="button"
                      onClick={() => togglePreference(preference.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left ${
                        isSelected
                          ? "border-[#22B8AD] bg-[#E6FAF7]/50"
                          : "border-[#DCE9E6] bg-white"
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                          isSelected
                            ? "bg-[#22B8AD] text-white"
                            : "bg-[#F5FBFA] text-[#64748B]"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <strong
                          className={`text-sm ${
                            isSelected ? "text-[#22B8AD]" : "text-[#0F172A]"
                          }`}
                        >
                          {preference.label}
                        </strong>
                        <span className="mt-1 block text-[11px] text-[#64748B]">
                          {preference.description}
                        </span>
                      </span>
                      {isSelected && (
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#22B8AD] text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={selectedPreferences.length === 0}
                onClick={() => setViewMode("preview")}
                className="mt-5 h-12 w-full rounded-xl bg-[#22B8AD] text-sm font-extrabold text-white disabled:opacity-40"
              >
                AI 일정 생성하기
              </button>
            </>
          ) : (
            <>
              <section className="rounded-2xl bg-[#E6FAF7] p-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#22B8AD]">
                  <Sparkles size={15} />
                  AI 생성 일정
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
                  굿즈 구매와 공연 집중 스타일에 맞춰 최적 일정을 만들었어요.
                </p>
              </section>

              <section className="relative mt-6 pl-7">
                <span className="absolute bottom-3 left-2.5 top-3 w-px bg-[#DCE9E6]" />
                <div className="space-y-5">
                  {generatedSchedule.map((item) => (
                    <article
                      key={`${item.time}-${item.label}`}
                      className="relative flex items-start gap-3"
                    >
                      <span
                        className={`absolute -left-7 top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 ${
                          item.type === "main"
                            ? "border-[#22B8AD] bg-[#22B8AD] text-white"
                            : "border-[#DCE9E6] bg-white text-transparent"
                        }`}
                      >
                        {item.type === "main" && <Music size={10} />}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <time className="rounded-md bg-[#F5FBFA] px-2 py-1 text-[10px] font-extrabold text-[#0F172A]">
                            {item.time}
                          </time>
                          <strong className="text-sm text-[#0F172A]">
                            {item.label}
                          </strong>
                        </div>
                        <p className="mt-1 text-[11px] text-[#64748B]">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <div className="mt-7 space-y-2">
                <button
                  type="button"
                  onClick={confirmSchedule}
                  className="h-12 w-full rounded-xl bg-[#22B8AD] text-sm font-extrabold text-white"
                >
                  이 일정으로 확정하기
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("preferences")}
                  className="h-12 w-full rounded-xl border border-[#DCE9E6] text-sm font-bold text-[#0F172A]"
                >
                  다시 생성하기
                </button>
              </div>
            </>
          )}
        </main>

        <BottomNav />
      </div>
    </MobileFrame>
  );
}
