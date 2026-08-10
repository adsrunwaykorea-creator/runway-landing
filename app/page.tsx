"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackDaangnSubmitApplication } from "@/lib/tracking/daangn-pixel";
import "./landing.css";

const BLUE = "#2563eb";
const BLUE_DARK = "#1e40af";
const BLUE_LIGHT = "#eff6ff";
const NAVY = "#0a1628";

const PROBLEMS = [
  "광고비를 냈는데 어디에 쓰였는지 모르겠어요",
  "광고대행사에 광고비까지 맡기는 게 불안해요",
  "DB는 들어오는데 품질이 들쭉날쭉해요",
  "인스타그램·유튜브 광고 세팅이 어렵습니다",
  "광고를 해도 예약이나 상담으로 연결이 안 됩니다",
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
  "광고비는 매체에 직접 결제되어 사용처가 투명합니다.",
  "광고 매체를 직접 설정해 DB 품질을 일정하게 유지합니다.",
  "문의, 예약, 방문까지 이어지는 실전형 광고 운영관리입니다.",
];

const OTHER_PERFORMANCE = [
  "온라인몰 월 매출액 +215% 달성",
  "오프라인 매장 월 매출액 +42% 달성",
  "오프라인 예약 +571% 달성",
  "메타 광고 ROAS +750% 달성",
  "네이버 플레이스 유입 +135% 달성",
];

const ADVANTAGES = [
  {
    title: "광고비에 거품이 없습니다",
    desc: "광고비는 대표님이 인스타그램·유튜브·네이버·당근 등 광고 매체에 직접 결제합니다. 그래서 광고비가 어디에 사용되는지 직접 확인할 수 있고, 불필요한 중간 마진 없이 광고비가 실제 매체에 사용됩니다.",
  },
  {
    title: "DB 품질이 일정하게 유지됩니다",
    desc: "런웨이는 광고 매체를 직접 설정해 운영합니다. 고객 DB는 출처가 불분명한 정보가 아니라, 대표님이 광고비를 지불한 매체에서 광고를 보고 직접 신청한 고객 정보만 유입됩니다.",
  },
];

const OPERATING_METHODS = [
  {
    title: "이름·전화번호 DB 전달",
    desc: "광고를 보고 관심 있는 고객이 이름과 전화번호를 남기면 대표님께 전달드립니다. 상담 후 예약 전환이 필요한 피부관리, 두피관리, SMP, 왁싱, 속눈썹, 탈모관리 업종에 적합합니다.",
  },
  {
    title: "네이버 예약페이지 연결",
    desc: "광고를 클릭한 고객을 대표님 네이버 예약페이지나 홈페이지로 바로 연결합니다. 예약페이지가 잘 정리되어 있고, 바로 예약을 유도하고 싶은 매장에 적합합니다.",
  },
];

const TARGET_INDUSTRIES = [
  "피부관리",
  "두피관리",
  "SMP",
  "왁싱",
  "속눈썹",
  "에스테틱",
  "탈모관리",
];

const TARGET_AUDIENCE = [
  "피부·두피·SMP·왁싱·속눈썹 SNS 광고를 체계적으로 운영하고 싶은 대표님",
  "광고비를 직접 결제하며 투명하게 관리하고 싶은 대표님",
  "DB 품질을 일정하게 유지하고 싶은 대표님",
  "인스타그램·유튜브 광고 세팅이 어려운 대표님",
  "광고를 예약·상담으로 연결하고 싶은 대표님",
];

