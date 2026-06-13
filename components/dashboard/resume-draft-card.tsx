"use client";

import Link from "next/link";
import { ClipboardList, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResumeDraftCard() {
  return (
    <div className="min-w-0">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-border">
          <h2 className="text-[14px] font-semibold text-foreground uppercase tracking-wider m-0">
            Resume Your Draft
          </h2>
          <Link href="/inspection/draft/draft_001/step-3" className="text-sm font-medium text-primary hover:underline cursor-pointer min-h-auto">
            Edit Draft
          </Link>
        </div>

        <div className="px-4 md:px-5 py-5 md:py-6 space-y-5">
          {/* Draft info */}
          <div className="flex items-start gap-2 md:gap-3 mb-2">
            <div className="h-11 w-11 md:h-12 md:w-12 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
              <ClipboardList className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-base md:text-lg text-foreground">
                HVAC Unit 12 – Inspection
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Started May 20, 10:08 AM
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Admin Building – Roof
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 resume-draft-card">
            {/* Progress */}
            <div className="space-y-2 flex-1 mt-[10px]">
              <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-[50%]" />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground progress-text">
                6 of 12 fields completed
              </p>
            </div>

            {/* Resume button */}
            <Link href="/inspection/draft/draft_001/step-3" className="block">
              <Button className="w-full h-11 md:h-12 font-semibold text-sm md:text-base text-white rounded-xl cursor-pointer">
                Resume Inspection
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
