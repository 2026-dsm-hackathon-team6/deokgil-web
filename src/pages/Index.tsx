import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import MobileFrame from "@/components/layout/MobileFrame";
import {
  BriefingPreview,
  RegisterPreview,
  ReturnPreview,
  SchedulePreview,
} from "@/components/onboarding/PhonePreviews";
import Logo from "@/assets/Logo.svg";
import TotalLogo from "@/assets/TotalLogo.svg";

type StepCardProps = {
  step: string;
  eyebrow: string;
  title: ReactNode;
  description: string;
  background: string;
  height: string;
  children: ReactNode;
};

function StepCard({ step, eyebrow, title, description, background, height, children }: StepCardProps) {
  return (
    <section className={`relative w-full overflow-hidden px-7 pt-[66px] ${background} ${height}`}>
      <p className="text-[12px] font-black tracking-[0.19em] text-[#687A84]">STEP {step}</p>
      <p className="mt-5 text-[11px] font-bold text-[#75868D]">{eyebrow}</p>
      <h2 className="mt-3 text-[35px] font-black leading-[1.04] tracking-[-0.055em] text-[#0A1830]">{title}</h2>
      <p className="mt-7 max-w-[285px] text-[12px] font-medium leading-[1.8] text-[#6B7C83]">{description}</p>
      <div className="mt-[58px]">{children}</div>
    </section>
  );
}

export default function Index() {
  const navigate = useNavigate();

  return (
    <MobileFrame className="onboarding-landing-frame">
      <main className="bg-white text-[#0A1830]">
        <section className="onboarding-hero relative h-[720px] overflow-hidden">
          <img src={TotalLogo} alt="덕길이" className="absolute left-4 top-6 h-auto w-25 object-contain" />

          <div className="absolute left-1/2 top-[111px] flex h-[496px] w-[496px] -translate-x-1/2 flex-col items-center justify-center rounded-full border border-[#B9EEE8] bg-white text-center">
            <p className="mb-4 text-[21px] font-black tracking-[-0.045em] text-[#0A1830]">덕질을 <span className="text-[#22C7B5]">쉬운 길로</span></p>
            <img src={TotalLogo} alt="덕길이" className="h-auto w-[228px] object-contain" />
            <p className="mt-[58px] text-[16px] font-medium tracking-[-0.025em] text-[#697893]">A to Z 덕질 플랜, 링크 하나면 끝</p>
          </div>
        </section>

        <section className="flex h-[400px] flex-col items-center justify-center px-8 text-center">
          <p className="text-[8px] font-black tracking-[0.28em] text-[#29C7B7]">HOW IT WORKS</p>
          <h1 className="mt-10 text-[29px] font-black leading-[1.24] tracking-[-0.045em]">복잡한 덕질 동선,<br />딱 4단계면 충분해요.</h1>
          <p className="mt-7 text-[10px] leading-relaxed text-[#9AA8AE]">행사 등록부터 일정과 귀가까지 필요한 준비를 차근차근 도와드려요.</p>
        </section>

        <div>
          <StepCard step="01" eyebrow="행사 등록" title={<>링크 하나면,<br />준비 끝.</>} description="공연 링크 하나만 넣으면 필요한 행사 정보를 빠르게 정리해요." background="bg-[#9DECDD]" height="h-[1030px]"><RegisterPreview /></StepCard>
          <StepCard step="02" eyebrow="내 일정 생성" title={<>내 취향대로<br />딱 맞는 하루.</>} description="원하는 활동과 이동 시간을 반영해 나에게 맞는 하루 동선을 만들어요." background="bg-[#E4F7F3]" height="h-[1070px]"><SchedulePreview /></StepCard>
          <StepCard step="03" eyebrow="오늘의 브리핑" title={<>오늘 필요한 건<br />한 화면에.</>} description="날씨, 교통, 준비물을 행사 당일 한 화면에서 확인해요." background="bg-[#DDF3F8]" height="h-[1050px]"><BriefingPreview /></StepCard>
          <StepCard step="04" eyebrow="안심 귀가" title={<>마지막 순간까지<br />안심 귀가.</>} description="공연 종료 시간과 막차를 계산해 여유 있는 귀가 경로를 안내해요." background="bg-[#DFE8F1]" height="h-[1144px]"><ReturnPreview /></StepCard>
        </div>

        <footer className="relative flex h-[760px] flex-col items-center justify-center overflow-hidden bg-[#071126] px-8 text-center text-white">
          <div className="absolute -left-24 top-4 h-[340px] w-[340px] rounded-full border border-white/[0.035]" />
          <div className="absolute -right-28 bottom-[-110px] h-[380px] w-[380px] rounded-full border border-white/[0.035]" />
          <img src={Logo} alt="" className="relative h-[66px] w-[66px]" />
          <p className="relative mt-7 text-[9px] font-black tracking-[0.22em] text-[#3EDAC8]">READY FOR YOUR DAY?</p>
          <h2 className="relative mt-7 text-[35px] font-black leading-[1.2] tracking-[-0.04em]">다음 덕질은,<br />덕길이와 함께.</h2>
          <p className="relative mt-7 text-[12px] leading-[1.8] text-[#748097]">설레는 마음은 그대로 두고,<br />복잡한 준비는 덕길이와 함께해요.</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="relative mt-10 flex h-[58px] w-[210px] items-center justify-center gap-2 rounded-full bg-[#38D9C7] text-[13px] font-extrabold text-[#062020] transition-transform active:scale-[0.98]"
          >
            덕길이 시작하기 <ChevronRight size={15} strokeWidth={2.6} />
          </button>
        </footer>
      </main>
    </MobileFrame>
  );
}
