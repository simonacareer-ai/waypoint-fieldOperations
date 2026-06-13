"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Cloud,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  X,
  GitMerge,
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
  fields: ConflictField[];
}

const MOCK_CONFLICT: SyncConflict = {
  id: "conflict_001",
  entityType: "inspection",
  entityId: "insp_001",
  entityName: "WT-03 — Wind Turbine 03",
  detectedAt: "2026-01-12T11:00:00Z",
  localUpdatedAt: "2026-01-12T10:45:00Z",
  serverUpdatedAt: "2026-01-12T10:50:00Z",
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
      serverValue: "22%",
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
      <div className="rounded-xl border-2 border-success-500/30 bg-success-50 p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-success-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-foreground">Conflict Resolved</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {resolution === "keep-local" && "Your local version has been kept. It will sync on next push."}
          {resolution === "keep-server" && "The server version has been accepted. Your local copy is updated."}
          {resolution === "merge" && "Your merged version has been saved locally. It will sync on next push."}
        </p>
        <Button className="mt-4 cursor-pointer" onClick={() => setResolved(false)}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-warning-500/30 bg-card overflow-hidden">
      {/* Header */}
      <div className="bg-warning-50 px-5 py-4 border-b border-warning-500/20">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-warning-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-warning-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground">Sync Conflict Detected</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              This record was modified on both this device and the server since the last sync.
            </p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Dismiss" className="cursor-pointer shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Entity info */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <GitMerge className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{conflict.entityName}</p>
            <p className="text-xs text-muted-foreground">
              Inspection • Conflict detected {new Date(conflict.detectedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Resolution strategy */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-medium text-foreground mb-3">Choose how to resolve:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setResolution("keep-local")}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
              resolution === "keep-local"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            )}
          >
            <Smartphone className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Keep Local</p>
              <p className="text-[11px] text-muted-foreground">Use your device&apos;s version</p>
            </div>
          </button>
          <button
            onClick={() => setResolution("keep-server")}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
              resolution === "keep-server"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            )}
          >
            <Cloud className="h-5 w-5 text-info-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Keep Server</p>
              <p className="text-[11px] text-muted-foreground">Accept the remote version</p>
            </div>
          </button>
          <button
            onClick={() => setResolution("merge")}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
              resolution === "merge"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            )}
          >
            <GitMerge className="h-5 w-5 text-warning-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Merge Fields</p>
              <p className="text-[11px] text-muted-foreground">Pick field by field</p>
            </div>
          </button>
        </div>
      </div>

      {/* Field-by-field comparison */}
      {resolution === "merge" && !showMergePreview && (
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-medium text-foreground mb-3">
            Select which version to keep for each field:
          </p>
          <div className="space-y-4">
            {conflict.fields.map((field) => (
              <div key={field.field} className="rounded-lg border border-border overflow-hidden">
                <div className="bg-secondary/50 px-4 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    {field.label}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Local version */}
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
                      <span className="text-[10px] font-semibold text-primary uppercase">
                        Local (This Device)
                      </span>
                      {fieldResolutions[field.field] === "local" && (
                        <CheckCircle2 className="h-4 w-4 text-success-500 ml-auto" />
                      )}
                    </div>
                    <p className="text-sm text-foreground">{field.localValue}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Updated {new Date(conflict.localUpdatedAt).toLocaleTimeString()}
                    </p>
                  </button>
                  {/* Server version */}
                  <button
                    onClick={() => handleFieldChoice(field.field, "server")}
                    className={cn(
                      "p-4 text-left transition-all cursor-pointer",
                      fieldResolutions[field.field] === "server"
                        ? "bg-info-50/50 ring-2 ring-info-500 ring-inset"
                        : "hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="h-3.5 w-3.5 text-info-500" />
                      <span className="text-[10px] font-semibold text-info-700 uppercase">
                        Server (Remote)
                      </span>
                      {fieldResolutions[field.field] === "server" && (
                        <CheckCircle2 className="h-4 w-4 text-success-500 ml-auto" />
                      )}
                    </div>
                    <p className="text-sm text-foreground">{field.serverValue}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Updated {new Date(conflict.serverUpdatedAt).toLocaleTimeString()}
                    </p>
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
            <Eye className="h-4 w-4 text-success-600" />
            <p className="text-sm font-semibold text-foreground">Merged Result Preview</p>
            <span className="text-[10px] text-muted-foreground ml-1">
              — Verify before confirming
            </span>
          </div>
          <div className="rounded-xl border-2 border-success-500/20 bg-success-50/30 dark:bg-success-950/10 overflow-hidden">
            <div className="divide-y divide-success-500/10">
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
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-info-700 bg-info-500/10 px-2 py-0.5 rounded-full shrink-0">
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

      {/* Comparison preview for keep-local / keep-server */}
      {(resolution === "keep-local" || resolution === "keep-server") && (
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-medium text-foreground mb-3">Changes that will be applied:</p>
          <div className="space-y-2">
            {conflict.fields.map((field) => (
              <div key={field.field} className="flex items-center gap-3 text-sm">
                <span className="w-20 text-xs text-muted-foreground shrink-0">{field.label}</span>
                <span className="text-foreground font-medium">
                  {resolution === "keep-local" ? field.localValue : field.serverValue}
                </span>
                {resolution === "keep-local" ? (
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-primary">
                    <Smartphone className="h-3 w-3" /> local
                  </span>
                ) : (
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-info-700">
                    <Cloud className="h-3 w-3" /> server
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-4 flex items-center justify-between gap-3">
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
            <Button
              onClick={handleResolve}
              className="cursor-pointer"
            >
              Confirm & Resolve
              <CheckCircle2 className="h-4 w-4 ml-2" />
            </Button>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              {!resolution && "Select a resolution strategy above."}
              {resolution === "merge" && !allFieldsResolved && "Pick a version for each field to continue."}
              {resolution === "merge" && allFieldsResolved && "All fields selected. Preview the merged result."}
              {(resolution === "keep-local" || resolution === "keep-server") && allFieldsResolved && "Ready to resolve this conflict."}
            </p>
            {resolution === "merge" && allFieldsResolved ? (
              <Button
                onClick={() => setShowMergePreview(true)}
                className="cursor-pointer"
              >
                Preview Result
                <Eye className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                disabled={!allFieldsResolved}
                onClick={handleResolve}
                className="cursor-pointer"
              >
                Resolve Conflict
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
