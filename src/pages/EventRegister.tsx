import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileFrame from "@/components/layout/MobileFrame";
import { ArrowLeft, Link2 } from "lucide-react";

export default function EventRegister() {
  const navigate = useNavigate();
  const [eventLink, setEventLink] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [venue, setVenue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!eventLink.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    window.setTimeout(() => {
      setEventName((value) => value || "2026 IU WORLD TOUR");
      setEventDate((value) => value || "2026-07-18");
      setEventTime((value) => value || "18:00");
      setVenue((value) => value || "KSPO DOME");
      setIsAnalyzing(false);
    }, 900);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/events");
  };

  return (
    <MobileFrame>
      <form onSubmit={handleSubmit} className="flex h-dvh flex-col bg-white">
        <header className="flex h-16 shrink-0 items-end px-5 pb-2 pt-4">
          <button
            type="button"
            aria-label="이벤트 목록으로 돌아가기"
            onClick={() => navigate("/events")}
            className="grid h-10 w-10 place-items-center rounded-full text-[#0F172A]"
          >
            <ArrowLeft size={20} />
          </button>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-28 pt-3">
          <p className="text-[10px] font-extrabold tracking-[0.18em] text-[#22B8AD]">
            STEP 1 OF 3
          </p>
          <h1 className="mt-3 text-[30px] font-medium leading-[1.35] tracking-[-0.04em] text-[#0F172A]">
            어떤 행사에
            <br />
            가시나요?
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#64748B]">
            공지 링크를 붙여넣으면 AI가 행사 정보를 자동으로 채워드려요.
          </p>

          <div className="mt-8 flex h-[72px] items-center gap-3 rounded-2xl border border-[#38D9C7] bg-[#F5FBFA] px-4">
            <Link2 size={16} className="shrink-0 text-[#22B8AD]" />
            <input
              type="url"
              aria-label="행사 공지 또는 예매 링크"
              placeholder="행사 공지 또는 예매 링크 붙여넣기"
              value={eventLink}
              onChange={(event) => setEventLink(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-xs text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
            />
            <button
              type="button"
              disabled={!eventLink.trim() || isAnalyzing}
              onClick={handleAnalyze}
              className="h-12 shrink-0 rounded-xl bg-[#38D9C7] px-4 text-xs font-extrabold text-[#083D39] disabled:opacity-40"
            >
              {isAnalyzing ? "분석 중" : "분석"}
            </button>
          </div>

          <div className="my-8 flex items-center gap-3 text-[10px] text-[#94A3B8]">
            <span className="h-px flex-1 bg-[#DCE9E6]" />
            또는 직접 입력
            <span className="h-px flex-1 bg-[#DCE9E6]" />
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-extrabold text-[#0F172A]">
                행사 이름
              </span>
              <input
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
                placeholder="예: 2026 IU WORLD TOUR"
                className="h-[62px] w-full rounded-2xl border border-[#DCE9E6] bg-[#F5FBFA] px-4 text-sm outline-none placeholder:text-[#94A3B8] focus:border-[#38D9C7]"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label>
                <span className="mb-2 block text-xs font-extrabold text-[#0F172A]">
                  날짜
                </span>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                  className="h-[62px] w-full rounded-2xl border border-[#DCE9E6] bg-[#F5FBFA] px-4 text-xs text-[#64748B] outline-none focus:border-[#38D9C7]"
                />
              </label>
              <label>
                <span className="mb-2 block text-xs font-extrabold text-[#0F172A]">
                  시작 시간
                </span>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(event) => setEventTime(event.target.value)}
                  className="h-[62px] w-full rounded-2xl border border-[#DCE9E6] bg-[#F5FBFA] px-4 text-xs text-[#64748B] outline-none focus:border-[#38D9C7]"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-extrabold text-[#0F172A]">
                장소
              </span>
              <input
                value={venue}
                onChange={(event) => setVenue(event.target.value)}
                placeholder="행사장 이름 또는 주소"
                className="h-[62px] w-full rounded-2xl border border-[#DCE9E6] bg-[#F5FBFA] px-4 text-sm outline-none placeholder:text-[#94A3B8] focus:border-[#38D9C7]"
              />
            </label>
          </div>
        </main>

        <div className="absolute bottom-0 left-0 right-0 bg-white px-5 pb-4 pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.04)] safe-bottom">
          <button
            type="submit"
            className="h-[62px] w-full rounded-2xl bg-[#38D9C7] text-base font-extrabold text-[#083D39]"
          >
            다음
          </button>
        </div>
      </form>
    </MobileFrame>
  );
}
