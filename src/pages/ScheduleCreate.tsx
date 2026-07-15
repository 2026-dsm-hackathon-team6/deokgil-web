import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";
import LoadingScreen from "@/components/layout/LoadingScreen";
import MobileFrame from "@/components/layout/MobileFrame";
import Train from "../assets/Train.svg";
// import Logo from "../assets/Logo.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import {
  generateChecklist,
  generateSchedules,
  getUpcomingEvents,
  type Schedule,
} from "@/lib/eventsApi";
import {
  clearConfirmedSchedule,
  loadConfirmedSchedule,
  saveConfirmedSchedule,
  type ChecklistItem,
  type ConfirmedSchedule,
  type ScheduleItem,
} from "@/lib/scheduleStore";
import {
  Camera,
  CalendarDays,
  Check,
  ChevronRight,
  House,
  Music,
  Pencil,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Utensils,
} from "lucide-react";

type ActiveEvent = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  venue: string;
};

type ViewMode = "landing" | "preferences" | "preview" | "confirmed";

const formatEventDateLabel = (startAt: string) => {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatEventTimeLabel = (startAt: string) => {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
};

const formatEventWeekdayDateLabel = (startAt: string) => {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" });
};

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

const PREFERENCE_TO_PRIORITY: Record<string, Schedule["type"]> = {
  goods: "GOODS",
  concert: "PERFORMANCE",
  photo: "VISIT",
  home: "RETURN",
  food: "ETC",
};

const transportOptions: { id: "PUBLIC_TRANSPORT" | "CAR" | "WALK"; label: string }[] = [
  { id: "PUBLIC_TRANSPORT", label: "대중교통" },
  { id: "CAR", label: "자차" },
  { id: "WALK", label: "도보" },
];

// Real backend response uses a different type enum (MOVE/WAITING/GOODS/...)
// than the display timeline (start/arrival/activity/main/end) — map it.
function mapSchedulesToItems(schedules: Schedule[]): ScheduleItem[] {
  const sorted = [...schedules].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );
  return sorted.map((schedule, index) => {
    const uiType: ScheduleItem["type"] =
      schedule.type === "PERFORMANCE"
        ? "main"
        : index === 0
          ? "start"
          : index === sorted.length - 1
            ? "end"
            : "activity";
    return {
      time: formatEventTimeLabel(schedule.startAt),
      label: schedule.title,
      description: `${formatEventTimeLabel(schedule.startAt)} - ${formatEventTimeLabel(schedule.endAt)}`,
      type: uiType,
    };
  });
}

