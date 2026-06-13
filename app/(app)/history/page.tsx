"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  MoreVertical,
  Plus,
  Eye,
  RotateCcw,
  FileText,
  Copy,
  Flag,
  Share2,
  Trash2,
  MessageSquare,
  ArrowUpDown,
  Settings2,
  XCircle,
  Battery,
  Thermometer,
  Wifi,
  Activity,
  CloudOff,
  Cog,
  Compass,
  RotateCw,
  Bell,
  FileEdit,
  Fan,
  CloudSun,
  Cpu,
  Zap,
} from "lucide-react";
import { INSTALLATIONS_DATA } from "@/lib/seed-data";
import { DeleteConfirmModal } from "@/components/states/delete-confirm-modal";
import { UndoSnackbar } from "@/components/states/undo-snackbar";
import { EmptyState } from "@/components/states/empty-state";

type EventType =
  | "inspection_completed"
  | "inspection_synced"
  | "critical_alert"
  | "maintenance_performed"
  | "inspection_edited"
  | "draft_restored"
  | "vibration_alert";

interface HistoryEntry {
  id: string;
  icon: "green" | "blue" | "red" | "orange" | "gray";
  date: string;
  time: string;
  assetId: string;
  installationName: string;
  installationType: string;
  location: string;
  event: string;
  eventSubtitle: string;
  details: string[];
  status: "critical" | "ok" | "attention" | "info";
  syncState: "synced" | "pending" | "local" | "failed";
  user: string;
  userRole: string;
  tags: string[];
}

const EVENT_TEMPLATES: { type: EventType; event: string; subtitle: string; icon: HistoryEntry["icon"] }[] = [
  { type: "inspection_completed", event: "Inspection Completed", subtitle: "Routine Inspection", icon: "green" },
  { type: "inspection_synced", event: "Inspection Synced", subtitle: "All data synced", icon: "blue" },
  { type: "critical_alert", event: "Critical Alert", subtitle: "Signal Strength Low", icon: "red" },
  { type: "maintenance_performed", event: "Maintenance Performed", subtitle: "Motor Check", icon: "green" },
  { type: "inspection_edited", event: "Inspection Edited", subtitle: "Field Temperature", icon: "orange" },
  { type: "draft_restored", event: "Draft Restored", subtitle: "Previously Drafted", icon: "gray" },
  { type: "vibration_alert", event: "Vibration Alert", subtitle: "High Vibration", icon: "orange" },
];

