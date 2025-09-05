import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Catch {
  id: string;
  userId: string;
  species: string;
  weight?: number;
  bait?: string;
  location?: string;
  spotId?: string;
  selectedMarkerIndexes?: number[];
  eventId?: string;
  photoUrls?: string[];
  comments?: string;
  weather?: Record<string, unknown>;
  isShared?: boolean;
  createdAt: string;
  spot?: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    coordinates?: any;
  };
  event?: {
    id: string;
    title: string;
    startAt: string;
  };
}

interface CatchState {
  catches: Catch[];
  loading: boolean;
  error: string | null;
  fetchCatches: () => Promise<void>;
  addCatch: (
    catch_: Omit<Catch, "id" | "userId" | "createdAt">
  ) => Promise<Catch | null>;
  updateCatch: (
    id: string,
    updatedCatch: Partial<Catch>
  ) => Promise<Catch | null>;
  deleteCatch: (id: string) => Promise<void>;
  toggleShared: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCatchStore = create<CatchState>()(
  persist(
    (set, get) => ({
      catches: [],
      loading: false,
      error: null,

      fetchCatches: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/catches");
          if (response.ok) {
            const catchesData = await response.json();
            set({ catches: catchesData, loading: false });
          } else {
            const errorData = await response.json();
            console.error("Failed to fetch catches:", errorData);
            set({
              error: `Failed to fetch catches: ${response.status}`,
              loading: false,
            });
          }
        } catch (error) {
          console.error("Error fetching catches:", error);
          if (error instanceof Error && error.name === "QuotaExceededError") {
            set({
              error: "Storage quota exceeded. Please clear browser data.",
              loading: false,
            });
          } else {
            set({ error: "Error fetching catches", loading: false });
          }
        }
      },

      addCatch: async (catch_) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/catches", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(catch_),
          });

          if (response.ok) {
            const newCatch = await response.json();
            set((state) => ({
              catches: [newCatch, ...state.catches],
              loading: false,
            }));
            return newCatch; // Return the created catch
          } else {
            const errorData = await response.json();
            console.error("Failed to create catch:", errorData);
            set({
              error: `Failed to create catch: ${response.status}`,
              loading: false,
            });
            return null;
          }
        } catch (error) {
          console.error("Error creating catch:", error);
          set({ error: "Error creating catch", loading: false });
          return null;
        }
      },

      updateCatch: async (id, updatedCatch) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/catches/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCatch),
          });

          if (response.ok) {
            const updatedCatchData = await response.json();
            set((state) => ({
              catches: state.catches.map((catch_) =>
                catch_.id === id ? updatedCatchData : catch_
              ),
              loading: false,
            }));
            return updatedCatchData; // Return the updated catch
          } else {
            const errorData = await response.json();
            console.error("Failed to update catch:", errorData);
            set({
              error: `Failed to update catch: ${response.status}`,
              loading: false,
            });
            return null;
          }
        } catch (error) {
          console.error("Error updating catch:", error);
          set({ error: "Error updating catch", loading: false });
          return null;
        }
      },

      deleteCatch: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/catches/${id}`, {
            method: "DELETE",
          });

          if (response.ok) {
            set((state) => ({
              catches: state.catches.filter((catch_) => catch_.id !== id),
              loading: false,
            }));
          } else {
            const errorData = await response.json();
            console.error("Failed to delete catch:", errorData);
            set({
              error: `Failed to delete catch: ${response.status}`,
              loading: false,
            });
          }
        } catch (error) {
          console.error("Error deleting catch:", error);
          set({ error: "Error deleting catch", loading: false });
        }
      },

      toggleShared: async (id) => {
        try {
          const response = await fetch(`/api/catches/${id}/share`, {
            method: "PATCH",
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to toggle share");
          }

          const data = await response.json();
          set((state) => ({
            catches: state.catches.map((catch_) =>
              catch_.id === id ? { ...catch_, isShared: data.isShared } : catch_
            ),
          }));
          return true;
        } catch (error) {
          set({
            error:
              error instanceof Error ? error.message : "Failed to toggle share",
          });
          return false;
        }
      },

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "catch-storage",
      partialize: (state) => ({
        catches: state.catches.map((catch_) => ({
          ...catch_,
          photoUrls: undefined, // Don't persist photo URLs to save space
        })),
      }),
    }
  )
);
