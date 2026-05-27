"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const HERO_GRADIENT =
  "linear-gradient(180deg, #0a1628 0%, #0c182b 25%, #101d32 50%, #142238 75%, #1a2a42 100%)";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function CheckIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M16.667 5L7.5 14.167 3.333 10"
        stroke="#ff6b35"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="#9ca3af"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`size-5 shrink-0 text-gray-muted transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BADGES = [
  "광고비 수수료 0원",
  "대표님 계정에서 운영",
  "소상공인 광고 전문",
  "데이터 대표님 소유",
];

const PROBLEMS = [
  {
    title: "광고 담당자 채용하기엔\n비용이 부담된다",
    desc: "마케팅 직원을 뽑기엔 인건비가 너무 비싸고, 한 명을 채용할 만큼 업무가 많지 않습니다.",
  },
  {
    title: "광고를 직접 하려니\n방법을 잘 모르겠다",
    desc: "광고 세팅, 타겟팅, 입찰, 전환 추적 등 전문 용어와 설정이 복잡합니다.",
  },
  {
    title: "광고비를 써도\n문의가 늘지 않는다",
    desc: "광고비는 계속 나가는데 실제로 전화 문의나 방문으로 이어지지 않습니다.",
  },
  {
    title: "다른 대행사는 광고비가\n불투명해 불안하다",
    desc: "광고비에 수수료를 얼마나 붙이는지, 실제로 얼마가 집행되는지 알 수 없습니다.",
  },
];

const SERVICES = [
  {
    num: 1,
    title: "광고 전략 설계",
    desc: "업종, 지역, 예산에 맞는 광고 방향을 잡습니다.",
  },
  {
    num: 2,
    title: "광고 문구 작성",
    desc: "고객이 클릭할 만한 제목과 설명을 만듭니다.",
  },
  {
    num: 3,
    title: "광고 소재 기획",
    desc: "당근, 네이버, SNS에 맞는 이미지와 콘텐츠 방향을 제안합니다.",
  },
  {
    num: 4,
    title: "광고 운영관리",
    desc: "성과를 보며 문구, 지역, 예산, 소재를 조정합니다.",
  },
];

const COMPARISON_ROWS = [
  {
    label: "광고비 결제",
    agency: "대행사에 입금하거나 구조가 불투명할 수 있음",
    runway: "대표님 광고계정에서 직접 결제",
  },
  {
    label: "광고계정 소유",
    agency: "대행사 중심 운영",
    runway: "대표님 소유 계정에서 운영",
  },
  {
    label: "광고 데이터",
    agency: "대행사에 데이터가 쌓일 수 있음",
    runway: "대표님 계정에 데이터 축적",
  },
  {
    label: "수수료 구조",
    agency: "광고비에 수수료가 붙을 수 있음",
    runway: "광고비 수수료 0원, 운영관리비만",
  },
  {
    label: "운영 방식",
    agency: "결과만 공유받는 방식",
    runway: "세팅, 운영, 개선 방향 공유",
  },
];

const PACKAGE_FEATURES = [
  "광고 전략 상담",
  "당근 광고 세팅",
  "네이버 또는 SNS 광고 방향 제안",
  "광고 문구 작성",
  "광고 소재 기획",
  "예산 설정",
  "월간 운영 리포트",
  "광고 개선 제안",
];

const PROCESS_STEPS = [
  {
    step: 1,
    title: "상담 신청",
    desc: "업종, 지역, 현재 광고 상황을 확인합니다.",
  },
  {
    step: 2,
    title: "광고 가능성 진단",
    desc: "당근, 네이버, SNS 중 어떤 채널이 적합한지 검토합니다.",
  },
  {
    step: 3,
    title: "광고 전략 제안",
    desc: "예산, 지역, 문구, 소재 방향을 제안합니다.",
  },
  {
    step: 4,
    title: "대표님 계정에서 광고 세팅",
    desc: "대표님 소유 광고계정에서 광고를 세팅합니다.",
  },
  {
    step: 5,
    title: "운영 및 개선",
    desc: "성과를 확인하며 문구, 소재, 예산, 지역을 조정합니다.",
  },
];

const FAQ_ITEMS = [
  {
    q: "광고비는 얼마부터 시작하면 좋나요?",
    a: "업종과 지역에 따라 다르지만, 보통 월 30~50만 원부터 테스트하시는 경우가 많습니다. 상담 시 예산 규모에 맞는 현실적인 방향을 함께 잡아드립니다.",
  },
  {
    q: "광고비는 런웨이에 입금하나요?",
    a: "아닙니다. 광고비는 대표님의 광고계정(당근, 메타, 네이버 등)에서 직접 결제됩니다. 런웨이는 광고비 수수료를 받지 않습니다.",
  },
  {
    q: "어떤 광고 채널을 운영하나요?",
    a: "당근 비즈니스, 메타(인스타·페이스북), 네이버 검색·플레이스 등 업종과 목표에 맞는 채널을 추천하고 운영합니다.",
  },
  {
    q: "광고계정이 없어도 가능한가요?",
    a: "가능합니다. 계정 개설부터 세팅까지 안내해 드리며, 계정과 데이터는 처음부터 대표님 명의로 생성합니다.",
  },
  {
    q: "우리 업종도 효과가 있을까요?",
    a: "미용실, 학원, 필라테스, 음식점 등 소상공인 업종별로 전략이 다릅니다. 상담 시 업종 특성에 맞는 사례와 방향을 공유해 드립니다.",
  },
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
  landing_page?: string | null;
};

function SectionHeading({
  title,
  subtitle,
  light = false,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2
        className={`text-2xl font-semibold leading-snug tracking-tight sm:text-3xl sm:leading-tight ${light ? "text-white" : "text-navy"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-[#d1d5dc]" : "text-gray-muted"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-[10px] bg-orange px-6 py-4 text-base font-medium text-white transition-opacity hover:opacity-90 active:opacity-80 sm:w-auto sm:min-w-[280px] ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[10px] border border-white/30 bg-white/10 px-6 py-4 text-base font-medium text-white transition-colors hover:bg-white/15 sm:w-auto"
    >
      {children}
    </button>
  );
}

