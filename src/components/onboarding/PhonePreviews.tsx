import type { ReactNode } from "react";
import {
  ArrowDownUp,
  ArrowLeft,
  Bell,
  Bike,
  CarFront,
  Check,
  ChevronRight,
  Footprints,
  House,
  Link2,
  Navigation,
  Sparkles,
  Star,
  TrainFront,
} from "lucide-react";
import TotalLogo from "@/assets/TotalLogo.svg";

const onboardingMockData = {
  event: {
    title: "2026 IU WORLD TOUR",
    date: "2026-07-18",
    displayDate: "7월 18일 토요일",
    time: "18:00",
    venue: "KSPO DOME",
    link: "ticket.example.com/iu-world-tour",
  },
  schedule: [
    { time: "15:40", title: "집에서 출발", description: "지하철 2호선 · 52분" },
    { time: "16:32", title: "KSPO DOME 도착", description: "올림픽공원역 3번 출구" },
    { time: "16:40", title: "굿즈 현장 수령", description: "예상 대기 20분" },
    { time: "18:00", title: "공연 시작", description: "D구역 12열" },
  ],
  checklist: [
    { label: "모바일 티켓", checked: true },
    { label: "신분증", checked: false },
    { label: "응원봉", checked: false },
  ],
  home: {
    nickname: "덕길",
    leaveIn: "15분",
    departure: "15:40",
    arrival: "16:32",
    duration: "52분",
  },
  returnRoute: {
    origin: "KSPO DOME",
    destination: "우리 집",
    duration: "1시간 7분",
    departure: "오후 9:40",
    arrival: "오후 10:47",
    fare: "1,500원",
    lastTrain: "23:48 막차",
  },
} as const;

function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-75 rounded-[39px] bg-[#071126] p-2 shadow-[0_22px_48px_rgba(15,23,42,0.2)]">
      <div className="relative h-[620px] overflow-hidden rounded-[31px] bg-white">
        <div className="absolute left-1/2 top-[10px] z-20 h-[7px] w-[62px] -translate-x-1/2 rounded-full bg-[#071126]" />
        <div className="flex items-center justify-between px-6 pb-2 pt-6 text-[9px] font-bold text-[#111827]">
          <span>9:41</span>
          <span className="flex items-end gap-[2px]" aria-hidden="true">
            <i className="h-[4px] w-[2px] bg-[#111827]" />
            <i className="h-[6px] w-[2px] bg-[#111827]" />
            <i className="h-[8px] w-[2px] bg-[#111827]" />
            <i className="ml-1 h-[6px] w-[11px] rounded-[2px] border border-[#111827]" />
          </span>
        </div>
        <div className="onboarding-phone-screen">{children}</div>
      </div>
    </div>
  );
}

