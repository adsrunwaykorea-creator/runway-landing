import { NextResponse } from "next/server";
import {
  buildContactValue,
  CONSULTATION_LEADS_TABLE,
} from "@/lib/consultation-leads";
import { createServiceClient } from "@/lib/supabase/service";

function isMissingStoreNameColumnError(error: {
  message?: string;
  code?: string;
  details?: string;
}): boolean {
  const text = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  return (
    text.includes("store_name") &&
    (text.includes("column") ||
      text.includes("schema cache") ||
      error.code === "PGRST204" ||
      error.code === "42703")
  );
}

export async function POST(request: Request) {
  try {
    const supabase = createServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();

    const {
      name,
      phone,
      business_type,
      store_name,
      shop_name,
      region,
      message,
      privacy_agreed,
      utm_source,
      utm_medium,
      utm_campaign,
      referrer,
      page_source,
      landing_page,
    } = body ?? {};

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedPhone = typeof phone === "string" ? phone.trim() : "";
    const trimmedBusinessType =
      typeof business_type === "string" ? business_type.trim() : "";
    const trimmedStoreName =
      typeof store_name === "string"
        ? store_name.trim()
        : typeof shop_name === "string"
          ? shop_name.trim()
          : "";
    const trimmedRegion = typeof region === "string" ? region.trim() : "";
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (!trimmedName || !trimmedPhone) {
      return NextResponse.json(
        { success: false, error: "이름과 연락처는 필수입니다." },
        { status: 400 },
      );
    }

    if (privacy_agreed !== true) {
      return NextResponse.json(
        {
          success: false,
          error: "개인정보 수집·이용에 동의해야 상담 신청이 가능합니다.",
        },
        { status: 400 },
      );
    }

    const resolvedPageSource =
      (typeof page_source === "string" ? page_source.trim() : "") ||
      (typeof landing_page === "string" ? landing_page.trim() : "") ||
      "landing.runwayads.kr";

    const contact = buildContactValue(trimmedName, trimmedPhone);
    const sessionKey = `landing-${crypto.randomUUID()}`;

    const rawPayload = {
      source: resolvedPageSource,
      pageSource: resolvedPageSource,
      privacyAgreed: true,
      name: trimmedName,
      phone: trimmedPhone,
      businessType: trimmedBusinessType || "일반 상담",
      storeName: trimmedStoreName || null,
      region: trimmedRegion || "미입력",
      message: trimmedMessage || null,
      referrer: referrer ?? null,
      utm_source: utm_source ?? null,
      utm_medium: utm_medium ?? null,
      utm_campaign: utm_campaign ?? null,
    };

    // NOTE: consultation_leads에 store_name 컬럼이 필요합니다.
    // 없으면 supabase/migrations/002_consultation_leads_store_name.sql 을 적용하세요.
    // 컬럼이 아직 없어도 기존 저장은 깨지지 않도록, 실패 시 store_name 없이 재시도합니다.
    const insertPayload = {
      source: "contact_us",
      session_key: sessionKey,
      lead_name: trimmedName,
      phone: trimmedPhone,
      business_type: trimmedBusinessType || "일반 상담",
      store_name: trimmedStoreName || null,
      region: trimmedRegion || "미입력",
      monthly_budget: "미입력",
      goal: trimmedMessage || "상담 문의",
      contact,
      message: trimmedMessage || null,
      ad_channel: null,
      service_type: null,
      privacy_agreed: true,
      page_source: resolvedPageSource,
      referrer: referrer ?? null,
      utm_source: utm_source ?? null,
      utm_medium: utm_medium ?? null,
      utm_campaign: utm_campaign ?? null,
      status: "신규",
      admin_memo: null,
      raw_payload: rawPayload,
    };

    let { error } = await supabase
      .from(CONSULTATION_LEADS_TABLE)
      .insert(insertPayload);

    if (error && isMissingStoreNameColumnError(error)) {
      console.warn(
        "consultation_leads.store_name column is missing. Retrying insert without store_name. Apply supabase/migrations/002_consultation_leads_store_name.sql",
      );
      const { store_name: _omitStoreName, ...payloadWithoutStoreName } =
        insertPayload;
      ({ error } = await supabase
        .from(CONSULTATION_LEADS_TABLE)
        .insert(payloadWithoutStoreName));
    }

    if (error) {
      console.error("Failed to insert consultation lead:", error);
      return NextResponse.json(
        { success: false, error: "상담 신청 저장에 실패했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error in /api/leads:", error);
    return NextResponse.json(
      { success: false, error: "알 수 없는 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 },
  );
}
