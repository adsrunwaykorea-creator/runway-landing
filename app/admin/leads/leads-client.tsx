"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LEAD_STATUSES,
  STATUS_LABELS,
  type Lead,
  type LeadStatus,
} from "@/lib/types/lead";

const STATUS_BADGE: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-green-100 text-green-800",
  scheduled: "bg-purple-100 text-purple-800",
  closed: "bg-emerald-800 text-white",
  lost: "bg-gray-200 text-gray-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export default function LeadsClient() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMemo, setEditMemo] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (channelFilter !== "all") params.set("channel", channelFilter);
    if (search.trim()) params.set("q", search.trim());

    try {
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const json = (await res.json()) as {
        success: boolean;
        leads?: Lead[];
        channels?: string[];
        error?: string;
      };

      if (!res.ok || !json.success) {
        setError(json.error || "목록을 불러오지 못했습니다.");
        return;
      }

      setLeads(json.leads ?? []);
      if (json.channels) setChannels(json.channels);
    } catch {
      setError("목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, channelFilter, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = (await res.json()) as {
        success: boolean;
        lead?: Lead;
        error?: string;
      };

      if (!res.ok || !json.success || !json.lead) {
        alert(json.error || "상태 변경에 실패했습니다.");
        return;
      }

      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: json.lead!.status } : l)),
      );
    } catch {
      alert("상태 변경에 실패했습니다.");
    } finally {
      setSavingId(null);
    }
  };

  const openMemoEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setEditMemo(lead.memo ?? "");
  };

  const saveMemo = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memo: editMemo }),
      });
      const json = (await res.json()) as {
        success: boolean;
        lead?: Lead;
        error?: string;
      };

      if (!res.ok || !json.success || !json.lead) {
        alert(json.error || "메모 저장에 실패했습니다.");
        return;
      }

      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, memo: json.lead!.memo } : l)),
      );
      setEditingId(null);
    } catch {
      alert("메모 저장에 실패했습니다.");
    } finally {
      setSavingId(null);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-[#e5e7eb] bg-navy px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-sm text-orange">런웨이 관리자</p>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">
              상담 신청자 목록
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-[10px] border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            로그아웃
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[14px] bg-white p-4 shadow-sm sm:p-5">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="search"
                className="mb-1 block text-sm font-medium text-[#364153]"
              >
                검색
              </label>
              <input
                id="search"
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="이름, 전화번호, 업종, 지역"
                className="w-full rounded-[10px] border border-[#d1d5dc] px-4 py-2.5 text-sm outline-none focus:border-orange focus:ring-2 focus:ring-orange/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-[10px] bg-orange px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              검색
            </button>
          </form>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="status-filter"
                className="mb-1 block text-sm font-medium text-[#364153]"
              >
                상태
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-[10px] border border-[#d1d5dc] px-3 py-2.5 text-sm outline-none focus:border-orange"
              >
                <option value="all">전체</option>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="channel-filter"
                className="mb-1 block text-sm font-medium text-[#364153]"
              >
                유입 채널
              </label>
              <select
                id="channel-filter"
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="w-full rounded-[10px] border border-[#d1d5dc] px-3 py-2.5 text-sm outline-none focus:border-orange"
              >
                <option value="all">전체</option>
                {channels.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="text-center text-sm text-gray-muted">불러오는 중...</p>
        ) : leads.length === 0 ? (
          <p className="rounded-[14px] bg-white p-8 text-center text-sm text-gray-muted shadow-sm">
            조건에 맞는 신청자가 없습니다.
          </p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto rounded-[14px] bg-white shadow-sm lg:block">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-gray-50 text-[#364153]">
                    <th className="px-4 py-3 font-medium">신청일</th>
                    <th className="px-4 py-3 font-medium">이름</th>
                    <th className="px-4 py-3 font-medium">연락처</th>
                    <th className="px-4 py-3 font-medium">업종</th>
                    <th className="px-4 py-3 font-medium">매장 지역</th>
                    <th className="px-4 py-3 font-medium">유입 채널</th>
                    <th className="px-4 py-3 font-medium">캠페인</th>
                    <th className="px-4 py-3 font-medium">소재 구분</th>
                    <th className="px-4 py-3 font-medium">문의 내용</th>
                    <th className="px-4 py-3 font-medium">상태</th>
                    <th className="px-4 py-3 font-medium">메모</th>
                    <th className="px-4 py-3 font-medium">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-[#f3f4f6] align-top"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-gray-muted">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3 font-medium">{lead.name}</td>
                      <td className="px-4 py-3">
                        <a
                          href={phoneHref(lead.phone)}
                          className="font-medium text-orange hover:underline"
                        >
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3">{lead.business_type || "-"}</td>
                      <td className="px-4 py-3">{lead.region || "-"}</td>
                      <td className="px-4 py-3">{lead.utm_source || "-"}</td>
                      <td className="px-4 py-3">{lead.utm_campaign || "-"}</td>
                      <td className="px-4 py-3">{lead.utm_content || "-"}</td>
                      <td className="max-w-[200px] px-4 py-3">
                        <p className="line-clamp-3 whitespace-pre-wrap">
                          {lead.message || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          disabled={savingId === lead.id}
                          onChange={(e) =>
                            handleStatusChange(
                              lead.id,
                              e.target.value as LeadStatus,
                            )
                          }
                          className={`rounded-full border-0 px-2 py-1 text-xs font-medium ${STATUS_BADGE[lead.status]}`}
                        >
                          {LEAD_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="max-w-[160px] px-4 py-3">
                        {editingId === lead.id ? (
                          <textarea
                            value={editMemo}
                            onChange={(e) => setEditMemo(e.target.value)}
                            rows={2}
                            className="w-full rounded border border-[#d1d5dc] p-2 text-xs"
                          />
                        ) : (
                          <p className="line-clamp-2 text-xs text-gray-muted">
                            {lead.memo || "-"}
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {editingId === lead.id ? (
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              disabled={savingId === lead.id}
                              onClick={() => saveMemo(lead.id)}
                              className="rounded bg-orange px-2 py-1 text-xs text-white"
                            >
                              저장
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded border px-2 py-1 text-xs"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openMemoEdit(lead)}
                            className="rounded border border-[#d1d5dc] px-2 py-1 text-xs hover:bg-gray-50"
                          >
                            메모
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 lg:hidden">
              {leads.map((lead) => (
                <article
                  key={lead.id}
                  className="rounded-[14px] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-navy">{lead.name}</p>
                      <p className="mt-1 text-xs text-gray-muted">
                        {formatDate(lead.created_at)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${STATUS_BADGE[lead.status]}`}
                    >
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </div>

                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-muted">연락처</dt>
                      <dd>
                        <a
                          href={phoneHref(lead.phone)}
                          className="font-medium text-orange"
                        >
                          {lead.phone}
                        </a>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-muted">업종</dt>
                      <dd>{lead.business_type || "-"}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-muted">지역</dt>
                      <dd>{lead.region || "-"}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-muted">유입</dt>
                      <dd>{lead.utm_source || "-"}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-muted">캠페인</dt>
                      <dd>{lead.utm_campaign || "-"}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-gray-muted">소재</dt>
                      <dd>{lead.utm_content || "-"}</dd>
                    </div>
                  </dl>

                  {lead.message && (
                    <p className="mt-3 rounded-[10px] bg-gray-50 p-3 text-sm text-gray-muted">
                      {lead.message}
                    </p>
                  )}

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-medium text-[#364153]">
                      상태
                    </label>
                    <select
                      value={lead.status}
                      disabled={savingId === lead.id}
                      onChange={(e) =>
                        handleStatusChange(
                          lead.id,
                          e.target.value as LeadStatus,
                        )
                      }
                      className="w-full rounded-[10px] border border-[#d1d5dc] px-3 py-2 text-sm"
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-[#364153]">
                      메모
                    </label>
                    {editingId === lead.id ? (
                      <>
                        <textarea
                          value={editMemo}
                          onChange={(e) => setEditMemo(e.target.value)}
                          rows={3}
                          className="w-full rounded-[10px] border border-[#d1d5dc] p-3 text-sm"
                        />
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            disabled={savingId === lead.id}
                            onClick={() => saveMemo(lead.id)}
                            className="flex-1 rounded-[10px] bg-orange py-2 text-sm text-white"
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="flex-1 rounded-[10px] border py-2 text-sm"
                          >
                            취소
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openMemoEdit(lead)}
                        className="w-full rounded-[10px] border border-[#d1d5dc] py-2 text-sm text-left text-gray-muted"
                      >
                        {lead.memo || "메모 입력"}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <p className="mt-4 text-center text-xs text-gray-light">
          총 {leads.length}건
        </p>
      </main>
    </div>
  );
}
