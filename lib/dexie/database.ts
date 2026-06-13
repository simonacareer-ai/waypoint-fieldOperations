import Dexie, { type EntityTable } from "dexie";

export interface DexieWorkspace {
  id: string;
  name: string;
  code: string;
  region?: string;
  updatedAt: string;
}

export interface DexieInstallation {
  id: string;
  workspaceId: string;
  assetId: string;
  name: string;
  type: string;
  siteName: string;
  status: string;
  batteryPct?: number;
  temperatureC?: number;
  signalStrength?: string;
  vibrationMmS?: number;
  imageUrl?: string;
  lastInspectedAt?: string;
  tags: string[];
  updatedAt: string;
}

export interface DexieInspectionDraft {
  id: string;
  workspaceId: string;
  installationId?: string;
  step: string;
  status?: string;
  measurements: Record<string, unknown>;
  notes?: string;
  tags: string[];
  attachmentIds: string[];
  syncState: string;
  lastSavedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DexieInspection {
  id: string;
  workspaceId: string;
  installationId: string;
  inspectorId: string;
  status: string;
  measurements: Record<string, unknown>;
  notes?: string;
  tags: string[];
  attachmentIds: string[];
  inspectedAt: string;
  syncState: string;
  sourceDraftId?: string;
  updatedAt: string;
}

export interface DexieAttachment {
  id: string;
  draftId?: string;
  inspectionId?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  localUrl?: string;
  remoteUrl?: string;
  syncState: string;
  createdAt: string;
}

export interface DexieSyncQueueItem {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  status: string;
  retryCount: number;
  nextRetryAt?: string;
  lastError?: string;
  createdAt: string;
}

export interface DexieSettings {
  id: string;
  userId: string;
  themeMode: string;
  autoSync: boolean;
  syncOnWifiOnly: boolean;
  notificationsEnabled: boolean;
  reducedMotion: boolean;
  updatedAt: string;
}

export interface DexieNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const db = new Dexie("WaypointFieldOps") as Dexie & {
  workspaces: EntityTable<DexieWorkspace, "id">;
  installations: EntityTable<DexieInstallation, "id">;
  inspectionDrafts: EntityTable<DexieInspectionDraft, "id">;
  inspections: EntityTable<DexieInspection, "id">;
  attachments: EntityTable<DexieAttachment, "id">;
  syncQueue: EntityTable<DexieSyncQueueItem, "id">;
  settings: EntityTable<DexieSettings, "id">;
  notifications: EntityTable<DexieNotification, "id">;
};

db.version(1).stores({
  workspaces: "id, name, updatedAt",
  installations: "id, workspaceId, assetId, name, status, updatedAt",
  inspectionDrafts: "id, workspaceId, installationId, step, status, updatedAt, createdAt",
  inspections: "id, workspaceId, installationId, syncState, inspectedAt, updatedAt",
  attachments: "id, draftId, inspectionId, localUrl, remoteUrl, syncState, createdAt",
  syncQueue: "id, entityType, entityId, action, status, retryCount, nextRetryAt, createdAt",
  settings: "id, userId, updatedAt",
  notifications: "id, userId, read, createdAt",
});

export { db };
