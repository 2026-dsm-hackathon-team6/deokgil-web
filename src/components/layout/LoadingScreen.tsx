import MobileFrame from "@/components/layout/MobileFrame";
import Logo from "../../assets/Logo.svg";

type LoadingScreenProps = {
  message?: string;
  description?: string;
};

export default function LoadingScreen({
  message = "화면을 불러오고 있어요",
  description = "잠시만 기다려 주세요.",
}: LoadingScreenProps) {
  return (
    <MobileFrame>
      <div
        className="flex h-dvh flex-col items-center justify-center bg-[#FFFFFF] px-6 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#38D9C7] text-xl font-extrabold text-[#063F3A] shadow-[0_6px_16px_rgba(34,184,173,0.16)]">
          <img src={Logo} alt="로고" />
        </span>

        <span
          className="mt-8 h-6 w-6 animate-spin rounded-full border-2 border-[#DCE9E6] border-t-[#22B8AD]"
          aria-hidden="true"
        />

        <strong className="mt-5 text-base font-bold text-[#0F172A]">
          {message}
        </strong>
        <p className="mt-2 text-sm text-[#64748B]">{description}</p>
      </div>
    </MobileFrame>
  );
}
