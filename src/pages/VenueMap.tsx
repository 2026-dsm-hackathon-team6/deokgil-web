import {
  type ComponentType,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "@/components/layout/BottomNav";
import MobileFrame from "@/components/layout/MobileFrame";
import { fetchNearbyPlaces, type NearbyCategory, type NearbyPlace } from "@/lib/nearbyPlaces";
import { geocodeAddress } from "@/lib/geocode";
import Lock from "../assets/Lock.svg";
import ConvenienceStore from "../assets/Convenience-store.svg";
import Cafe from "../assets/Cafe.svg";
import Restroom from "../assets/Restroom.svg";
import {
  LayoutGrid,
  LocateFixed,
  Navigation,
  Search,
  X,
} from "lucide-react";

function LockIcon({ size = 20 }: { size?: number }) {
  return (
    <img
      src={Lock}
      alt=""
      aria-hidden="true"
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}

function ConvenienceStoreIcon({ size = 20 }: { size?: number }) {
  return (
    <img
      src={ConvenienceStore}
      alt=""
      aria-hidden="true"
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}

function CafeIcon({ size = 20 }: { size?: number }) {
  return (
    <img
      src={Cafe}
      alt=""
      aria-hidden="true"
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}

function RestroomIcon({ size = 20 }: { size?: number }) {
  return (
    <img
      src={Restroom}
      alt=""
      aria-hidden="true"
      className="object-contain"
      style={{ width: size, height: size }}
    />
  );
}

const categories = [
  { id: "all", label: "전체" },
  { id: "locker", label: "코인락커" },
  { id: "store", label: "편의점" },
  { id: "cafe", label: "카페" },
  { id: "restroom", label: "화장실" },
] as const;

type Category = (typeof categories)[number]["id"];

const CATEGORY_ICON: Record<NearbyCategory, ComponentType<{ size?: number }>> = {
  locker: LockIcon,
  store: ConvenienceStoreIcon,
  cafe: CafeIcon,
  restroom: RestroomIcon,
};

const CATEGORY_TONE: Record<NearbyCategory, string> = {
  locker: "bg-[#f7fcfc] text-[#0f766e]",
  store: "bg-[#f0fdf4] text-[#16a34a]",
  cafe: "bg-[#fff7ed] text-[#ea580c]",
  restroom: "bg-[#f0fdfa] text-[#22b8ad]",
};

const SHEET_COLLAPSED_HEIGHT = 112;
const SHEET_DEFAULT_HEIGHT = 210;
const SHEET_EXPANDED_HEIGHT = 520;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function VenueMap() {
  const location = useLocation();
  const venueState = location.state as { placeName?: string; address?: string } | null;
  const initialQuery = venueState?.address || venueState?.placeName || "";

  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [query, setQuery] = useState(initialQuery);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lon: number } | null>(null);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(true);
  const [nearbyError, setNearbyError] = useState<string | null>(null);
  const [sheetHeight, setSheetHeight] = useState(SHEET_DEFAULT_HEIGHT);
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(SHEET_DEFAULT_HEIGHT);
  const currentSheetHeight = useRef(SHEET_DEFAULT_HEIGHT);
  const isDraggingSheetRef = useRef(false);

  // The list re-centers on whichever location was resolved most recently:
  // a text search (geocoded via Nominatim) takes priority over raw GPS.
  const nearbyCenter = searchCenter ?? currentPosition;

  const mapEmbedSrc = query
    ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
    : currentPosition
      ? `https://www.google.com/maps?q=${currentPosition.lat},${currentPosition.lon}&output=embed`
      : undefined;

  const locateMe = () => {
    if (!("geolocation" in navigator)) {
      setLocationError("이 브라우저에서는 위치를 가져올 수 없어요.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSearchCenter(null);
        setCurrentPosition({ lat: position.coords.latitude, lon: position.coords.longitude });
        setLocationError(null);
      },
      () => setLocationError("위치 권한을 허용해 주세요."),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  const runSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setIsSearching(true);
    setLocationError(null);
    geocodeAddress(trimmed)
      .then((coords) => {
        if (!coords) {
          setLocationError("해당 장소를 찾지 못했어요.");
          return;
        }
        setSearchCenter(coords);
      })
      .catch(() => setLocationError("장소 검색에 실패했어요."))
      .finally(() => setIsSearching(false));
  };

  useEffect(() => {
    if (initialQuery) {
      runSearch(initialQuery);
    } else {
      locateMe();
    }
    // Only run once on mount — search/locate are re-triggered by user action.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFirstQueryChange = useRef(true);

  // Live search: re-geocode and refresh nearby facilities as the user
  // types, without waiting for Enter. Debounced so every keystroke doesn't
  // fire its own network round trip.
  useEffect(() => {
    if (isFirstQueryChange.current) {
      isFirstQueryChange.current = false;
      return;
    }
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsSearching(true);
    const timeoutId = window.setTimeout(() => {
      runSearch(trimmed);
    }, 500);
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (!nearbyCenter) return;
    setIsLoadingNearby(true);
    setNearbyError(null);
    const controller = new AbortController();
    fetchNearbyPlaces(nearbyCenter, 800, controller.signal)
      .then(setNearbyPlaces)
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setNearbyError("주변 시설을 불러오지 못했어요.");
      })
      .finally(() => setIsLoadingNearby(false));
    return () => controller.abort();
  }, [nearbyCenter]);

  const visibleFacilities = useMemo(
    () =>
      activeCategory === "all"
        ? nearbyPlaces
        : nearbyPlaces.filter((place) => place.category === activeCategory),
    [activeCategory, nearbyPlaces],
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
      <div className="relative h-dvh overflow-hidden bg-[#e8efe8]">
        <header className="absolute left-4 right-4 top-4 z-30 flex gap-2.5">
          <div className="flex h-14 min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_6px_22px_rgba(15,23,42,0.12)]">
            <button
              type="button"
              aria-label="검색"
              onClick={() => runSearch(query)}
              disabled={isSearching}
              className="shrink-0 text-[#0f172a] disabled:opacity-50"
            >
              <Search size={18} strokeWidth={2} />
            </button>
            <input
              aria-label="장소 검색"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") runSearch(query);
              }}
              placeholder="장소를 검색해 보세요 (예: YES24 라이브홀)"
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
          {mapEmbedSrc && (
            <iframe
              title="행사장 지도"
              src={mapEmbedSrc}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}

          <button
            type="button"
            aria-label="현재 위치"
            onClick={locateMe}
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
            {locationError ? (
              <p className="py-6 text-center text-xs text-[#64748b]">{locationError}</p>
            ) : isLoadingNearby ? (
              <p className="py-6 text-center text-xs text-[#64748b]">주변 시설을 찾는 중이에요...</p>
            ) : nearbyError ? (
              <p className="py-6 text-center text-xs text-[#64748b]">{nearbyError}</p>
            ) : visibleFacilities.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#64748b]">
                반경 800m 안에서 시설을 찾지 못했어요.
              </p>
            ) : (
              visibleFacilities.map((facility) => {
                const FacilityIcon = CATEGORY_ICON[facility.category];
                const categoryLabel = categories.find((c) => c.id === facility.category)?.label ?? "";

                return (
                  <article key={facility.id} className="flex items-center gap-3">
                    <span
                      className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl ${CATEGORY_TONE[facility.category]}`}
                    >
                      <FacilityIcon size={30} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-[#22c7bb]">
                        {categoryLabel} · 도보 {facility.walkMinutes}분
                      </p>
                      <strong className="mt-1 block truncate text-sm text-[#0f172a]">
                        {facility.name}
                      </strong>
                      <p className="mt-1 text-[10px] text-[#64748b]">{facility.distanceMeters}m</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-[#7ceedf] px-3 text-[11px] font-bold text-[#22b8ad]"
                    >
                      <Navigation size={14} />
                      길찾기
                    </a>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <BottomNav />
      </div>
    </MobileFrame>
  );
}
