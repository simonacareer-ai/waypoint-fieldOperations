"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Filter,
  Fan,
  CloudSun,
  Cpu,
  Zap,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ArrowUpDown,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { getInstallationCounts } from "@/lib/seed-data";
import { useInstallations } from "@/hooks/use-dexie-data";
import { EmptyState } from "@/components/states/empty-state";

const TYPE_ICONS: Record<string, typeof Fan> = {
  "wind-turbine": Fan,
  "weather-station": CloudSun,
  "solar-panel": Zap,
  generator: Zap,
  pump: Cpu,
  hvac: Cpu,
  transformer: Zap,
  robot: Cpu,
};

const TYPE_LABELS: Record<string, string> = {
  "wind-turbine": "Wind Turbine",
  "weather-station": "Weather Station",
  "solar-panel": "Solar Panel",
  generator: "Generator",
  pump: "Pump",
  hvac: "HVAC",
  transformer: "Transformer",
  robot: "Autonomous Robot",
};

function HealthGauge({ percent, status }: { percent: number; status: string }) {
  const getColor = () => {
    if (status === "critical") return { stroke: "#EF4444", text: "text-red-600 dark:text-red-400" };
    if (status === "attention") return { stroke: "#F59E0B", text: "text-orange-600 dark:text-orange-400" };
    return { stroke: "#22C55E", text: "text-green-600 dark:text-green-400" };
  };
  const color = getColor();
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-border" />
        <circle
          cx="22" cy="22" r={radius} fill="none"
          stroke={color.stroke} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
        />
      </svg>
      <div>
        <p className={`text-sm font-bold ${color.text}`}>{percent}%</p>
        <p className="text-[10px] text-muted-foreground capitalize">
          {status === "ok" ? "OK" : status === "critical" ? "Critical" : "Attention"}
        </p>
      </div>
    </div>
  );
}

