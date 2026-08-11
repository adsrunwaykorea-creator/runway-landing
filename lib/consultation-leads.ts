import type { Lead } from "@/lib/types/lead";

export const CONSULTATION_LEADS_TABLE = "consultation_leads";

export type ConsultationLeadRow = {
  id: string;
  created_at: string;
  session_key?: string;
  source?: string | null;
  lead_name?: string | null;
  phone?: string | null;
  company?: string | null;
  business_type: string;
  store_name?: string | null;
  region: string;
  monthly_budget: string;
  goal: string;
  contact: string;
  message?: string | null;
  ad_channel?: string | null;
  service_type?: string | null;
  privacy_agreed?: boolean | null;
  page_source?: string | null;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  status?: string | null;
  admin_memo?: string | null;
  raw_payload?: Record<string, unknown> | null;
};

export function mapConsultationLead(row: ConsultationLeadRow): Lead {
  return {
    id: row.id,
    created_at: row.created_at,
    name: row.lead_name ?? "-",
    phone: row.phone ?? "-",
    business_type: row.business_type,
    region: row.region,
    monthly_budget: row.monthly_budget,
    goal: row.goal,
    contact: row.contact,
    message: row.message ?? null,
    ad_channel: row.ad_channel ?? null,
    page_source: row.page_source ?? null,
    referrer: row.referrer ?? null,
    utm_source: row.utm_source ?? null,
    utm_medium: row.utm_medium ?? null,
    utm_campaign: row.utm_campaign ?? null,
    status: (row.status as Lead["status"]) ?? "신규",
    admin_memo: row.admin_memo ?? null,
  };
}

export function buildContactValue(name: string, phone: string) {
  return `${name.trim()} / ${phone.trim()}`;
}
