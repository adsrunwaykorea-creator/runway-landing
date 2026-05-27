import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/service";
import type { LeadStatus } from "@/lib/types/lead";

export async function GET(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Supabase is not configured" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const channel = searchParams.get("channel");
  const q = searchParams.get("q")?.trim();

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status as LeadStatus);
  }

  if (channel && channel !== "all") {
    query = query.eq("utm_source", channel);
  }

  if (q) {
    const pattern = `%${q}%`;
    query = query.or(
      `name.ilike.${pattern},phone.ilike.${pattern},business_type.ilike.${pattern},region.ilike.${pattern}`,
    );
  }

  const [{ data, error }, { data: channelRows }] = await Promise.all([
    query,
    supabase.from("leads").select("utm_source").not("utm_source", "is", null),
  ]);

  if (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json(
      { success: false, error: "신청자 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }

  const channels = [
    ...new Set(
      (channelRows ?? [])
        .map((row) => row.utm_source as string)
        .filter(Boolean),
    ),
  ].sort();

  return NextResponse.json({
    success: true,
    leads: data ?? [],
    channels,
  });
}
