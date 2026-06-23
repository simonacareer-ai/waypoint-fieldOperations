"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Clock,
  Wifi,
  Shield,
  Info,
  FileText,
  Image as ImageIcon,
  ClipboardList,
  MoreVertical,
  ArrowRight,
  ChevronRight,
  HardDrive,
  CloudUpload,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ConflictPanel } from "@/components/offline-sync/conflict-panel";
import { useInspectionCounts } from "@/hooks/use-dexie-data";

interface SyncItem {
  id: string;
  name: string;
  type: "form" | "photo" | "inspection";
  time: string;
  status: "synced" | "syncing" | "pending" | "failed";
  progress?: number;
}

const INITIAL_ACTIVITY: SyncItem[] = [
  { id: "a1", name: "Daily Safety Inspection", type: "form", time: "9:38 AM", status: "synced" },
  { id: "a2", name: "Asset Check – Excavator 204", type: "form", time: "9:36 AM", status: "synced" },
  { id: "a3", name: "Site Photo – North Area", type: "photo", time: "9:35 AM", status: "synced" },
  { id: "a4", name: "Work Log – Concrete Pour", type: "form", time: "9:33 AM", status: "syncing" },
  { id: "a5", name: "Daily Pre-Trip Inspection", type: "form", time: "9:32 AM", status: "syncing" },
];

interface FailedItem {
  id: string;
  name: string;
  type: "form" | "photo" | "inspection";
  time: string;
  status: "failed";
}

const INITIAL_FAILED: FailedItem[] = [
  { id: "f1", name: "Incident Report – 05/13", type: "form", time: "9:31 AM", status: "failed" },
  { id: "f2", name: "Site Photo – South Area", type: "photo", time: "9:30 AM", status: "failed" },
];

