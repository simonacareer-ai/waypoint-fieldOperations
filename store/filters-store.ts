import { create } from "zustand";

interface FiltersState {
  searchQuery: string;
  statusFilter: string;
  dateRange: { from: string | null; to: string | null };
  tags: string[];
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setDateRange: (range: { from: string | null; to: string | null }) => void;
  setTags: (tags: string[]) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  searchQuery: "",
  statusFilter: "all",
  dateRange: { from: null, to: null },
  tags: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setDateRange: (range) => set({ dateRange: range }),
  setTags: (tags) => set({ tags }),
  resetFilters: () =>
    set({
      searchQuery: "",
      statusFilter: "all",
      dateRange: { from: null, to: null },
      tags: [],
    }),
}));
