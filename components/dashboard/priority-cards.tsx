"use client";

import Link from "next/link";
import { AlertTriangle, ClipboardList, Wrench, CheckCircle2, ChevronRight } from "lucide-react";
import { getInspectionCounts, getInstallationCounts } from "@/lib/seed-data";

const counts = getInspectionCounts();
const instCounts = getInstallationCounts();

const PRIORITIES = [
  {
    value: String(counts.critical),
    label: "High Priority",
    description: "Require immediate action",
    icon: AlertTriangle,
    iconBg: "bg-red-100 dark:bg-red-950/40",
    iconColor: "text-red-600 dark:text-red-400",
    valueColor: "text-red-600",
    linkText: "View all",
    href: "/inspections?status=critical",
  },
  {
    value: String(counts.attention),
    label: "Due This Week",
    description: "Inspections & work orders",
    icon: ClipboardList,
    iconBg: "bg-orange-100 dark:bg-orange-950/40",
    iconColor: "text-orange-600 dark:text-orange-400",
    valueColor: "text-orange-600",
    linkText: "View schedule",
    href: "/inspections?status=attention",
  },
  {
    value: String(counts.ok),
    label: "In Progress",
    description: "Active work",
    icon: Wrench,
    iconBg: "bg-blue-100 dark:bg-blue-950/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    valueColor: "text-blue-800 dark:text-blue-300",
    linkText: "View all",
    href: "/inspections?status=ok",
  },
  {
    value: `${Math.round(((instCounts.ok + instCounts.attention) / instCounts.total) * 100)}%`,
    label: "System Health",
    description: "All systems operational",
    icon: CheckCircle2,
    iconBg: "bg-green-100 dark:bg-green-950/40",
    iconColor: "text-green-600 dark:text-green-400",
    valueColor: "text-green-600",
    linkText: "View status",
    href: "/installations",
  },
];

export function PriorityCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {PRIORITIES.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-lg border border-border bg-card p-3 sm:p-3 md:p-4 md:pb-3.5 flex flex-col gap-3 hover:shadow-md transition-all cursor-pointer priority-cards"
          >
            <div className="flex items-start gap-2.5">
              <div className={`h-11 w-11 md:h-14 md:w-14 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 md:h-6 md:w-6 ${item.iconColor}`} />
              </div>
              <div className="flex gap-0.5 flex-col">
                <span className={`text-2xl md:text-3xl lg:text-4xl font-bold ${item.valueColor} block`}>
                    {item.value}
                  </span>
                  <p className="text-sm md:text-[14px] font-semibold text-foreground mt-0.5 small-card-title">
                    {item.label}
                  </p>
              </div>
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5 mb-[-5px] description-text">
                {item.description}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-xs md:text-sm font-medium ${item.valueColor} mt-auto`}
            >
              {item.linkText}
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
