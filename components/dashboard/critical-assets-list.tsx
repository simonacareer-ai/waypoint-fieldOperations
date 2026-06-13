"use client";

import Link from "next/link";
import { AlertOctagon, AlertTriangle, ChevronRight, MapPin } from "lucide-react";
import { getCriticalAssets } from "@/lib/seed-data";

const statusStyles = {
  critical: {
    status: "ALARM",
    statusColor: "text-red-700 dark:text-red-400",
    statusBg: "bg-red-50 dark:bg-red-950/40",
    statusBorder: "border-red-200 dark:border-red-800",
    borderColor: "border-l-red-500",
    icon: AlertOctagon,
    iconBg: "bg-red-100 dark:bg-red-950/40",
    iconColor: "text-red-600 dark:text-red-400",
  },
  attention: {
    status: "WARNING",
    statusColor: "text-orange-700 dark:text-orange-400",
    statusBg: "bg-orange-50 dark:bg-orange-950/40",
    statusBorder: "border-orange-200 dark:border-orange-800",
    borderColor: "border-l-orange-500",
    icon: AlertTriangle,
    iconBg: "bg-orange-100 dark:bg-orange-950/40",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
};

const criticalAssets = getCriticalAssets().slice(0, 3);

export function CriticalAssetsList() {
  return (
    <div className="min-w-0">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-[14px] font-semibold text-foreground uppercase tracking-wider m-0">
            Critical Assets
          </h2>
          <Link href="/installations" className="text-sm font-medium text-primary hover:underline cursor-pointer min-h-auto">
            View all
          </Link>
        </div>

        <div className="divide-y divide-border">
          {criticalAssets.map((asset) => {
            const style = statusStyles[asset.status as keyof typeof statusStyles];
            if (!style) return null;
            const Icon = style.icon;
            const metricValue = asset.batteryPct < 30 ? `${asset.batteryPct}%` : asset.temperatureC > 50 ? "High" : `${asset.batteryPct}%`;
            const metricLabel = asset.batteryPct < 30 ? "Battery Level" : asset.temperatureC > 50 ? "Temperature" : "Battery Level";
            const metricPercent = asset.batteryPct < 30 ? asset.batteryPct : asset.temperatureC > 50 ? Math.min(asset.temperatureC, 100) : asset.batteryPct;

            return (
              <Link key={asset.id} href={`/installations/${asset.id}`}>
                <div className={`px-4 md:px-5 py-3 md:py-4 border-b border-border ${style.borderColor} hover:bg-muted/30 transition-colors cursor-pointer`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 md:h-10 md:w-10 rounded-full ${style.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`h-4 w-4 md:h-5 md:w-5 ${style.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-sm md:text-base text-foreground block truncate">
                        {asset.name}
                      </span>
                      <span className="text-xs text-muted-foreground block">{asset.assetId}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{asset.siteName} – {asset.location}</span>
                      </span>
                    </div>

                    {/* Metric - inline on wide screens */}
                    <div className="critical-asset-metric-inline shrink-0 min-w-[100px]">
                      <span className="text-xs text-muted-foreground block">{metricLabel}</span>
                      <p className="text-sm font-bold text-foreground">{metricValue}</p>
                      <div className="h-1 w-12 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${metricPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Last inspected - inline on wide screens */}
                    <div className="critical-asset-metric-inline shrink-0 min-w-[100px]">
                      <span className="text-xs text-muted-foreground block">Last inspected</span>
                      <p className="text-sm font-semibold text-foreground">{asset.lastInspectedAt}</p>
                    </div>

                    <span className={`inline-flex items-center rounded-md ${style.statusBg} border ${style.statusBorder} px-2 md:px-2.5 py-0.5 text-[10px] md:text-[11px] font-bold ${style.statusColor} uppercase shrink-0`}>
                      {style.status}
                    </span>

                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </div>

                  {/* Second row: 1024px–1300px only */}
                  <div className="critical-asset-metric-row hidden items-center gap-5 mt-2 ml-12 md:ml-[52px]">
                    <div>
                      <span className="text-[11px] text-muted-foreground block">{metricLabel}</span>
                      <p className="text-sm font-bold text-foreground">{metricValue}</p>
                      <div className="h-1 w-10 bg-slate-200 dark:bg-slate-700 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${metricPercent}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground block">Last inspected</span>
                      <p className="text-sm font-semibold text-foreground">{asset.lastInspectedAt}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
