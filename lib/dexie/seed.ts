import { db } from "./database";
import { INSTALLATIONS_DATA, INSPECTIONS_DATA } from "@/lib/seed-data";

let seedPromise: Promise<void> | null = null;

export async function seedDatabase(): Promise<void> {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const orphaned = await db.inspections.filter((r) => !r.installationId).toArray();
    if (orphaned.length > 0) {
      await db.inspections.bulkDelete(orphaned.map((r) => r.id));
    }

    const count = await db.inspections.count();
    if (count > 0) return;

    await db.transaction("rw", [db.installations, db.inspections], async () => {
      await db.installations.bulkPut(
        INSTALLATIONS_DATA.map((inst) => ({
          id: inst.id,
          workspaceId: "ws_default",
          assetId: inst.assetId,
          name: inst.name,
          type: inst.type,
          siteName: inst.siteName,
          status: inst.status,
          batteryPct: inst.batteryPct,
          temperatureC: inst.temperatureC,
          signalStrength: inst.signalStrength,
          vibrationMmS: inst.vibrationMmS,
          lastInspectedAt: inst.lastInspectedAt,
          tags: inst.tags,
          updatedAt: new Date().toISOString(),
        }))
      );

      await db.inspections.bulkPut(
        INSPECTIONS_DATA.map((insp) => ({
          id: insp.id,
          workspaceId: "ws_default",
          installationId: insp.installationId,
          inspectorId: insp.inspector,
          status: insp.status,
          measurements: {
            batteryPct: insp.batteryPct,
            temperatureC: insp.temperatureC,
          },
          notes: insp.notes,
          tags: insp.tags,
          attachmentIds: [],
          inspectedAt: `${insp.date}T${insp.time}`,
          syncState: insp.syncState,
          updatedAt: new Date().toISOString(),
        }))
      );
    });
  })();

  return seedPromise;
}
