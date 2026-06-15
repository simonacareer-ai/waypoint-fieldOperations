"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Flag,
  CloudUpload,
  X,
  Fan,
  CloudSun,
  Zap,
  Cpu,
  CalendarDays,
} from "lucide-react";
import { INSTALLATIONS_DATA } from "@/lib/seed-data";
import { useInspections } from "@/hooks/use-dexie-data";
import { EmptyState } from "@/components/states/empty-state";

const STATUS_CONFIG = {
  ok: { label: "OK", dotClass: "bg-green-500", textClass: "text-green-700 dark:text-green-400", bgClass: "bg-green-50 dark:bg-green-950/40", borderClass: "border-green-200 dark:border-green-800" },
  attention: { label: "Attention", dotClass: "bg-orange-500", textClass: "text-orange-700 dark:text-orange-400", bgClass: "bg-orange-50 dark:bg-orange-950/40", borderClass: "border-orange-200 dark:border-orange-800" },
  critical: { label: "Critical", dotClass: "bg-red-500", textClass: "text-red-700 dark:text-red-400", bgClass: "bg-red-50 dark:bg-red-950/40", borderClass: "border-red-200 dark:border-red-800" },
};

const TYPE_ICONS: Record<string, typeof Fan> = {
  WT: Fan,
  WS: CloudSun,
  SOL: Zap,
  GEN: Zap,
  PMP: Cpu,
  HVAC: Cpu,
  TRN: Zap,
  RB: Cpu,
};

function getIconForAsset(assetId: string) {
  const prefix = assetId.split("-")[0]?.toUpperCase() ?? "";
  return TYPE_ICONS[prefix] || Fan;
}

const SYNC_CONFIG = {
  synced: { label: "Synced", dotClass: "bg-green-500", textClass: "text-green-700 dark:text-green-400", bgClass: "bg-green-50 dark:bg-green-950/40", borderClass: "border-green-200 dark:border-green-800" },
  pending: { label: "Pending", dotClass: "bg-orange-500", textClass: "text-orange-700 dark:text-orange-400", bgClass: "bg-orange-50 dark:bg-orange-950/40", borderClass: "border-orange-200 dark:border-orange-800" },
  failed: { label: "Failed", dotClass: "bg-red-500", textClass: "text-red-700 dark:text-red-400", bgClass: "bg-red-50 dark:bg-red-950/40", borderClass: "border-red-200 dark:border-red-800" },
  "local-only": { label: "Local", dotClass: "bg-slate-400", textClass: "text-slate-600 dark:text-slate-400", bgClass: "bg-slate-100 dark:bg-slate-800", borderClass: "border-slate-200 dark:border-slate-700" },
};

const SAVED_FILTERS = [
  { id: "battery", label: "Battery", icon: CheckCircle2, detail: "Battery level below 30%" },
  { id: "temperature", label: "Temperature", icon: AlertTriangle, detail: "Temperature above threshold" },
  { id: "signal", label: "Signal", icon: RefreshCw, detail: "Signal strength issues" },
  { id: "vibration", label: "Vibration", icon: Flag, detail: "Vibration anomaly detected" },
  { id: "overdue", label: "Overdue", icon: Clock, detail: "Past due date inspections" },
];

const ROWS_PER_PAGE_OPTIONS = [6, 10, 25, 50, 100];

