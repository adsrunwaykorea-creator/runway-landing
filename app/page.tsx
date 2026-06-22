"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./landing.css";

const BLUE = "#2563eb";
const BLUE_DARK = "#1e40af";
const BLUE_LIGHT = "#eff6ff";
const NAVY = "#0a1628";

const PROBLEMS = [
  "어떤 광고 매체부터 시작할지 모르겠어요",
  "광고 매체별 세팅 방법이 어려워요",
  "사내 마케터 채용 비용이 부담스러워요",
  "바빠서 광고까지 직접 챙기기 어려워요",
  "광고가 제대로 운영되는지 판단하기 어려워요",
];

const PERFORMANCE_BEFORE = [
  { value: "912", label: "플레이스 유입" },
  { value: "787", label: "네이버지도 유입" },
  { value: "7건", label: "예약신청" },
  { value: "2건", label: "리뷰 등록" },
];

const PERFORMANCE_AFTER = [
  { value: "2,142", label: "플레이스 유입", change: "+135%" },
  { value: "1,347", label: "네이버지도 유입", change: "+71%" },
  { value: "59건", label: "예약신청", change: "+743%" },
  { value: "19건", label: "리뷰 등록", change: "+850%" },
];

const BEFORE_NOTES = ["자연 유입량이 매우 적은", "낮은 예약 전환율", "지역 내 노출 부족"];
const AFTER_NOTES = [
  "광고비는 투명하게 관리되고, 성과는 숫자로 확인됩니다.",
  "전문 마케터가 매월 소재·타깃·예산을 직접 점검합니다.",
  "문의, 예약, 방문까지 이어지는 실전형 마케팅을 운영합니다.",
];

const OTHER_PERFORMANCE = [
  "온라인몰 월 매출액 +215% 달성",
  "오프라인 매장 월 매출액 +42% 달성",
  "오프라인 예약 +571% 달성",
  "메타 광고 ROAS +750% 달성",
  "네이버 플레이스 유입 +135% 달성",
];

const SERVICE_CARDS = [
  {
    title: "최초 1회 마케팅 컨설팅 상담",
    desc: "업종·예산에 맞는 광고 시작 방향 제안",
  },
  {
    title: "1개월간 매체 2곳 광고 대행",
    desc: "광고 운영과 성과 보고서 전달 포함",
  },
  {
    title: "광고 운영 보고서 전달",
    desc: "성과를 숫자로 확인할 수 있게 정리",
  },
  {
    title: "매체 확장 운영 가능",
    desc: "필요 시 여러 매체로 확장 운영",
  },
];

const MEDIA_ITEMS = [
  "검색 포털 광고",
  "당근마켓 광고",
  "구글 검색·디스플레이·유튜브",
  "메타 이미지·릴스 광고",
  "카카오 검색·디스플레이",
  "오픈마켓 광고",
  "앱 내 광고",
  "CRM 메시지",
];

const TARGET_AUDIENCE = [
  "어디서부터 마케팅을 시작할지 막막한 사장님",
  "광고 세팅 방법을 몰라 운영이 어려운 사장님",
  "사내 마케터 채용 비용이 부담스러운 사장님",
  "광고는 맡기고 사업 운영에 집중하고 싶은 사장님",
  "작게 시작해서 광고 방향을 잡고 싶은 사장님",
];

const PACKAGE_FEATURES = [
  "최초 1회 마케팅 컨설팅 상담",
  "매체 2곳 광고 운영",
  "광고 세팅 및 운영관리",
  "광고 성과 보고서 전달",
  "매체 확장 운영 상담",
];

type LeadPayload = {
  name: string;
  phone: string;
  business_type?: string;
  region?: string;
  message?: string;
  privacy_agreed: boolean;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  referrer?: string | null;
  page_source?: string | null;
};

function formatPerformanceLine(text: string) {
  const parts = text.split(/(\+\d+%)/g);
  return parts.map((part, index) =>
    /^\+\d+%$/.test(part) ? (
      <span key={index} className="font-bold" style={{ color: BLUE }}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="break-keep text-center text-base font-semibold leading-snug sm:text-xl">
      {children}
    </h2>
  );
}

function PrimaryCta({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`touch-manipulation w-full min-h-[52px] rounded-xl px-5 py-3.5 text-[15px] font-semibold text-white transition-opacity active:opacity-80 sm:w-auto sm:min-w-[220px] sm:text-base ${className}`}
      style={{ backgroundColor: BLUE }}
    >
      {children}
    </button>
  );
}

