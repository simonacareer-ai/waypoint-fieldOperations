"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";

export function useNetworkStatus() {
  const { networkOnline, setNetworkOnline } = useAppStore();

  useEffect(() => {
    const handleOnline = () => setNetworkOnline(true);
    const handleOffline = () => setNetworkOnline(false);

    setNetworkOnline(navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setNetworkOnline]);

  return networkOnline;
}