const PACKAGE_FEATURES = [
  "뷰티업종 전문 SNS 광고 운영관리",
  "인스타그램·유튜브·네이버·당근 매체 세팅",
  "광고비는 매체 직접 결제 구조",
  "고객 DB 품질 관리",
  "광고 성과 보고서 전달",
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

function Section({
  children,
  className = "",
  style,
  id,
  sectionRef,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  sectionRef?: React.RefObject<HTMLElement | null>;
}) {
  return (
    <section
      ref={sectionRef}
      id={id}
      className={`landing-section ${className}`}
      style={style}
    >
      <div className="landing-container">{children}</div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="landing-section-title">{children}</h2>;
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
      data-main-cta="true"
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

function AdvantageCards() {
  const listRef = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={listRef} className="landing-content landing-card-list">
      {ADVANTAGES.map((card, index) => (
        <li
          key={card.title}
          className="landing-card landing-card--soft landing-card--stack benefit-card"
        >
          <div className="benefit-card__body">
            <div className="benefit-card__aside">
              <span className="star-badge" aria-hidden="true">
                ★
              </span>
              <span className="landing-card__index">{index + 1}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="benefit-title">
                <span
                  className={`animated-red-underline${visible ? " is-visible" : ""}`}
                >
                  {card.title}
                </span>
              </p>
              <p className="landing-card__desc">{card.desc}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnyMainCtaVisible, setIsAnyMainCtaVisible] = useState(false);
  const [isContactFormVisible, setIsContactFormVisible] = useState(false);
  const consultationRef = useRef<HTMLElement>(null);
  const daangnConversionTrackedRef = useRef(false);

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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 250);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ctaElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-main-cta="true"]'),
    );
    if (ctaElements.length === 0) return;

    const visibility = new Map<Element, boolean>();
    ctaElements.forEach((el) => visibility.set(el, false));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target, entry.isIntersecting);
        });
        setIsAnyMainCtaVisible([...visibility.values()].some(Boolean));
      },
      { threshold: 0.2 },
    );

    ctaElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const formEl = consultationRef.current ?? document.getElementById("contact-form");
    if (!formEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsContactFormVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(formEl);
    return () => observer.disconnect();
  }, []);

  const shouldShowStickyCta =
    isScrolled && !isAnyMainCtaVisible && !isContactFormVisible;

  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubmitError(null);
    setSubmitSuccess(null);
    daangnConversionTrackedRef.current = false;

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

      if (!daangnConversionTrackedRef.current) {
        daangnConversionTrackedRef.current = true;
        await trackDaangnSubmitApplication();
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
    <div className="landing-page min-h-screen bg-white text-[#0f172a]">
      {/* 1. 히어로 */}
      <Section className="landing-section--hero">
        <div className="landing-hero">
          <p className="landing-hero__eyebrow">뷰티업종 SNS 광고관리</p>
          <h1 className="landing-hero__title">
            광고비 거품 없이,
            <br />
            고객 DB 품질은 일정하게
          </h1>
          <p className="landing-hero__sub">
            피부·두피·SMP·왁싱·속눈썹 업종에 맞춰
            <br />
            SNS 광고를 세팅하고 운영합니다.
            <br />
            광고비는 대표님이 매체에 직접 결제하고,
            <br />
            런웨이는 월 관리비만 받습니다.
          </p>
          <div className="hero-price-callout">
            <p className="hero-price-callout__amount">
              월 <span className="hero-price-callout__price">399,000원</span>
            </p>
            <p className="hero-price-callout__tagline">뷰티업종 전문 SNS 광고관리</p>
            <p className="hero-price-callout__note">VAT 별도 / 광고비 별도</p>
          </div>
          <div className="landing-hero__cta">
            <PrimaryCta onClick={scrollToForm}>무료 상담 신청하기</PrimaryCta>
          </div>
          <p className="landing-hero__trust">
            광고비는 매체에 직접 결제,
            <br />
            런웨이는 월 관리비만 받습니다.
          </p>
        </div>
      </Section>

      {/* 2. 적합 업종 */}
      <Section style={{ backgroundColor: BLUE_LIGHT }}>
        <SectionTitle>이런 업종에 적합합니다</SectionTitle>
        <div className="landing-content">
          <ul className="mt-0 flex flex-wrap justify-center gap-2 sm:gap-2.5">
            {TARGET_INDUSTRIES.map((item) => (
              <li
                key={item}
                className="rounded-full border-2 bg-white px-3.5 py-2 text-[14px] font-bold text-[#1e40af] sm:px-4 sm:py-2.5 sm:text-[15px]"
                style={{ borderColor: "#93c5fd" }}
              >
                {item}
              </li>
            ))}
          </ul>
          <p className="landing-body-text mt-5 sm:mt-6">
            상담 후 예약 전환이 중요한 뷰티업종에 맞춰
            <br />
            고객 DB 수집 또는 네이버 예약페이지 연결 방식으로 운영합니다.
          </p>
        </div>
      </Section>

      {/* 3. 문제 공감 */}
      <Section>
        <SectionTitle>이런 고민이 있으신가요?</SectionTitle>
        <ul className="landing-list landing-card-list">
          {PROBLEMS.map((item, index) => (
            <li key={item} className="landing-card landing-card--soft landing-card--row">
              <ProblemCheck delayMs={index * 250} />
              <span className="landing-card__text">{item}</span>
            </li>
          ))}
        </ul>
        <p
          className="landing-content mt-6 break-keep text-center text-[15px] font-semibold leading-relaxed sm:mt-8 sm:text-base"
          style={{ color: BLUE_DARK }}
        >
          그렇다면 런웨이가
          <br />
          투명한 광고 운영관리로 도와드리겠습니다.
        </p>
      </Section>

      {/* 3. 마케팅 성과 */}
      <Section>
        <div className="landing-content text-center">
          <p className="text-[15px] font-medium text-[#64748b] sm:text-base">
            실제 사례로 증명합니다.
          </p>
          <p
            className="mt-3 break-keep text-[1.15rem] font-bold leading-snug sm:mt-4 sm:text-2xl"
            style={{ color: BLUE_DARK }}
          >
            M 뷰티 프랜차이즈 기준 월 예약 신청이
            <br />
            <span className="headline-stat-highlight text-[1.35rem] sm:text-3xl">
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
          <p className="landing-body-text mt-3">
            지역 타겟팅의 효과는 숫자로 나타납니다. 두피/탈모 브랜드의 실제 운영 데이터입니다.
          </p>
        </div>

        <div className="landing-compare mt-6 sm:mt-8">
          <article className="landing-card landing-compare__card">
            <h3 className="text-center text-lg font-extrabold tracking-tight text-[#1e293b] sm:text-2xl">
              대표님 직접 운영
            </h3>
            <p className="mx-auto mt-2 w-fit rounded-full bg-[#f1f5f9] px-3 py-1 text-xs text-[#64748b] sm:text-sm">
              2025년 3월
            </p>
            <ul className="mt-5 divide-y divide-[#eef2f7]">
              {PERFORMANCE_BEFORE.map((item) => (
                <li key={item.label} className="py-3 text-center sm:py-4">
                  <p className="text-3xl font-bold text-[#334155] sm:text-4xl">{item.value}</p>
                  <p className="landing-compare__label">{item.label}</p>
                </li>
              ))}
            </ul>
            <ul className="landing-compare__notes space-y-1 bg-[#f8fafc] text-[#64748b]">
              {BEFORE_NOTES.map((note) => (
                <li key={note}>✖ {note}</li>
              ))}
            </ul>
          </article>

          <div className="hidden items-center justify-center text-center lg:flex lg:flex-col">
            <p className="text-sm text-[#64748b]">런웨이 지역 타겟팅</p>
            <p className="text-3xl font-bold" style={{ color: BLUE }}>
              →
            </p>
          </div>

          <article className="landing-card landing-compare__card animated-highlight-border border-2">
            <h3
              className="text-center text-lg font-extrabold tracking-tight sm:text-2xl"
              style={{ color: BLUE_DARK }}
            >
              런웨이 운영 후
            </h3>
            <p className="performance-after-channel mx-auto mt-2 text-center text-[15px] sm:text-base">
              당근 + 인스타 광고 운영
            </p>
            <p
              className="mx-auto mt-2 w-fit rounded-full px-3 py-1 text-xs text-white sm:text-sm"
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
                  <p className="landing-compare__label text-[#334155]">
                    {item.label} <span className="text-[#64748b]">({item.change})</span>
                  </p>
                </li>
              ))}
            </ul>
            <ul className="landing-compare__notes space-y-1 bg-[#eff6ff] text-[#334155]">
              {AFTER_NOTES.map((note) => (
                <li key={note}>☑ {note}</li>
              ))}
            </ul>
          </article>
        </div>

        <p className="landing-content landing-body-text mt-6 sm:mt-8">
          런웨이는 감으로만 광고를 운영하지 않습니다.
          <br />
          실제 운영 경험과 성과 데이터를 기준으로
          <br />
          광고 방향을 제안합니다.
        </p>

        <div className="landing-content animated-highlight-border mt-8 rounded-2xl border-2 bg-[#f8fbff] p-4 sm:p-5">
          <h3 className="text-center text-base font-bold text-[#334155] sm:text-lg">
            마케팅 성과
          </h3>
          <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
            {OTHER_PERFORMANCE.map((item) => (
              <li
                key={item}
                className="landing-card break-keep px-3.5 py-3.5 text-center text-[15px] font-medium text-[#334155] sm:px-4 sm:py-4 sm:text-base"
                style={{ borderColor: "#93c5fd", borderWidth: 2 }}
              >
                {formatPerformanceLine(item)}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 4. 핵심 장점 */}
      <Section style={{ backgroundColor: BLUE_LIGHT }}>
        <SectionTitle>런웨이가 광고비를 직접 받지 않는 이유</SectionTitle>
        <AdvantageCards />
      </Section>

      {/* 5. 고객 모으는 방식 */}
      <Section>
        <SectionTitle>고객을 모으는 방식은 두 가지입니다</SectionTitle>
        <ul className="landing-content landing-card-list">
          {OPERATING_METHODS.map((card, index) => (
            <li key={card.title} className="landing-card landing-card--stack">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="landing-card__index">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="landing-card__title">{card.title}</p>
                  <p className="landing-card__desc">{card.desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* 6. 효과적인 대상 */}
      <Section style={{ backgroundColor: BLUE_LIGHT }}>
        <SectionTitle>이런 분에게 효과적입니다</SectionTitle>
        <ul className="landing-list landing-card-list">
          {TARGET_AUDIENCE.map((item) => (
            <li key={item} className="landing-card landing-card--soft landing-card--row">
              <span
                className="shrink-0 text-base font-bold leading-none sm:text-lg"
                style={{ color: BLUE }}
              >
                ·
              </span>
              <span className="landing-card__text">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 7. 가격 */}
      <Section>
        <SectionTitle>
          광고비 거품 없이
          <br />
          뷰티업종 SNS 광고를 운영하세요
        </SectionTitle>
        <div className="landing-content">
          <div className="landing-card landing-card--accent p-5 sm:p-8">
            <p className="break-keep text-center text-base font-semibold sm:text-lg">
              뷰티업종(피부·두피·SMP·왁싱·속눈썹) 전문 광고관리
            </p>
            <p className="mt-3 text-center sm:mt-4">
              <span className="text-[1.65rem] font-bold sm:text-4xl" style={{ color: BLUE_DARK }}>
                월 399,000원
              </span>
              <span className="mt-1 block text-[15px] font-medium text-[#475569] sm:text-base">
                월 관리비 · 광고비 별도
              </span>
            </p>
            <p className="landing-body-text mt-3 sm:mt-4">
              광고비는 매체에 직접 결제하고,
              <br />
              런웨이는 광고 운영관리만 담당합니다.
            </p>
            <ul className="mt-4 space-y-1.5 sm:mt-5 sm:space-y-2">
              {PACKAGE_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[15px] sm:gap-2.5 sm:py-3 sm:text-base"
                  style={{ backgroundColor: BLUE_LIGHT }}
                >
                  <span className="shrink-0 font-bold" style={{ color: BLUE }}>
                    ✓
                  </span>
                  <span className="break-keep">{feature}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 break-keep text-center text-xs leading-relaxed text-[#94a3b8] sm:mt-4 sm:text-sm">
              VAT 별도 / 광고비 별도
              <br />
              운영 매체 수, 광고 예산, 업무 범위에 따라
              <br />
              최종 견적은 달라질 수 있습니다.
            </p>
            <div className="mt-5 flex justify-center sm:mt-6">
              <PrimaryCta onClick={scrollToForm}>무료 상담 신청하기</PrimaryCta>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. 마지막 CTA */}
      <Section style={{ backgroundColor: BLUE_LIGHT }}>
        <div className="landing-content text-center">
          <h2 className="landing-section-title">
            광고비는 투명하게,
            <br />
            DB 품질은 일정하게
          </h2>
          <p className="mt-4 break-keep text-[15px] font-medium leading-relaxed text-[#475569] sm:mt-5 sm:text-base">
            업종, 예산, 현재 상황을 남겨주시면
            <br />
            피부·두피·SMP·왁싱·속눈썹에 맞는 광고 운영 방향을 안내드립니다.
          </p>
          <p className="landing-body-text mt-2 sm:mt-3">
            런웨이는 광고비를 직접 받지 않습니다.
            <br />
            매체 직접 결제 구조로 광고 운영을 상담해드립니다.
          </p>
          <div className="mt-6 flex justify-center sm:mt-7">
            <PrimaryCta onClick={scrollToForm}>광고 운영 상담받기</PrimaryCta>
          </div>
        </div>
      </Section>

      {/* 9. 상담신청 폼 */}
      <Section
        sectionRef={consultationRef}
        id="contact-form"
        className="scroll-mt-3 sm:scroll-mt-4"
      >
        <div className="landing-form-wrap">
          <h2 className="landing-section-title">상담 신청</h2>
          <p className="mt-2 text-center text-[15px] text-[#64748b] sm:text-base">
            간단한 정보를 입력해주세요
          </p>

          <form
            id="consultation-form"
            onSubmit={handleFormSubmit}
            className="landing-card mt-6 space-y-4 p-4 sm:mt-8 sm:space-y-5 sm:p-8"
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
      </Section>

      {/* 스크롤 고정 CTA — 기존 CTA/폼이 보일 때는 숨김 */}
      {shouldShowStickyCta && (
        <button
          type="button"
          className="sticky-cta"
          onClick={scrollToForm}
          aria-label="무료 상담 신청하기"
        >
          무료 상담 신청하기
        </button>
      )}

      {/* Footer */}
      <footer
        className="landing-section text-center"
        style={{
          backgroundColor: NAVY,
          paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="landing-container">
          <p className="text-lg font-medium text-white">런웨이 광고대행사</p>
          <p className="mt-2 text-sm text-[#99a1af]">뷰티업종 SNS 광고관리 파트너</p>
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
        </div>
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
