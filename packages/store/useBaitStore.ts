import { create } from "zustand";

interface Bait {
  id: string;
  commonName: string;
  country: string;
  imageUrl?: string;
  createdAt: string;
}

interface BaitStore {
  baits: Bait[];
  loading: boolean;
  error: string | null;
  fetchBaits: () => Promise<void>;
}

export const useBaitStore = create<BaitStore>((set, get) => ({
  baits: [],
  loading: false,
  error: null,

  fetchBaits: async () => {
    // Don't fetch if already loading or if we have data
    if (get().loading || get().baits.length > 0) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch("/api/baits");

      if (!response.ok) {
        throw new Error(`Failed to fetch baits: ${response.status}`);
      }

      const baitsData = await response.json();

      if (Array.isArray(baitsData)) {
        set({ baits: baitsData, loading: false, error: null });
      } else {
        throw new Error("Invalid baits data format");
      }
    } catch (error) {
      console.error("Error fetching baits:", error);
      set({
        baits: [],
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch baits",
      });
    }
  },
}));
