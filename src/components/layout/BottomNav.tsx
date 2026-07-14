import type { LucideIcon } from "lucide-react";
import Home from "../../assets/Home.svg";
import Schedule from "../../assets/Schedule.svg";
import Schedule2 from "../../assets/Schedule2.svg";
import Market from "../../assets/Market.svg";
import Person from "../../assets/Person.svg";
import { useLocation, useNavigate } from "react-router-dom";

type NavItem = {
  icon?: LucideIcon;
  iconAsset?: string;
  label: string;
  path: string;
  match: string[];
};

const navItems: NavItem[] = [
  { iconAsset: Home, label: "홈", path: "/home", match: ["/home"] },
  {
    iconAsset: Schedule,
    label: "이벤트",
    path: "/events",
    match: ["/events", "/event"],
  },
  {
    iconAsset: Schedule2,
    label: "일정",
    path: "/schedule/create",
    match: ["/schedule"],
  },
  {
    iconAsset: Market,
    label: "주변",
    path: "/venue-map",
    match: ["/venue-map"],
  },
  { iconAsset: Person, label: "MY", path: "/mypage", match: ["/mypage"] },
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
              {item.iconAsset ? (
                <img
                  src={item.iconAsset}
                  alt=""
                  aria-hidden="true"
                  className={`h-[21px] w-6 shrink-0 object-contain transition-opacity ${
                    isActive ? "opacity-100" : "opacity-40"
                  }`}
                  style={{
                    filter: isActive
                      ? "brightness(0) saturate(100%) invert(56%) sepia(45%) saturate(1028%) hue-rotate(126deg) brightness(92%) contrast(82%)"
                      : "grayscale(1)",
                  }}
                />
              ) : (
                item.icon && (
                  <item.icon size={21} strokeWidth={isActive ? 2.25 : 1.75} />
                )
              )}
              <span
                className={`text-[10px] ${isActive ? "font-bold" : "font-semibold"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
