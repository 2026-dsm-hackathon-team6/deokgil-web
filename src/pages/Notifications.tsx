import MobileFrame from "@/components/layout/MobileFrame";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Sparkles,
  TrainFront,
  Umbrella,
} from "lucide-react";
import { useState, type ElementType } from "react";
import { useNavigate } from "react-router-dom";

type NotificationItem = {
  id: number;
  group: "오늘" | "이전 알림";
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: ElementType;
  tone: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    group: "오늘",
    title: "이제 출발할 시간이에요",
    description: "15분 안에 출발하면 KSPO DOME에 여유롭게 도착해요.",
    time: "방금",
    unread: true,
    icon: Sparkles,
    tone: "bg-[#DDF8F4] text-[#138A80]",
  },
  {
    id: 2,
    group: "오늘",
    title: "우산을 챙겨 주세요",
    description: "오후 9시부터 비가 올 확률이 70%예요.",
    time: "12분 전",
    unread: true,
    icon: Umbrella,
    tone: "bg-[#FFF7E6] text-[#D97706]",
  },
  {
    id: 3,
    group: "오늘",
    title: "체크리스트가 업데이트됐어요",
    description: "날씨 정보를 반영해 준비물에 우산을 추가했어요.",
    time: "오전 11:20",
    unread: false,
    icon: Bell,
    tone: "bg-[#F5FBFA] text-[#22B8AD]",
  },
  {
    id: 4,
    group: "이전 알림",
    title: "귀가 경로를 준비했어요",
    description: "공연 종료 후 이용할 수 있는 안전한 귀가 경로를 확인해 보세요.",
    time: "어제",
    unread: false,
    icon: TrainFront,
    tone: "bg-[#F1F5F9] text-[#64748B]",
  },
  {
    id: 5,
    group: "이전 알림",
    title: "이벤트가 등록됐어요",
    description: "2026 IU WORLD TOUR 일정 정보를 모두 확인했어요.",
    time: "7월 13일",
    unread: false,
    icon: CalendarDays,
    tone: "bg-[#F1F5F9] text-[#64748B]",
  },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((item) => item.unread).length;

  const markAsRead = (id: number) => {
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((items) =>
      items.map((item) => ({ ...item, unread: false })),
    );
  };

  return (
    <MobileFrame>
      <div className="flex h-screen flex-col bg-white">
        <header className="flex items-center justify-between border-b border-[#DCE9E6] px-5 pb-4 pt-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="뒤로 가기"
              className="grid h-9 w-9 place-items-center rounded-full text-[#0F172A]"
            >
              <ArrowLeft size={19} />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-[#0F172A]">알림</h1>
              {unreadCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#22B8AD] px-1 text-[10px] font-extrabold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-xs font-bold text-[#22B8AD]"
            >
              모두 읽음
            </button>
          )}
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-5">
          {(["오늘", "이전 알림"] as const).map((group) => {
            const groupItems = notifications.filter((item) => item.group === group);

            return (
              <section key={group} className="mb-7 last:mb-0">
                <h2 className="mb-3 text-xs font-extrabold text-[#64748B]">
                  {group}
                </h2>
                <div className="space-y-2.5">
                  {groupItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className={`relative flex w-full gap-3 rounded-2xl border p-4 text-left transition-colors ${
                        item.unread
                          ? "border-[#BDEBE5] bg-[#F5FBFA]"
                          : "border-[#E7EEEC] bg-white"
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${item.tone}`}
                      >
                        <item.icon size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <strong className="text-sm text-[#0F172A]">
                            {item.title}
                          </strong>
                          <time className="shrink-0 text-[9px] text-[#94A3B8]">
                            {item.time}
                          </time>
                        </span>
                        <span className="mt-1.5 block text-[11px] leading-relaxed text-[#64748B]">
                          {item.description}
                        </span>
                      </span>
                      {item.unread && (
                        <span
                          className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[#22B8AD]"
                          aria-label="읽지 않은 알림"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      </div>
    </MobileFrame>
  );
}
