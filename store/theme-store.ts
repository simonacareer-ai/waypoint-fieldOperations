import { create } from "zustand";
import type { ThemeMode } from "@/types";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "light",
  setMode: (mode) => set({ mode }),
}));
