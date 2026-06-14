"use client";

import { PriorityCards } from "@/components/dashboard/priority-cards";
import { CriticalAssetsList } from "@/components/dashboard/critical-assets-list";
import { ResumeDraftCard } from "@/components/dashboard/resume-draft-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { InspectionsDue } from "@/components/dashboard/inspections-due";
import { SyncStatusCard } from "@/components/dashboard/sync-status-card";
import { SyncStatusBar } from "@/components/dashboard/sync-status-bar";
import { MobileSyncStatus } from "@/components/dashboard/mobile-sync-status";

export default function DashboardPage() {
  return (
    <div className="space-y-4 xl:space-y-6">
      {/* Mobile greeting */}
      <div className="md:hidden">
        <h1 className="text-xl font-bold text-foreground">Good morning, Simona</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Abu Dhabi Wind Farm</p>
      </div>

      <MobileSyncStatus />

      {/* Priority Cards - 4 cards row */}
      <PriorityCards />

      {/* Main content: 2-column layout on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xl:gap-6">
        {/* Left column */}
        <div className="space-y-3 xl:space-y-6 min-w-0 order-1">
          <CriticalAssetsList />
          <div className="hidden lg:block">
            <SyncStatusCard />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-3 xl:space-y-6 min-w-0 order-2">
          <ResumeDraftCard />
          <div className="hidden lg:block">
            <InspectionsDue />
          </div>
        </div>

        {/* Mobile-only: Sync after Resume */}
        <div className="lg:hidden order-3">
          <SyncStatusCard />
        </div>

        {/* Mobile-only: Inspections Due after Sync */}
        <div className="lg:hidden order-4">
          <InspectionsDue />
        </div>
      </div>

      {/* Recent Activity - full width */}
      <RecentActivity />

      {/* Bottom sync status bar */}
      <SyncStatusBar />
    </div>
  );
}
