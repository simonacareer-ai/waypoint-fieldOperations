"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/dexie/database";
import { seedDatabase } from "@/lib/dexie/seed";
import type { Installation, Inspection } from "@/lib/seed-data";

export function useInstallations() {
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    seedDatabase().then(() => setSeeded(true));
  }, []);

  const raw = useLiveQuery(
    () => db.installations.toArray(),
    [seeded]
  );

  const installations: Installation[] = (raw ?? []).map((r) => ({
    id: r.id,
    assetId: r.assetId,
    name: r.name,
    type: r.type as Installation["type"],
    siteName: r.siteName,
    location: r.siteName,
    status: r.status as Installation["status"],
    batteryPct: r.batteryPct ?? 0,
    temperatureC: r.temperatureC ?? 0,
    signalStrength: (r.signalStrength ?? "moderate") as Installation["signalStrength"],
    vibrationMmS: r.vibrationMmS ?? 0,
    lastInspectedAt: r.lastInspectedAt ?? "",
    tags: r.tags ?? [],
  }));

  return { installations, loading: !seeded || raw === undefined };
}

export function useInspections() {
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    seedDatabase().then(() => setSeeded(true));
  }, []);

  const raw = useLiveQuery(
    () => db.inspections.toArray(),
    [seeded]
  );

  const installationsRaw = useLiveQuery(
    () => db.installations.toArray(),
    [seeded]
  );

  const inspections: Inspection[] = (raw ?? [])
    .filter((r) => r.installationId)
    .map((r) => {
      const inst = (installationsRaw ?? []).find((i) => i.id === r.installationId);
      return {
        id: r.id,
        installationId: r.installationId,
        installation: inst?.name ?? "Unknown",
        assetId: inst?.assetId ?? "",
        location: inst?.siteName ?? "",
        status: r.status as Inspection["status"],
        syncState: r.syncState as Inspection["syncState"],
        inspector: r.inspectorId,
        inspectorRole: "",
        date: r.inspectedAt.split("T")[0],
        time: r.inspectedAt.split("T")[1] ?? "00:00",
        notes: r.notes ?? "",
        duration: 0,
        fieldsCompleted: 4,
        totalFields: 4,
        batteryPct: (r.measurements as Record<string, number>)?.batteryPct ?? 0,
        temperatureC: (r.measurements as Record<string, number>)?.temperatureC ?? null,
        tags: r.tags ?? [],
        isDraft: false,
      };
    });

  return { inspections, loading: !seeded || raw === undefined };
}

export async function addInspection(data: {
  installationId: string;
  status: string;
  measurements: Record<string, unknown>;
  notes: string;
  tags: string[];
}): Promise<string> {
  if (!data.installationId) {
    throw new Error("Cannot save inspection without a selected installation.");
  }
  const id = `insp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await db.inspections.add({
    id,
    workspaceId: "ws_default",
    installationId: data.installationId,
    inspectorId: "Simona D.",
    status: data.status,
    measurements: data.measurements,
    notes: data.notes,
    tags: data.tags,
    attachmentIds: [],
    inspectedAt: new Date().toISOString(),
    syncState: "local-only",
    updatedAt: new Date().toISOString(),
  });
  return id;
}

