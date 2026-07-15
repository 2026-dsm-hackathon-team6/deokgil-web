import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/layout/MobileFrame";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { requestGoogleAuthorizationCode } from "@/lib/googleAuth";
import { ApiError, loginWithGoogle, saveAuthTokens, type AuthResponse } from "@/lib/auth";
import { normalizeAuthenticatedUser, saveAuthenticatedUser, saveUserProfile } from "@/lib/profile";
import { DEMO_ACCESS_TOKEN_PREFIX, demoUser, isBackendUnreachable } from "@/lib/demoFallback";
import TotalLogo from "../assets/TotalLogo.svg";

const isUnregisteredUserError = (error: unknown) =>
  error instanceof ApiError &&
  (error.status === 404 ||
    error.code === "USER_NOT_FOUND" ||
    error.code === "USER_NOT_REGISTERED" ||
    error.code === "UNREGISTERED_USER");

export default function Login() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGoogleLogin = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const authorizationCode = await requestGoogleAuthorizationCode();
      let response: AuthResponse;
      try {
        response = await loginWithGoogle(authorizationCode);
      } catch (error) {
        // Backend unreachable: fall back to a local demo session so the
        // rest of the app is still click-through-able. Real 4xx/5xx errors
        // (e.g. unregistered account) still surface normally.
        if (!isBackendUnreachable(error)) throw error;
        response = {
          accessToken: `${DEMO_ACCESS_TOKEN_PREFIX}${crypto.randomUUID()}`,
          user: demoUser,
        };
      }
      saveAuthTokens(response);
      const user = normalizeAuthenticatedUser(response.user);
      saveAuthenticatedUser(user);
      saveUserProfile({
        nickname: user.name,
        image: user.image,
        email: user.email,
      });
      navigate("/home", { replace: true });
    } catch (error) {
      if (isUnregisteredUserError(error)) {
        toast.error("가입되지 않은 계정이에요. 회원가입으로 진행해 주세요.");
      } else {
        toast.error(
          error instanceof Error ? error.message : "구글 인증에 실패했어요.",
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      // Keep this code and send it to the signup API after the user fills in
      // their profile. It is single-use, so requesting another code later
      // would cause needless Google popups and can invalidate this flow.
      const authorizationCode = await requestGoogleAuthorizationCode();
      navigate("/profile/setup", { state: { authorizationCode } });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "구글 인증에 실패했어요.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MobileFrame>
      <div className="flex flex-col h-dvh px-6 pt-20 pb-8">
        {/* Logo and branding */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <img
            src={TotalLogo}
            alt="덕길이"
            className="w-52 h-auto object-contain mb-6"
          />
          <p className="text-[#64748B] text-sm text-center leading-relaxed">
            AI가 추천하는 최적의 덕질 일정
          </p>
        </div>

        {/* Login button */}
        <div className="space-y-3 mb-8">
          <Button
            onClick={handleGoogleLogin}
            disabled={isProcessing}
            className="w-full h-14 rounded-2xl bg-white border border-[#DCE9E6] text-[#0F172A] text-base font-medium shadow-sm cursor-pointer disabled:opacity-60"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isProcessing ? "처리 중..." : "Google로 로그인"}
          </Button>
          <div className="flex items-center justify-center gap-1 pt-1 text-sm">
            <span className="text-[#64748B]">덕길이가 처음이신가요?</span>
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isProcessing}
              className="font-bold text-[#22B8AD] underline-offset-4 hover:underline disabled:opacity-60"
            >
              회원가입
            </button>
          </div>
        </div>

        {/* Terms */}
        <p className="text-[10px] text-[#64748B] text-center leading-relaxed">
          계속 진행하면{" "}
          <span className="underline cursor-pointer">이용약관</span> 및{" "}
          <span className="underline cursor-pointer">개인정보처리방침</span>에
          동의하는 것으로 간주됩니다.
        </p>
      </div>
    </MobileFrame>
  );
}
