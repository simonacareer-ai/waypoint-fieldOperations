"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const INSPECTIONS_DUE = [
  {
    id: "1",
    month: "MAY",
    day: "20",
    title: "HVAC Unit 12 Inspection",
    location: "Admin Building – Roof",
    status: "OVERDUE",
    statusColor: "text-red-700 dark:text-red-400",
    statusChipBg: "bg-red-50 dark:bg-red-950/40",
    statusBorder: "border-red-200 dark:border-red-800",
    dateBg: "bg-red-500",
    href: "/inspections/hvac_012",
  },
  {
    id: "2",
    month: "MAY",
    day: "21",
    title: "Fire Extinguisher Check",
    location: "Main Office – All Floors",
    status: "DUE TODAY",
    statusColor: "text-orange-700 dark:text-orange-400",
    statusChipBg: "bg-orange-50 dark:bg-orange-950/40",
    statusBorder: "border-orange-200 dark:border-orange-800",
    dateBg: "bg-orange-500",
    href: "/inspections/fire_ext_001",
  },
  {
    id: "3",
    month: "MAY",
    day: "23",
    title: "Generator G-02 Inspection",
    location: "North Plant – Building 4",
    status: "2 DAYS",
    statusColor: "text-slate-600 dark:text-slate-400",
    statusChipBg: "bg-slate-100 dark:bg-slate-800",
    statusBorder: "border-slate-200 dark:border-slate-700",
    dateBg: "bg-slate-400 dark:bg-slate-600",
    href: "/inspections/gen_002",
  },
  {
    id: "4",
    month: "MAY",
    day: "25",
    title: "Transformer T-7 Inspection",
    location: "Substation B – Yard 3",
    status: "4 DAYS",
    statusColor: "text-slate-600 dark:text-slate-400",
    statusChipBg: "bg-slate-100 dark:bg-slate-800",
    statusBorder: "border-slate-200 dark:border-slate-700",
    dateBg: "bg-slate-400 dark:bg-slate-600",
    href: "/inspections/trn_007",
  },
  {
    id: "5",
    month: "MAY",
    day: "27",
    title: "Wind Turbine 09 Check",
    location: "Abu Dhabi Wind Cluster – Zone B",
    status: "6 DAYS",
    statusColor: "text-slate-600 dark:text-slate-400",
    statusChipBg: "bg-slate-100 dark:bg-slate-800",
    statusBorder: "border-slate-200 dark:border-slate-700",
    dateBg: "bg-slate-400 dark:bg-slate-600",
    href: "/inspections/wt_09",
  },
];

export function InspectionsDue() {
  return (
    <div className="min-w-0">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-border">
          <h2 className="text-[14px] font-semibold text-foreground uppercase tracking-wider m-0">
            Inspections Due
          </h2>
          <Link href="/inspections" className="text-sm font-medium text-primary hover:underline cursor-pointer min-h-auto">
            View all
          </Link>
        </div>

        <div className="divide-y divide-border">
          {INSPECTIONS_DUE.slice(0, 3).map((item) => (
            <Link key={item.id} href={item.href}>
              <div className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 hover:bg-muted/30 transition-colors cursor-pointer border-b border-border">
                {/* Calendar date */}
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-[6px] border border-border bg-card flex flex-col overflow-hidden gap-0 items-center">
                  <span className={`text-[9px] md:text-[10px] font-bold text-white uppercase w-full text-center py-0.5 ${item.dateBg}`}>
                    {item.month}
                  </span>
                  <span className="text-lg md:text-xl font-bold text-foreground mt-[4px]">
                    {item.day}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-semibold text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                    {item.location}
                  </p>
                </div>

                {/* Status badge */}
                <span className={`inline-flex items-center rounded-md ${item.statusChipBg} border ${item.statusBorder} px-2 md:px-2.5 py-0.5 text-[10px] md:text-[11px] font-bold ${item.statusColor} uppercase shrink-0`}>
                  {item.status}
                </span>

                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer link */}
        <div className="border-t border-border">
          <Link href="/inspections" className="flex items-center justify-center gap-1 px-4 py-3 text-xs md:text-sm font-medium text-primary hover:bg-muted/30 transition-colors cursor-pointer">
            View all inspections
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
