"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Cloud,
  Smartphone,
  CheckCircle2,
  X,
  Eye,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConflictField {
  field: string;
  label: string;
  localValue: string;
  serverValue: string;
}

interface SyncConflict {
  id: string;
  entityType: "inspection" | "inspectionDraft" | "attachment";
  entityId: string;
  entityName: string;
  detectedAt: string;
  localUpdatedAt: string;
  serverUpdatedAt: string;
  localUser: string;
  serverUser: string;
  localSummary: string[];
  serverSummary: string[];
  fields: ConflictField[];
}

const MOCK_CONFLICT: SyncConflict = {
  id: "conflict_001",
  entityType: "inspection",
  entityId: "insp_001",
  entityName: "WT-03 — Wind Turbine 03",
  detectedAt: "2026-01-12T11:00:00Z",
  localUpdatedAt: "2026-01-12T10:24:00Z",
  serverUpdatedAt: "2026-01-12T09:58:00Z",
  localUser: "Simona D.",
  serverUser: "Andrew K.",
  localSummary: ["Battery level 14%", "Added photo", "Step 2 of 4"],
  serverSummary: ["Battery level 18%", "No photo", "Step 1 of 4"],
  fields: [
    {
      field: "status",
      label: "Status",
      localValue: "Critical",
      serverValue: "Attention",
    },
    {
      field: "measurements.batteryPct",
      label: "Battery %",
      localValue: "14%",
      serverValue: "18%",
    },
    {
      field: "notes",
      label: "Notes",
      localValue: "Battery below threshold. Recommend immediate replacement.",
      serverValue: "Battery level declining. Schedule maintenance check.",
    },
  ],
};

type Resolution = "keep-local" | "keep-server" | "merge";
type FieldResolution = Record<string, "local" | "server">;

