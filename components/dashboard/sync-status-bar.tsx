"use client";

import { CheckCircle2, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInspectionCounts } from "@/hooks/use-dexie-data";

export function SyncStatusBar() {
  const { counts } = useInspectionCounts();
  return (
    <div className="rounded-lg border border-border bg-card px-4 md:px-4 py-2 md:py-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
        {/* Saved locally */}
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 shrink-0" />
          <div>
            <p className="text-xs md:text-sm font-bold text-foreground">
              All changes saved locally
            </p>
            <p className="text-[11px] md:text-xs text-muted-foreground">
              Last saved: 10:21 AM
            </p>
          </div>
        </div>

        {/* Sync pending */}
        <div className="flex items-center gap-2.5">
          <CloudUpload className="h-8 w-8 text-slate-500 dark:text-slate-400 shrink-0" />
          <div>
            <p className="text-xs md:text-sm font-bold text-foreground">
              Sync pending
            </p>
            <p className="text-[11px] md:text-xs text-muted-foreground">
              {counts.pendingSync} items waiting to sync
            </p>
          </div>
        </div>

        {/* Sync button */}
        <div className="sm:ml-auto">
          <Button
            variant="outline"
            className="h-9 md:h-10 px-4 md:px-5 text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2 cursor-pointer border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto"
          >
            <CloudUpload className="!h-6 !w-6" />
            Sync Now
          </Button>
        </div>
      </div>
    </div>
  );
}
