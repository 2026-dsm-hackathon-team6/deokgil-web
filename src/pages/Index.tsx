import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/layout/MobileFrame";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Sparkles, Navigation } from "lucide-react";

const onboardingSlides = [
  {
    icon: Calendar,
    title: "이벤트를 등록하세요",
    description:
      "콘서트, 팝업스토어, 팬미팅 등\n링크만 붙여넣으면 AI가 자동으로\n행사 정보를 추출해요",
    color: "bg-teal-50",
    iconColor: "text-[#22B8AD]",
    image:
      "https://mgx-backend-cdn.metadl.com/generate/images/1422594/2026-07-13/smacozacaiyq/onboarding-schedule-planning.png",
  },
  {
    icon: Sparkles,
    title: "AI가 일정을 만들어요",
    description:
      "출발 시간, 이동 경로, 날씨까지\n고려한 최적의 일정을\nAI가 자동으로 생성해요",
    color: "bg-teal-50",
    iconColor: "text-[#38D9C7]",
    image:
      "https://mgx-backend-cdn.metadl.com/generate/images/1422594/2026-07-13/smacpfycaiya/onboarding-ai-assistant.png",
  },
  {
    icon: Navigation,
    title: "귀가까지 함께해요",
    description:
      "공연 종료 후 최적 귀가 경로,\n막차 시간, 예상 도착 시간까지\n한 번에 안내해요",
    color: "bg-teal-50",
    iconColor: "text-[#22B8AD]",
    image:
      "https://mgx-backend-cdn.metadl.com/generate/images/1422594/2026-07-13/smacpuqcaiza/onboarding-way-home.png",
  },
];

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/login");
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  const slide = onboardingSlides[currentSlide];

  return (
    <MobileFrame>
      <div className="flex flex-col h-screen px-6 pt-12 pb-8">
        {/* Skip button */}
        <div className="flex justify-end">
          <button
            onClick={handleSkip}
            className="text-[#64748B] text-sm font-medium cursor-pointer transition-colors"
          >
            건너뛰기
          </button>
        </div>

        {/* Logo area */}
        <div className="flex items-center gap-2 mt-8 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#22B8AD] flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-[#0F172A]">덕길이</span>
        </div>

        {/* Illustration area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className={`w-56 h-56 rounded-full ${slide.color} flex items-center justify-center mb-10 overflow-hidden`}
          >
            {slide.image ? (
              <img
                src={slide.image}
                alt={slide.title}
                className="w-44 h-44 object-contain"
              />
            ) : (
              <slide.icon
                size={80}
                className={slide.iconColor}
                strokeWidth={1.2}
              />
            )}
          </div>

          {/* Text content */}
          <h1 className="text-2xl font-bold text-[#0F172A] text-center mb-3">
            {slide.title}
          </h1>
          <p className="text-[#64748B] text-center text-sm leading-relaxed whitespace-pre-line">
            {slide.description}
          </p>
        </div>

        {/* Pagination dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {onboardingSlides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-6 bg-[#22B8AD]" : "w-2 bg-[#DCE9E6]"
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleNext}
          className="w-full h-14 rounded-2xl bg-[#22B8AD] text-white text-base font-semibold shadow-sm cursor-pointer"
        >
          {currentSlide < onboardingSlides.length - 1 ? (
            <>
              다음
              <ChevronRight size={18} className="ml-1" />
            </>
          ) : (
            "시작하기"
          )}
        </Button>
      </div>
    </MobileFrame>
  );
}
