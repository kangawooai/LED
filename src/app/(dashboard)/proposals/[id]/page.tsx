"use client";

import ProposalClient from "@/app/(standalone)/proposal/[id]/_client";
import { useIsAdmin } from "@/lib/hooks/useIsAdmin";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface EditHistoryEntry {
  id: string;
  lead_id: string;
  field: string;
  field_label: string;
  old_value: string;
  new_value: string;
  created_at: string;
}

async function fetchEditHistory(leadId: string): Promise<EditHistoryEntry[]> {
  const res = await fetch(`/api/proposal/history?lead_id=${leadId}`);
  if (!res.ok) return [];
  return res.json();
}

export default function DashboardProposalDetailPage() {
  const params = useParams();
  const leadId = params.id as string;

  const isAdmin = useIsAdmin();

  const { data: editHistory } = useQuery({
    queryKey: ["editHistory", leadId],
    queryFn: () => fetchEditHistory(leadId),
    enabled: !!leadId && isAdmin,
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/proposals"
          className="text-foreground/40 hover:text-foreground text-sm transition-colors"
        >
          &larr; Back to Proposals
        </Link>
      </div>
      <ProposalClient leadId={leadId} />

      {/* Edit History — admin only */}
      {isAdmin && <div className="max-w-2xl mx-auto px-0 sm:px-6 mt-8">
        <h2 className="text-lg font-semibold tracking-tight mb-4">Edit History</h2>
        <div className="bg-white/5 border border-white/10 rounded-md p-5">
          {!editHistory || editHistory.length === 0 ? (
            <p className="text-foreground/40 text-sm text-center py-4">
              No changes recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {editHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0"
                >
                  <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{entry.field_label}</span>
                      {" changed"}
                      {entry.old_value && entry.old_value !== "null" && entry.old_value !== "" && (
                        <>
                          {" from "}
                          <span className="text-foreground/50 line-through">{entry.old_value}</span>
                        </>
                      )}
                      {" to "}
                      <span className="text-foreground font-medium">{entry.new_value}</span>
                    </p>
                    <p className="text-[11px] text-foreground/30 mt-0.5">
                      {new Date(entry.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>}
    </div>
  );
}
