"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, CheckCircle2, ChevronRight, MapPin, Check, Fan, CloudSun, Bot, Thermometer, Zap, Sun, Fuel, Droplets } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WizardStepper } from "@/components/inspection-wizard/wizard-stepper";
import { useInstallations } from "@/hooks/use-dexie-data";

const STEPS = [
  { label: "Installation", description: "Select asset" },
  { label: "Status", description: "Set condition" },
  { label: "Measurements", description: "Record data" },
  { label: "Notes & Save", description: "Review" },
];

const STATUS_STYLES = {
  critical: { label: "CRITICAL", bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
  attention: { label: "ATTENTION", bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
  ok: { label: "OK", bg: "bg-green-50 dark:bg-green-950/40", text: "text-green-700 dark:text-green-400", border: "border-green-200 dark:border-green-800" },
  offline: { label: "OFFLINE", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700" },
};

const TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "wind-turbine", label: "Wind Turbines" },
  { id: "weather-station", label: "Weather Stations" },
  { id: "robot", label: "Robots" },
  { id: "hvac", label: "HVAC" },
  { id: "transformer", label: "Transformers" },
  { id: "solar-panel", label: "Solar" },
];

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "wind-turbine": Fan,
  "weather-station": CloudSun,
  "robot": Bot,
  "hvac": Thermometer,
  "transformer": Zap,
  "solar-panel": Sun,
  "generator": Fuel,
  "pump": Droplets,
};

function getTimeSince(dateStr: string) {
  const now = new Date("2026-06-13");
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hrs ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export default function Step1Page() {
  const params = useParams();
  const router = useRouter();
  const { installations: INSTALLATIONS_DATA } = useInstallations();
  const storageKey = `wizard-${params.draftId}-step1`;
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) setSelected(saved);
  }, [storageKey]);

  useEffect(() => {
    if (selected) sessionStorage.setItem(storageKey, selected);
  }, [selected, storageKey]);

  const filtered = useMemo(() => {
    return INSTALLATIONS_DATA.filter((inst) => {
      const matchesSearch =
        inst.name.toLowerCase().includes(search.toLowerCase()) ||
        inst.assetId.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || inst.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: INSTALLATIONS_DATA.length };
    INSTALLATIONS_DATA.forEach((inst) => {
      counts[inst.type] = (counts[inst.type] || 0) + 1;
    });
    return counts;
  }, []);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  function getMetricLabel(inst: typeof INSTALLATIONS_DATA[0]) {
    if (inst.batteryPct < 30) return `Battery ${inst.batteryPct}%`;
    if (inst.temperatureC > 50) return `Motor Temp High`;
    if (inst.signalStrength === "weak") return `Signal Weak`;
    return `Battery ${inst.batteryPct}%`;
  }

  return (
    <div className="space-y-5 max-w-[900px] pb-28">
      <WizardStepper currentStep={1} steps={STEPS} />

      <div>
        <p className="text-xs text-muted-foreground mb-1">Step 1 of 4</p>
        <h1 className="text-2xl font-bold text-foreground">Select Installation</h1>
        <p className="text-sm text-muted-foreground">Choose the asset you&apos;re inspecting.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search installation name or ID"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisibleCount(4); }}
          className="pl-10 h-14 text-sm bg-card"
        />
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-2 mt-[-10px]">
        {TYPE_FILTERS.map((f) => {
          const count = typeCounts[f.id] || 0;
          const isActive = typeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => { setTypeFilter(f.id); setVisibleCount(4); }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                isActive
                  ? "border-primary text-primary bg-primary/5"
                  : "border-border text-foreground hover:border-primary/40"
              }`}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Installation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {visible.map((inst) => {
          const isSelected = selected === inst.id;
          const status = STATUS_STYLES[inst.status];
          const metric = getMetricLabel(inst);
          const timeSince = getTimeSince(inst.lastInspectedAt);
          const TypeIcon = TYPE_ICONS[inst.type] || MapPin;

          return (
            <button
              key={inst.id}
              onClick={() => setSelected(inst.id)}
              className={`w-full bg-card flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-accent/50"
              }`}
            >
              {/* Image placeholder */}
              <div className="h-16 w-16 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                <TypeIcon className="h-7 w-7 text-slate-500 dark:text-slate-400" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-bold text-foreground">{inst.assetId}</p>
                  <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase ${status.bg} ${status.border} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{inst.name}</p>
                <p className="text-xs text-muted-foreground">{inst.siteName}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-foreground font-medium">{metric}</span>
                  <span className="text-xs text-muted-foreground">{timeSince}</span>
                </div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Showing count + View all */}
      <div className="flex items-center justify-between border-t border-border pb-2">
        <p className="text-sm text-muted-foreground">
          Showing 1–{Math.min(visibleCount, filtered.length)} of {filtered.length}
        </p>
        {hasMore && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary cursor-pointer hover:underline"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm px-6 py-4">
        <div className="max-w-[900px] mx-auto flex items-center justify-end gap-5">
          {selected && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Saved locally</span>
              <span className="text-xs text-muted-foreground ml-2">Draft updated 2 min ago</span>
            </div>
          )}
          <Button
            className="h-14 px-6 text-sm font-semibold"
            onClick={() => router.push(`/inspection/draft/${params.draftId}/step-2`)}
            disabled={!selected}
          >
            Continue to Status
            <ChevronRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