function hashStr(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateHistoryData(): HistoryEntry[] {
  const entries: HistoryEntry[] = [];
  const statuses: HistoryEntry["status"][] = ["ok", "critical", "attention", "info"];
  const syncStates: HistoryEntry["syncState"][] = ["synced", "pending", "local", "failed"];
  const detailSets = [
    ["Battery: 14%", "Temp: 32°C", "Alerts: 2"],
    ["All data synced", "Duration: 18m 42s", "Record ID: 8f3c1d2e"],
    ["Signal: -112 dBm", "Threshold: -100 dBm", "Duration: 7m 15s"],
    ["Battery: 67%", "Temp: 28°C", "Notes: All good"],
    ["Motor: Replaced", "Runtime: 3.2h", "Next PM: Jan 18"],
    ["Field Temperature", "Old: 22°C", "New: 24°C"],
    ["Restored from draft", "Original: Jan 10", "Fields completed: 8/12"],
    ["Vibration: 6.4 mm/s", "Threshold: 5.0 mm/s", "Duration: 3m 22s"],
    ["Battery: 92%", "Temp: 31°C", "Signal: Strong"],
    ["Calibrated sensors", "Duration: 12m", "Status: Verified"],
  ];

  const inspectors = [
    { name: "Jordan M.", role: "Site Manager" },
    { name: "System", role: "Automated" },
    { name: "Priya S.", role: "Engineer" },
    { name: "Alex R.", role: "Technician" },
    { name: "Taylor K.", role: "Field Tech" },
    { name: "Khalid M.", role: "Field Tech" },
    { name: "Ahmed R.", role: "Technician" },
    { name: "Omar T.", role: "Site Manager" },
  ];

  const startDate = new Date(2026, 0, 12, 10, 24);

  for (let i = 0; i < 248; i++) {
    const h = hashStr(`hist-${i}`);
    const instIdx = h % INSTALLATIONS_DATA.length;
    const inst = INSTALLATIONS_DATA[instIdx];
    const eventTemplate = EVENT_TEMPLATES[h % EVENT_TEMPLATES.length];
    const detailIdx = h % detailSets.length;
    const inspectorIdx = h % inspectors.length;
    const statusIdx = h % statuses.length;
    const syncIdx = (h >> 3) % 10;

    const entryDate = new Date(startDate.getTime() - i * (3600000 * 2 + (h % 7200000)));
    const dateStr = `${entryDate.toLocaleDateString("en-CA")}`;
    const timeStr = entryDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

    let syncState: HistoryEntry["syncState"];
    if (syncIdx < 6) syncState = "synced";
    else if (syncIdx < 8) syncState = "pending";
    else if (syncIdx < 9) syncState = "local";
    else syncState = "failed";

    const tagPool = ["battery", "temperature", "routine", "signal", "vibration", "motor", "calibration"];
    const tags: string[] = [];
    if ((h >> 2) % 3 === 0) tags.push(tagPool[h % tagPool.length]);
    if ((h >> 4) % 4 === 0) tags.push(tagPool[(h + 3) % tagPool.length]);

    entries.push({
      id: `hist_${String(i + 1).padStart(3, "0")}`,
      icon: eventTemplate.icon,
      date: dateStr,
      time: timeStr,
      assetId: inst.assetId,
      installationName: inst.name,
      installationType: inst.type,
      location: `${inst.siteName}`,
      event: eventTemplate.event,
      eventSubtitle: eventTemplate.subtitle,
      details: detailSets[detailIdx],
      status: statuses[statusIdx],
      syncState,
      user: inspectors[inspectorIdx].name,
      userRole: inspectors[inspectorIdx].role,
      tags,
    });
  }

  return entries;
}

const HISTORY_DATA = generateHistoryData();

const STATUS_CONFIG = {
  ok: { label: "OK", textClass: "text-green-700 dark:text-green-400", bgClass: "bg-green-50 dark:bg-green-950/40", borderClass: "border-green-200 dark:border-green-800", dotClass: "bg-green-500" },
  critical: { label: "Critical", textClass: "text-red-700 dark:text-red-400", bgClass: "bg-red-50 dark:bg-red-950/40", borderClass: "border-red-200 dark:border-red-800", dotClass: "bg-red-500" },
  attention: { label: "Attention", textClass: "text-orange-700 dark:text-orange-400", bgClass: "bg-orange-50 dark:bg-orange-950/40", borderClass: "border-orange-200 dark:border-orange-800", dotClass: "bg-orange-500" },
  info: { label: "Info", textClass: "text-blue-700 dark:text-blue-400", bgClass: "bg-blue-50 dark:bg-blue-950/40", borderClass: "border-blue-200 dark:border-blue-800", dotClass: "bg-blue-500" },
};

const SYNC_CONFIG = {
  synced: { label: "Synced", textClass: "text-green-700 dark:text-green-400", bgClass: "bg-green-50 dark:bg-green-950/40", borderClass: "border-green-200 dark:border-green-800", dotClass: "bg-green-500" },
  pending: { label: "Pending", textClass: "text-orange-700 dark:text-orange-400", bgClass: "bg-orange-50 dark:bg-orange-950/40", borderClass: "border-orange-200 dark:border-orange-800", dotClass: "bg-orange-500" },
  local: { label: "Local", textClass: "text-slate-600 dark:text-slate-400", bgClass: "bg-slate-100 dark:bg-slate-800", borderClass: "border-slate-200 dark:border-slate-700", dotClass: "bg-slate-400" },
  failed: { label: "Failed", textClass: "text-red-700 dark:text-red-400", bgClass: "bg-red-50 dark:bg-red-950/40", borderClass: "border-red-200 dark:border-red-800", dotClass: "bg-red-500" },
};

const STATUS_ICONS = {
  critical: { icon: AlertOctagon, color: "text-red-600 dark:text-red-400" },
  ok: { icon: CheckCircle2, color: "text-green-600 dark:text-green-400" },
  attention: { icon: AlertTriangle, color: "text-orange-600 dark:text-orange-400" },
  info: { icon: Info, color: "text-blue-600 dark:text-blue-400" },
};

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

const ROWS_PER_PAGE_OPTIONS = [8, 10, 25, 50];

const DEFAULT_TAGS = [
  { id: "battery", label: "Battery" },
  { id: "temperature", label: "Temperature" },
  { id: "signal", label: "Signal" },
  { id: "vibration", label: "Vibration" },
  { id: "sync-issues", label: "Sync Issues" },
];

const TAG_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  battery: Battery,
  temperature: Thermometer,
  signal: Wifi,
  vibration: Activity,
  "sync-issues": CloudOff,
  motor: Cog,
  calibration: Compass,
  routine: RotateCw,
  alerts: Bell,
  drafts: FileEdit,
};

