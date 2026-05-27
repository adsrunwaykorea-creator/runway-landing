export type LeadStatus = "new" | "contacted" | "scheduled" | "closed" | "lost";

export type Lead = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  business_type: string | null;
  region: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  message: string | null;
  status: LeadStatus;
  memo: string | null;
  referrer: string | null;
  landing_page: string | null;
};

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "scheduled",
  "closed",
  "lost",
];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "신규",
  contacted: "연락완료",
  scheduled: "상담예약",
  closed: "종료",
  lost: "실패",
};
