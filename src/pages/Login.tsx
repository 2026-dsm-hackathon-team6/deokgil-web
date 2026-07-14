import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/layout/MobileFrame";
import { Button } from "@/components/ui/button";
import Logo from "../assets/Logo.svg";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleSignupPreview = () => {
    navigate("/profile/setup", {
      state: {
        googleProfile: {
          name: "김덕길",
          email: "deokgil@gmail.com",
          image: "/google-profile-placeholder.svg",
        },
      },
    });
  };

  return (
    <MobileFrame>
      <div className="flex flex-col h-screen px-6 pt-20 pb-8">
        {/* Logo and branding */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* <div className="w-20 h-20 rounded-2xl bg-[#22B8AD] flex items-center justify-center mb-6 shadow-lg shadow-teal-200 overflow-hidden"> */}
          <img
            src={Logo}
            alt="덕길이 로고"
            className="w-20 h-20 object-contain flex items-center justify-center mb-6  overflow-hidden"
          />
          {/* </div> */}
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">덕길이</h1>
          <p className="text-[#64748B] text-sm text-center leading-relaxed">
            AI가 추천하는 최적의 덕질 일정
          </p>
        </div>

        {/* Login buttons */}
        <div className="space-y-3 mb-8">
          <Button
            onClick={() => navigate("/home")}
            className="w-full h-14 rounded-2xl bg-white border border-[#DCE9E6] text-[#0F172A] text-base font-medium shadow-sm cursor-pointer"
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
            Google로 로그인
          </Button>

          <div className="flex items-center justify-center gap-1 pt-1 text-sm">
            <span className="text-[#64748B]">덕길이가 처음이신가요?</span>
            <button
              type="button"
              onClick={handleGoogleSignupPreview}
              className="font-bold text-[#22B8AD] underline-offset-4 hover:underline"
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
