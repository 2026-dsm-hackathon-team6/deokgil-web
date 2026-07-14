import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileFrame from "@/components/layout/MobileFrame";
import BottomNav from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { markEventAsDeleted } from "@/lib/events";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CloudSun,
  Navigation,
  Thermometer,
  Trash2,
} from "lucide-react";

const checklist = [
  { id: 1, label: "티켓 (모바일)", checked: true },
  { id: 2, label: "신분증", checked: true },
  { id: 3, label: "응원봉", checked: false },
  { id: 4, label: "보조배터리", checked: false },
  { id: 5, label: "물 / 간식", checked: false },
  { id: 6, label: "우산 (비 예보)", checked: false },
];

export default function EventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [checklistItems, setChecklistItems] = useState(checklist);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const completedItemCount = checklistItems.filter(
    (item) => item.checked,
  ).length;

  const handleChecklistChange = (id: number, checked: boolean) => {
    setChecklistItems((items) =>
      items.map((item) => (item.id === id ? { ...item, checked } : item)),
    );
  };

  const handleDeleteEvent = () => {
    if (id) markEventAsDeleted(id);
    navigate("/events", { replace: true });
  };

  return (
    <MobileFrame>
      <div className="flex flex-col h-screen">
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
              BTS 월드투어 서울
            </h1>
            <p className="text-xs text-[#64748B]">잠실종합운동장 주경기장</p>
          </div>
          <Badge className="bg-[#22B8AD] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            D-7
          </Badge>
        </header>

        {/* Content */}
        <div className="flex-1 px-5 pb-24 overflow-y-auto space-y-4">
          {/* AI Briefing Card */}
          <Card className="p-4 bg-[#E6FAF7] border-none">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-[#138A80]">
                AI Event 브리핑
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2.5">
                <Clock size={14} className="text-[#22B8AD]" />
                <div>
                  <p className="text-[10px] text-[#64748B]">추천 출발</p>
                  <p className="text-xs font-bold text-[#0F172A]">15:40</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2.5">
                <Navigation size={14} className="text-[#22B8AD]" />
                <div>
                  <p className="text-[10px] text-[#64748B]">이동 시간</p>
                  <p className="text-xs font-bold text-[#0F172A]">1시간 10분</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2.5">
                <CloudSun size={14} className="text-[#F59E0B]" />
                <div>
                  <p className="text-[10px] text-[#64748B]">날씨</p>
                  <p className="text-xs font-bold text-[#0F172A]">맑음</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2.5">
                <Thermometer size={14} className="text-[#EF4444]" />
                <div>
                  <p className="text-[10px] text-[#64748B]">기온</p>
                  <p className="text-xs font-bold text-[#0F172A]">28°C</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Event Info */}
          <Card className="p-4 border border-[#DCE9E6]">
            <h3 className="text-sm font-bold text-[#0F172A] mb-3">행사 정보</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-[#64748B]" />
                <span className="text-sm text-[#0F172A]">
                  2026.07.20 (일) 18:00
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-[#64748B]" />
                <span className="text-sm text-[#0F172A]">
                  잠실종합운동장 주경기장
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-[#64748B]" />
                <span className="text-sm text-[#0F172A]">
                  약 2시간 30분 예상
                </span>
              </div>
            </div>
          </Card>

          {/* AI Checklist */}
          <Card className="p-4 border border-[#DCE9E6]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0F172A]">
                  AI 체크리스트
                </h3>
              </div>
              <span className="text-[10px] text-[#64748B]">
                {completedItemCount}/{checklistItems.length} 완료
              </span>
            </div>
            <div className="space-y-2.5">
              {checklistItems.map((item) => (
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
                  20:30
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">추천 출발 시간</span>
                <span className="text-xs font-semibold text-[#138A80]">
                  20:40
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">막차 시간</span>
                <span className="text-xs font-semibold text-[#EF4444]">
                  23:20
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">예상 도착</span>
                <span className="text-xs font-semibold text-[#0F172A]">
                  21:50
                </span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={() => navigate("/schedule/create")}
              className="w-full h-12 rounded-xl bg-[#38D9C7] text-[#063F3A] text-sm font-extrabold cursor-pointer hover:bg-[#38D9C7]"
            >
              AI 일정 생성하기
            </Button>
            <Button
              onClick={() => navigate("/venue-map")}
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
              className="w-full rounded-3xl bg-white p-5 shadow-xl"
            >
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#DCE9E6]" />
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FEF2F2] text-[#EF4444]">
                <Trash2 size={20} />
              </span>
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
