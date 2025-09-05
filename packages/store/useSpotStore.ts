import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Spot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  coordinates?: Array<{ lat: number; lng: number; name?: string }>; // Multiple marker positions with names
  notes?: string;
  mapImageUrl?: string;
  isFavorite: boolean;
  createdAt: string;
}

interface SpotState {
  spots: Spot[];
  selectedSpotId: string | null;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;

  // Actions
  setSpots: (spots: Spot[]) => void;
  addSpot: (spot: Spot) => void;
  updateSpot: (id: string, spot: Partial<Spot>) => void;
  deleteSpot: (id: string) => void;
  setSelectedSpot: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetFetchState: () => void;

  // API calls
  fetchSpots: (force?: boolean) => Promise<void>;
  createSpot: (
    spotData: Omit<Spot, "id" | "createdAt" | "isFavorite"> & {
      mapImage?: string | null;
    }
  ) => Promise<Spot | null>;
  updateSpotAPI: (
    id: string,
    spotData: Partial<Spot> & { mapImage?: string | null }
  ) => Promise<Spot | null>;
  deleteSpotAPI: (id: string) => Promise<boolean>;
  toggleFavoriteAPI: (id: string) => Promise<boolean>;
}

export const useSpotStore = create<SpotState>()(
  persist(
    (set, get) => ({
      spots: [],
      selectedSpotId: null,
      loading: false,
      error: null,
      hasFetched: false,

      setSpots: (spots) => set({ spots }),
      addSpot: (spot) => set((state) => ({ spots: [spot, ...state.spots] })),
      updateSpot: (id, spotData) =>
        set((state) => ({
          spots: state.spots.map((spot) =>
            spot.id === id ? { ...spot, ...spotData } : spot
          ),
        })),
      deleteSpot: (id) =>
        set((state) => ({
          spots: state.spots.filter((spot) => spot.id !== id),
          selectedSpotId:
            state.selectedSpotId === id ? null : state.selectedSpotId,
        })),
      setSelectedSpot: (id) => set({ selectedSpotId: id }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      resetFetchState: () =>
        set({ hasFetched: false, spots: [], loading: false, error: null }),

      fetchSpots: async (force = false) => {
        const state = get();
        if (state.loading || (state.hasFetched && !force)) {
          return; // Prevent multiple simultaneous fetches unless forced
        }

        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/spots");
          if (!response.ok) {
            throw new Error("Failed to fetch spots");
          }
          const data = await response.json();
          set({ spots: data.spots, loading: false, hasFetched: true });
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to fetch spots",
            loading: false,
          });
        }
      },

      createSpot: async (spotData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/spots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spotData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create spot");
          }

          const data = await response.json();
          get().addSpot(data.spot);
          set({ loading: false });
          return data.spot;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to create spot",
            loading: false,
          });
          return null;
        }
      },

      updateSpotAPI: async (id, spotData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/spots/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(spotData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update spot");
          }

          const data = await response.json();
          get().updateSpot(id, data.spot);
          set({ loading: false });
          return data.spot;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to update spot",
            loading: false,
          });
          return null;
        }
      },

      deleteSpotAPI: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/spots/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete spot");
          }

          get().deleteSpot(id);
          set({ loading: false });
          return true;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to delete spot",
            loading: false,
          });
          return false;
        }
      },

      toggleFavoriteAPI: async (id) => {
        try {
          const response = await fetch(`/api/spots/${id}/favorite`, {
            method: "PATCH",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to toggle favorite");
          }

          const data = await response.json();
          get().updateSpot(id, { isFavorite: data.isFavorite });
          return true;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to toggle favorite",
          });
          return false;
        }
      },
    }),
    {
      name: "spot-storage",
      partialize: (state) => ({
        selectedSpotId: state.selectedSpotId,
      }), // Only persist selectedSpotId, not the spots array
    }
  )
);
