"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Plus,
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
  const { installations: INSTALLATIONS_DATA } = useInstallations();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<"lastInspectedAt" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const rowsPerPage = 10;

  const counts = useMemo(() => getInstallationCounts(), []);

  const filtered = useMemo(() => {
    let items = INSTALLATIONS_DATA.filter(
      (inst) =>
        inst.name.toLowerCase().includes(search.toLowerCase()) ||
        inst.assetId.toLowerCase().includes(search.toLowerCase()) ||
        inst.siteName.toLowerCase().includes(search.toLowerCase())
    );
    if (sortField === "lastInspectedAt") {
      items = [...items].sort((a, b) => {
        const cmp = a.lastInspectedAt.localeCompare(b.lastInspectedAt);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return items;
  }, [search, sortField, sortDir, INSTALLATIONS_DATA]);

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
          <p className="text-sm text-muted-foreground mt-0.5">Asset registry and health overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search installations..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-10 h-12 w-[240px]"
            />
          </div>
          <Button variant="outline" className="h-12 px-4 cursor-pointer">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Link href="/inspection/new">
            <Button className="h-12 px-5 cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
          <div className="h-11 w-11 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
            <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{counts.critical}</p>
            <p className="text-xs font-medium text-red-600 dark:text-red-400">Critical</p>
            <p className="text-[10px] text-muted-foreground">Require immediate action</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
          <div className="h-11 w-11 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{counts.attention}</p>
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Need Attention</p>
            <p className="text-[10px] text-muted-foreground">Should be reviewed</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
          <div className="h-11 w-11 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{counts.ok}</p>
            <p className="text-xs font-medium text-green-600 dark:text-green-400">OK</p>
            <p className="text-[10px] text-muted-foreground">All systems normal</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
          <div className="h-11 w-11 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{counts.total}</p>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Assets</p>
            <p className="text-[10px] text-muted-foreground">Across all sites</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8 text-muted-foreground" />}
          title="No installations found"
          description="Try adjusting your search terms or clearing filters to see results."
          action={
            <Button variant="outline" className="cursor-pointer" onClick={() => setSearch("")}>
              Clear search
            </Button>
          }
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

                const inspectors = ["Simona D.", "Ahmed K.", "Mohammed R."];
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
                      <button className="p-1.5 hover:bg-accent rounded cursor-pointer">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>
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