export default function InspectionsPage() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const { inspections: INSPECTIONS_DATA, loading: dbLoading } = useInspections();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(statusParam || "all");
  const [installationFilter, setInstallationFilter] = useState("all");
  const [sortField, setSortField] = useState<"date" | "battery">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [showStats, setShowStats] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [statsDismissed, setStatsDismissed] = useState(false);
  const [syncDismissed, setSyncDismissed] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState("2025-01-01");
  const [dateTo, setDateTo] = useState("2026-12-31");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (statusParam) setStatusFilter(statusParam);
  }, [statusParam]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    }
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDatePicker]);

  const filtered = useMemo(() => {
    let result = INSPECTIONS_DATA.filter((insp) => {
      const matchesSearch =
        insp.installation.toLowerCase().includes(search.toLowerCase()) ||
        insp.assetId.toLowerCase().includes(search.toLowerCase()) ||
        insp.inspector.toLowerCase().includes(search.toLowerCase()) ||
        insp.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === "all" || insp.status === statusFilter;
      const matchesInstallation = installationFilter === "all" || insp.installationId === installationFilter;
      const matchesDate = insp.date >= dateFrom && insp.date <= dateTo;

      let matchesSavedFilters = activeFilters.length === 0;
      if (!matchesSavedFilters) {
        if (activeFilters.includes("battery") && insp.batteryPct < 30) matchesSavedFilters = true;
        if (activeFilters.includes("temperature") && insp.temperatureC !== null && insp.temperatureC > 35) matchesSavedFilters = true;
        if (activeFilters.includes("vibration") && insp.tags.some((t) => t === "vibration")) matchesSavedFilters = true;
        if (activeFilters.includes("signal") && insp.tags.some((t) => t === "signal")) matchesSavedFilters = true;
        if (activeFilters.includes("overdue") && insp.isDraft) matchesSavedFilters = true;
      }

      return matchesSearch && matchesStatus && matchesInstallation && matchesDate && matchesSavedFilters;
    });

    result.sort((a, b) => {
      if (sortField === "date") {
        return sortDir === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
      }
      return sortDir === "desc" ? b.batteryPct - a.batteryPct : a.batteryPct - b.batteryPct;
    });

    return result;
  }, [search, statusFilter, installationFilter, sortField, sortDir, dateFrom, dateTo, activeFilters, INSPECTIONS_DATA]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const stats = useMemo(() => {
    const total = INSPECTIONS_DATA.length;
    const critical = INSPECTIONS_DATA.filter((i) => i.status === "critical").length;
    const attention = INSPECTIONS_DATA.filter((i) => i.status === "attention").length;
    const ok = INSPECTIONS_DATA.filter((i) => i.status === "ok").length;
    const drafts = INSPECTIONS_DATA.filter((i) => i.isDraft).length;
    const pendingSync = INSPECTIONS_DATA.filter((i) => i.syncState === "pending" || i.syncState === "local-only").length;
    return { total, critical, attention, ok, drafts, pendingSync };
  }, [INSPECTIONS_DATA]);

  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, installationFilter, rowsPerPage, dateFrom, dateTo]);

  function formatDateLabel(iso: string) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Inspections</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Work queue • {INSPECTIONS_DATA.length} inspections
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/inspection/new">
            <Button className="h-10 px-4 font-semibold text-sm !gap-1.5">
              <Plus className="h-4 w-4" />
              New Inspection
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="h-10 px-3 font-semibold text-sm gap-1.5">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button
            variant="outline"
            className={`h-10 px-3 text-sm gap-1.5 ${showFilters ? "border-primary text-primary" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search + Filters row + Saved Filters */}
      {showFilters && (
      <div className="space-y-2 bg-card rounded-lg border border-border p-2.5 mt-[-8px]">
        <div className="flex flex-col md:flex-row gap-3.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search installations, tags, inspectors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-12 text-sm bg-card"
            />
          </div>
          <select
            value={installationFilter}
            onChange={(e) => setInstallationFilter(e.target.value)}
            className="h-12 px-3 rounded-lg border border-border bg-card text-sm text-foreground cursor-pointer"
          >
            <option value="all">All Installations</option>
            {INSTALLATIONS_DATA.map((inst) => (
              <option key={inst.id} value={inst.id}>{inst.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 px-3 rounded-lg border border-border bg-card text-sm text-foreground cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="critical">Critical</option>
            <option value="attention">Attention</option>
            <option value="ok">OK</option>
          </select>
          <div className="relative" ref={dateRef}>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="h-12 px-3 rounded-lg border border-border bg-card text-sm flex items-center gap-2 text-foreground cursor-pointer min-w-[190px] w-auto sm:w-full"
            >
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{dateFrom === "2025-01-01" && dateTo === "2026-12-31" ? "All dates" : `${formatDateLabel(dateFrom)} — ${formatDateLabel(dateTo)}`}</span>
              <ChevronDown className={`h-3.5 w-3.5 ml-auto text-muted-foreground transition-transform ${showDatePicker ? "rotate-180" : ""}`} />
            </button>
            {showDatePicker && (
              <div className="absolute top-full mt-2 right-0 z-50 bg-card border border-border rounded-lg shadow-lg p-4 space-y-3 w-[280px]">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-border bg-card text-sm text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-border bg-card text-sm text-foreground"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    className="flex-1 h-8 text-xs cursor-pointer"
                    onClick={() => { setDateFrom("2025-01-01"); setDateTo("2026-12-31"); setShowDatePicker(false); }}
                  >
                    All Time
                  </Button>
                  <Button
                    className="flex-1 h-8 text-xs cursor-pointer"
                    onClick={() => setShowDatePicker(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-12 px-4 text-sm gap-1.5 !h-[48px] !min-h-[48px] w-auto sm:w-full"
              onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort: {sortDir === "desc" ? "Newest" : "Oldest"}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.slice(0, 3).map((filterId) => {
            const f = SAVED_FILTERS.find((sf) => sf.id === filterId);
            if (!f) return null;
            const Icon = f.icon;
            return (
              <span
                key={f.id}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-[12px] font-medium border border-border bg-card text-foreground h-[44px] cursor-pointer"
              >
                {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
                {f.label}
                <button
                  onClick={() => setActiveFilters((prev) => prev.filter((id) => id !== f.id))}
                  className="hover:text-red-500 transition-colors cursor-pointer flex items-center justify-center ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
          {activeFilters.length > 3 && (
            <span className="text-[12px] font-medium text-muted-foreground">
              +{activeFilters.length - 3} more
            </span>
          )}
          <div className="relative">
            <button
              onClick={() => setShowAddFilter(!showAddFilter)}
              className="inline-flex items-center gap-1.5 px-2 py-1 text-[12px] font-medium text-primary cursor-pointer hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="underline">Add Filter</span>
            </button>
            {showAddFilter && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAddFilter(false)} />
                <div className="absolute left-0 top-full mt-2 z-50 w-56 bg-card border border-border rounded-lg shadow-lg py-2">
                  <p className="px-3 pb-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Add a filter</p>
                  {SAVED_FILTERS.filter((sf) => !activeFilters.includes(sf.id)).map((sf) => {
                    const Icon = sf.icon;
                    return (
                      <button
                        key={sf.id}
                        className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          setActiveFilters((prev) => [...prev, sf.id]);
                          setShowAddFilter(false);
                        }}
                      >
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        {sf.label}
                      </button>
                    );
                  })}
                  {SAVED_FILTERS.filter((sf) => !activeFilters.includes(sf.id)).length === 0 && (
                    <p className="px-3 py-2 text-xs text-muted-foreground">All filters applied</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Stats Row - collapsible & dismissible */}
      {!statsDismissed && (
      <div className="rounded-lg border border-border bg-card overflow-hidden mt-[-10px]">
        <div className="flex items-center">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex-1 flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors"
          >
          <div className={`flex items-center flex-1 ${showStats ? "overflow-x-auto" : ""}`}>
            {showStats && (
              <>
                {/* Desktop: inline with dividers */}
                <div className="hidden md:flex items-center divide-x divide-border w-full justify-around">
                  <div className="pr-5">
                    <span className="text-[11px] text-muted-foreground block">Total</span>
                    <span className="text-lg font-bold text-foreground">{stats.total}</span>
                    <span className="text-[11px] text-muted-foreground block">Inspections</span>
                  </div>
                  <div className="px-5">
                    <span className="text-[11px] text-muted-foreground block">Due Today</span>
                    <span className="text-lg font-bold text-orange-600">{stats.attention}</span>
                    <span className="text-[11px] text-muted-foreground block">Inspections</span>
                  </div>
                  <div className="px-5">
                    <span className="text-[11px] text-muted-foreground block">Overdue</span>
                    <span className="text-lg font-bold text-red-600">{stats.critical}</span>
                    <span className="text-[11px] text-muted-foreground block">Inspections</span>
                  </div>
                  <div className="px-5">
                    <span className="text-[11px] text-muted-foreground block">In Progress</span>
                    <span className="text-lg font-bold text-blue-600">{stats.drafts}</span>
                    <span className="text-[11px] text-muted-foreground block">Inspections</span>
                  </div>
                  <div className="px-5">
                    <span className="text-[11px] text-muted-foreground block">Completed</span>
                    <span className="text-lg font-bold text-green-600">{stats.ok}</span>
                    <span className="text-[11px] text-muted-foreground block">Inspections</span>
                  </div>
                  <div className="pl-5">
                    <span className="text-[11px] text-muted-foreground block">Drafts</span>
                    <span className="text-lg font-bold text-slate-600 dark:text-slate-300">{stats.drafts}</span>
                    <span className="text-[11px] text-muted-foreground block">Inspections</span>
                  </div>
                </div>
                {/* Mobile: grid */}
                <div className="grid grid-cols-3 gap-3 md:hidden">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Total</span>
                    <span className="text-base font-bold text-foreground">{stats.total}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Due Today</span>
                    <span className="text-base font-bold text-orange-600">{stats.attention}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Overdue</span>
                    <span className="text-base font-bold text-red-600">{stats.critical}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">In Progress</span>
                    <span className="text-base font-bold text-blue-600">{stats.drafts}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Completed</span>
                    <span className="text-base font-bold text-green-600">{stats.ok}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Drafts</span>
                    <span className="text-base font-bold text-slate-600 dark:text-slate-300">{stats.drafts}</span>
                  </div>
                </div>
              </>
            )}
            {!showStats && (
              <span className="text-xs text-muted-foreground">Show inspection stats</span>
            )}
          </div>
          {showStats ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 ml-3" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-3" />
          )}
        </button>
          <button
            onClick={() => setStatsDismissed(true)}
            className="px-3 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer shrink-0"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </div>
      )}

      {/* Sync Bar */}
      {!syncDismissed && (
      <div className="flex items-center gap-3 md:gap-4 rounded-lg bg-[#628cf124] dark:bg-blue-950/20 dark:border-blue-900/40 px-3 md:px-4 py-2 flex-wrap mt-[-10px]">
        <div className="flex items-center gap-2 min-w-0">
          <CloudUpload className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="text-xs md:text-sm font-medium text-foreground">
            {stats.pendingSync} inspections waiting to sync
          </span>
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">Last sync: 2m ago</span>
        <div className="flex items-center gap-2 md:gap-3 ml-auto shrink-0">
          <Button variant="outline" className="h-9 md:!min-h-[44px] px-3 md:px-5 text-xs md:text-sm text-primary font-medium rounded-lg border-border bg-card">
            Sync Now
          </Button>
          <Button variant="outline" className="h-9 md:!min-h-[44px] px-3 md:px-5 text-xs md:text-sm text-primary font-medium rounded-lg border-border bg-card">
            View Sync Details
          </Button>
          <button
            onClick={() => setSyncDismissed(true)}
            className="p-1.5 hover:bg-white/50 dark:hover:bg-white/10 rounded transition-colors cursor-pointer shrink-0 flex items-center justify-center align-middle "
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
      </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 uppercase">Asset</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2 uppercase">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-3 cursor-pointer uppercase min-w-[90px]" onClick={() => { setSortField("battery"); setSortDir(sortDir === "desc" ? "asc" : "desc"); }}>
                  Battery % {sortField === "battery" && "↓"}
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2 uppercase">Temperature</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2 uppercase">Tags</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2 uppercase">Sync</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 uppercase">Inspector</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 cursor-pointer min-w-[88px] uppercase" onClick={() => { setSortField("date"); setSortDir(sortDir === "desc" ? "asc" : "desc"); }}>
                  Updated {sortField === "date" && "↓"}
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-0">
                    <EmptyState
                      icon={
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <Search className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </div>
                      }
                      title="No inspections found"
                      description={search
                        ? `No results match "${search}" with the current filters.`
                        : "No inspections match the current filters."
                      }
                      action={
                        <div className="flex items-center gap-3">
                          <Button
                            className="h-[48px] px-5 text-sm font-semibold cursor-pointer"
                            onClick={() => { setSearch(""); setStatusFilter("all"); setInstallationFilter("all"); setDateFrom("2025-01-01"); setDateTo("2026-12-31"); setActiveFilters([]); }}
                          >
                            Clear Filters
                          </Button>
                          <Button
                            variant="outline"
                            className="h-[48px] px-5 text-sm font-semibold cursor-pointer"
                            onClick={() => window.location.href = "/inspection/new"}
                          >
                            Start New Inspection
                          </Button>
                        </div>
                      }
                      tip="Try searching by installation type (WT, WS, RB), date range, or status."
                    />
                  </td>
                </tr>
              ) : paginatedData.map((insp) => {
                const statusCfg = STATUS_CONFIG[insp.status];
                const syncCfg = SYNC_CONFIG[insp.syncState];
                const TypeIcon = getIconForAsset(insp.assetId);

                return (
                  <tr
                    key={insp.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    
                    <td className="px-3 py-2 min-w-[140px]">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center shrink-0">
                          <TypeIcon className="h-4.5 w-4.5 text-sky-700 dark:text-sky-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{insp.assetId} — {insp.installation}</p>
                          <p className="text-xs text-muted-foreground">{insp.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase ${statusCfg.bgClass} ${statusCfg.borderClass} ${statusCfg.textClass}`}>
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-foreground">{insp.batteryPct}%</td>
                    <td className="px-2 py-2 text-sm text-foreground">
                      {insp.temperatureC !== null ? `${insp.temperatureC}°C` : "—"}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex flex-wrap gap-1">
                        {insp.tags.map((tag) => (
                          <span key={tag} className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase ${syncCfg.bgClass} ${syncCfg.borderClass} ${syncCfg.textClass}`}>
                        {syncCfg.label}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-xs font-medium text-foreground">{insp.inspector}</p>
                      <p className="text-[11px] text-muted-foreground">{insp.inspectorRole}</p>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-xs text-foreground min-w-[68px]">{insp.date}</p>
                      <p className="text-[11px] text-muted-foreground">{insp.time}</p>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Link href={`/inspection/draft/${insp.id}/step-1`}>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-xs text-primary font-medium min-w-[90px] border-primary text-primary hover:bg-primary/10 hover:text-primary bg-card">
                            {insp.isDraft ? "Resume" : "Inspect Now"}
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} inspections
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="h-8 px-2 rounded border border-border bg-card text-xs cursor-pointer"
              >
                {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              {totalPages > 3 && (
                <>
                  <span className="text-xs text-muted-foreground px-1">...</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-xs"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
