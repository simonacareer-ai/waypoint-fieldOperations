"use client";

import Link from "next/link";
import { CheckCircle2, ArrowDown, ChevronRight, Cloud } from "lucide-react";

const INSPECTIONS = [
  {
    id: "insp_001",
    installation: "WT-03 — Wind Turbine 03",
    date: "Jan 12, 2026 10:24 AM",
    inspector: "Simona D.",
    status: "critical" as const,
    syncState: "pending" as const,
  },
  {
    id: "insp_002",
    installation: "WS-11 — Weather Station 11",
    date: "Jan 12, 2026 9:15 AM",
    inspector: "Simona D.",
    status: "ok" as const,
    syncState: "synced" as const,
  },
  {
    id: "insp_003",
    installation: "RB-07 — Autonomous Robot 07",
    date: "Jan 11, 2026 3:30 PM",
    inspector: "Ahmed K.",
    status: "attention" as const,
    syncState: "synced" as const,
  },
  {
    id: "insp_004",
    installation: "WT-01 — Wind Turbine 01",
    date: "Jan 11, 2026 11:20 AM",
    inspector: "Simona D.",
    status: "ok" as const,
    syncState: "synced" as const,
  },
  {
    id: "insp_005",
    installation: "WS-08 — Weather Station 08",
    date: "Jan 11, 2026 9:02 AM",
    inspector: "Michael R.",
    status: "attention" as const,
    syncState: "pending" as const,
  },
];

const statusBadge = {
  critical: { label: "CRITICAL", className: "bg-critical-50 text-critical-700 border-critical-500/30" },
  attention: { label: "ATTENTION", className: "bg-warning-50 text-warning-700 border-warning-500/30" },
  ok: { label: "OK", className: "bg-success-50 text-success-700 border-success-500/30" },
  offline: { label: "OFFLINE", className: "bg-neutral-100 text-neutral-700 border-neutral-400/30" },
};

const syncConfig = {
  pending: { label: "Pending", className: "text-warning-700", icon: Cloud, iconClass: "text-warning-500" },
  synced: { label: "Synced", className: "text-success-700", icon: CheckCircle2, iconClass: "text-success-500" },
  failed: { label: "Failed", className: "text-critical-700", icon: Cloud, iconClass: "text-critical-500" },
  "local-only": { label: "Local", className: "text-neutral-700", icon: Cloud, iconClass: "text-neutral-400" },
  syncing: { label: "Syncing", className: "text-info-700", icon: Cloud, iconClass: "text-info-500" },
  conflict: { label: "Conflict", className: "text-warning-700", icon: Cloud, iconClass: "text-warning-500" },
};

export function RecentInspectionsTable() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Recent Inspections
        </h2>
        <Link
          href="/inspections"
          className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline cursor-pointer"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] font-semibold text-muted-foreground px-3 xl:px-4 py-3">
                  Installation
                </th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground px-3 xl:px-4 py-3">
                  <span className="inline-flex items-center gap-1 cursor-pointer">
                    Date <ArrowDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground px-3 xl:px-4 py-3">
                  Inspector
                </th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground px-3 xl:px-4 py-3">
                  Status
                </th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground px-3 xl:px-4 py-3">
                  Sync
                </th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {INSPECTIONS.map((insp) => {
                const status = statusBadge[insp.status];
                const sync = syncConfig[insp.syncState];
                const SyncIcon = sync.icon;
                return (
                  <tr
                    key={insp.id}
                    className="border-b border-border last:border-0 hover:bg-accent/30 cursor-pointer transition-colors"
                  >
                    <td className="px-3 xl:px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shrink-0">
                          <span className="text-[7px] font-bold text-muted-foreground">
                            {insp.installation.split(" — ")[0]}
                          </span>
                        </div>
                        <span className="text-xs xl:text-sm font-medium text-foreground whitespace-nowrap">
                          {insp.installation}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 xl:px-4 py-3">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{insp.date}</span>
                    </td>
                    <td className="px-3 xl:px-4 py-3">
                      <span className="text-xs text-foreground whitespace-nowrap">{insp.inspector}</span>
                    </td>
                    <td className="px-3 xl:px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] xl:text-[10px] font-bold uppercase ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-3 xl:px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${sync.className}`}>
                        <SyncIcon className={`h-3.5 w-3.5 ${sync.iconClass}`} />
                        {sync.label}
                      </span>
                    </td>
                    <td className="pr-3 py-3">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-3 xl:px-4 py-2.5 border-t border-border bg-secondary/20">
          <p className="text-[11px] text-muted-foreground">
            Showing 1 to 5 of 25 inspections
          </p>
        </div>
      </div>
    </div>
  );
}