export default function OfflineSyncPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [syncActivity, setSyncActivity] = useState<SyncItem[]>(INITIAL_ACTIVITY);
  const [failedItems, setFailedItems] = useState<FailedItem[]>(INITIAL_FAILED);
  const [syncingNow, setSyncingNow] = useState(true);
  const [syncProgress, setSyncProgress] = useState(60);
  const [syncedTotal, setSyncedTotal] = useState(5);
  const [syncingTotal] = useState(12);
  const [currentSyncItem] = useState("Uploading Work Log – Concrete Pour");

  const { counts } = useInspectionCounts();
  const savedLocally = counts.pendingSync;
  const syncingCount = counts.syncing;
  const syncedCount = counts.synced;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!syncingNow) return;
    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          setSyncedTotal((t) => Math.min(t + 1, syncingTotal));
          return 0;
        }
        return prev + 2;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [syncingNow, syncingTotal]);

  const handleRetry = useCallback((id: string) => {
    setFailedItems((items) => items.filter((i) => i.id !== id));
    setSyncActivity((items) => [
      { id, name: id === "f1" ? "Incident Report – 05/13" : "Site Photo – South Area", type: "form", time: "Now", status: "syncing" },
      ...items,
    ]);
  }, []);

  const handleCancelSync = useCallback(() => {
    setSyncingNow(false);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "form": return FileText;
      case "photo": return ImageIcon;
      case "inspection": return ClipboardList;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      <PageHeader
        title="Offline & Sync"
        description="Your work is saved locally and will sync when you're back online."
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card">
              <div className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{isOnline ? "Online" : "Offline"}</p>
                <p className="text-[10px] text-muted-foreground">{isOnline ? "Good connection" : "No connection"}</p>
              </div>
            </div>
          </div>
        }
      />

      {/* Status Banner */}
      <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
        <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold text-foreground">You&apos;re all set.</p>
          <p className="text-sm text-muted-foreground">All work is saved locally. We&apos;ll sync everything when you&apos;re back online.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-green-600" />
          <span>Your data is safe on this device.</span>
        </div>
        <Button variant="outline" className="h-12 px-5 shrink-0 cursor-pointer">
          Learn more
          <Info className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Stats Cards + Sync Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column: 3 stat cards */}
        <div className="lg:col-span-2 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Saved Locally */}
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <HardDrive className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Saved Locally</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{savedLocally} <span className="text-base font-normal text-muted-foreground">items</span></p>
                <p className="text-xs text-muted-foreground mt-1">Waiting to sync</p>
                <button className="flex items-center gap-1 text-xs text-primary font-medium mt-3 cursor-pointer hover:underline">
                  View queue <ChevronRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>

            {/* Syncing */}
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
                  <span className="text-sm font-medium text-foreground">Syncing</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{syncingCount} <span className="text-base font-normal text-muted-foreground">items</span></p>
                <p className="text-xs text-muted-foreground mt-1">Sync in progress</p>
                <button className="flex items-center gap-1 text-xs text-primary font-medium mt-3 cursor-pointer hover:underline">
                  View progress <ChevronRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>

            {/* Synced */}
            <Card className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-foreground">Synced</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{syncedCount} <span className="text-base font-normal text-muted-foreground">items</span></p>
                <p className="text-xs text-muted-foreground mt-1">Synced today</p>
                <button className="flex items-center gap-1 text-xs text-primary font-medium mt-3 cursor-pointer hover:underline">
                  View history <ChevronRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Syncing Now */}
          {syncingNow && (
            <Card className="border-border">
              <CardContent className="p-5 pt-0 mt-[-2px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-foreground">Syncing now</h3>
                  <span className="text-sm text-muted-foreground">{syncedTotal} of {syncingTotal} items</span>
                </div>
                <div className="w-full bg-border rounded-full h-2 mb-4">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(syncedTotal / syncingTotal) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{currentSyncItem}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 bg-border rounded-full h-1.5 max-w-[300px]">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${syncProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{syncProgress}%</span>
                    </div>
                  </div>
                  <button onClick={handleCancelSync} className="p-2 hover:bg-accent rounded-lg cursor-pointer ml-3">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Wifi className="h-3.5 w-3.5 text-green-500" />
                  <span>Good connection • Estimated time: 30 seconds</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Needs Attention */}
          {failedItems.length > 0 && (
            <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 pb-0">
              <CardContent className="p-5 pb-0">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 id="failed" className="text-base font-semibold text-foreground">Needs attention</h3>
                  <span className="text-sm text-muted-foreground ml-1">{failedItems.length} items failed to sync</span>
                </div>
                <div className="space-y-3">
                  {failedItems.map((item) => {
                    const TypeIcon = getTypeIcon(item.type);
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                        <TypeIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                        </div>
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">Failed</span>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                        <Button
                          variant="outline"
                          className="h-9 px-3 text-xs border-red-300 bg-red-50 text-red-600 hover:bg-red-50/50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30 cursor-pointer"
                          onClick={() => handleRetry(item.id)}
                        >
                          Retry
                        </Button>
                        <button className="p-1.5 hover:bg-accent rounded cursor-pointer items-center justify-center">
                          <MoreVertical className="h-6 w-6 text-muted-foreground" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button className="flex items-center gap-1 text-xs text-primary font-medium mt-1 cursor-pointer hover:underline">
                  View all failed items <ChevronRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Sync activity */}
        <div className="space-y-5">
          <Card className="border-border">
            <CardContent className="p-5 pt-0 mt-[-8px]">
              <div className="flex items-center justify-between mb-4 ">
                <h3 className="text-base font-semibold text-foreground">Sync activity</h3>
                <button className="text-xs text-primary font-medium cursor-pointer hover:underline">View all</button>
              </div>
              <div className="space-y-4">
                {syncActivity.map((item) => {
                  const TypeIcon = getTypeIcon(item.type);
                  return (
                    <div key={item.id} className="flex items-start gap-3">
                      <TypeIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">{item.type} • {item.time}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.status === "synced" && (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">Synced</span>
                          </>
                        )}
                        {item.status === "syncing" && (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                            <span className="text-xs font-medium text-muted-foreground">Syncing</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
                <Wifi className="h-3.5 w-3.5 text-green-500" />
                <span>Auto-sync is on. We&apos;ll sync when connectivity is available.</span>
              </div>
            </CardContent>
          </Card>

          {/* Pick up where you left off */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Cloud className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-primary">Pick up where you left off</h3>
                <p className="text-sm text-muted-foreground mt-1.5">
                  You have unsynced work. We&apos;ll keep it safe on this device until it syncs.
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-primary">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <Button variant="outline" className="h-11 px-5 mt-4 cursor-pointer">
                  View my work
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conflict Resolution */}
      <section id="conflicts" aria-labelledby="conflict-heading">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h2 id="conflict-heading" className="text-base font-semibold text-foreground">Sync Conflicts (1)</h2>
          <span className="text-xs text-muted-foreground">Resolve before next sync</span>
        </div>
        <ConflictPanel />
      </section>

      {/* Footer status bar */}
      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          <span>All data is stored securely on this device and will sync to Waypoint when you&apos;re back online.</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Last synced: Today, 9:28 AM</span>
        </div>
      </div>

      {/* Auto-sync toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
        <div className="flex items-center gap-3">
          <CloudUpload className="h-6 w-6 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Auto-sync</p>
            <p className="text-xs text-muted-foreground">Automatically sync when connection is available</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">{autoSync ? "ON" : "OFF"}</span>
          <Switch checked={autoSync} onCheckedChange={setAutoSync} />
        </div>
      </div>
    </div>
  );
}