export function RegisterPreview() {
  const { event } = onboardingMockData;

  return (
    <PhoneShell>
      <div className="px-3 pb-4 pt-1 text-[#0F172A]">
        <ArrowLeft size={10} className="mb-3" />
        <p className="text-[5px] font-extrabold tracking-[0.18em] text-[#22B8AD]">STEP 1 OF 3</p>
        <h3 className="mt-2 text-[15px] font-medium leading-[1.28] tracking-[-0.04em]">어떤 행사를<br />가시나요?</h3>
        <p className="mt-2 text-[6px] leading-relaxed text-[#64748B]">공연 링크를 붙여 넣으면<br />행사 정보를 빠르게 채워드려요.</p>
        <div className="mt-4 flex h-[39px] items-center gap-2 rounded-[9px] border border-[#38D9C7] bg-[#F5FBFA] px-2">
          <Link2 size={9} className="shrink-0 text-[#22B8AD]" />
          <span className="min-w-0 flex-1 truncate text-[5px] text-[#64748B]">{event.link}</span>
          <span className="rounded-[6px] bg-[#38D9C7] px-2 py-2 text-[5px] font-extrabold text-[#083D39]">분석</span>
        </div>
        <div className="my-3 flex items-center gap-2 text-[5px] text-[#94A3B8]">
          <span className="h-px flex-1 bg-[#DCE9E6]" />직접 입력<span className="h-px flex-1 bg-[#DCE9E6]" />
        </div>
        <label className="block text-[6px] font-extrabold">
          행사 이름
          <span className="mt-1.5 flex h-8 items-center rounded-[8px] border border-[#DCE9E6] bg-[#F5FBFA] px-2 text-[6px] font-medium">{event.title}</span>
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="text-[6px] font-extrabold">날짜<span className="mt-1.5 flex h-8 items-center rounded-[8px] border border-[#DCE9E6] bg-[#F5FBFA] px-2 text-[5px] font-medium text-[#64748B]">{event.date}</span></label>
          <label className="text-[6px] font-extrabold">시작 시간<span className="mt-1.5 flex h-8 items-center rounded-[8px] border border-[#DCE9E6] bg-[#F5FBFA] px-2 text-[5px] font-medium text-[#64748B]">{event.time}</span></label>
        </div>
        <label className="mt-2 block text-[6px] font-extrabold">장소<span className="mt-1.5 flex h-8 items-center rounded-[8px] border border-[#DCE9E6] bg-[#F5FBFA] px-2 text-[6px] font-medium">{event.venue}</span></label>
        <div className="mt-3 flex h-8 items-center justify-center rounded-[8px] bg-[#38D9C7] text-[6px] font-extrabold text-[#063F3A]">다음</div>
      </div>
    </PhoneShell>
  );
}

