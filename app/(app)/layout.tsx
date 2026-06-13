"use client";

import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";
import { MobileBottomNav } from "@/components/app-shell/mobile-bottom-nav";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        className={cn(
          "transition-all duration-300 p-4 md:p-5 xl:p-6 pb-24 md:pb-6 overflow-hidden",
          "ml-0 md:ml-[88px] lg:ml-[180px] xl:ml-[220px]"
        )}
      >
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
