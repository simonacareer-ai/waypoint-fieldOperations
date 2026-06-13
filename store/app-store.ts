import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  currentWorkspaceId: string | null;
  networkOnline: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentWorkspaceId: (id: string | null) => void;
  setNetworkOnline: (online: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  currentWorkspaceId: null,
  networkOnline: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setCurrentWorkspaceId: (id) => set({ currentWorkspaceId: id }),
  setNetworkOnline: (online) => set({ networkOnline: online }),
}));
