"use client";

import Link from "next/link";
import { CheckCircle2, FileEdit, Camera, WifiOff } from "lucide-react";

const ACTIVITIES = [
  {
    id: "1",
    icon: CheckCircle2,
    iconBg: "bg-green-100 dark:bg-green-950/40",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Work order WO-1247 completed",
    description: "Pump P-16 Repair",
    time: "10:15 AM",
    day: "Today",
  },
  {
    id: "2",
    icon: FileEdit,
    iconBg: "bg-green-100 dark:bg-green-950/40",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Inspection draft saved",
    description: "HVAC Unit 12 – Inspection",
    time: "10:08 AM",
    day: "Today",
  },
  {
    id: "3",
    icon: Camera,
    iconBg: "bg-blue-100 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "Photo added to WO-1243",
    description: "Electrical Panel Inspection",
    time: "9:42 AM",
    day: "Today",
  },
  {
    id: "4",
    icon: WifiOff,
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-500 dark:text-slate-400",
    title: "Working offline",
    description: "All changes saved locally",
    time: "9:30 AM",
    day: "Today",
  },
];

export function RecentActivity() {
  return (
    <div className="min-w-0">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-border">
          <h2 className="text-[14px] font-semibold text-foreground uppercase tracking-wider m-0">
            Recent Activity
          </h2>
          <Link href="/history" className="text-sm font-medium text-primary hover:underline cursor-pointer min-h-auto">
            View all
          </Link>
        </div>

        <div className="divide-y divide-border">
          {ACTIVITIES.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 px-4 md:px-5 py-3 md:py-4 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className={`h-8 w-8 md:h-9 md:w-9 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-foreground leading-tight truncate">
                    {activity.title}
                  </p>
                  <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 truncate">
                    {activity.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] md:text-xs font-medium text-muted-foreground">
                    {activity.time}
                  </p>
                  <p className="text-[10px] md:text-[11px] text-muted-foreground">
                    {activity.day}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
