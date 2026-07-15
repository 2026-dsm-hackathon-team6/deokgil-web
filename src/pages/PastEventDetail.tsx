import MobileFrame from "@/components/layout/MobileFrame";
import { pastEvents } from "@/data/pastEvents";
import { ArrowLeft, Check, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const timeline = [
  {
    time: "14:40",
    title: "행사장으로 출발",
    description: "예상 이동 시간 50분",
  },
  {
    time: "15:30",
    title: "행사장 도착",
    description: "입장 전 티켓과 신분증 확인",
  },
  { time: "17:00", title: "행사 시작", description: "즐거운 관람 시간" },
  {
    time: "20:10",
    title: "행사 종료 및 귀가",
    description: "추천 경로로 안전하게 귀가",
  },
];

export default function PastEventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const event = pastEvents.find((item) => String(item.id) === id);

  if (!event) {
    return (
      <MobileFrame>
        <div className="grid h-dvh place-items-center px-6 text-center">
          <div>
            <p className="text-base font-extrabold text-[#0F172A]">
              일정을 찾을 수 없어요.
            </p>
            <button
              type="button"
              onClick={() => navigate("/mypage/past-events", { replace: true })}
              className="mt-4 rounded-xl bg-[#38D9C7] px-5 py-3 text-sm font-extrabold text-[#063F3A]"
            >
              과거 일정으로 돌아가기
            </button>
          </div>
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <div className="flex h-dvh flex-col bg-white">
        <header className="flex items-center gap-3 border-b border-[#DCE9E6] px-5 pb-4 pt-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
            className="grid h-9 w-9 place-items-center rounded-full text-[#0F172A]"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="text-lg font-extrabold text-[#0F172A]">
            과거 일정 상세
          </h1>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-10 pt-5">
          <section className="rounded-[24px] bg-[#E6FAF7] p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-[#138A80]">
                <Check size={11} /> 완료된 일정
              </span>
              <span className="text-[10px] font-semibold text-[#64748B]">
                {event.date}
              </span>
            </div>
            <h2 className="mt-5 text-[22px] font-extrabold leading-snug tracking-[-0.03em] text-[#0F172A]">
              {event.title}
            </h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#64748B]">
              <MapPin size={14} className="text-[#22B8AD]" />
              {event.venue}
            </p>
          </section>

          <section className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#DCE9E6] p-4">
              <p className="mt-1 text-[10px] text-[#64748B]">행사 날짜</p>
              <strong className="mt-1 block text-sm text-[#0F172A]">
                {event.date}
              </strong>
            </div>
            <div className="rounded-2xl border border-[#DCE9E6] p-4">
              <p className="mt-1 text-[10px] text-[#64748B]">진행 상태</p>
              <strong className="mt-1 block text-sm text-[#0F172A]">
                일정 완료
              </strong>
            </div>
          </section>

          <section className="mt-7">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-[#0F172A]">
                당시 일정
              </h3>
            </div>
            <div className="mt-4">
              {timeline.map((item, index) => (
                <div
                  key={item.time}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  {index < timeline.length - 1 && (
                    <span className="absolute -bottom-[18px] left-[82px] top-[18px] w-px bg-[#DCE9E6]" />
                  )}
                  <time className="w-12 shrink-0 pt-0.5 text-xs font-bold text-[#64748B]">
                    {item.time}
                  </time>
                  <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#DDF8F4] text-[#138A80]">
                    <Check size={15} />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <strong className="block text-sm text-[#0F172A]">
                      {item.title}
                    </strong>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#64748B]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="mt-7 rounded-2xl bg-[#F5FBFA] p-4 text-center">
            <p className="text-xs font-bold text-[#138A80]">
              덕길이와 함께한 소중한 일정이에요
            </p>
            <p className="mt-1 text-[10px] text-[#64748B]">
              과거 일정은 언제든 다시 확인할 수 있어요.
            </p>
          </aside>
        </main>
      </div>
    </MobileFrame>
  );
}
