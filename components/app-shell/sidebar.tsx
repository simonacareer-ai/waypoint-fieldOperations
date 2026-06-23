"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  History,
  MapPin,
  Settings,
  CheckCircle2,
  Cloud,
  Clock,
  HardDrive,
  ChevronRight,
  Plus,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useInspectionCounts } from "@/hooks/use-dexie-data";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inspections", href: "/inspections", icon: ClipboardList },
  { label: "New Inspection", href: "/inspection/new", icon: Plus },
  { label: "History", href: "/history", icon: History },
  { label: "Installations", href: "/installations", icon: MapPin },
  { label: "Sync", href: "/offline-sync", icon: RefreshCw },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { counts } = useInspectionCounts();
  const [syncSimulation, setSyncSimulation] = useState(true);

  return (
    <aside
      aria-label="Main navigation"
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card flex flex-col transition-all duration-300",
        "hidden md:flex",
        "md:w-[88px] lg:w-[180px] xl:w-[220px]"
      )}
    >
      {/* Logo */}
      <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-2.5 px-2 lg:px-4 xl:px-5 py-4 lg:py-0 lg:h-16 shrink-0">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-bold text-sm">W</span>
        </div>
        <div className="text-center lg:text-left">
          <p className="text-[10px] lg:text-sm font-bold text-foreground leading-tight">WAYPOINT</p>
          <p className="text-[8px] lg:text-[10px] text-muted-foreground leading-tight">Field Operations</p>
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Primary" className="flex-1 py-2 lg:py-3 px-2 lg:px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            (item.href === "/dashboard" && pathname === "/dashboard") ||
            (item.href === "/inspection/new" && pathname.startsWith("/inspection/")) ||
            (item.href !== "/dashboard" && item.href !== "/inspection/new" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg transition-all cursor-pointer",
                "flex-col lg:flex-row",
                "px-2 lg:px-3 py-2.5 lg:py-2.5",
                "text-center lg:text-left",
                "min-h-[48px] lg:min-h-[56px]",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-[10px] lg:text-sm font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sync Status - portrait compact */}
      <div className="hidden px-2 py-3 border-t border-border space-y-1.5 shrink-0 text-center">
        <p className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider">
          Sync Status
        </p>
        <div className="flex items-center justify-center gap-1 text-[9px] text-muted-foreground">
          <span>Last sync: 2h ago</span>
          <CheckCircle2 className="h-3 w-3 text-success-500" />
        </div>
        <div className="flex items-center justify-center gap-1">
          <Cloud className="h-3 w-3 text-info-500" />
          <span className="text-[9px] font-medium text-foreground">{counts.pendingSync} Pending Sync</span>
        </div>
        <p className="text-[9px] text-muted-foreground">Will upload when online</p>
        <div className="space-y-0.5">
          <p className="text-[9px] text-muted-foreground">Device Storage</p>
          <p className="text-[9px] font-medium text-foreground">68% used</p>
          <div className="w-full bg-border rounded-full h-1.5 mx-auto max-w-[60px]">
            <div className="bg-primary h-1.5 rounded-full w-[68%]" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <span className="text-[9px] text-muted-foreground">Sync Simulation</span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-[9px] font-medium">ON</span>
          <Switch checked={syncSimulation} onCheckedChange={setSyncSimulation} className="scale-[0.6]" />
        </div>
      </div>

      {/* Sync Status - landscape/desktop expanded */}
      <div className="hidden lg:block px-4 xl:px-5 py-3 border-t border-border space-y-2.5 shrink-0">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Local & Sync Status
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-success-500 shrink-0" />
          <div>
            <p className="text-xs font-medium text-foreground">Saved Locally</p>
            <p className="text-[10px] text-muted-foreground">All changes saved on this device</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Cloud className="h-3.5 w-3.5 text-info-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-foreground">{counts.pendingSync} Pending Sync</p>
            <p className="text-[10px] text-muted-foreground">Will upload when online</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>Last Sync: 2h ago</span>
          <CheckCircle2 className="h-3 w-3 text-success-500" />
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Device Storage: 68%</p>
            <div className="w-full bg-border rounded-full h-1.5 mt-1">
              <div className="bg-primary h-1.5 rounded-full w-[68%]" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Sync Simulation</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-foreground">ON</span>
            <Switch checked={syncSimulation} onCheckedChange={setSyncSimulation} className="scale-[0.7] cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Profile */}
      <Link
        href="/profile"
        className="flex items-center justify-center lg:justify-start gap-2 px-2 lg:px-4 xl:px-5 py-3 border-t border-border hover:bg-accent transition-colors cursor-pointer shrink-0"
      >
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <span className="text-xs font-bold text-primary">SD</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground hidden lg:block ml-auto" />
      </Link>
    </aside>
  );
}
