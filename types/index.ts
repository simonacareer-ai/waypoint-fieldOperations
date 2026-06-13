export type ThemeMode = "light" | "dark";
export type InstallationStatus = "ok" | "attention" | "critical" | "offline";
export type SyncState = "local-only" | "pending" | "syncing" | "synced" | "failed" | "conflict";
export type QueueAction = "create" | "update" | "delete" | "upload";
export type QueueEntityType = "inspectionDraft" | "inspection" | "attachment";
export type WizardStep = "step-1" | "step-2" | "step-3" | "step-4";
export type InspectionStatus = "ok" | "attention" | "critical" | "offline";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "technician" | "supervisor" | "admin";
  avatarUrl?: string;
  workspaceId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  code: string;
  region?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Installation {
  id: string;
  workspaceId: string;
  assetId: string;
  name: string;
  type: "wind-turbine" | "weather-station" | "solar-array" | "other";
  siteName: string;
  status: InstallationStatus;
  batteryPct?: number;
  temperatureC?: number;
  signalStrength?: "strong" | "medium" | "weak";
  vibrationMmS?: number;
  imageUrl?: string;
  commissionedAt?: string;
  lastInspectedAt?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MeasurementSet {
  batteryPct?: number;
  temperatureC?: number;
  rotorSpeedRpm?: number;
  vibrationMmS?: number;
  signalStrength?: "strong" | "medium" | "weak";
}

export interface InspectionDraft {
  id: string;
  workspaceId: string;
  installationId?: string;
  step: WizardStep;
  status?: InspectionStatus;
  measurements: MeasurementSet;
  notes?: string;
  tags: string[];
  attachmentIds: string[];
  syncState: SyncState;
  lastSavedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Inspection {
  id: string;
  workspaceId: string;
  installationId: string;
  inspectorId: string;
  status: InspectionStatus;
  measurements: MeasurementSet;
  notes?: string;
  tags: string[];
  attachmentIds: string[];
  inspectedAt: string;
  syncState: SyncState;
  sourceDraftId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncQueueItem {
  id: string;
  entityType: QueueEntityType;
  entityId: string;
  action: QueueAction;
  status: SyncState;
  retryCount: number;
  nextRetryAt?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  draftId?: string;
  inspectionId?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  localUrl?: string;
  remoteUrl?: string;
  syncState: SyncState;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  userId: string;
  themeMode: ThemeMode;
  autoSync: boolean;
  syncOnWifiOnly: boolean;
  notificationsEnabled: boolean;
  reducedMotion: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "info" | "warning" | "critical" | "sync";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}
