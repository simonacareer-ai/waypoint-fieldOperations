"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  Plus,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inspections", href: "/inspections", icon: ClipboardList },
  { label: "New", href: "/inspection/new", icon: Plus, isPrimary: true },
  { label: "Installations", href: "/installations", icon: MapPin },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isWizardPage = pathname.startsWith("/inspection/draft/") || pathname === "/inspection/new";

  return (
    <nav aria-label="Mobile navigation" className={cn("fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card/95 backdrop-blur-sm safe-bottom", isWizardPage && "z-40")}>
      <div className="flex items-center justify-around px-2 py-2">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            (item.href === "/dashboard" && pathname === "/dashboard") ||
            (item.href !== "/dashboard" &&
              item.href !== "/inspection/new" &&
              pathname.startsWith(item.href));

          if (item.isPrimary) {
            if (isWizardPage) return null;
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label="Start new inspection"
                className="flex flex-col items-center justify-center -mt-5 cursor-pointer"
              >
                <div className="h-14 w-14 rounded-full bg-primary shadow-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-[10px] font-medium text-primary mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] cursor-pointer",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
