"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const PENDING = [
  {
    id: "1",
    name: "WT-02 — Wind Turbine 02",
    site: "Abu Dhabi Wind Farm",
  },
  {
    id: "2",
    name: "WS-08 — Weather Station 08",
    site: "Abu Dhabi Wind Farm",
  },
];

export function PendingInspections() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Pending Inspections Due Today
        </h2>
        <Link
          href="/inspections"
          className="text-xs font-medium text-primary hover:underline cursor-pointer"
        >
          View all
        </Link>
      </div>
      <div className="space-y-2">
        {PENDING.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2.5 p-3 lg:p-3.5 rounded-xl border border-border bg-card hover:shadow-sm hover:border-primary/20 transition-all cursor-pointer"
          >
            <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-success-50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4 lg:h-5 lg:w-5 text-success-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm font-medium text-foreground truncate">
                {item.name}
              </p>
              <p className="text-[10px] lg:text-xs text-muted-foreground truncate">
                {item.site}
              </p>
            </div>
            <span className="inline-flex items-center rounded-md bg-warning-50 border border-warning-500/30 px-1.5 lg:px-2 py-0.5 text-[9px] lg:text-[10px] font-bold text-warning-700 uppercase shrink-0">
              Attention
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 lg:px-2.5 text-[10px] lg:text-xs font-medium shrink-0 cursor-pointer"
            >
              Inspect Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
