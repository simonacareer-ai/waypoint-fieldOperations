"use client";

import Link from "next/link";
import { LayoutDashboard, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="w-full max-w-[520px]">
      <div className="text-center mb-8">
        <div className="mx-auto h-14 w-14 rounded-lg bg-primary flex items-center justify-center mb-4">
          <span className="text-primary-foreground font-bold text-xl">W</span>
        </div>
        <h1 className="text-[28px] leading-[34px] font-bold text-foreground">
          Welcome to Waypoint
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          You&apos;re all set. Choose how you&apos;d like to start.
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
        <div className="grid gap-4">
          <Link href="/dashboard">
            <div className="group flex items-center gap-4 p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[80px]">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <LayoutDashboard className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Go to Dashboard</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  View assignments, KPIs, and recent activity
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>

          <Link href="/inspection/new">
            <div className="group flex items-center gap-4 p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[80px]">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Start First Inspection</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Begin a new field inspection right away
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
