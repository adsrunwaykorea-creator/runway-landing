import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/service";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types/lead";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
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

  const { id } = await context.params;
  const body = await request.json();
  const { status, memo } = body ?? {};

  const updates: { status?: LeadStatus; memo?: string | null } = {};

  if (status !== undefined) {
    if (!LEAD_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 상태입니다." },
        { status: 400 },
      );
    }
    updates.status = status;
  }

  if (memo !== undefined) {
    updates.memo = memo === "" ? null : String(memo);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { success: false, error: "변경할 항목이 없습니다." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update lead:", error);
    return NextResponse.json(
      { success: false, error: "저장에 실패했습니다." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, lead: data });
}