export default function InstallationsPage() {
  const router = useRouter();
  const { installations: INSTALLATIONS_DATA } = useInstallations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"lastInspectedAt" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rowsPerPage = 10;

  const counts = useMemo(() => getInstallationCounts(), []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, typeFilter]);

  const filtered = useMemo(() => {
    let items = INSTALLATIONS_DATA.filter((inst) => {
      const matchesSearch =
        inst.name.toLowerCase().includes(search.toLowerCase()) ||
        inst.assetId.toLowerCase().includes(search.toLowerCase()) ||
        inst.siteName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || inst.status === statusFilter;
      const matchesType = typeFilter === "all" || inst.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
    if (sortField === "lastInspectedAt") {
      items = [...items].sort((a, b) => {
        const cmp = a.lastInspectedAt.localeCompare(b.lastInspectedAt);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return items;
  }, [search, statusFilter, typeFilter, sortField, sortDir, INSTALLATIONS_DATA]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleSort = () => {
    if (sortField === "lastInspectedAt") {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField("lastInspectedAt");
      setSortDir("desc");
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Installations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Asset registry and health overview • {INSTALLATIONS_DATA.length} assets</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/inspection/new">
            <Button className="h-10 px-4 font-semibold text-sm !gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" />
              New Inspection
            </Button>
          </Link>
          <Button
            variant="outline"
            className={`h-10 px-3 text-sm gap-1.5 cursor-pointer ${showFilters ? "border-primary text-primary" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
      <div className="flex flex-col md:flex-row gap-3 bg-card rounded-lg border border-border p-2.5 mt-[-8px]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, asset ID, or site..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-12 text-sm bg-card"
          />
        </div>
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
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-12 px-3 rounded-lg border border-border bg-card text-sm text-foreground cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="wind-turbine">Wind Turbine</option>
          <option value="weather-station">Weather Station</option>
          <option value="solar-panel">Solar Panel</option>
          <option value="generator">Generator</option>
          <option value="transformer">Transformer</option>
          <option value="robot">Autonomous Robot</option>
          <option value="pump">Pump</option>
          <option value="hvac">HVAC</option>
        </select>
        <Button
          variant="outline"
          className="h-12 px-4 text-sm gap-1.5"
          onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          Sort: {sortDir === "desc" ? "Newest" : "Oldest"}
        </Button>
        {(search || statusFilter !== "all" || typeFilter !== "all") && (
          <Button
            variant="ghost"
            className="h-12 px-4 text-sm text-primary"
            onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}
          >
            Clear all filters
          </Button>
        )}
      </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter(statusFilter === "critical" ? "all" : "critical")}
          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all text-left ${
            statusFilter === "critical"
              ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800 bg-red-50 dark:bg-red-950/30"
              : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 hover:border-red-400"
          }`}
        >
          <div className="h-11 w-11 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
            <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{counts.critical}</p>
            <p className="text-xs font-medium text-red-600 dark:text-red-400">Critical</p>
            <p className="text-[10px] text-muted-foreground">Require immediate action</p>
          </div>
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "attention" ? "all" : "attention")}
          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all text-left ${
            statusFilter === "attention"
              ? "border-orange-500 ring-2 ring-orange-200 dark:ring-orange-800 bg-orange-50 dark:bg-orange-950/30"
              : "border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 hover:border-orange-400"
          }`}
        >
          <div className="h-11 w-11 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{counts.attention}</p>
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Need Attention</p>
            <p className="text-[10px] text-muted-foreground">Should be reviewed</p>
          </div>
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "ok" ? "all" : "ok")}
          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all text-left ${
            statusFilter === "ok"
              ? "border-green-500 ring-2 ring-green-200 dark:ring-green-800 bg-green-50 dark:bg-green-950/30"
              : "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 hover:border-green-400"
          }`}
        >
          <div className="h-11 w-11 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{counts.ok}</p>
            <p className="text-xs font-medium text-green-600 dark:text-green-400">OK</p>
            <p className="text-[10px] text-muted-foreground">All systems normal</p>
          </div>
        </button>
        <button
          onClick={() => setStatusFilter("all")}
          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all text-left border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 hover:border-blue-400`}
        >
          <div className="h-11 w-11 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{counts.total}</p>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Assets</p>
            <p className="text-[10px] text-muted-foreground">Across all sites</p>
          </div>
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
          }
          title="No installations found"
          description={search
            ? `No results match "${search}" with the current filters.`
            : "No installations match the current filters."
          }
          action={
            <Button className="h-[48px] px-5 text-sm font-semibold cursor-pointer" onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }}>
              Clear Filters
            </Button>
          }
          tip="Try searching by asset ID (WT-01, WS-05), site name, or type."
        />
      ) : (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Site</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Health</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer" onClick={toggleSort}>
                  <span className="inline-flex items-center gap-1">
                    Last Inspected
                    <ArrowUpDown className="h-3 w-3" />
                  </span>
                </th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((inst) => {
                const TypeIcon = TYPE_ICONS[inst.type] || Fan;
                const statusLabel = inst.status === "ok" ? "OK" : inst.status === "critical" ? "CRITICAL" : "ATTENTION";
                const statusClass = inst.status === "critical"
                  ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800"
                  : inst.status === "attention"
                  ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800"
                  : "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800";

                const inspectors = ["Simona D.", "Bradley V", "Hezel WD"];
                const inspectorIdx = Math.abs(inst.id.charCodeAt(inst.id.length - 1)) % inspectors.length;

                return (
                  <tr key={inst.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center shrink-0 overflow-hidden">
                          <TypeIcon className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                        </div>
                        <div>
                          <Link href={`/installations/${inst.id}`} className="text-sm font-semibold text-primary hover:underline cursor-pointer">{inst.assetId}</Link>
                          <p className="text-xs text-muted-foreground">{inst.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{TYPE_LABELS[inst.type] || inst.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">{inst.siteName.replace("Abu Dhabi Wind Cluster", "Al Dhafra Wind Farm")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <HealthGauge percent={inst.batteryPct} status={inst.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-foreground">{inst.lastInspectedAt}</p>
                        <p className="text-xs text-muted-foreground">{inspectors[inspectorIdx]}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative" ref={openMenuId === inst.id ? menuRef : undefined}>
                        <button
                          className="p-1.5 hover:bg-accent rounded cursor-pointer"
                          onClick={() => setOpenMenuId(openMenuId === inst.id ? null : inst.id)}
                        >
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                        {openMenuId === inst.id && (
                          <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 w-[160px]">
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                              onClick={() => { setOpenMenuId(null); router.push(`/installations/${inst.id}`); }}
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              View Details
                            </button>
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                              onClick={() => { setOpenMenuId(null); router.push(`/installations/${inst.id}`); }}
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                              Edit
                            </button>
                            <button
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                              onClick={() => { setOpenMenuId(null); }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} assets
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 cursor-pointer"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                className="h-9 w-9 cursor-pointer"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            {totalPages > 4 && <span className="px-2 text-sm text-muted-foreground">...</span>}
            {totalPages > 3 && (
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                className="h-9 w-9 cursor-pointer"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 cursor-pointer"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
