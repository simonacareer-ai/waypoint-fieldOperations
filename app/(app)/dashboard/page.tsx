"use client";

import { PriorityCards } from "@/components/dashboard/priority-cards";
import { CriticalAssetsList } from "@/components/dashboard/critical-assets-list";
import { ResumeDraftCard } from "@/components/dashboard/resume-draft-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { InspectionsDue } from "@/components/dashboard/inspections-due";
import { SyncStatusBar } from "@/components/dashboard/sync-status-bar";
import { MobileSyncStatus } from "@/components/dashboard/mobile-sync-status";

export default function DashboardPage() {
  return (
    <div className="space-y-5 xl:space-y-6">
      {/* Mobile greeting */}
      <div className="md:hidden">
        <h1 className="text-xl font-bold text-foreground">Good morning, Simona</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Abu Dhabi Wind Farm</p>
      </div>

      <MobileSyncStatus />

      {/* Priority Cards - 4 cards row */}
      <PriorityCards />

      {/* Main content: 2-column layout on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-6">
        {/* Left column */}
        <div className="space-y-5 xl:space-y-6 min-w-0">
          <CriticalAssetsList />
          <RecentActivity />
        </div>

        {/* Right column */}
        <div className="space-y-5 xl:space-y-6 min-w-0">
          <ResumeDraftCard />
          <InspectionsDue />
        </div>
      </div>

      {/* Bottom sync status bar */}
      <SyncStatusBar />
    </div>
  );
}
