import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileFrame from "@/components/layout/MobileFrame";
import BottomNav from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import { deleteEvent, getEvent, type EventDetail as EventDetailData } from "@/lib/eventsApi";
import { fetchWeatherEstimate, type WeatherEstimate } from "@/lib/travelEstimate";
import {
  clearConfirmedSchedule,
  loadConfirmedSchedule,
  saveConfirmedSchedule,
  type ConfirmedSchedule,
} from "@/lib/scheduleStore";
import Clock2 from "../assets/Clock.svg";
import Location from "../assets/Location.svg";
import Sunny from "../assets/Sunny.svg";
import Temperature from "../assets/Temperature.svg";
import { ArrowLeft, Calendar, MapPin, Trash2, Clock } from "lucide-react";

export default function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [event, setEvent] = useState<EventDetailData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [weather, setWeather] = useState<WeatherEstimate | null>(null);
  const [confirmedSchedule, setConfirmedSchedule] = useState<ConfirmedSchedule | null>(null);

  useEffect(() => {
    if (!id) return;
    setConfirmedSchedule(loadConfirmedSchedule(id));
  }, [id]);

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    setConfirmedSchedule((current) => {
      if (!current) return current;
      const updated = {
        ...current,
        checklist: current.checklist.map((item) =>
          item.id === itemId ? { ...item, checked } : item,
        ),
      };
      saveConfirmedSchedule(updated);
      return updated;
    });
  };

  const loadEvent = () => {
    if (!id) return;
    setIsLoading(true);
    setLoadError(null);
    getEvent(id)
      .then((data) => {
        setEvent(data);
        setIsLoading(false);
      })
      .catch((error) => {
        const message =
          error instanceof Error ? error.message : "행사를 불러오지 못했어요.";
        toast.error(message);
        setLoadError(message);
        setIsLoading(false);
      });
  };

  useEffect(loadEvent, [id]);

  useEffect(() => {
    // Backend serializes absent coordinates as JSON null, not a missing
    // key — `== null` catches both null and undefined.
    if (event?.latitude == null || event?.longitude == null || !event.startAt) return;
    const controller = new AbortController();
    fetchWeatherEstimate(
      { lat: event.latitude, lon: event.longitude },
      new Date(event.startAt),
      controller.signal,
    )
      .then(setWeather)
      .catch(() => setWeather(null));
    return () => controller.abort();
  }, [event?.latitude, event?.longitude, event?.startAt]);

  const handleDeleteEvent = async () => {
    if (!id || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteEvent(id);
      clearConfirmedSchedule(id);
      navigate("/events", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "행사를 삭제하지 못했어요.");
      setIsDeleting(false);
    }
  };

  const startAt = event ? new Date(event.startAt) : null;
  const durationMinutes = event
    ? Math.max(0, (new Date(event.endAt).getTime() - new Date(event.startAt).getTime()) / 60000)
    : 0;

  return (
    <MobileFrame>
      <div className="flex flex-col h-dvh">
        {/* Header */}
        <header className="flex items-center gap-3 px-5 pt-10 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9  flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-[#0F172A]" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#0F172A]">
              {event?.title || "행사 정보"}
            </h1>
            <p className="text-xs text-[#64748B]">{event?.placeName || "행사장을 불러오는 중이에요."}</p>
          </div>
          <Badge className="bg-[#22B8AD] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            {startAt ? `D-${Math.max(0, Math.ceil((startAt.getTime() - Date.now()) / 86400000))}` : "..."}
          </Badge>
        </header>

        {/* Content */}
        <div className="flex-1 px-5 pb-24 overflow-y-auto space-y-4">
          {loadError && !event ? (
            <Card className="p-6 border border-[#DCE9E6] text-center">
              <p className="text-sm text-[#64748B]">{loadError}</p>
              <button
                type="button"
                onClick={loadEvent}
                disabled={isLoading}
                className="mt-4 h-11 w-full rounded-xl bg-[#38D9C7] text-sm font-extrabold text-[#083D39] disabled:opacity-60"
              >
                {isLoading ? "다시 불러오는 중..." : "다시 시도"}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-[#EF4444] transition-colors hover:bg-[#FEF2F2]"
              >
                <Trash2 size={16} />
                이 이벤트 삭제
              </button>
            </Card>
          ) : (
          <>
          {confirmedSchedule && (
          <Card className="p-4 bg-[#E6FAF7] border-none">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-[#138A80]">
                AI Event 브리핑
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2.5">
                <img src={Clock2} alt="시계" className="w-5" />
                <div>
                  <p className="text-[10px] text-[#64748B]">추천 출발</p>
                  <p className="text-xs font-bold text-[#0F172A]">-</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2.5">
                <img src={Location} alt="지도" className="w-5" />
                <div>
                  <p className="text-[10px] text-[#64748B]">이동 시간</p>
                  <p className="text-xs font-bold text-[#0F172A]">-</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2.5">
                <img src={Sunny} alt="날씨" className="w-5" />
                <div>
                  <p className="text-[10px] text-[#64748B]">날씨</p>
                  <p className="text-xs font-bold text-[#0F172A]">{weather?.label || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2.5">
                <img src={Temperature} alt="날씨" className="w-5" />

                <div>
                  <p className="text-[10px] text-[#64748B]">기온</p>
                  <p className="text-xs font-bold text-[#0F172A]">
                    {weather ? `${weather.tempC}°C` : "-"}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          )}

          {/* Event Info */}
          <Card className="p-4 border border-[#DCE9E6]">
            <h3 className="text-sm font-bold text-[#0F172A] mb-3">행사 정보</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-[#64748B]" />
                <span className="text-sm text-[#0F172A]">
                  {startAt
                    ? `${startAt.getFullYear()}.${String(startAt.getMonth() + 1).padStart(2, "0")}.${String(startAt.getDate()).padStart(2, "0")} ${startAt.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}`
                    : "불러오는 중"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-[#64748B]" />
                <span className="text-sm text-[#0F172A]">
                  {event?.address || event?.placeName || "-"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-[#64748B]" />
                <span className="text-sm text-[#0F172A]">
                  {durationMinutes ? `약 ${Math.floor(durationMinutes / 60)}시간 ${durationMinutes % 60}분` : "-"}
                </span>
              </div>
            </div>
          </Card>

          {confirmedSchedule && (
          <>
          {/* AI Checklist */}
          <Card className="p-4 border border-[#DCE9E6]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0F172A]">체크리스트</h3>
              </div>
              <span className="text-[10px] text-[#64748B]">
                {confirmedSchedule.checklist.filter((item) => item.checked).length}/
                {confirmedSchedule.checklist.length} 완료
              </span>
            </div>
            <div className="space-y-2.5">
              {confirmedSchedule.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={(checked) =>
                      handleChecklistChange(item.id, checked === true)
                    }
                    aria-label={`${item.label} ${item.checked ? "선택 해제" : "선택"}`}
                    className="w-5 h-5 rounded-md border-[#DCE9E6] data-[state=checked]:bg-[#22B8AD] data-[state=checked]:border-[#22B8AD]"
                  />
                  <span
                    className={`text-sm ${
                      item.checked
                        ? "text-[#64748B] line-through"
                        : "text-[#0F172A]"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Return Home Planner */}
          <Card className="p-4 border border-[#DCE9E6]">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-[#0F172A]">귀가 플래너</h3>
            </div>
            <div className="space-y-2 bg-[#F5FBFA] rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">공연 종료 예상</span>
                <span className="text-xs font-semibold text-[#0F172A]">
                  {event
                    ? new Date(event.endAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">추천 출발 시간</span>
                <span className="text-xs font-semibold text-[#138A80]">-</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">막차 시간</span>
                <span className="text-xs font-semibold text-[#EF4444]">-</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">예상 도착</span>
                <span className="text-xs font-semibold text-[#0F172A]">-</span>
              </div>
            </div>
          </Card>
          </>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={() =>
                navigate("/schedule/create", {
                  state: {
                    eventId: id,
                    title: event?.title,
                    startAt: event?.startAt,
                    endAt: event?.endAt,
                    placeName: event?.placeName,
                  },
                })
              }
              className="w-full h-12 rounded-xl bg-[#38D9C7] text-[#063F3A] text-sm font-extrabold cursor-pointer hover:bg-[#38D9C7]"
            >
              AI 일정 생성하기
            </Button>
            <Button
              onClick={() =>
                navigate("/venue-map", {
                  state: { placeName: event?.placeName, address: event?.address },
                })
              }
              variant="outline"
              className="w-full h-12 rounded-xl border-[#DCE9E6] text-[#0F172A] text-sm font-semibold cursor-pointer"
            >
              <MapPin size={16} className="mr-2" />
              행사장 지도 보기
            </Button>
            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-[#EF4444] transition-colors hover:bg-[#FEF2F2]"
            >
              <Trash2 size={16} />
              등록한 이벤트 삭제
            </button>
          </div>
          </>
          )}
        </div>

        <BottomNav />

        {isDeleteDialogOpen && (
          <div
            className="absolute inset-0 z-50 flex items-end bg-[#0F172A]/45 px-4 pb-5"
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
              aria-labelledby="delete-event-title"
              className="w-full rounded-3xl bg-[#FFFFFF] p-5"
            >
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#DCE9E6]" />
              <h2
                id="delete-event-title"
                className="mt-4 text-lg font-extrabold text-[#0F172A]"
              >
                이벤트를 삭제할까요?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
                체크리스트와 생성한 일정도 함께 삭제되며, 삭제한 이벤트는 복구할
                수 없어요.
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
                  onClick={handleDeleteEvent}
                  disabled={isDeleting}
                  className="h-12 rounded-xl bg-[#EF4444] text-sm font-bold text-white"
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </MobileFrame>
  );
}
