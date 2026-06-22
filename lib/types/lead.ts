export type LeadStatus =
  | "신규"
  | "연락완료"
  | "상담완료"
  | "계약완료"
  | "보류"
  | "부재";

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  business_type: string;
  region: string;
  monthly_budget: string;
  goal: string;
  contact: string;
  message: string | null;
  ad_channel: string | null;
  page_source: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: LeadStatus;
  admin_memo: string | null;
};

export const LEAD_STATUSES: LeadStatus[] = [
  "신규",
  "연락완료",
  "상담완료",
  "계약완료",
  "보류",
  "부재",
];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  신규: "신규",
  연락완료: "연락완료",
  상담완료: "상담완료",
  계약완료: "계약완료",
  보류: "보류",
  부재: "부재",
};
