"use client";

import { Cloud, CheckCircle2 } from "lucide-react";
import { getInspectionCounts } from "@/lib/seed-data";

export function MobileSyncStatus() {
  return (
    <div className="md:hidden flex items-center gap-3 p-3 rounded-xl border border-border bg-card cursor-pointer">
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-4 w-4 text-success-500" />
        <span className="text-xs font-medium text-foreground">Saved Locally</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-1.5">
        <Cloud className="h-4 w-4 text-info-500" />
        <span className="text-xs font-medium text-foreground">{getInspectionCounts().pendingSync} Pending</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <span className="text-[11px] text-muted-foreground">Last sync: 2h ago</span>
    </div>
  );
}
