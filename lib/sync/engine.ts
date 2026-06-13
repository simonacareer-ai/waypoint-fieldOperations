import { db } from "@/lib/dexie/database";

function calculateBackoff(retryCount: number): string {
  const baseMs = 1000;
  const delay = baseMs * Math.pow(2, retryCount);
  return new Date(Date.now() + delay).toISOString();
}

function isConflict(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes("conflict") || error.message.includes("409");
  }
  return false;
}

export async function processSyncQueue(): Promise<void> {
  if (!navigator.onLine) return;

  const items = await db.syncQueue
    .where("status")
    .anyOf(["pending", "failed"])
    .sortBy("createdAt");

  for (const item of items) {
    try {
      await db.syncQueue.update(item.id, { status: "syncing" });

      const response = await fetch("/api/sync/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              entityType: item.entityType,
              entityId: item.entityId,
              action: item.action,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }

      await db.syncQueue.update(item.id, { status: "synced" });
    } catch (error) {
      const retryCount = item.retryCount + 1;
      const nextRetryAt = calculateBackoff(retryCount);

      await db.syncQueue.update(item.id, {
        status: isConflict(error) ? "conflict" : "failed",
        retryCount,
        nextRetryAt,
        lastError: String(error),
      });
    }
  }
}

export async function addToSyncQueue(
  entityType: string,
  entityId: string,
  action: string
): Promise<void> {
  await db.syncQueue.add({
    id: `sq_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    entityType,
    entityId,
    action,
    status: "pending",
    retryCount: 0,
    createdAt: new Date().toISOString(),
  });
}