export function SchedulePreview() {
  const { event, schedule, checklist } = onboardingMockData;

  return (
    <PhoneShell>
      <div className="px-3 pb-5 pt-1 text-[#0F172A]">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-extrabold">오늘의 일정</h3>
          <span className="text-[5px] font-bold text-[#22B8AD]">다시 만들기</span>
        </div>
        <section className="mt-3 flex items-center justify-between rounded-[10px] bg-[#E6FAF7] p-3">
          <div>
            <p className="text-[5px] font-extrabold text-[#22B8AD]">{event.displayDate}</p>
            <p className="mt-1.5 text-[8px] font-extrabold">{event.title}</p>
            <p className="mt-1 text-[5px] text-[#64748B]">{event.venue} · {event.time}</p>
          </div>
          <strong className="text-right text-[12px] leading-none text-[#22B8AD]">4<span className="text-[5px]">시간</span><br />20<span className="text-[5px]">분</span></strong>
        </section>
        <section className="mt-2.5 rounded-[9px] border border-[#DCE9E6] p-2.5">
          <div className="flex items-center justify-between text-[6px] font-extrabold"><span>체크리스트</span><span className="text-[5px] text-[#64748B]">1/3 완료</span></div>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {checklist.map((item) => (
              <span key={item.label} className="flex items-center gap-1 rounded-[5px] bg-[#F8FCFB] px-1.5 py-1.5 text-[4.5px]">
                <i className={`grid h-2.5 w-2.5 place-items-center rounded-[3px] not-italic ${item.checked ? "bg-[#22B8AD] text-white" : "border border-[#DCE9E6]"}`}>{item.checked && <Check size={6} />}</i>{item.label}
              </span>
            ))}
          </div>
        </section>
        <div className="mt-4">
          {schedule.map((item, index) => (
            <article key={item.time} className="relative grid min-h-[49px] grid-cols-[30px_20px_1fr]">
              <time className={`pt-0.5 text-[5.5px] ${index === 1 ? "font-extrabold text-[#22B8AD]" : "text-[#64748B]"}`}>{item.time}</time>
              <span className={`relative z-10 grid h-3.5 w-3.5 place-items-center rounded-full border text-[5px] ${index === 0 ? "border-[#22B8AD] bg-[#22B8AD] text-white" : index === 1 ? "border-[3px] border-[#7CEEDF] bg-[#22B8AD] text-transparent ring-1 ring-white" : "border-[#CBD5E1] bg-white text-[#94A3B8]"}`}>
                {index === 0 ? <Check size={7} /> : index + 1}
                {index < schedule.length - 1 && <i className="absolute left-1/2 top-3.5 -z-10 h-[36px] w-px -translate-x-1/2 bg-[#DCE9E6]" />}
              </span>
              <span><strong className="block text-[6px]">{item.title}</strong><small className="mt-1 block text-[5px] text-[#64748B]">{item.description}</small></span>
            </article>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}

export function BriefingPreview() {
  const { event, home } = onboardingMockData;

  return (
    <PhoneShell>
      <div className="px-3 pb-5 pt-1 text-[#0F172A]">
        <header className="flex items-center justify-between">
          <img src={TotalLogo} alt="덕길이" className="w-[62px]" />
          <span className="relative grid h-5 w-5 place-items-center rounded-full text-[#64748B]"><Bell size={10} /><i className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-[#EF4444]" /></span>
        </header>
        <p className="mt-5 text-[5px] font-extrabold text-[#22B8AD]">{event.displayDate}</p>
        <h3 className="mt-2 text-[15px] font-medium leading-[1.25] tracking-[-0.04em]">{home.nickname}님, 오늘은<br />기다리던 날이에요.</h3>
        <div className="mt-3 flex items-center gap-2 rounded-[9px] border border-[#DCE9E6] bg-white p-2 shadow-[0_2px_8px_rgba(15,23,42,0.05)]">
          <span className="grid h-8 w-8 place-items-center rounded-[7px] bg-[#0F172A] text-white"><Sparkles size={11} fill="white" /></span>
          <span className="min-w-0 flex-1"><small className="block text-[4.5px] text-[#64748B]">오늘의 이벤트</small><strong className="mt-0.5 block truncate text-[6px]">{event.title}</strong><small className="mt-0.5 block text-[4.5px] text-[#64748B]">{event.venue} · {event.time}</small></span>
          <ChevronRight size={9} className="text-[#94A3B8]" />
        </div>
        <section className="mt-3 rounded-[13px] bg-[#38D9C7] px-3 pb-3 pt-3 text-[#063F3A] shadow-[0_7px_16px_rgba(56,217,199,0.2)]">
          <p className="text-[6px] font-bold">이제 출발할 시간이에요</p>
          <h4 className="font-deokgil-display mt-1.5 text-[13px] font-medium leading-[1.25] tracking-[-0.04em]">{home.leaveIn} 안에 출발하면<br />여유롭게 도착해요.</h4>
          <div className="relative mt-3 flex items-start justify-between">
            <span className="absolute left-3 right-3 top-2 border-t border-dashed border-[#0F766E]/30" />
            <span className="relative z-10 flex flex-col items-center gap-1 text-[4.5px] font-semibold"><i className="grid h-4 w-4 place-items-center rounded-full bg-white text-[#22B8AD] not-italic"><House size={7} /></i>우리 집</span>
            <strong className="relative z-10 mt-1 bg-[#38D9C7] px-1 text-[5px]">{home.duration}</strong>
            <span className="relative z-10 flex flex-col items-center gap-1 text-[4.5px] font-semibold"><i className="grid h-4 w-4 place-items-center rounded-full bg-white text-[#22B8AD] not-italic"><Star size={7} fill="#22B8AD" /></i>{event.venue}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 border-t border-[#0F766E]/20 pt-2 text-[5px] font-semibold"><span>추천 출발<strong className="mt-0.5 block text-[9px]">{home.departure}</strong></span><span className="border-l border-[#0F766E]/20 pl-3">도착 예정<strong className="mt-0.5 block text-[9px]">{home.arrival}</strong></span></div>
          <div className="mt-2.5 flex h-7 items-center justify-center rounded-[7px] bg-white text-[5.5px] font-extrabold text-[#0F766E]">오늘 일정 확인하기 <ChevronRight size={8} /></div>
        </section>
      </div>
    </PhoneShell>
  );
}

export function ReturnPreview() {
  const { returnRoute } = onboardingMockData;

  return (
    <PhoneShell>
      <div className="pb-5 pt-1 text-[#0F172A]">
        <header className="flex items-center gap-2 px-3"><ArrowLeft size={10} /><h3 className="text-[9px] font-extrabold">귀가 플래너</h3></header>
        <section className="mt-3 px-3">
          <div className="rounded-[9px] border border-[#DCE9E6] bg-white p-2.5 shadow-[0_2px_7px_rgba(15,23,42,0.05)]">
            <div className="grid grid-cols-[10px_1fr_18px] items-center gap-x-2 gap-y-2">
              <span className="grid h-2.5 w-2.5 place-items-center rounded-full border border-[#22B8AD]"><i className="h-1 w-1 rounded-full bg-[#22B8AD]" /></span><span className="border-b border-[#E7EEEC] pb-2"><small className="block text-[4px] text-[#94A3B8]">출발</small><strong className="text-[6px]">{returnRoute.origin}</strong></span><span className="row-span-2 grid h-5 w-5 place-items-center rounded-full bg-[#F5FBFA] text-[#64748B]"><ArrowDownUp size={8} /></span>
              <span className="grid h-2.5 w-2.5 place-items-center rounded-full border border-[#EF4444]"><i className="h-1 w-1 rounded-full bg-[#EF4444]" /></span><span><small className="block text-[4px] text-[#94A3B8]">도착</small><strong className="text-[6px]">{returnRoute.destination}</strong></span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {[[TrainFront, returnRoute.duration, true], [CarFront, "52분", false], [Footprints, "3시간", false], [Bike, "1시간", false]].map(([Icon, label, active], index) => {
              const ModeIcon = Icon as typeof TrainFront;
              return <span key={index} className={`flex h-9 flex-col items-center justify-center gap-0.5 rounded-[7px] ${active ? "bg-[#38D9C7] text-[#063F3A]" : "bg-[#F8FAFC] text-[#64748B]"}`}><ModeIcon size={9} /><small className="text-[4px] font-extrabold">{String(label)}</small></span>;
            })}
          </div>
        </section>
        <div className="mt-2 flex h-7 items-center gap-4 border-y border-[#DCE9E6] px-3 text-[5px] font-bold"><span className="relative h-full pt-2">전체<i className="absolute bottom-0 left-0 right-0 h-px bg-[#22B8AD]" /></span><span className="text-[#94A3B8]">지하철</span><span className="text-[#94A3B8]">버스</span></div>
        <div className="px-3 pt-2.5">
          <aside className="flex items-center rounded-[7px] bg-[#DDF8F4] px-2 py-2 text-[5px] font-bold text-[#138A80]">막차까지 2시간 18분 여유 있어요<span className="ml-auto text-[4px] text-[#64748B]">{returnRoute.lastTrain}</span></aside>
          <article className="mt-2 overflow-hidden rounded-[11px] border border-[#22B8AD] bg-white shadow-[0_2px_7px_rgba(15,23,42,0.05)]">
            <div className="p-2.5">
              <span className="text-[5px] font-extrabold text-[#138A80]">최적</span>
              <strong className="mt-1 block text-[14px] leading-none">{returnRoute.duration}</strong>
              <p className="mt-1.5 text-[5px] text-[#64748B]">{returnRoute.departure} - {returnRoute.arrival} · {returnRoute.fare}</p>
              <div className="mt-2 flex h-4 overflow-hidden rounded-full bg-[#E7EEEC] text-[4px] font-bold"><span className="grid w-[18%] place-items-center">도보</span><span className="grid w-[70%] place-items-center rounded-full bg-[#38D9C7] text-[#063F3A]">대중교통 51분</span><span className="grid w-[12%] place-items-center">4분</span></div>
            </div>
            <div className="border-t border-[#E7EEEC] p-2.5">
              <div className="flex items-center gap-2"><span className="rounded-[4px] bg-[#22B8AD] px-1.5 py-1 text-[4px] font-extrabold text-white">5호선</span><strong className="text-[5.5px]">올림픽공원역</strong></div>
              <p className="mt-2 text-[5px] text-[#64748B]">방화행 · 8개 역 이동</p>
              <div className="mt-2 flex h-7 items-center justify-center gap-1 rounded-[7px] bg-[#38D9C7] text-[5px] font-extrabold text-[#063F3A]"><Navigation size={8} /> 이 경로로 안내 시작</div>
            </div>
          </article>
        </div>
      </div>
    </PhoneShell>
  );
}
