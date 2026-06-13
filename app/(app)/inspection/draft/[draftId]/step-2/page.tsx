"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, XCircle, CloudOff, Info } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { WizardStepper } from "@/components/inspection-wizard/wizard-stepper";
import { StickyFooter } from "@/components/inspection-wizard/sticky-footer";

const STEPS = [
  { label: "Installation", description: "Select asset" },
  { label: "Status", description: "Set condition" },
  { label: "Measurements", description: "Record data" },
  { label: "Notes & Save", description: "Review" },
];

const STATUSES = [
  {
    id: "ok",
    label: "OK",
    description: "All systems operating normally",
    icon: CheckCircle2,
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-950/40",
    className: "border-green-500 bg-green-50 dark:bg-green-950/20",
    hoverClass: "hover:border-green-500/50",
  },
  {
    id: "attention",
    label: "Attention",
    description: "Minor issues detected, needs monitoring",
    icon: AlertTriangle,
    iconColor: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-950/40",
    className: "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
    hoverClass: "hover:border-orange-500/50",
  },
  {
    id: "critical",
    label: "Critical",
    description: "Requires immediate action",
    icon: XCircle,
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-950/40",
    className: "border-red-500 bg-red-50 dark:bg-red-950/20",
    hoverClass: "hover:border-red-500/50",
  },
  {
    id: "offline",
    label: "Offline",
    description: "Asset not responding or powered down",
    icon: CloudOff,
    iconColor: "text-slate-600 dark:text-slate-400",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    className: "border-slate-400 bg-slate-50 dark:bg-slate-900/40",
    hoverClass: "hover:border-slate-400/50",
  },
];

export default function Step2Page() {
  const params = useParams();
  const router = useRouter();
  const storageKey = `wizard-${params.draftId}-step2`;
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) setSelected(saved);
  }, [storageKey]);

  useEffect(() => {
    if (selected) sessionStorage.setItem(storageKey, selected);
  }, [selected, storageKey]);

  return (
    <div className="space-y-6 max-w-[900px] pb-24">
      <WizardStepper currentStep={2} steps={STEPS} />

      <PageHeader
        title="Select Status"
        description="What is the current condition of this asset?"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {STATUSES.map((status) => {
          const Icon = status.icon;
          const isSelected = selected === status.id;
          return (
            <button
              key={status.id}
              onClick={() => setSelected(status.id)}
              className={`w-full bg-card flex items-center gap-4 p-6 rounded-xl border-2 transition-all text-left min-h-[88px] cursor-pointer ${
                isSelected
                  ? status.className
                  : `border-border ${status.hoverClass}`
              }`}
            >
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${status.iconBg}`}
              >
                <Icon className={`h-6 w-6 ${status.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{status.label}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{status.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick info */}
      <div className="flex items-start gap-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 px-4 py-3">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Quick info</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your status helps prioritize this asset for review by the operations team.
          </p>
        </div>
      </div>

      <StickyFooter
        onBack={() => router.push(`/inspection/draft/${params.draftId}/step-1`)}
        onNext={() => router.push(`/inspection/draft/${params.draftId}/step-3`)}
        nextLabel="Continue to Measurements"
        disabled={!selected}
        showSavedStatus={!!selected}
      />
    </div>
  );
}
