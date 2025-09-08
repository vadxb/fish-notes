import { create } from "zustand";

interface Fish {
  id: string;
  commonName: string;
  scientificName: string;
  countryId: string;
  country: {
    id: string;
    name: string;
    code: string;
  };
  habitat?: string;
  imageUrl?: string;
  createdAt: string;
}

interface FishStore {
  fishes: Fish[];
  loading: boolean;
  error: string | null;
  fetchFishes: (countryId?: string) => Promise<void>;
}

export const useFishStore = create<FishStore>((set, get) => ({
  fishes: [],
  loading: false,
  error: null,

  fetchFishes: async (countryId?: string) => {
    set({ loading: true, error: null });

    try {
      const url = countryId
        ? `/api/fishes?countryId=${countryId}`
        : "/api/fishes";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch fishes: ${response.status}`);
      }

      const fishesData = await response.json();

      if (Array.isArray(fishesData)) {
        set({ fishes: fishesData, loading: false, error: null });
      } else {
        throw new Error("Invalid fishes data format");
      }
    } catch (error) {
      console.error("Error fetching fishes:", error);
      set({
        fishes: [],
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch fishes",
      });
    }
  },
}));