export function ConflictPanel() {
  const [conflict] = useState<SyncConflict>(MOCK_CONFLICT);
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [fieldResolutions, setFieldResolutions] = useState<FieldResolution>({});
  const [resolved, setResolved] = useState(false);
  const [showMergePreview, setShowMergePreview] = useState(false);

  const handleFieldChoice = (field: string, choice: "local" | "server") => {
    setFieldResolutions((prev) => ({ ...prev, [field]: choice }));
  };

  const allFieldsResolved =
    resolution === "merge"
      ? conflict.fields.every((f) => fieldResolutions[f.field])
      : resolution !== null;

  const handleResolve = () => {
    setResolved(true);
  };

  if (resolved) {
    return (
      <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground">Conflict Resolved</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {resolution === "keep-local" && "Your local version has been kept. It will sync on next push."}
          {resolution === "keep-server" && "The server version has been accepted. Your local copy is updated."}
          {resolution === "merge" && "Your merged version has been saved locally. It will sync on next push."}
        </p>
        <Button className="mt-4 cursor-pointer" onClick={() => { setResolved(false); setResolution(null); setFieldResolutions({}); setShowMergePreview(false); }}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-orange-50 dark:bg-orange-950/20 px-5 py-5 border-b border-orange-200/50 dark:border-orange-800/30">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground">Sync Issue Detected</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              We found a conflict while syncing.<br />
              Review and choose how to proceed.
            </p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Dismiss" className="cursor-pointer shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Entity info + conflict type */}
      <div className="px-5 py-4 border-b border-border">
        <h4 className="text-base font-bold text-foreground">{conflict.entityName}</h4>
        <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
          Field vs Server Conflict
        </span>
      </div>

      {/* What happened - explanation */}
      <div className="px-5 py-4 border-b border-border">
        <h4 className="text-sm font-bold text-foreground mb-1">What happened?</h4>
        <p className="text-sm text-muted-foreground">
          This inspection was updated on this device and on the server.<br />
          We need to know which version to keep.
        </p>
      </div>

      {/* Side-by-side comparison */}
      {!resolution && (
        <div className="px-5 py-4 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Local side */}
            <div className="rounded-lg border border-primary/20 bg-primary/[0.02] px-4 py-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Smartphone className="h-3.5 w-3.5 text-primary" />
                <p className="text-xs font-bold text-primary">This Device (Local)</p>
              </div>
              <p className="text-[11px] text-muted-foreground">Inspection done by — <span className="text-[13px] font-medium text-foreground">{conflict.localUser}</span></p>
              <p className="text-[11px] text-muted-foreground mb-2">Time — <span className="text-[13px] font-medium text-foreground">{new Date(conflict.localUpdatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span></p>
              <div className="space-y-1">
                {conflict.localSummary.map((item, i) => (
                  <p key={i} className="text-xs text-foreground">{item}</p>
                ))}
              </div>
            </div>

            {/* Server side */}
            <div className="rounded-lg border border-blue-200 dark:border-blue-800/50 bg-blue-50/20 dark:bg-blue-950/10 px-4 py-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Cloud className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Server (Cloud)</p>
              </div>
              <p className="text-[11px] text-muted-foreground">Inspection done by — <span className="text-[13px] font-medium text-foreground">{conflict.serverUser}</span></p>
              <p className="text-[11px] text-muted-foreground mb-2">Time — <span className="text-[13px] font-medium text-foreground">{new Date(conflict.serverUpdatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span></p>
              <div className="space-y-1">
                {conflict.serverSummary.map((item, i) => (
                  <p key={i} className="text-xs text-foreground">{item}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resolution buttons - shown before selecting a strategy */}
      {!resolution && (
        <div className="px-5 py-5">
          <h4 className="text-sm font-bold text-foreground mb-3">How would you like to proceed?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <Button
              onClick={() => { setResolution("keep-local"); handleResolve(); }}
              className="h-12 text-sm font-semibold cursor-pointer"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Keep My Version (Local)
            </Button>
            <Button
              variant="outline"
              onClick={() => { setResolution("keep-server"); handleResolve(); }}
              className="h-12 text-sm font-semibold cursor-pointer text-primary border-primary"
            >
              <Cloud className="h-4 w-4 mr-2" />
              Use Server Version
            </Button>
            <Button
              variant="outline"
              onClick={() => setResolution("merge")}
              className="h-12 text-sm font-semibold cursor-pointer text-primary border-primary"
            >
              <Eye className="h-4 w-4 mr-2" />
              Merge &amp; Review
            </Button>
          </div>
        </div>
      )}

      {/* Field-by-field merge picker */}
      {resolution === "merge" && !showMergePreview && (
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-foreground mb-3">
            Select which version to keep for each field:
          </p>
          <div className="space-y-4">
            {conflict.fields.map((field) => (
              <div key={field.field} className="rounded-lg border border-border overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    {field.label}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <button
                    onClick={() => handleFieldChoice(field.field, "local")}
                    className={cn(
                      "p-4 text-left border-b md:border-b-0 md:border-r border-border transition-all cursor-pointer",
                      fieldResolutions[field.field] === "local"
                        ? "bg-primary/5 ring-2 ring-primary ring-inset"
                        : "hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[10px] font-semibold text-primary uppercase">Local</span>
                      {fieldResolutions[field.field] === "local" && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                      )}
                    </div>
                    <p className="text-sm text-foreground">{field.localValue}</p>
                  </button>
                  <button
                    onClick={() => handleFieldChoice(field.field, "server")}
                    className={cn(
                      "p-4 text-left transition-all cursor-pointer",
                      fieldResolutions[field.field] === "server"
                        ? "bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500 ring-inset"
                        : "hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase">Server</span>
                      {fieldResolutions[field.field] === "server" && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                      )}
                    </div>
                    <p className="text-sm text-foreground">{field.serverValue}</p>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Merged result preview */}
      {resolution === "merge" && showMergePreview && (
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-4 w-4 text-green-600" />
            <p className="text-sm font-bold text-foreground">Merged Result Preview</p>
            <span className="text-[10px] text-muted-foreground ml-1">— Verify before confirming</span>
          </div>
          <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/10 overflow-hidden">
            <div className="divide-y divide-green-100 dark:divide-green-900/30">
              {conflict.fields.map((field) => {
                const source = fieldResolutions[field.field];
                const value = source === "local" ? field.localValue : field.serverValue;
                return (
                  <div key={field.field} className="flex items-start gap-4 px-4 py-3">
                    <span className="text-xs font-medium text-muted-foreground w-24 shrink-0 pt-0.5">
                      {field.label}
                    </span>
                    <p className="text-sm font-medium text-foreground flex-1">{value}</p>
                    {source === "local" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                        <Smartphone className="h-3 w-3" /> Local
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/30 px-2 py-0.5 rounded-full shrink-0">
                        <Cloud className="h-3 w-3" /> Server
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Merge actions */}
      {resolution === "merge" && (
        <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {showMergePreview ? (
            <>
              <Button
                variant="ghost"
                onClick={() => setShowMergePreview(false)}
                className="cursor-pointer"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Selections
              </Button>
              <Button onClick={handleResolve} className="cursor-pointer">
                Confirm &amp; Resolve
                <CheckCircle2 className="h-4 w-4 ml-2" />
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                {!allFieldsResolved ? "Pick a version for each field to continue." : "All fields selected. Preview the merged result."}
              </p>
              <Button
                disabled={!allFieldsResolved}
                onClick={() => setShowMergePreview(true)}
                className="cursor-pointer"
              >
                Preview Result
                <Eye className="h-4 w-4 ml-2" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
