import {
  CalendarDays,
  Clock3,
  House,
  LocateFixed,
  UserRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: House, label: "오늘", path: "/home", match: ["/home"] },
  {
    icon: CalendarDays,
    label: "이벤트",
    path: "/events",
    match: ["/events", "/event"],
  },
  {
    icon: Clock3,
    label: "일정",
    path: "/schedule/create",
    match: ["/schedule"],
  },
  {
    icon: LocateFixed,
    label: "주변",
    path: "/venue-map",
    match: ["/venue-map"],
  },
  { icon: UserRound, label: "MY", path: "/mypage", match: ["/mypage"] },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="glass-nav fixed bottom-0 left-1/2 z-50 w-full max-w-97.5 -translate-x-1/2 border-t safe-bottom">
      <div className="grid h-[72px] grid-cols-5 px-1">
        {navItems.map((item) => {
          const isActive = item.match.some((path) =>
            location.pathname.startsWith(path),
          );

          return (
            <button
              key={item.path}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => navigate(item.path)}
              className={`flex min-w-0 flex-col items-center justify-center gap-1.5 ${
                isActive ? "text-[#22B8AD]" : "text-[#94A3B8]"
              }`}
            >
              <item.icon size={21} strokeWidth={isActive ? 2.25 : 1.75} />
              <span className={`text-[10px] ${isActive ? "font-bold" : "font-semibold"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