export default function ScheduleCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [isResolvingEvent, setIsResolvingEvent] = useState(true);
  const [confirmedSchedule, setConfirmedSchedule] = useState<ConfirmedSchedule | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("landing");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    "goods",
    "concert",
  ]);
  const [transportation, setTransportation] = useState<"PUBLIC_TRANSPORT" | "CAR" | "WALK">(
    "PUBLIC_TRANSPORT",
  );
  const [draftSchedule, setDraftSchedule] = useState<ScheduleItem[]>([]);
  const [draftChecklist, setDraftChecklist] = useState<ChecklistItem[]>([]);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);

  // Resolve which event this screen builds a schedule for: passed in
  // directly from an event's "AI 일정 생성하기" button, or — when reached
  // from the bottom nav with no context — the soonest upcoming event.
  useEffect(() => {
    const state = location.state as
      | { eventId?: string; title?: string; startAt?: string; endAt?: string; placeName?: string }
      | null;
    if (state?.eventId) {
      setActiveEvent({
        id: state.eventId,
        title: state.title || "",
        startAt: state.startAt || "",
        endAt: state.endAt || "",
        venue: state.placeName || "",
      });
      setIsResolvingEvent(false);
      return;
    }

    let active = true;
    getUpcomingEvents()
      .then((response) => {
        if (!active) return;
        const events = response.events ?? [];
        const soonest = [...events].sort(
          (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
        )[0];
        if (soonest) {
          setActiveEvent({
            id: soonest.eventId,
            title: soonest.title,
            startAt: soonest.startAt,
            endAt: soonest.endAt,
            venue: soonest.placeName || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsResolvingEvent(false);
      });
    return () => {
      active = false;
    };
  }, [location.state]);

  useEffect(() => {
    if (!activeEvent) return;
    const stored = loadConfirmedSchedule(activeEvent.id);
    setConfirmedSchedule(stored);
    setViewMode(stored ? "confirmed" : "landing");
  }, [activeEvent?.id]);

  const togglePreference = (id: string) => {
    setSelectedPreferences((currentPreferences) =>
      currentPreferences.includes(id)
        ? currentPreferences.filter((preference) => preference !== id)
        : [...currentPreferences, id],
    );
  };

  const confirmSchedule = () => {
    if (!activeEvent) return;
    const scheduleToSave: ConfirmedSchedule = {
      eventId: activeEvent.id,
      eventTitle: activeEvent.title,
      eventDate: activeEvent.startAt,
      eventEndAt: activeEvent.endAt,
      venue: activeEvent.venue,
      items: draftSchedule.map((item) => ({ ...item })),
      checklist: draftChecklist.map((item) => ({ ...item })),
      confirmedAt: new Date().toISOString(),
    };
    saveConfirmedSchedule(scheduleToSave);
    setConfirmedSchedule(scheduleToSave);
    setViewMode("confirmed");
  };

  const toggleConfirmedChecklist = (id: string, checked: boolean) => {
    setConfirmedSchedule((currentSchedule) => {
      if (!currentSchedule) return currentSchedule;

      const updatedSchedule = {
        ...currentSchedule,
        checklist: currentSchedule.checklist.map((item) =>
          item.id === id ? { ...item, checked } : item,
        ),
      };
      saveConfirmedSchedule(updatedSchedule);
      return updatedSchedule;
    });
  };

  const createSchedulePreview = async () => {
    if (!activeEvent) return;
    setIsGeneratingSchedule(true);
    const priorities = selectedPreferences
      .map((id) => PREFERENCE_TO_PRIORITY[id])
      .filter((type): type is Schedule["type"] => Boolean(type));
    const purpose =
      selectedPreferences
        .map((id) => preferences.find((preference) => preference.id === id)?.label)
        .filter(Boolean)
        .join(", ") || "행사 일정";

    try {
      const [scheduleResponse, checklistResponse] = await Promise.all([
        generateSchedules(activeEvent.id, { purpose, priorities, transportation }),
        generateChecklist(activeEvent.id),
      ]);
      const schedules = scheduleResponse.schedules ?? [];
      if (schedules.length === 0) {
        throw new Error("AI가 생성한 일정이 비어 있어요.");
      }
      setDraftSchedule(mapSchedulesToItems(schedules));
      setDraftChecklist(
        (checklistResponse.items ?? []).map((item) => ({
          id: item.checklistId,
          label: item.content,
          checked: item.checked,
        })),
      );
      setIsEditingSchedule(false);
      setViewMode("preview");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "일정을 생성하지 못했어요.");
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  const updateDraftItem = (
    index: number,
    field: "time" | "label" | "description",
    value: string,
  ) => {
    setDraftSchedule((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const updateDraftChecklistItem = (
    id: string,
    field: "label" | "reason",
    value: string,
  ) => {
    setDraftChecklist((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addDraftChecklistItem = () => {
    setDraftChecklist((items) => [
      ...items,
      {
        id: crypto.randomUUID(),
        label: "새 준비물",
        reason: "필요한 내용을 입력해 주세요",
        checked: false,
      },
    ]);
  };

  const removeDraftChecklistItem = (id: string) => {
    setDraftChecklist((items) => items.filter((item) => item.id !== id));
  };

  const resetSchedule = () => {
    if (activeEvent) clearConfirmedSchedule(activeEvent.id);
    setConfirmedSchedule(null);
    setIsDeleteDialogOpen(false);
    setViewMode("landing");
  };

  if (isGeneratingSchedule) {
    return (
      <LoadingScreen
        message="맞춤 일정을 만들고 있어요"
        description="선택한 취향과 이동 시간을 반영하고 있어요."
      />
    );
  }

  if (isResolvingEvent) {
    return (
      <LoadingScreen
        message="일정을 불러오는 중이에요"
        description="잠시만 기다려 주세요."
      />
    );
  }

  if (!activeEvent) {
    return (
      <MobileFrame>
        <div className="flex h-dvh flex-col bg-white">
          <header className="flex h-20 shrink-0 items-center px-5 pt-3">
            <h1 className="text-xl font-extrabold text-[#0F172A]">일정</h1>
          </header>
          <main className="flex flex-1 flex-col items-center justify-center px-5 pb-28 text-center">
            <h2 className="text-[22px] font-bold text-[#0F172A]">등록된 행사가 없어요</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
              일정을 만들려면 먼저 행사를 등록해 주세요.
            </p>
            <button
              type="button"
              onClick={() => navigate("/event/register")}
              className="mt-6 h-12 rounded-2xl bg-[#38D9C7] px-6 text-sm font-extrabold text-[#063F3A]"
            >
              행사 등록하러 가기
            </button>
          </main>
          <BottomNav />
        </div>
      </MobileFrame>
    );
  }

  if (viewMode === "landing") {
    return (
      <MobileFrame>
        <div className="flex h-dvh flex-col bg-white">
          <header className="flex h-20 shrink-0 items-center px-5 pt-3">
            <h1 className="text-xl font-extrabold text-[#0F172A]">일정</h1>
          </header>

          <main className="min-h-0 flex flex-1 flex-col overflow-y-auto px-5 pb-28">
            <section className="flex flex-1 flex-col items-center justify-center pb-5 text-center">
              {/* <span className="grid h-20 w-20 place-items-center rounded-3xl bg-[#E6FAF7] text-[#138A80]">
                <CalendarDays size={32} strokeWidth={1.8} />
              </span> */}
              {/* <img src={Logo} alt="로고" className="w-20"/> */}

              <h2 className="mt-7 text-[27px] font-bold leading-[1.35] tracking-[-0.04em] text-[#0F172A]">
                새 일정을 만들어볼까요?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                아직 생성된 일정이 없어요.
                <br />
                행사에 맞춰 출발부터 귀가까지 정리할 수 있어요.
              </p>
            </section>

            <section className="mb-4 flex items-center gap-3 rounded-2xl border border-[#DCE9E6] bg-[#F8FCFB] p-4 text-left">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#E6FAF7] text-[#138A80]">
                <CalendarDays size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <small className="text-[9px] font-bold text-[#22B8AD]">
                  예정된 이벤트
                </small>
                <strong className="mt-1 block truncate text-sm text-[#0F172A]">
                  {activeEvent.title}
                </strong>
                <span className="mt-1 block text-[10px] text-[#64748B]">
                  {formatEventDateLabel(activeEvent.startAt)}
                  {activeEvent.venue ? ` · ${activeEvent.venue}` : ""}
                </span>
              </span>
            </section>

            <button
              type="button"
              onClick={() => setViewMode("preferences")}
              className="h-14 w-full rounded-2xl bg-[#38D9C7] text-sm font-extrabold text-[#063F3A] shadow-[0_8px_22px_rgba(34,184,173,0.22)]"
            >
              일정 만들기
            </button>
          </main>

          <BottomNav />
        </div>
      </MobileFrame>
    );
  }

  if (viewMode === "confirmed" && confirmedSchedule) {
    const completedChecklistCount = confirmedSchedule.checklist.filter(
      (item) => item.checked,
    ).length;

    return (
      <MobileFrame>
        <div className="flex h-dvh flex-col bg-white">
          <header className="flex h-20 shrink-0 items-center justify-between px-5 pt-3">
            <h1 className="text-xl font-extrabold text-[#0F172A]">
              오늘의 일정
            </h1>
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
                  {formatEventWeekdayDateLabel(confirmedSchedule.eventDate)}
                </p>
                <h2 className="mt-2 text-base font-extrabold text-[#0F172A]">
                  {confirmedSchedule.eventTitle}
                </h2>
                <p className="mt-1 text-[11px] text-[#64748B]">
                  {confirmedSchedule.venue}
                  {confirmedSchedule.venue ? " · " : ""}
                  {formatEventTimeLabel(confirmedSchedule.eventDate)}
                </p>
              </div>
              <strong className="text-right text-2xl leading-none text-[#22B8AD]">
                {(() => {
                  const minutes = Math.max(
                    0,
                    Math.round(
                      (new Date(confirmedSchedule.eventEndAt).getTime() -
                        new Date(confirmedSchedule.eventDate).getTime()) /
                        60000,
                    ),
                  );
                  return (
                    <>
                      {Math.floor(minutes / 60)}
                      <span className="ml-0.5 text-[10px]">시간</span>
                      <br />
                      {minutes % 60}
                      <span className="ml-0.5 text-[10px]">분</span>
                    </>
                  );
                })()}
              </strong>
            </section>

            <section className="mt-4 rounded-2xl border border-[#DCE9E6] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-[#0F172A]">
                    체크리스트
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-[#64748B]">
                  {completedChecklistCount}/{confirmedSchedule.checklist.length}{" "}
                  완료
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                {confirmedSchedule.checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#F8FCFB] p-3"
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={(checked) =>
                        toggleConfirmedChecklist(item.id, checked === true)
                      }
                      className="h-5 w-5 rounded-md border-[#DCE9E6] data-[state=checked]:border-[#22B8AD] data-[state=checked]:bg-[#22B8AD]"
                    />
                    <span className="min-w-0 flex-1">
                      <strong
                        className={`block text-xs ${
                          item.checked
                            ? "text-[#94A3B8] line-through"
                            : "text-[#0F172A]"
                        }`}
                      >
                        {item.label}
                      </strong>
                      <span className="mt-0.5 block text-[10px] text-[#64748B]">
                        {item.reason}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="mt-7">
              {confirmedSchedule.items.map((item, index) => {
                const isDone = index === 0;
                const isNext = index === 1;

                return (
                  <article
                    key={`${item.time}-${item.label}`}
                    className="relative grid min-h-[78px] grid-cols-[50px_32px_1fr_auto]"
                  >
                    <time
                      className={`pt-0.5 text-[11px] ${
                        isNext
                          ? "font-extrabold text-[#22B8AD]"
                          : "text-[#64748B]"
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
                      {index < confirmedSchedule.items.length - 1 && (
                        <i className="absolute left-1/2 top-5 -z-10 h-[58px] w-px -translate-x-1/2 bg-[#DCE9E6]" />
                      )}
                    </span>
                    <div className={isDone ? "opacity-45" : ""}>
                      <strong className="text-sm text-[#0F172A]">
                        {item.label}
                      </strong>
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
              onClick={() => navigate("/return-planner")}
              className="mt-2 flex w-full items-center gap-3 rounded-2xl bg-[#F5FBFA] p-4 text-left"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl text-[#22B8AD]">
                <img src={Train} alt="" />
              </span>
              <span className="flex-1">
                <small className="text-[9px] text-[#22B8AD]">
                  공연이 끝난 뒤
                </small>
                <strong className="mt-1 block text-xs text-[#0F172A]">
                  귀가 일정도 준비했어요
                </strong>
              </span>
              <ChevronRight size={17} className="text-[#22B8AD]" />
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-[#EF4444] transition-colors hover:bg-[#FEF2F2]"
            >
              <Trash2 size={16} />
              확정한 일정 삭제
            </button>
          </main>

          <BottomNav />

          {isDeleteDialogOpen && (
            <div
              className="absolute inset-0 z-[60] flex items-end bg-[#0F172A]/45 px-4 pb-5"
              role="presentation"
              onMouseDown={(event) => {
                if (event.currentTarget === event.target) {
                  setIsDeleteDialogOpen(false);
                }
              }}
            >
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-schedule-title"
                className="w-full rounded-[24px] bg-[#FFFFFF] p-5 shadow-xl"
              >
                <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#DCE9E6]" />
                <h2
                  id="delete-schedule-title"
                  className="mt-4 text-lg font-extrabold text-[#0F172A]"
                >
                  확정한 일정을 삭제할까요?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                  직접 수정한 내용을 포함한 현재 일정이 삭제돼요. 삭제한 일정은
                  복구할 수 없어요.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    className="h-12 rounded-xl bg-[#F1F5F9] text-sm font-bold text-[#475569]"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={resetSchedule}
                    className="h-12 rounded-xl bg-[#EF4444] text-sm font-bold text-white"
                  >
                    삭제
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <div className="flex h-dvh flex-col bg-white">
        <header className="flex h-20 shrink-0 items-center justify-between px-5 pt-3">
          <div>
            <h1 className="mt-1 text-xl font-extrabold text-[#0F172A]">
              {viewMode === "preview" ? "추천 일정" : "AI 일정 생성"}
            </h1>
          </div>
          {viewMode === "preview" && !isEditingSchedule && (
            <button
              type="button"
              onClick={() => setIsEditingSchedule(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#F5FBFA] px-3 py-2 text-xs font-extrabold text-[#138A80]"
            >
              <Pencil size={13} />
              직접 수정
            </button>
          )}
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
                  나의 덕질 스타일을 선택하면 AI가 맞춤형 일정을 생성해요. 여러
                  개 선택할 수 있어요.
                </p>
              </section>

              <div className="mt-5 space-y-2.5">
                {preferences.map((preference) => {
                  const Icon = preference.icon;
                  const isSelected = selectedPreferences.includes(
                    preference.id,
                  );

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

              <div className="mt-6">
                <span className="mb-2 block text-xs font-extrabold text-[#0F172A]">
                  이동 수단
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {transportOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setTransportation(option.id)}
                      className={`h-11 rounded-xl border text-xs font-bold ${
                        transportation === option.id
                          ? "border-[#22B8AD] bg-[#E6FAF7] text-[#22B8AD]"
                          : "border-[#DCE9E6] bg-white text-[#64748B]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={selectedPreferences.length === 0}
                onClick={createSchedulePreview}
                className="mt-5 h-12 w-full rounded-xl bg-[#22B8AD] text-sm font-extrabold text-white disabled:opacity-40"
              >
                AI 일정 생성하기
              </button>
            </>
          ) : (
            <>
              <section className="rounded-2xl bg-[#E6FAF7] p-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#22B8AD]">
                  AI 생성 일정
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
                  굿즈 구매와 공연 집중 스타일에 맞춰 최적 일정을 만들었어요.
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-[#138A80]">
                  <Pencil size={11} /> 확정하기 전에 시간과 내용을 직접 수정할
                  수 있어요.
                </p>
              </section>

              <section className="mt-4 rounded-2xl border border-[#DCE9E6] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check size={15} className="text-[#22B8AD]" />
                    <h3 className="text-sm font-extrabold text-[#0F172A]">
                      함께 생성된 체크리스트
                    </h3>
                  </div>
                  <span className="rounded-md bg-[#E6FAF7] px-2 py-1 text-[9px] font-extrabold text-[#138A80]">
                    {draftChecklist.length}개
                  </span>
                </div>
                {isEditingSchedule ? (
                  <div className="mt-3 space-y-2.5">
                    {draftChecklist.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[#DCE9E6] bg-[#F8FCFB] p-3"
                      >
                        <div className="flex items-end gap-2">
                          <label className="min-w-0 flex-1">
                            <span className="mb-1 block text-[9px] font-bold text-[#64748B]">
                              준비물
                            </span>
                            <input
                              value={item.label}
                              onChange={(event) =>
                                updateDraftChecklistItem(
                                  item.id,
                                  "label",
                                  event.target.value,
                                )
                              }
                              className="h-10 w-full rounded-lg border border-[#DCE9E6] bg-white px-3 text-xs font-bold text-[#0F172A] outline-none focus:border-[#22B8AD]"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeDraftChecklistItem(item.id)}
                            aria-label={`${item.label} 삭제`}
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#FEF2F2] text-[#EF4444]"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <label className="mt-2 block">
                          <span className="mb-1 block text-[9px] font-bold text-[#64748B]">
                            안내 문구
                          </span>
                          <input
                            value={item.reason}
                            onChange={(event) =>
                              updateDraftChecklistItem(
                                item.id,
                                "reason",
                                event.target.value,
                              )
                            }
                            className="h-10 w-full rounded-lg border border-[#DCE9E6] bg-white px-3 text-xs text-[#64748B] outline-none focus:border-[#22B8AD]"
                          />
                        </label>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addDraftChecklistItem}
                      className="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#7CEEDF] text-xs font-extrabold text-[#138A80]"
                    >
                      <Plus size={15} /> 준비물 추가
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {draftChecklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 rounded-xl bg-[#F8FCFB] px-3 py-2.5"
                      >
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#DDF8F4] text-[#138A80]">
                          <Check size={11} />
                        </span>
                        <span className="truncate text-[11px] font-bold text-[#0F172A]">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="relative mt-6 pl-7">
                <span className="absolute bottom-3 left-2.5 top-3 w-px bg-[#DCE9E6]" />
                <div className="space-y-5">
                  {draftSchedule.map((item, index) => (
                    <article
                      key={index}
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
                      <div className="min-w-0 flex-1">
                        {isEditingSchedule ? (
                          <div className="space-y-2 rounded-xl border border-[#DCE9E6] bg-[#F8FCFB] p-3">
                            <div className="flex gap-2">
                              <label className="w-[88px] shrink-0">
                                <span className="mb-1 block text-[9px] font-bold text-[#64748B]">
                                  시간
                                </span>
                                <input
                                  type="time"
                                  value={item.time}
                                  onChange={(event) =>
                                    updateDraftItem(
                                      index,
                                      "time",
                                      event.target.value,
                                    )
                                  }
                                  className="h-10 w-full rounded-lg border border-[#DCE9E6] bg-white px-2 text-xs font-bold text-[#0F172A] outline-none focus:border-[#22B8AD]"
                                />
                              </label>
                              <label className="min-w-0 flex-1">
                                <span className="mb-1 block text-[9px] font-bold text-[#64748B]">
                                  일정명
                                </span>
                                <input
                                  value={item.label}
                                  onChange={(event) =>
                                    updateDraftItem(
                                      index,
                                      "label",
                                      event.target.value,
                                    )
                                  }
                                  className="h-10 w-full rounded-lg border border-[#DCE9E6] bg-white px-3 text-xs font-bold text-[#0F172A] outline-none focus:border-[#22B8AD]"
                                />
                              </label>
                            </div>
                            <label className="block">
                              <span className="mb-1 block text-[9px] font-bold text-[#64748B]">
                                상세 내용
                              </span>
                              <input
                                value={item.description}
                                onChange={(event) =>
                                  updateDraftItem(
                                    index,
                                    "description",
                                    event.target.value,
                                  )
                                }
                                className="h-10 w-full rounded-lg border border-[#DCE9E6] bg-white px-3 text-xs text-[#64748B] outline-none focus:border-[#22B8AD]"
                              />
                            </label>
                          </div>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <div className="mt-7 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isEditingSchedule) {
                      setIsEditingSchedule(false);
                      return;
                    }
                    confirmSchedule();
                  }}
                  className={`h-12 w-full rounded-xl text-sm font-extrabold ${
                    isEditingSchedule
                      ? "bg-[#38D9C7] text-[#063F3A]"
                      : "bg-[#22B8AD] text-white"
                  }`}
                >
                  {isEditingSchedule ? (
                    <span className="flex items-center justify-center gap-1.5">
                      수정 완료
                    </span>
                  ) : (
                    "이 일정으로 확정하기"
                  )}
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
