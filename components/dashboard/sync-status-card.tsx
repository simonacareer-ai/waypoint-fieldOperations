"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, CloudUpload, Clock, AlertTriangle, RefreshCw, GitMerge, Wifi, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getInspectionCounts } from "@/lib/seed-data";

const counts = getInspectionCounts();

export function SyncStatusCard() {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 3000);
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header with connection indicator */}
      <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[14px] font-semibold text-foreground uppercase tracking-wider m-0">
            Sync Status
          </h2>
          <span className="flex items-center gap-1 text-[10px] font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
            <Wifi className="h-2.5 w-2.5" /> Online
          </span>
        </div>
        <Link href="/offline-sync" className="text-[14px] font-medium text-primary hover:underline cursor-pointer min-h-auto">
          View all
        </Link>
      </div>

      {/* Compact stats */}
      <div className="grid grid-cols-3 border-b border-border">
        <div className="px-3 py-2.5 text-center border-r border-border">
          <p className="text-xl font-bold text-green-600 dark:text-green-400 leading-tight">{counts.pendingSync}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Pending</p>
        </div>
        <div className="px-3 py-2.5 text-center border-r border-border">
          <p className="text-xl font-bold text-red-600 dark:text-red-400 leading-tight">2</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Failed</p>
        </div>
        <div className="px-3 py-2.5 text-center">
          <p className="text-xl font-bold text-foreground leading-tight">1</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Conflict</p>
        </div>
      </div>

      {/* Conflict + Failed — actionable items */}
      <div className="divide-y divide-border">
        <Link href="/offline-sync#conflicts" className="flex items-center gap-3 px-4 md:px-5 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer min-h-[64px]">
          <div className="h-7 w-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
            <GitMerge className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">WT-03 — Sync conflict</p>
            <p className="text-xs text-muted-foreground">2 fields differ · Tap to resolve</p>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </Link>

        <Link href="/offline-sync#failed" className="flex items-center gap-3 px-4 md:px-5 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer min-h-[64px]">
          <div className="h-7 w-7 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">2 inspections failed</p>
            <p className="text-xs text-muted-foreground">Network timeout · Retry available</p>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </Link>
      </div>

      {/* Footer: last sync + action */}
      <div className="flex items-center justify-between px-4 md:px-5 py-2.5 border-t border-border bg-muted/20">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <p className="text-[14px] text-muted-foreground">Last sync 2h ago</p>
          <CheckCircle2 className="h-5 w-5 text-green-500 ml-1" />
        </div>
        <Button
          size="sm"
          onClick={handleSync}
          disabled={syncing}
          className="h-7 px-3 gap-2 font-semibold cursor-pointer"
        >
          <CloudUpload className={`!h-5 !w-5 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync Now"}
        </Button>
      </div>
    </div>
  );
}
