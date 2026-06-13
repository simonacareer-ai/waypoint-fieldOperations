"use client";

import { Cloud, CloudOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { useSyncStore } from "@/store/sync-store";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

export function SyncChip() {
  const { overallStatus, pendingCount, failedCount } = useSyncStore();
  const { networkOnline } = useAppStore();

  if (!networkOnline) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
        <CloudOff className="h-3.5 w-3.5" />
        <span>Offline</span>
      </div>
    );
  }

  if (failedCount > 0) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-critical-50 px-3 py-1.5 text-xs font-medium text-critical-700">
        <RefreshCw className="h-3.5 w-3.5" />
        <span>{failedCount} failed</span>
      </div>
    );
  }

  if (pendingCount > 0 || overallStatus === "syncing") {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-info-50 px-3 py-1.5 text-xs font-medium text-info-700">
        <Cloud className={cn("h-3.5 w-3.5", overallStatus === "syncing" && "animate-pulse")} />
        <span>{pendingCount > 0 ? `${pendingCount} pending` : "Syncing..."}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-success-50 px-3 py-1.5 text-xs font-medium text-success-700">
      <CheckCircle2 className="h-3.5 w-3.5" />
      <span>Synced</span>
    </div>
  );
}
