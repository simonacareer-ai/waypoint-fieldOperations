"use client";

import { useEffect, useCallback } from "react";
import { useAppStore } from "@/store/app-store";
import { useSyncStore } from "@/store/sync-store";

export function useSyncEngine() {
  const { networkOnline } = useAppStore();
  const {
    setSyncingCount,
    setLastSyncAt,
    setOverallStatus,
  } = useSyncStore();

  const processSyncQueue = useCallback(async () => {
    if (!networkOnline) {
      setOverallStatus("pending");
      return;
    }

    setOverallStatus("syncing");
    setSyncingCount(1);

    setTimeout(() => {
      setSyncingCount(0);
      setOverallStatus("synced");
      setLastSyncAt(new Date().toISOString());
    }, 2000);
  }, [networkOnline, setOverallStatus, setSyncingCount, setLastSyncAt]);

  useEffect(() => {
    if (networkOnline) {
      processSyncQueue();
    }
  }, [networkOnline, processSyncQueue]);

  return { processSyncQueue };
}
