"use client";

import { useState, useEffect, useMemo } from "react";
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
  MoreHorizontal,
  Clock,
  Flag,
  Upload,
  Settings2,
  CloudUpload,
  X,
} from "lucide-react";
import { INSPECTIONS_DATA, INSTALLATIONS_DATA } from "@/lib/seed-data";

const STATUS_CONFIG = {
  ok: { label: "OK", dotClass: "bg-green-500", textClass: "text-green-700 dark:text-green-400", bgClass: "bg-green-50 dark:bg-green-950/40", borderClass: "border-green-200 dark:border-green-800" },
  attention: { label: "Attention", dotClass: "bg-orange-500", textClass: "text-orange-700 dark:text-orange-400", bgClass: "bg-orange-50 dark:bg-orange-950/40", borderClass: "border-orange-200 dark:border-orange-800" },
  critical: { label: "Critical", dotClass: "bg-red-500", textClass: "text-red-700 dark:text-red-400", bgClass: "bg-red-50 dark:bg-red-950/40", borderClass: "border-red-200 dark:border-red-800" },
};

const PRIORITY_CONFIG = {
  critical: { label: "Critical", icon: XCircle, color: "text-red-600 dark:text-red-400" },
  attention: { label: "Attention", icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400" },
  ok: { label: "OK", icon: CheckCircle2, color: "text-green-600 dark:text-green-400" },
};

const SYNC_CONFIG = {
  synced: { label: "Synced", dotClass: "bg-green-500", textClass: "text-green-700 dark:text-green-400", bgClass: "bg-green-50 dark:bg-green-950/40", borderClass: "border-green-200 dark:border-green-800" },
  pending: { label: "Pending", dotClass: "bg-orange-500", textClass: "text-orange-700 dark:text-orange-400", bgClass: "bg-orange-50 dark:bg-orange-950/40", borderClass: "border-orange-200 dark:border-orange-800" },
  failed: { label: "Failed", dotClass: "bg-red-500", textClass: "text-red-700 dark:text-red-400", bgClass: "bg-red-50 dark:bg-red-950/40", borderClass: "border-red-200 dark:border-red-800" },
  "local-only": { label: "Local", dotClass: "bg-slate-400", textClass: "text-slate-600 dark:text-slate-400", bgClass: "bg-slate-100 dark:bg-slate-800", borderClass: "border-slate-200 dark:border-slate-700" },
};

const SAVED_FILTERS = [
  { id: "mine", label: "My Inspections", icon: CheckCircle2, active: true, detail: "Assigned to: Simona D. • Status: All • Last 30 days" },
  { id: "due-today", label: "Due Today", icon: Clock, detail: "Due date: Today • Status: Attention, Critical • All installations" },
  { id: "overdue", label: "Overdue", icon: XCircle, detail: "Status: Critical • Past due date • All inspectors" },
];

const ROWS_PER_PAGE_OPTIONS = [6, 10, 25, 50, 100];

export default function InspectionsPage() {
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(statusParam || "all");
  const [installationFilter, setInstallationFilter] = useState("all");
  const [sortField, setSortField] = useState<"date" | "battery">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showStats, setShowStats] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [statsDismissed, setStatsDismissed] = useState(false);
  const [syncDismissed, setSyncDismissed] = useState(false);
  const [showManageFilters, setShowManageFilters] = useState(false);

  useEffect(() => {
    if (statusParam) setStatusFilter(statusParam);
  }, [statusParam]);

  const filtered = useMemo(() => {
    let result = INSPECTIONS_DATA.filter((insp) => {
      const matchesSearch =
        insp.installation.toLowerCase().includes(search.toLowerCase()) ||
        insp.assetId.toLowerCase().includes(search.toLowerCase()) ||
        insp.inspector.toLowerCase().includes(search.toLowerCase()) ||
        insp.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === "all" || insp.status === statusFilter;
      const matchesInstallation = installationFilter === "all" || insp.installationId === installationFilter;
      return matchesSearch && matchesStatus && matchesInstallation;
    });

    result.sort((a, b) => {
      if (sortField === "date") {
        return sortDir === "desc" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
      }
      return sortDir === "desc" ? b.batteryPct - a.batteryPct : a.batteryPct - b.batteryPct;
    });

    return result;
  }, [search, statusFilter, installationFilter, sortField, sortDir]);

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
  }, []);

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((r) => r.id)));
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, installationFilter, rowsPerPage]);

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
          <div className="relative flex-1 max-w-sm">
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
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              className="h-12 px-4 text-sm gap-1.5"
              onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              Sort: {sortDir === "desc" ? "Newest" : "Oldest"}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-muted-foreground">Saved Filters</span>
          {SAVED_FILTERS.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.id} className="relative group">
                <button
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer transition-colors ${
                    f.active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {f.label}
                </button>
                <div className="absolute left-0 top-full mt-1.5 z-50 hidden group-hover:block">
                  <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2 text-[11px] text-muted-foreground whitespace-nowrap">
                    {f.detail}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="relative">
            <button
              onClick={() => setShowManageFilters(!showManageFilters)}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-primary cursor-pointer hover:underline"
            >
              <Settings2 className="h-3 w-3" />
              Manage Filters
            </button>
            {showManageFilters && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowManageFilters(false)} />
                <div className="absolute left-0 top-full mt-2 z-50 w-72 bg-card border border-border rounded-xl shadow-lg px-4 pt-1 pb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Manage Saved Filters</h3>
                    <button onClick={() => setShowManageFilters(false)} className="cursor-pointer flex items-center justify-center">
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {SAVED_FILTERS.map((f) => {
                      const Icon = f.icon;
                      return (
                        <div key={f.id} className="flex items-start gap-2 p-2 rounded-lg border border-border bg-muted/20">
                          <Icon className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">{f.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{f.detail}</p>
                          </div>
                          <button className="text-[10px] text-red-500 hover:underline cursor-pointer shrink-0">
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="outline" className="w-full h-8 text-xs font-medium">
                    + Create New Filter
                  </Button>
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
                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">Installation<br/><span className="font-normal">Location</span></th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-3 cursor-pointer min-w-[85px]" onClick={() => { setSortField("battery"); setSortDir(sortDir === "desc" ? "asc" : "desc"); }}>
                  Battery % {sortField === "battery" && "↓"}
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2">Temperature</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2">Tags</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2">Sync</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">Inspector</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2 cursor-pointer min-w-[88px]" onClick={() => { setSortField("date"); setSortDir(sortDir === "desc" ? "asc" : "desc"); }}>
                  Updated {sortField === "date" && "↓"}
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((insp) => {
                const statusCfg = STATUS_CONFIG[insp.status];
                const syncCfg = SYNC_CONFIG[insp.syncState];

                return (
                  <tr
                    key={insp.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    
                    <td className="px-3 py-2 min-w-[140px]">
                      <p className="text-sm font-medium text-foreground">{insp.assetId} — {insp.installation}</p>
                      <p className="text-xs text-muted-foreground">{insp.location}</p>
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
