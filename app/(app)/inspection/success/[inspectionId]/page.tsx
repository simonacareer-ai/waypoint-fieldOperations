"use client";

import Link from "next/link";
import { CheckCircle2, LayoutDashboard, ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InspectionSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-[480px]">
        <div className="mx-auto h-20 w-20 rounded-full bg-success-50 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-success-500" />
        </div>
        <h1 className="text-[28px] leading-[34px] font-bold text-foreground mb-3">
          Inspection Saved
        </h1>
        <p className="text-base text-muted-foreground mb-2">
          Your inspection has been saved locally and will sync when online.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Saved locally · Will sync when online
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/dashboard">
            <Button variant="outline" className="w-full h-12">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/inspections">
            <Button variant="outline" className="w-full h-12">
              <ClipboardList className="h-4 w-4 mr-2" />
              Inspections
            </Button>
          </Link>
          <Link href="/inspection/new">
            <Button className="w-full h-12">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
