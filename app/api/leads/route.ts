import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  SUPABASE_URL && SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

export async function POST(request: Request) {
  try {
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
      region,
      message,
      privacy_agreed,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      referrer,
      landing_page,
    } = body ?? {};

    if (!name || !phone) {
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

    const { error } = await supabase.from("leads").insert({
      name,
      phone,
      business_type: business_type ?? null,
      region: region ?? null,
      message: message ?? null,
      privacy_agreed: true,
      utm_source: utm_source ?? null,
      utm_medium: utm_medium ?? null,
      utm_campaign: utm_campaign ?? null,
      utm_content: utm_content ?? null,
      utm_term: utm_term ?? null,
      referrer: referrer ?? null,
      landing_page: landing_page ?? null,
      status: "new",
    });

    if (error) {
      console.error("Failed to insert lead:", error);
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