function ProblemCheck({ delayMs }: { delayMs: number }) {
  return (
    <span
      className="problem-check shrink-0"
      style={{ ["--check-delay" as string]: `${delayMs}ms` }}
      aria-hidden="true"
    >
      <svg className="problem-check__svg" viewBox="0 0 20 20" fill="none">
        <path
          className="problem-check__path"
          d="M5.5 10.2 8.4 13.1 14.5 7"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function LandingPageInner() {
  const searchParams = useSearchParams();

  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [region, setRegion] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [utm, setUtm] = useState<{
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
  }>({});
  const [referrer, setReferrer] = useState<string | null>(null);
  const [landingPage, setLandingPage] = useState<string | null>(null);
  const [showStickyCta, setShowStickyCta] = useState(true);
  const consultationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setUtm({
      utm_source: searchParams.get("utm_source"),
      utm_medium: searchParams.get("utm_medium"),
      utm_campaign: searchParams.get("utm_campaign"),
      utm_content: searchParams.get("utm_content"),
      utm_term: searchParams.get("utm_term"),
    });
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReferrer(document.referrer || null);
    setLandingPage(window.location.href);
  }, []);

  useEffect(() => {
    const section = consultationRef.current;
    if (!section) return;

    const updateStickyCta = () => {
      const { top } = section.getBoundingClientRect();
      setShowStickyCta(top > window.innerHeight - 80);
    };

    updateStickyCta();
    window.addEventListener("scroll", updateStickyCta, { passive: true });
    window.addEventListener("resize", updateStickyCta);

    return () => {
      window.removeEventListener("scroll", updateStickyCta);
      window.removeEventListener("resize", updateStickyCta);
    };
  }, []);

  const scrollToForm = () => scrollTo("consultation-form");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!name.trim() || !phone.trim()) {
      setSubmitError("이름과 연락처를 입력해 주세요.");
      return;
    }

    if (!agreed) {
      setSubmitError("개인정보 수집·이용에 동의해 주세요.");
      return;
    }

    const payload: LeadPayload = {
      name: name.trim(),
      phone: phone.trim(),
      business_type: businessType.trim() || undefined,
      region: region.trim() || undefined,
      message: message.trim() || undefined,
      privacy_agreed: agreed,
      utm_source: utm.utm_source ?? null,
      utm_medium: utm.utm_medium ?? null,
      utm_campaign: utm.utm_campaign ?? null,
      utm_content: utm.utm_content ?? null,
      utm_term: utm.utm_term ?? null,
      referrer,
      page_source: landingPage,
    };

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !result.success) {
        setSubmitError(result.error || "상담 신청 처리 중 오류가 발생했습니다.");
        return;
      }

      if (typeof window !== "undefined") {
        const anyWindow = window as typeof window & {
          gtag?: (...args: unknown[]) => void;
          fbq?: (...args: unknown[]) => void;
        };

        if (typeof anyWindow.gtag === "function") {
          anyWindow.gtag("event", "generate_lead", {
            event_category: "engagement",
            event_label: "consultation_form",
            value: 1,
          });
        }

        if (typeof anyWindow.fbq === "function") {
          anyWindow.fbq("track", "Lead");
        }
      }

      setSubmitSuccess(
        "상담 신청이 완료되었습니다. 남겨주신 정보를 확인한 뒤 빠른 시간 내에 연락드리겠습니다.",
      );
      setName("");
      setPhone("");
      setBusinessType("");
      setRegion("");
      setMessage("");
      setAgreed(false);
    } catch (error) {
      console.error("Lead submit error:", error);
      setSubmitError("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-[#0f172a] sm:pb-0">
      {/* 1. 히어로 — 모바일 첫 화면: 카피 + 가격 + CTA 우선 */}
      <section className="px-4 pb-8 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-[13px] font-medium sm:text-sm" style={{ color: BLUE }}>
            소상공인 광고관리
          </p>
          <h1 className="mt-2.5 break-keep text-[1.2rem] font-semibold leading-[1.45] sm:mt-3 sm:text-2xl sm:leading-snug">
            온라인 마케팅을 시작하고 싶은데
            <br />
            방법을 모르시나요?
          </h1>
          <p className="mt-2.5 break-keep text-[13px] leading-relaxed text-[#64748b] sm:mt-3 sm:text-sm">
            사내에 마케터를 고용하기에는
            <br />
            비용이 부담스러우신가요?
          </p>
          <div className="hero-price-callout mx-auto mt-4 max-w-sm sm:mt-5">
            <p className="hero-price-callout__amount">
              월 <span className="hero-price-callout__price">330,000원</span>
            </p>
            <p className="hero-price-callout__tagline">전문 마케터를 구독하세요</p>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:mt-7 sm:flex-row sm:justify-center sm:gap-2.5">
            <PrimaryCta onClick={scrollToForm}>무료 상담 신청하기</PrimaryCta>
          </div>
          <p className="mt-4 break-keep text-[13px] font-semibold leading-relaxed text-[#475569] sm:mt-5 sm:text-sm">
            9년차 퍼포먼스 마케터가
            <br />
            광고 세팅부터 운영, 보고서까지 도와드립니다.
          </p>
          <p className="mt-2 break-keep text-[12px] leading-relaxed text-[#64748b] sm:text-sm">
            5번의 인하우스 마케팅 경험으로
            <br />
            고객님의 광고 고민을 해결해드리겠습니다.
          </p>
        </div>
      </section>

      {/* 2. 문제 공감 */}
      <section className="px-4 py-10 sm:px-6 sm:py-12" style={{ backgroundColor: BLUE_LIGHT }}>
        <div className="mx-auto max-w-lg">
          <SectionTitle>이런 고민이 있으신가요?</SectionTitle>
          <ul className="compact-card-list mt-5 space-y-2 sm:mt-6 sm:space-y-2.5">
            {PROBLEMS.map((item, index) => (
              <li
                key={item}
                className="compact-card flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-sm sm:gap-3 sm:px-4 sm:py-3"
              >
                <ProblemCheck delayMs={index * 250} />
                <span className="problem-card__text min-w-0 flex-1 text-[13px] font-bold leading-none text-[#1e293b] sm:text-[15px]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <p
            className="mt-5 break-keep text-center text-[13px] font-semibold leading-relaxed sm:mt-6 sm:text-sm"
            style={{ color: BLUE_DARK }}
          >
            그렇다면 런웨이가
            <br />
            광고 운영의 시작을 도와드리겠습니다.
          </p>
        </div>
      </section>

      {/* 3. 마케팅 성과 */}
      <section className="px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-[#64748b] sm:text-base">
              실제 사례로 증명합니다.
            </p>
            <p
              className="mt-3 break-keep text-[1.05rem] font-bold leading-snug sm:mt-4 sm:text-2xl"
              style={{ color: BLUE_DARK }}
            >
              M 뷰티 프랜차이즈 기준 월 예약 신청이
              <br />
              <span className="headline-stat-highlight text-[1.25rem] sm:text-3xl">
                <svg
                  className="headline-stat-highlight__star"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="headline-stat-highlight__text">7.4배 증가했습니다.</span>
              </span>
            </p>
          </div>
          <p className="mt-3 break-keep text-center text-[13px] leading-relaxed text-[#64748b] sm:text-sm">
            지역 타겟팅의 효과는 숫자로 나타납니다. 두피/탈모 브랜드의 실제 운영 데이터입니다.
          </p>

          <div className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <article className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm sm:p-6">
              <h3 className="text-center text-lg font-extrabold tracking-tight text-[#1e293b] sm:text-2xl">
                대표님 직접 운영
              </h3>
              <p className="mx-auto mt-2 w-fit rounded-full bg-[#f1f5f9] px-3 py-1 text-xs text-[#64748b]">
                2025년 3월
              </p>
              <ul className="mt-5 divide-y divide-[#eef2f7]">
                {PERFORMANCE_BEFORE.map((item) => (
                  <li key={item.label} className="py-3 text-center sm:py-4">
                    <p className="text-3xl font-bold text-[#334155] sm:text-4xl">{item.value}</p>
                    <p className="mt-1 text-xs text-[#64748b] sm:text-sm">{item.label}</p>
                  </li>
                ))}
              </ul>
              <ul className="mt-4 space-y-1 rounded-lg bg-[#f8fafc] p-3 text-xs text-[#64748b] sm:text-sm">
                {BEFORE_NOTES.map((note) => (
                  <li key={note}>✖ {note}</li>
                ))}
              </ul>
            </article>

            <div className="hidden lg:block text-center">
              <p className="text-xs text-[#64748b]">런웨이 지역 타겟팅</p>
              <p className="text-3xl font-bold" style={{ color: BLUE }}>
                →
              </p>
            </div>

            <article className="animated-highlight-border rounded-2xl border-2 bg-white p-4 shadow-sm sm:p-6">
              <h3
                className="text-center text-lg font-extrabold tracking-tight sm:text-2xl"
                style={{ color: BLUE_DARK }}
              >
                런웨이 운영 후
              </h3>
              <p
                className="mx-auto mt-2 w-fit rounded-full px-3 py-1 text-xs text-white"
                style={{ backgroundColor: BLUE }}
              >
                2025년 12월
              </p>
              <ul className="mt-5 divide-y divide-[#eef2f7]">
                {PERFORMANCE_AFTER.map((item) => (
                  <li key={item.label} className="py-3 text-center sm:py-4">
                    <p className="text-3xl font-bold sm:text-4xl" style={{ color: BLUE }}>
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-[#334155] sm:text-sm">
                      {item.label} <span className="text-[#64748b]">({item.change})</span>
                    </p>
                  </li>
                ))}
              </ul>
              <ul className="mt-4 space-y-1 rounded-lg bg-[#eff6ff] p-3 text-xs text-[#334155] sm:text-sm">
                {AFTER_NOTES.map((note) => (
                  <li key={note}>☑ {note}</li>
                ))}
              </ul>
            </article>
          </div>

          <p className="mt-5 break-keep text-center text-[13px] leading-relaxed text-[#64748b] sm:text-sm">
            런웨이는 감으로만 광고를 운영하지 않습니다.
            <br />
            실제 운영 경험과 성과 데이터를 기준으로
            <br />
            광고 방향을 제안합니다.
          </p>

          <div className="animated-highlight-border mt-8 rounded-2xl border-2 bg-[#f8fbff] p-4 sm:p-5">
            <h3 className="text-center text-sm font-bold text-[#334155] sm:text-base">
              마케팅 성과
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {OTHER_PERFORMANCE.map((item) => (
                <li
                  key={item}
                  className="break-keep rounded-xl border-2 bg-white px-3.5 py-3.5 text-center text-[13px] font-medium text-[#334155] shadow-sm sm:px-4 sm:py-4 sm:text-sm"
                  style={{ borderColor: "#93c5fd" }}
                >
                  {formatPerformanceLine(item)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. 서비스 제공 내역 */}
      <section className="px-4 py-10 sm:px-6 sm:py-12" style={{ backgroundColor: BLUE_LIGHT }}>
        <div className="mx-auto max-w-lg">
          <SectionTitle>런웨이는 이렇게 도와드립니다</SectionTitle>
          <ul className="compact-card-list mt-5 space-y-2 sm:mt-6 sm:space-y-2.5">
            {SERVICE_CARDS.map((card, index) => (
              <li
                key={card.title}
                className="compact-card flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-sm sm:gap-3 sm:px-4 sm:py-3"
              >
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white sm:size-7 sm:text-xs"
                  style={{ backgroundColor: BLUE }}
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="problem-card__text text-[13px] font-bold leading-none text-[#1e293b] sm:text-[15px]">
                    {card.title}
                  </p>
                  <p className="problem-card__text mt-1 text-[12px] font-medium leading-none text-[#64748b] sm:text-[13px]">
                    {card.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. 대행 가능 매체 — 모바일: 2열 그리드 칩 */}
      <section className="px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-lg">
          <SectionTitle>다양한 광고 매체를 운영할 수 있습니다</SectionTitle>
          <p className="mt-3 break-keep text-center text-[13px] leading-relaxed text-[#64748b] sm:text-sm">
            업종과 예산에 맞춰 필요한 매체를 선택합니다.
            <br />
            현재 상황에 맞는 매체부터 시작하는 것이 중요합니다.
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-2">
            {MEDIA_ITEMS.map((item) => (
              <li
                key={item}
                className="media-chip break-keep rounded-xl border-2 px-2.5 py-2.5 text-center text-[11px] font-bold leading-snug sm:rounded-full sm:px-3.5 sm:py-2.5 sm:text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. 효과적인 대상 */}
      <section className="px-4 py-10 sm:px-6 sm:py-12" style={{ backgroundColor: BLUE_LIGHT }}>
        <div className="mx-auto max-w-lg">
          <SectionTitle>이런 분에게 효과적입니다</SectionTitle>
          <ul className="compact-card-list mt-5 space-y-2 sm:mt-6 sm:space-y-2.5">
            {TARGET_AUDIENCE.map((item) => (
              <li
                key={item}
                className="compact-card flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-sm sm:gap-3 sm:px-4 sm:py-3"
              >
                <span className="shrink-0 text-[15px] font-bold leading-none sm:text-base" style={{ color: BLUE }}>
                  ·
                </span>
                <span className="problem-card__text min-w-0 flex-1 text-[13px] font-bold leading-none text-[#1e293b] sm:text-[15px]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. 가격 */}
      <section className="px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-lg">
          <SectionTitle>
            전문 마케터 채용이 부담스럽다면
            <br />
            먼저 런웨이로 시작하세요
          </SectionTitle>
          <div
            className="mt-5 rounded-2xl border-2 bg-white p-5 shadow-sm sm:mt-6 sm:p-8"
            style={{ borderColor: BLUE }}
          >
            <p className="break-keep text-center text-[15px] font-semibold sm:text-lg">
              런웨이 SNS 광고관리 베이직
            </p>
            <p className="mt-3 text-center sm:mt-4">
              <span className="text-[1.65rem] font-bold sm:text-4xl" style={{ color: BLUE_DARK }}>
                월 330,000원부터
              </span>
              <span className="mt-1 block text-[13px] font-medium text-[#475569] sm:text-sm">
                전문 마케터 구독
              </span>
            </p>
            <p className="mt-3 break-keep text-center text-[13px] leading-relaxed text-[#64748b] sm:mt-4 sm:text-sm">
              필요한 광고 운영을 작게 시작하고,
              <br />
              성과와 예산에 따라 매체를 확장할 수 있습니다.
            </p>
            <ul className="mt-4 space-y-1.5 sm:mt-5 sm:space-y-2">
              {PACKAGE_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] sm:gap-2.5 sm:py-2.5 sm:text-sm"
                  style={{ backgroundColor: BLUE_LIGHT }}
                >
                  <span className="shrink-0 font-bold" style={{ color: BLUE }}>
                    ✓
                  </span>
                  <span className="break-keep">{feature}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 break-keep text-center text-[11px] leading-relaxed text-[#94a3b8] sm:mt-4 sm:text-xs">
              운영 매체 수, 광고 예산, 업무 범위에 따라
              <br />
              최종 견적은 달라질 수 있습니다.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:gap-2.5">
              <PrimaryCta onClick={scrollToForm}>무료 상담 신청하기</PrimaryCta>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 마지막 CTA */}
      <section className="px-4 py-10 sm:px-6 sm:py-12" style={{ backgroundColor: BLUE_LIGHT }}>
        <div className="mx-auto max-w-lg text-center">
          <h2 className="break-keep text-center text-lg font-bold leading-snug text-[#0f172a] sm:text-2xl">
            온라인 마케팅,
            <br />
            이제 혼자 고민하지 마세요
          </h2>
          <p className="mt-3 break-keep text-[14px] font-medium leading-relaxed text-[#475569] sm:mt-4 sm:text-[15px]">
            업종, 예산, 현재 상황을 남겨주시면
            <br />
            어떤 광고부터 시작하면 좋을지 안내드리겠습니다.
          </p>
          <p className="mt-2 break-keep text-[13px] leading-relaxed text-[#64748b] sm:mt-3 sm:text-sm">
            광고를 처음 시작하는 사장님도 이해할 수 있도록
            <br />
            쉽고 현실적인 방향으로 상담해드립니다.
          </p>
          <div className="mt-5 flex justify-center sm:mt-6">
            <PrimaryCta onClick={scrollToForm}>무료 상담 신청하기</PrimaryCta>
          </div>
        </div>
      </section>

      {/* 9. 상담신청 폼 */}
      <section
        ref={consultationRef}
        id="consultation"
        className="scroll-mt-3 px-4 py-10 sm:scroll-mt-4 sm:px-6 sm:py-12"
      >
        <div className="mx-auto max-w-xl">
          <h2 className="text-center text-lg font-semibold sm:text-2xl">상담 신청</h2>
          <p className="mt-2 text-center text-[13px] text-[#64748b] sm:text-sm">
            간단한 정보를 입력해주세요
          </p>

          <form
            id="consultation-form"
            onSubmit={handleFormSubmit}
            className="mt-6 space-y-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-sm sm:mt-8 sm:space-y-5 sm:p-8"
          >
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#364153]">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="홍길동"
                className="w-full rounded-lg border border-[#d1d5dc] px-4 py-3 text-base outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#364153]">
                연락처
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="010-0000-0000"
                className="w-full rounded-lg border border-[#d1d5dc] px-4 py-3 text-base outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="industry" className="mb-2 block text-sm font-medium text-[#364153]">
                업종
              </label>
              <input
                id="industry"
                name="industry"
                type="text"
                placeholder="예: 미용실, 필라테스, 카페 등"
                className="w-full rounded-lg border border-[#d1d5dc] px-4 py-3 text-base outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="region" className="mb-2 block text-sm font-medium text-[#364153]">
                매장 지역
              </label>
              <input
                id="region"
                name="region"
                type="text"
                placeholder="예: 서울 강남구 역삼동"
                className="w-full rounded-lg border border-[#d1d5dc] px-4 py-3 text-base outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#364153]">
                문의 내용
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="광고 관련 궁금한 점이나 목표를 자유롭게 작성해주세요."
                className="w-full resize-y rounded-lg border border-[#d1d5dc] px-4 py-3 text-base outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="rounded-lg bg-[#f8fafc] p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 size-4 shrink-0 accent-[#2563eb]"
                />
                <span className="text-sm font-medium text-[#364153]">
                  개인정보 수집·이용 동의 (필수)
                </span>
              </label>
              <div className="mt-3 space-y-1 text-xs leading-relaxed text-[#64748b]">
                <p>
                  <strong className="text-[#364153]">수집 목적:</strong> 광고 상담 및 문의 응대
                </p>
                <p>
                  <strong className="text-[#364153]">수집 항목:</strong> 이름, 연락처, 업종,
                  매장 지역, 문의 내용
                </p>
                <p>
                  <strong className="text-[#364153]">보유 기간:</strong> 상담 종료 후 1년 또는
                  요청 시 즉시 삭제
                </p>
                <p className="pt-1">동의 거부 시 상담 신청이 제한될 수 있습니다.</p>
              </div>
            </div>
            {submitError && (
              <p className="text-sm text-red-600" role="alert">
                {submitError}
              </p>
            )}
            {submitSuccess && (
              <p className="text-sm text-green-700" role="status">
                {submitSuccess}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="touch-manipulation w-full min-h-[52px] rounded-xl py-3.5 text-[15px] font-semibold text-white transition-opacity active:opacity-80 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
              style={{ backgroundColor: BLUE }}
            >
              {isSubmitting ? "신청 중..." : "무료 상담 신청하기"}
            </button>
          </form>
        </div>
      </section>

      {/* 모바일 하단 고정 CTA — 상담 신청 섹션에서는 숨김 */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#e2e8f0] bg-white/95 px-4 py-3 backdrop-blur-sm transition-transform duration-300 ease-out sm:hidden ${
          showStickyCta ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        aria-hidden={!showStickyCta}
      >
        <div className="mx-auto flex max-w-lg">
          <button
            type="button"
            onClick={scrollToForm}
            className="touch-manipulation min-h-[48px] w-full rounded-xl py-3 text-[14px] font-semibold text-white active:opacity-80"
            style={{ backgroundColor: BLUE }}
          >
            무료 상담 신청
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="px-4 py-10 text-center sm:px-6 sm:py-12"
        style={{
          backgroundColor: NAVY,
          paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))",
        }}
      >
        <p className="text-lg font-medium text-white">런웨이 광고대행사</p>
        <p className="mt-2 text-sm text-[#99a1af]">투명한 광고 운영 파트너</p>
        <div className="mt-6 space-y-1 text-xs text-[#99a1af]">
          <p>사업자등록번호: 326-02-03126</p>
          <p>통신판매신고: 제 2026-서울영등포-1088 호</p>
          <p>이메일: ads.runwaykorea@gmail.com</p>
          <p>
            연락처:{" "}
            <a href="tel:010-7753-9765" className="text-[#99a1af] hover:text-white">
              010-7753-9765
            </a>
          </p>
          <p>사업장소재지: 서울특별시 영등포구 국회대로38길 8, 403호</p>
        </div>
        <p className="mt-8 border-t border-[#364153] pt-6 text-xs text-[#99a1af]">
          © 2026 런웨이 광고대행사. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LandingPageInner />
    </Suspense>
  );
}
