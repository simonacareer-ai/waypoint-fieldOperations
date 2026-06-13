import { create } from "zustand";
import type { SyncState } from "@/types";

interface SyncStoreState {
  pendingCount: number;
  syncingCount: number;
  failedCount: number;
  lastSyncAt: string | null;
  overallStatus: SyncState;
  setPendingCount: (count: number) => void;
  setSyncingCount: (count: number) => void;
  setFailedCount: (count: number) => void;
  setLastSyncAt: (date: string | null) => void;
  setOverallStatus: (status: SyncState) => void;
}

export const useSyncStore = create<SyncStoreState>((set) => ({
  pendingCount: 0,
  syncingCount: 0,
  failedCount: 0,
  lastSyncAt: null,
  overallStatus: "synced",
  setPendingCount: (count) => set({ pendingCount: count }),
  setSyncingCount: (count) => set({ syncingCount: count }),
  setFailedCount: (count) => set({ failedCount: count }),
  setLastSyncAt: (date) => set({ lastSyncAt: date }),
  setOverallStatus: (status) => set({ overallStatus: status }),
}));
