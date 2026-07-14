import MobileFrame from "@/components/layout/MobileFrame";

type LoadingScreenProps = {
  message?: string;
  description?: string;
};

export default function LoadingScreen({
  message = "덕길이가 준비하고 있어요",
  description = "잠시만 기다려 주세요",
}: LoadingScreenProps) {
  return (
    <MobileFrame>
      <div
        className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-[#F5FBFA] px-6 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="absolute -right-18 -top-16 h-52 w-52 rounded-full bg-[#DDF8F4]" />
        <span className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#E6FAF7]" />

        <div className="relative">
          <span className="absolute inset-0 animate-ping rounded-[28px] bg-[#38D9C7]/20 [animation-duration:1.8s]" />
          <span className="relative flex h-24 w-24 items-end justify-center gap-1 rounded-[28px] bg-[#38D9C7] px-6 pb-6 shadow-[0_16px_35px_rgba(34,184,173,0.25)]">
            <i className="h-4 w-1.5 rotate-38 rounded-full bg-white" />
            <i className="h-8 w-1.5 rotate-38 rounded-full bg-white" />
            <i className="h-6 w-1.5 rotate-38 rounded-full bg-white" />
          </span>
        </div>

        <strong className="relative mt-8 text-xl font-extrabold tracking-[-0.03em] text-[#0F172A]">
          {message}
        </strong>
        <p className="relative mt-2 text-sm text-[#64748B]">{description}</p>

        <span
          className="relative mt-7 flex h-5 items-center gap-1.5"
          aria-hidden="true"
        >
          <i className="h-2 w-2 animate-bounce rounded-full bg-[#22B8AD] [animation-delay:-0.3s]" />
          <i className="h-2 w-2 animate-bounce rounded-full bg-[#22B8AD] [animation-delay:-0.15s]" />
          <i className="h-2 w-2 animate-bounce rounded-full bg-[#22B8AD]" />
        </span>
      </div>
    </MobileFrame>
  );
}
