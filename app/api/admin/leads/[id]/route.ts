import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth/admin";
import {
  CONSULTATION_LEADS_TABLE,
  mapConsultationLead,
  type ConsultationLeadRow,
} from "@/lib/consultation-leads";
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
  const { status, memo, admin_memo } = body ?? {};

  const updates: { status?: LeadStatus; admin_memo?: string | null } = {};

  if (status !== undefined) {
    if (!LEAD_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 상태입니다." },
        { status: 400 },
      );
    }
    updates.status = status;
  }

  const memoValue = admin_memo !== undefined ? admin_memo : memo;
  if (memoValue !== undefined) {
    updates.admin_memo = memoValue === "" ? null : String(memoValue);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { success: false, error: "변경할 항목이 없습니다." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from(CONSULTATION_LEADS_TABLE)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update consultation lead:", error);
    return NextResponse.json(
      { success: false, error: "저장에 실패했습니다." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    lead: mapConsultationLead(data as ConsultationLeadRow),
  });
}
