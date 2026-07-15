import { useState } from "react";
import MobileFrame from "@/components/layout/MobileFrame";
import BottomNav from "@/components/layout/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { LogOut, ChevronRight, MapPin, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearAuthenticatedUser, loadAuthenticatedUser, loadUserProfile } from "@/lib/profile";
import {
  ApiError,
  clearAuthTokens,
  deleteAccountRequest,
  getAccessToken,
  logoutRequest,
} from "@/lib/auth";
import { isBackendUnreachable } from "@/lib/demoFallback";
import { pastEvents } from "@/data/pastEvents";
import Event from "../assets/Event.svg";

export default function MyPage() {
  const navigate = useNavigate();
  const profile = loadUserProfile();
  const authenticatedUser = loadAuthenticatedUser();
  const nickname = profile?.nickname || "덕민";
  const email = profile?.email || authenticatedUser?.email || "";
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      // No local access token means there is no server session to revoke.
      if (getAccessToken()) {
        await logoutRequest();
      }
    } catch (error) {
      // An expired/already-invalid token, or an unreachable backend, both
      // mean the desired state (logged out locally) is reached anyway —
      // don't show a misleading logout failure message for either.
      if (!(error instanceof ApiError && error.status === 401) && !isBackendUnreachable(error)) {
        toast.error(
          error instanceof Error ? error.message : "로그아웃 요청에 실패했어요.",
        );
      }
    } finally {
      clearAuthTokens();
      clearAuthenticatedUser();
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  const handleWithdraw = async () => {
    if (isWithdrawing) return;
    setShowWithdrawConfirm(false);
    setIsWithdrawing(true);
    try {
      await deleteAccountRequest();
      clearAuthTokens();
      clearAuthenticatedUser();
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "회원탈퇴에 실패했어요.",
      );
      // Invalid session or already-deleted account: nothing left to retry,
      // so drop local state and send the user back to login.
      if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
        clearAuthTokens();
        clearAuthenticatedUser();
        navigate("/login", { replace: true });
      }
    } finally {
      setIsWithdrawing(false);
    }
  };
  return (
    <MobileFrame>
      <div className="flex flex-col h-dvh">
        {/* Header */}
        <header className="flex items-center gap-3 px-5 pt-10 pb-4">
          <h1 className="text-lg font-bold text-[#0F172A]">마이페이지</h1>
        </header>

        {/* Content */}
        <div className="flex-1 px-5 pb-24 overflow-y-auto space-y-5">
          {/* Profile Card */}
          <Card className="p-5 border border-[#DCE9E6]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#E6FAF7] flex items-center justify-center overflow-hidden">
                {profile?.image && !imageLoadFailed ? (
                  <img
                    src={profile.image}
                    alt={`${nickname} 프로필`}
                    className="h-full w-full object-cover"
                    onError={() => setImageLoadFailed(true)}
                  />
                ) : (
                  <span className="text-xl font-bold text-[#22B8AD]">
                    {nickname.slice(0, 1)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-[#0F172A]">
                  {nickname}
                </h2>
                <p className="text-xs text-[#64748B]">{email}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/profile/setup")}
                className="px-3 py-1.5 rounded-lg bg-[#F5FBFA] border border-[#DCE9E6] text-xs font-medium text-[#64748B] cursor-pointer transition-colors"
              >
                편집
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-around mt-5 pt-4 border-t border-[#DCE9E6]">
              <div className="text-center">
                <p className="text-lg font-bold text-[#22B8AD]">12</p>
                <p className="text-[10px] text-[#64748B]">참석한 행사</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center">
                <p className="text-lg font-bold text-[#22B8AD]">3</p>
                <p className="text-[10px] text-[#64748B]">예정된 행사</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-center">
                <p className="text-lg font-bold text-[#22B8AD]">28</p>
                <p className="text-[10px] text-[#64748B]">AI 추천 사용</p>
              </div>
            </div>
          </Card>

          {/* Past Events */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#0F172A]">과거 일정</h3>
              <button
                type="button"
                onClick={() => navigate("/mypage/past-events")}
                className="text-xs text-[#22B8AD] font-medium cursor-pointer"
              >
                전체보기
              </button>
            </div>
            <div className="space-y-2">
              {pastEvents.slice(0, 3).map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => navigate(`/mypage/past-events/${event.id}`)}
                  className="w-full rounded-lg border border-[#DCE9E6] bg-white p-3.5 text-left transition-colors hover:bg-[#F8FCFB]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F5FBFA] flex items-center justify-center">
                      <img src={Event} alt="일정" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 min-w-0">
                        <span className="shrink-0 text-xs text-[#64748B]">
                          {event.date}
                        </span>
                        <span className="shrink-0 text-[#DCE9E6]">·</span>
                        <div className="flex min-w-0 items-center gap-0.5">
                          <MapPin size={10} className="shrink-0 text-[#64748B]" />
                          <span className="truncate text-xs text-[#64748B]">
                            {event.venue}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-[#F5FBFA] text-[#64748B] text-[10px] px-2 py-0.5 rounded-md"
                    >
                      완료
                    </Badge>
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-[#CBD5E1]"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          {/* <div>
            <h3 className="text-sm font-bold text-[#0F172A] mb-3">설정</h3>
            <Card className="border border-[#DCE9E6] overflow-hidden">
              {menuItems.map((item, index) => (
                <div key={item.label}>
                  <button className="w-full flex items-center gap-3 p-4 cursor-pointer transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-[#F5FBFA] flex items-center justify-center">
                      <item.icon size={16} className="text-[#64748B]" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-[#0F172A]">
                        {item.label}
                      </p>
                      <p className="text-xs text-[#64748B]">{item.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-[#DCE9E6]" />
                  </button>
                  {index < menuItems.length - 1 && <Separator />}
                </div>
              ))}
            </Card>
          </div> */}

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[#EF4444] font-medium cursor-pointer rounded-xl transition-colors disabled:opacity-60"
          >
            <LogOut size={16} />
            {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
          </button>

          {/* Withdraw */}
          <button
            type="button"
            onClick={() => setShowWithdrawConfirm(true)}
            disabled={isWithdrawing}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs text-[#94A3B8] font-medium cursor-pointer rounded-xl transition-colors disabled:opacity-60"
          >
            <UserX size={14} />
            {isWithdrawing ? "탈퇴 처리 중..." : "회원탈퇴"}
          </button>
        </div>

        <BottomNav />

        {showWithdrawConfirm && (
          <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/40 px-6 pb-8 md:items-center md:pb-0">
            <div className="w-full max-w-80 rounded-3xl bg-[#FFFFFF] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.25)]">
              <h2 className="text-center text-base font-bold text-[#0F172A]">
                정말 탈퇴하시겠어요?
              </h2>
              <p className="mt-2 text-center text-xs leading-relaxed text-[#64748B]">
                계정 데이터는 삭제되며 복구할 수 없어요.
              </p>
              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawConfirm(false)}
                  className="h-12 flex-1 rounded-xl bg-slate-100 text-sm font-bold text-[#64748B] transition-colors"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleWithdraw}
                  className="h-12 flex-1 rounded-xl bg-[#EF4444] text-sm font-bold text-white transition-colors"
                >
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileFrame>
  );
}