const ALL_FILTER_OPTIONS = [
  { id: "battery", label: "Battery" },
  { id: "temperature", label: "Temperature" },
  { id: "signal", label: "Signal" },
  { id: "vibration", label: "Vibration" },
  { id: "sync-issues", label: "Sync Issues" },
  { id: "motor", label: "Motor" },
  { id: "calibration", label: "Calibration" },
  { id: "routine", label: "Routine" },
  { id: "alerts", label: "Alerts Only" },
  { id: "drafts", label: "Drafts" },
];

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [installationFilter, setInstallationFilter] = useState("all");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [showFilters, setShowFilters] = useState(true);
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>(
    DEFAULT_TAGS.map((t) => t.id)
  );
  const [showToast, setShowToast] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-01-12");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [historyEntries, setHistoryEntries] = useState(HISTORY_DATA);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deletedEntry, setDeletedEntry] = useState<HistoryEntry | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const addFilterRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (addFilterRef.current && !addFilterRef.current.contains(e.target as Node)) {
        setShowAddFilter(false);
      }
    }
    if (showAddFilter) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showAddFilter]);

  const filtered = useMemo(() => {
    let result = historyEntries.filter((entry) => {
      const matchesSearch =
        entry.installationName.toLowerCase().includes(search.toLowerCase()) ||
        entry.assetId.toLowerCase().includes(search.toLowerCase()) ||
        entry.event.toLowerCase().includes(search.toLowerCase()) ||
        entry.user.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
      const matchesInstallation = installationFilter === "all" ||
        INSTALLATIONS_DATA.find((i) => i.assetId === entry.assetId)?.id === installationFilter;
      const matchesDate = entry.date >= dateFrom && entry.date <= dateTo;
      return matchesSearch && matchesStatus && matchesInstallation && matchesDate;
    });

    result.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();
      return sortDir === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [search, statusFilter, installationFilter, sortDir, dateFrom, dateTo, historyEntries]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginatedData = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, installationFilter, rowsPerPage, dateFrom, dateTo]);

  const removeTag = (tagId: string) => {
    setActiveTagFilters((prev) => prev.filter((id) => id !== tagId));
  };

  function formatDateLabel(iso: string) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <>
    <div className="space-y-0 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">History</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Audit log &bull; {filtered.length} records
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Button variant="outline" className="h-10 px-3 text-sm gap-1.5 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="outline"
            className={`h-10 px-3 text-sm gap-1.5 cursor-pointer hover:bg-primary/10 hover:text-primary ${showFilters ? "border-primary text-primary" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 px-3 py-1.5 mb-4 mt-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">Restored item</p>
            <p className="text-xs text-green-700 dark:text-green-400">
              Draft inspection &quot;WT-03 – Wind Turbine 03&quot; has been restored.
            </p>
          </div>
          <button onClick={() => setShowToast(false)} className="shrink-0 p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors cursor-pointer flex items-center justify-center">
            <X className="h-4 w-4 text-green-600 dark:text-green-400" />
          </button>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
      <div className="space-y-2 bg-card rounded-lg border border-border p-2.5 mb-4">
        <div className="flex flex-col md:flex-row gap-3.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search inspections, events, inspectors..."
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
            <option value="ok">OK</option>
            <option value="attention">Attention</option>
            <option value="critical">Critical</option>
            <option value="info">Info</option>
          </select>
          <div className="relative" ref={dateRef}>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="h-12 px-3 rounded-lg border border-border bg-card text-sm flex items-center gap-2 text-foreground cursor-pointer min-w-[190px]"
            >
              <span className="text-sm">{formatDateLabel(dateFrom)} — {formatDateLabel(dateTo)}</span>
              <ChevronDown className={`h-3.5 w-3.5 ml-auto text-muted-foreground transition-transform ${showDatePicker ? "rotate-180" : ""}`} />
            </button>
            {showDatePicker && (
              <div className="absolute top-full mt-2 left-0 z-50 bg-card border border-border rounded-lg shadow-lg p-4 space-y-3 w-[280px]">
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
                    className="flex-1 h-8 text-xs"
                    onClick={() => { setDateFrom("2025-01-01"); setDateTo("2026-12-31"); setShowDatePicker(false); }}
                  >
                    All Time
                  </Button>
                  <Button
                    className="flex-1 h-8 text-xs"
                    onClick={() => setShowDatePicker(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeTagFilters.slice(0, 3).map((tagId) => {
            const tag = DEFAULT_TAGS.find((t) => t.id === tagId) || ALL_FILTER_OPTIONS.find((t) => t.id === tagId);
            if (!tag) return null;
            const TagIcon = TAG_ICONS[tag.id];
            return (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-[12px] font-medium border border-border bg-card text-foreground h-[44px] cursor-pointer"
              >
                {TagIcon && <TagIcon className="h-3.5 w-3.5 text-muted-foreground" />}
                {tag.label}
                <button
                  onClick={() => removeTag(tag.id)}
                  className="hover:text-red-500 transition-colors cursor-pointer flex items-center justify-center ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
          {activeTagFilters.length > 3 && (
            <span className="text-[12px] font-medium text-muted-foreground">
              +{activeTagFilters.length - 3} more
            </span>
          )}
          <div className="relative" ref={addFilterRef}>
            <button
              onClick={() => setShowAddFilter(!showAddFilter)}
              className="inline-flex items-center gap-1.5 px-2 py-1 text-[12px] font-medium text-primary cursor-pointer hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="underline">Add Filter</span>
            </button>
            {showAddFilter && (
              <div className="absolute left-0 top-full mt-2 z-50 w-56 bg-card border border-border rounded-lg shadow-lg py-2">
                <p className="px-3 pb-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Add a filter</p>
                {ALL_FILTER_OPTIONS.filter((opt) => !activeTagFilters.includes(opt.id)).map((opt) => (
                  <button
                    key={opt.id}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                    onClick={() => {
                      setActiveTagFilters((prev) => [...prev, opt.id]);
                      setShowAddFilter(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
                {ALL_FILTER_OPTIONS.filter((opt) => !activeTagFilters.includes(opt.id)).length === 0 && (
                  <p className="px-3 py-2 text-xs text-muted-foreground">All filters applied</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-8 px-2 py-2"></th>
                <th
                  className="text-left text-xs font-medium text-muted-foreground px-3 py-3 cursor-pointer whitespace-nowrap"
                  onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
                >
                  Date &amp; Time {sortDir === "desc" ? "↓" : "↑"}
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2">Installation</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2">Event</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2">Details</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-2 py-2">Sync</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-3 py-2">User</th>
                <th className="w-8 px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-0">
                    <EmptyState
                      icon={<Search className="h-8 w-8 text-muted-foreground" />}
                      title="No records found"
                      description="Try adjusting your search, filters, or date range."
                    />
                  </td>
                </tr>
              ) : paginatedData.map((entry) => {
                const statusCfg = STATUS_CONFIG[entry.status];
                const syncCfg = SYNC_CONFIG[entry.syncState];
                const TypeIcon = TYPE_ICONS[entry.installationType] || Fan;

                return (
                  <tr
                    key={entry.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-color"
                  >
                    {/* Icon */}
                    <td className="px-3 py-3">
                      <div className="h-10 w-10 rounded-lg bg-sky-50 dark:bg-sky-950/30 flex items-center justify-center">
                        <TypeIcon className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-2 py-2 whitespace-nowrap">
                      <p className="text-xs font-medium text-foreground">{entry.date}</p>
                      <p className="text-xs text-muted-foreground">{entry.time}</p>
                    </td>

                    {/* Installation */}
                    <td className="px-2 py-2 min-w-[140px]">
                      <p className="text-sm font-semibold text-foreground">{entry.assetId}</p>
                      <p className="text-xs text-muted-foreground">{entry.installationName}</p>
                      <p className="text-xs text-muted-foreground">{entry.location}</p>
                    </td>

                    {/* Event */}
                    <td className="px-2 py-2 min-w-[150px]">
                      <p className="text-[12px] font-semibold text-foreground">{entry.event}</p>
                      <p className="text-xs text-muted-foreground">{entry.eventSubtitle}</p>
                    </td>

                    {/* Details */}
                    <td className="px-2 py-2 min-w-[150px]">
                      {entry.details.map((line, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground leading-relaxed">{line}</p>
                      ))}
                    </td>

                    {/* Status */}
                    <td className="px-2 py-2">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase ${statusCfg.bgClass} ${statusCfg.borderClass} ${statusCfg.textClass}`}>
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Sync */}
                    <td className="px-2 py-2">
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase ${syncCfg.bgClass} ${syncCfg.borderClass} ${syncCfg.textClass}`}>
                        {syncCfg.label}
                      </span>
                    </td>

                    {/* User */}
                    <td className="px-3 py-3 whitespace-nowrap">
                      <p className="text-xs font-medium text-foreground">{entry.user}</p>
                      <p className="text-[11px] text-muted-foreground">{entry.userRole}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <div className="relative" ref={openMenuId === entry.id ? menuRef : undefined}>
                        <button
                          className="p-1 rounded hover:bg-muted transition-colors flex items-center justify-center cursor-pointer"
                          onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)}
                        >
                          <MoreVertical className="h-6 w-6 text-foreground" />
                        </button>

                        {openMenuId === entry.id && (
                          <div className="absolute right-0 top-8 z-50 w-52 rounded-lg border border-border bg-card shadow-lg py-1 animate-in fade-in-0 zoom-in-95">
                            <button
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              View Full Details
                            </button>
                            <button
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <RotateCcw className="h-4 w-4 text-muted-foreground" />
                              Restore / Revert
                            </button>
                            <button
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              Export as PDF
                            </button>
                            <button
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Copy className="h-4 w-4 text-muted-foreground" />
                              Copy Record ID
                            </button>
                            <div className="my-1 border-t border-border" />
                            <button
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              Add Note
                            </button>
                            <button
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Flag className="h-4 w-4 text-muted-foreground" />
                              Flag for Review
                            </button>
                            <button
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Share2 className="h-4 w-4 text-muted-foreground" />
                              Share Entry
                            </button>
                            <div className="my-1 border-t border-border" />
                            <button
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                              onClick={() => { setDeleteTarget(entry.id); setOpenMenuId(null); }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Record
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} records
          </p>
          <div className="flex items-center gap-3">
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
                    variant={currentPage === totalPages ? "default" : "outline"}
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
          </div>
        </div>
      </div>
    </div>

      <DeleteConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="Delete Record"
        description="This action will remove the history record. You can undo this action within 5 seconds."
        onConfirm={() => {
          if (deleteTarget) {
            const entry = historyEntries.find((e) => e.id === deleteTarget);
            if (entry) {
              setDeletedEntry(entry);
              setHistoryEntries((prev) => prev.filter((e) => e.id !== deleteTarget));
              setShowUndo(true);
            }
            setDeleteTarget(null);
          }
        }}
      />

      <UndoSnackbar
        message="Record deleted"
        visible={showUndo}
        onUndo={() => {
          if (deletedEntry) {
            setHistoryEntries((prev) => [...prev, deletedEntry].sort((a, b) => b.date.localeCompare(a.date)));
            setDeletedEntry(null);
          }
          setShowUndo(false);
        }}
        onDismiss={() => { setShowUndo(false); setDeletedEntry(null); }}
      />
    </>
  );
}
