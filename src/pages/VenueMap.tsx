import {
  type PointerEvent as ReactPointerEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import BottomNav from "@/components/layout/BottomNav";
import MobileFrame from "@/components/layout/MobileFrame";
import {
  Bath,
  Coffee,
  LayoutGrid,
  LocateFixed,
  LockKeyhole,
  Navigation,
  Search,
  Star,
  Store,
  X,
} from "lucide-react";

const categories = [
  { id: "all", label: "전체" },
  { id: "locker", label: "코인락커" },
  { id: "store", label: "편의점" },
  { id: "cafe", label: "카페" },
  { id: "restroom", label: "화장실" },
] as const;

type Category = (typeof categories)[number]["id"];

const SHEET_COLLAPSED_HEIGHT = 112;
const SHEET_DEFAULT_HEIGHT = 210;
const SHEET_EXPANDED_HEIGHT = 520;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const facilities = [
  {
    id: 1,
    name: "올림픽공원역 3번 출구",
    category: "locker" as Category,
    categoryLabel: "코인락커",
    distance: "도보 4분",
    status: "현재 이용 가능",
    icon: LockKeyhole,
    markerClass: "left-[18%] top-[29%]",
    tone: "bg-[#f7fcfc] text-[#0f766e]",
  },
  {
    id: 2,
    name: "GS25 올림픽공원점",
    category: "store" as Category,
    categoryLabel: "편의점",
    distance: "도보 3분",
    status: "24시간 영업",
    icon: Store,
    markerClass: "right-[14%] top-[21%]",
    tone: "bg-[#f0fdf4] text-[#16a34a]",
  },
  {
    id: 3,
    name: "투썸플레이스 올림픽공원점",
    category: "cafe" as Category,
    categoryLabel: "카페",
    distance: "도보 5분",
    status: "현재 영업 중",
    icon: Coffee,
    markerClass: "right-[12%] top-[59%]",
    tone: "bg-[#fff7ed] text-[#ea580c]",
  },
  {
    id: 4,
    name: "KSPO DOME 1층 화장실",
    category: "restroom" as Category,
    categoryLabel: "화장실",
    distance: "도보 1분",
    status: "이용 가능",
    icon: Bath,
    markerClass: "left-[10%] top-[64%]",
    tone: "bg-[#f0fdfa] text-[#22b8ad]",
  },
];

export default function VenueMap() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [query, setQuery] = useState("KSPO DOME 주변");
  const [sheetHeight, setSheetHeight] = useState(SHEET_DEFAULT_HEIGHT);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(SHEET_DEFAULT_HEIGHT);
  const currentSheetHeight = useRef(SHEET_DEFAULT_HEIGHT);
  const isDraggingSheetRef = useRef(false);

  const visibleFacilities = useMemo(
    () =>
      activeCategory === "all"
        ? facilities
        : facilities.filter((facility) => facility.category === activeCategory),
    [activeCategory],
  );

  const getMaximumSheetHeight = () =>
    Math.min(SHEET_EXPANDED_HEIGHT, window.innerHeight - 112);

  const updateSheetHeight = (height: number) => {
    currentSheetHeight.current = height;
    setSheetHeight(height);
  };

  const handleSheetDragStart = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartY.current = event.clientY;
    dragStartHeight.current = currentSheetHeight.current;
    isDraggingSheetRef.current = true;
    setIsDraggingSheet(true);
  };

  const handleSheetDragMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isDraggingSheetRef.current) return;

    const draggedDistance = dragStartY.current - event.clientY;
    updateSheetHeight(
      clamp(
        dragStartHeight.current + draggedDistance,
        SHEET_COLLAPSED_HEIGHT,
        getMaximumSheetHeight(),
      ),
    );
  };

  const handleSheetDragEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isDraggingSheetRef.current) return;

    isDraggingSheetRef.current = false;
    setIsDraggingSheet(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const snapPoints = [
      SHEET_COLLAPSED_HEIGHT,
      SHEET_DEFAULT_HEIGHT,
      getMaximumSheetHeight(),
    ];
    const nearestSnapPoint = snapPoints.reduce((nearest, point) =>
      Math.abs(point - currentSheetHeight.current) <
      Math.abs(nearest - currentSheetHeight.current)
        ? point
        : nearest,
    );

    updateSheetHeight(nearestSnapPoint);
  };

  return (
    <MobileFrame className="bg-[#e8efe8]">
      <div className="relative h-screen overflow-hidden bg-[#e8efe8]">
        <header className="absolute left-4 right-4 top-4 z-30 flex gap-2.5">
          <div className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_6px_22px_rgba(15,23,42,0.12)]">
            <Search
              size={18}
              strokeWidth={2}
              className="shrink-0 text-[#0f172a]"
            />
            <input
              aria-label="장소 검색"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold text-[#0f172a] outline-none"
            />
            {query && (
              <button
                type="button"
                aria-label="검색어 지우기"
                onClick={() => setQuery("")}
                className="grid h-8 w-8 shrink-0 place-items-center text-[#94a3b8]"
              >
                <X size={17} />
              </button>
            )}
          </div>
          <button
            type="button"
            aria-label="지도 필터"
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-[#0f172a] shadow-[0_6px_22px_rgba(15,23,42,0.12)]"
          >
            <LayoutGrid size={20} />
          </button>
        </header>

        <div className="absolute inset-0 overflow-hidden bg-[#e8efe8]">
          <span className="absolute -left-22.5 top-[38%] h-4 w-142.5 rotate-18 border-y border-[#dce9e6] bg-white" />
          <span className="absolute -left-20 top-[58%] h-4 w-135 rotate-[-38deg] border-y border-[#dce9e6] bg-white" />
          <span className="absolute left-[42%] top-[25%] h-4 w-95 rotate-87 border-y border-[#dce9e6] bg-white" />

          <div className="absolute left-[47%] top-[43%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <div className="grid h-14 w-14 -rotate-45 place-items-center rounded-[50%_50%_50%_0] bg-[#38d9c7] shadow-[0_7px_20px_rgba(56,217,199,0.35)]">
              <Star
                size={20}
                fill="#334155"
                className="rotate-45 text-[#334155]"
              />
            </div>
            <strong className="mt-2 rounded-md bg-white px-2 py-1 text-[10px] font-extrabold text-[#334155] shadow-[0_3px_10px_rgba(15,23,42,0.16)]">
              KSPO DOME
            </strong>
          </div>

          {facilities.map((facility) => {
            const Icon = facility.icon;
            const isVisible =
              activeCategory === "all" || activeCategory === facility.category;

            if (!isVisible) return null;

            return (
              <button
                key={facility.id}
                type="button"
                aria-label={facility.name}
                onClick={() => setActiveCategory(facility.category)}
                className={`absolute z-10 flex flex-col items-center ${facility.markerClass}`}
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full border-2 border-white shadow-[0_4px_13px_rgba(15,23,42,0.2)] ${facility.tone}`}
                >
                  <Icon size={19} />
                </span>
                <small className="mt-1 rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#475569] shadow-sm">
                  {facility.categoryLabel}
                </small>
              </button>
            );
          })}

          <button
            type="button"
            aria-label="현재 위치"
            style={{ bottom: sheetHeight + 80 }}
            className={`absolute right-4 z-20 grid h-13 w-13 place-items-center rounded-full bg-white text-[#22c7bb] shadow-[0_4px_16px_rgba(15,23,42,0.16)] ${
              isDraggingSheet ? "" : "transition-[bottom] duration-300"
            }`}
          >
            <LocateFixed size={22} />
          </button>
        </div>

        <section
          style={{ height: sheetHeight }}
          className={`venue-map-sheet absolute bottom-16 left-0 right-0 z-20 flex flex-col overflow-hidden rounded-t-[28px] bg-white px-5 pb-5 pt-2 shadow-[0_-8px_28px_rgba(15,23,42,0.1)] ${
            isDraggingSheet ? "" : "transition-[height] duration-300 ease-out"
          }`}
        >
          <button
            type="button"
            aria-label="주변 시설 패널 높이 조절"
            onPointerDown={handleSheetDragStart}
            onPointerMove={handleSheetDragMove}
            onPointerUp={handleSheetDragEnd}
            onPointerCancel={handleSheetDragEnd}
            className="mx-auto mb-3 flex h-5 w-20 shrink-0 touch-none cursor-grab items-center justify-center active:cursor-grabbing"
          >
            <span className="block h-1 w-11 rounded-full bg-[#cbd5e1]" />
          </button>

          <div className="flex shrink-0 gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={`h-9 shrink-0 rounded-full px-4 text-[11px] font-semibold ${
                  activeCategory === category.id
                    ? "border border-[#38d9c7] bg-[#38d9c7] text-white"
                    : "border border-[#dbe4ee] bg-white text-[#64748b]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {visibleFacilities.map((facility) => {
              const FacilityIcon = facility.icon;

              return (
                <article key={facility.id} className="flex items-center gap-3">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#f0fdfa] text-[#22c7bb]">
                    <FacilityIcon size={23} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-[#22c7bb]">
                      {facility.categoryLabel} · {facility.distance}
                    </p>
                    <strong className="mt-1 block truncate text-sm text-[#0f172a]">
                      {facility.name}
                    </strong>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-[#64748b]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                      {facility.status}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-[#7ceedf] px-3 text-[11px] font-bold text-[#22b8ad]"
                  >
                    <Navigation size={14} />
                    길찾기
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <BottomNav />
      </div>
    </MobileFrame>
  );
}