function LandingPageInner() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

  const searchParams = useSearchParams();

  useEffect(() => {
    const source = searchParams.get("utm_source");
    const medium = searchParams.get("utm_medium");
    const campaign = searchParams.get("utm_campaign");
    const content = searchParams.get("utm_content");
    const term = searchParams.get("utm_term");

    setUtm({
      utm_source: source,
      utm_medium: medium,
      utm_campaign: campaign,
      utm_content: content,
      utm_term: term,
    });
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReferrer(document.referrer || null);
    setLandingPage(window.location.href);
  }, []);

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
      landing_page: landingPage,
    };

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !result.success) {
        setSubmitError(result.error || "상담 신청 처리 중 오류가 발생했습니다.");
        return;
      }

      if (typeof window !== "undefined") {
        const anyWindow = window as typeof window & {
          gtag?: (...args: any[]) => void;
          fbq?: (...args: any[]) => void;
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
    <div className="min-h-screen bg-white text-navy">
      {/* Hero */}
      <section
        id="hero"
        className="px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8"
        style={{ background: HERO_GRADIENT }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-sm font-medium text-orange sm:text-base">
            런웨이 광고대행
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl sm:leading-tight lg:text-5xl lg:leading-tight">
            월 <span className="text-orange">49만 9천원</span>으로
            <br />
            전문 마케터를 고용하세요
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[#d1d5dc] sm:text-lg">
            대표님은 사업에만 집중하세요.
            <br className="hidden sm:inline" />
            SNS 광고 세팅과 운영은 런웨이가 대신 해드립니다.
          </p>
          <p className="mt-3 text-sm text-gray-light sm:text-base">
            광고비는 대표님 계정에서 직접 결제하고,
            <br className="sm:hidden" />
            광고계정과 데이터는 대표님 소유로 남습니다.
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <PrimaryButton onClick={() => scrollTo("consultation")}>
              월 49만 9천원 광고 운영 상담받기
            </PrimaryButton>
            <SecondaryButton onClick={() => scrollTo("ownership")}>
              운영 방식 자세히 보기
            </SecondaryButton>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-[10px] bg-white/10 px-3 py-2.5 text-xs text-white sm:px-4 sm:text-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
      <section id="problems" className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title={
              <>
                광고 담당자를 뽑기에는 부담스럽고,
                <br />
                직접 운영하기에는 너무 복잡하셨나요?
              </>
            }
            subtitle={
              <>
                당근 광고, 네이버 광고, SNS 광고는 시작보다 운영이 더 중요합니다.
                <br className="hidden sm:inline" />
                어떤 문구를 쓰고, 어떤 지역에 노출하고, 어떤 소재를 테스트하느냐에
                따라 결과가 달라집니다.
              </>
            }
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMS.map((item) => (
              <article
                key={item.title}
                className="rounded-[14px] bg-white p-6 shadow-sm"
              >
                <h3 className="whitespace-pre-line text-lg font-semibold leading-snug text-navy">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-muted">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title={
              <>
                대표님은 사업에만 집중하세요.
                <br />
                광고는 런웨이가 대신 해드립니다.
              </>
            }
            subtitle={
              <>
                매장 운영, 고객 응대, 직원 관리만으로도 하루가 바쁩니다.
                <br className="hidden sm:inline" />
                런웨이는 대표님 대신 광고 전략, 문구 작성, 소재 기획, 채널 세팅,
                성과 확인까지 관리합니다.
              </>
            }
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((item) => (
              <article
                key={item.num}
                className="rounded-[14px] bg-gray-50 p-6"
              >
                <div className="flex size-12 items-center justify-center rounded-[10px] bg-orange text-xl font-medium text-white">
                  {item.num}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-navy">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-muted">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Ownership */}
      <section id="ownership" className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <SectionHeading title="광고계정도, 결제도, 데이터도 대표님 소유입니다" />
          <div className="mt-8 rounded-[10px] border-l-4 border-orange bg-gradient-to-r from-[#fff7ed] to-[#ffedd4] px-5 py-5 sm:px-7">
            <p className="text-base leading-relaxed text-navy sm:text-lg">
              광고비는 대표님의 자산입니다. 광고를 집행할수록 데이터가 쌓여야
              하고, 그 데이터는 대표님 계정에 남아야 합니다.
            </p>
          </div>

          {/* Desktop table */}
          <div className="mt-8 hidden overflow-hidden rounded-[14px] bg-white shadow-md sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="bg-[#f3f4f6] px-4 py-4 text-left font-bold text-[#364153]">
                    구분
                  </th>
                  <th className="bg-[#f3f4f6] px-4 py-4 text-center font-bold text-[#364153]">
                    일반 대행사
                  </th>
                  <th className="bg-orange px-4 py-4 text-center font-bold text-white">
                    런웨이
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label} className="border-t border-[#f3f4f6]">
                    <td className="px-4 py-4 font-medium text-[#364153]">
                      {row.label}
                    </td>
                    <td className="px-4 py-4 text-center text-[#6a7282]">
                      <span className="inline-flex items-center gap-2">
                        <XIcon />
                        {row.agency}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center font-medium text-navy">
                      <span className="inline-flex items-center gap-2">
                        <CheckIcon className="size-4" />
                        {row.runway}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-8 space-y-4 sm:hidden">
            {COMPARISON_ROWS.map((row) => (
              <div
                key={row.label}
                className="overflow-hidden rounded-[14px] bg-white shadow-sm"
              >
                <p className="bg-[#f3f4f6] px-4 py-3 text-sm font-bold text-[#364153]">
                  {row.label}
                </p>
                <div className="border-b border-[#f3f4f6] px-4 py-3">
                  <p className="text-xs font-medium text-[#6a7282]">일반 대행사</p>
                  <p className="mt-1 flex items-start gap-2 text-sm text-[#6a7282]">
                    <XIcon className="mt-0.5 shrink-0" />
                    {row.agency}
                  </p>
                </div>
                <div className="bg-[#fff7ed] px-4 py-3">
                  <p className="text-xs font-bold text-orange">런웨이</p>
                  <p className="mt-1 flex items-start gap-2 text-sm font-medium text-navy">
                    <CheckIcon className="mt-0.5 shrink-0" />
                    {row.runway}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            title="월 49만 9천원으로 전문 마케터를 고용한 것처럼"
            subtitle="직원 1명을 채용하는 비용보다 낮은 금액으로, 광고 운영 전문가를 외부 마케터처럼 활용하세요."
          />
          <div className="relative mt-10 rounded-2xl border-2 border-orange bg-white p-6 shadow-xl sm:p-8">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange px-4 py-1 text-sm font-medium text-white">
              대표 추천
            </span>
            <h3 className="mt-2 text-center text-2xl font-semibold text-navy">
              소상공인 광고 운영 패키지
            </h3>
            <p className="mt-4 text-center text-4xl font-normal text-navy sm:text-5xl">
              월 499,000원
            </p>
            <p className="mt-4 text-center text-base leading-relaxed text-gray-muted">
              광고 담당자를 채용하기 부담스러운 소상공인 대표님을 위한 광고 운영
              패키지입니다. 런웨이가 광고 세팅부터 운영관리까지 대신
              맡아드립니다.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {PACKAGE_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 rounded-[10px] bg-gray-50 px-4 py-3 text-sm text-[#364153]"
                >
                  <CheckIcon />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-[10px] border border-[#ffd6a8] bg-[#fff7ed] px-5 py-4 text-sm leading-relaxed text-navy">
              <strong>중요:</strong> 광고비는 별도입니다. 광고비는 대표님
              광고계정에서 직접 결제됩니다. 런웨이는 광고비 수수료를 받지
              않습니다.
            </div>
            <div className="mt-6 flex justify-center">
              <PrimaryButton
                className="sm:w-full"
                onClick={() => scrollTo("consultation")}
              >
                월 49만 9천원 광고 운영 상담받기
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title="처음 시작하는 대표님도 쉽게 진행됩니다" />
          <ol className="mt-10 space-y-6">
            {PROCESS_STEPS.map((item, index) => (
              <li key={item.step} className="flex gap-4 sm:gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-orange text-sm font-bold text-white sm:size-16">
                    {item.step}
                  </div>
                  {index < PROCESS_STEPS.length - 1 && (
                    <div className="mt-2 h-full min-h-8 w-0.5 flex-1 bg-[#d1d5dc]" />
                  )}
                </div>
                <article className="flex-1 rounded-[14px] border border-[#f3f4f6] bg-white p-5 shadow-sm sm:p-6">
                  <p className="text-xs font-medium text-orange">
                    STEP {item.step}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-navy sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-muted">{item.desc}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title="자주 묻는 질문" />
          <div className="mt-10 space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-navy">{item.q}</span>
                    <ChevronIcon open={isOpen} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#e5e7eb] px-5 py-4 text-sm leading-relaxed text-gray-muted">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section
        className="px-4 py-16 sm:px-6 lg:px-8"
        style={{ background: HERO_GRADIENT }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            light
            title={
              <>
                광고 담당자를 뽑기 부담스럽다면,
                <br />
                월 49만 9천원으로 런웨이를 고용하세요
              </>
            }
            subtitle={
              <>
                대표님은 사업에만 집중하세요
                <br />
                광고 전략, 문구, 이미지, 세팅, 운영관리는 런웨이가 대신
                해드립니다
              </>
            }
          />
          <div className="mt-8 flex justify-center">
            <PrimaryButton onClick={() => scrollTo("consultation")}>
              월 49만 9천원 광고 운영 상담받기
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* Consultation form */}
      <section id="consultation" className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center text-2xl font-semibold text-navy sm:text-3xl">
            상담 신청
          </h2>
          <p className="mt-3 text-center text-base text-gray-muted">
            간단한 정보를 입력해주시면 빠른 시간 내에 연락드리겠습니다.
          </p>
          <form
            onSubmit={handleFormSubmit}
            className="mt-8 space-y-5 rounded-[14px] bg-white p-6 shadow-lg sm:p-8"
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
                className="w-full rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-base outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
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
                className="w-full rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-base outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
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
                className="w-full rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-base outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
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
                className="w-full rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-base outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
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
                className="w-full resize-y rounded-[10px] border border-[#d1d5dc] px-4 py-3 text-base outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="rounded-[10px] bg-gray-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 size-4 shrink-0 accent-orange"
                />
                <span className="text-sm font-medium text-[#364153]">
                  개인정보 수집·이용 동의 (필수)
                </span>
              </label>
              <div className="mt-3 space-y-1 text-xs leading-relaxed text-gray-muted">
                <p>
                  <strong className="text-[#364153]">수집 목적:</strong> 광고 상담
                  및 문의 응대
                </p>
                <p>
                  <strong className="text-[#364153]">수집 항목:</strong> 이름,
                  연락처, 업종, 매장 지역, 문의 내용
                </p>
                <p>
                  <strong className="text-[#364153]">보유 기간:</strong> 상담
                  종료 후 1년 또는 요청 시 즉시 삭제
                </p>
                <p className="pt-1">
                  동의 거부 시 상담 신청이 제한될 수 있습니다.
                </p>
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
              className="w-full rounded-[10px] bg-orange py-4 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "신청 중..." : "상담 신청하기"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy px-4 py-12 text-center sm:px-6">
        <p className="text-lg font-medium text-white">런웨이 광고대행사</p>
        <p className="mt-2 text-sm text-gray-light">투명한 광고 운영 파트너</p>
        <div className="mt-6 space-y-1 text-xs text-gray-light">
          <p>사업자등록번호: 326-02-03126</p>
          <p>이메일: ads.runwaykorea@gmail.com</p>
          <p>사업장소재지: 서울특별시 영등포구 국회대로38길 8, 403호</p>
        </div>
        <p className="mt-8 border-t border-[#364153] pt-6 text-xs text-gray-light">
          © 2026 런웨이 광고대행사. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={null}>
      <LandingPageInner />
    </Suspense>
  );
}
