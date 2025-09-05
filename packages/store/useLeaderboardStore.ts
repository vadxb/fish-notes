import { create } from "zustand";

export interface LeaderboardUser {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  rank: number;
  total_weight: number;
  catch_count: number;
  total_likes: number;
}

export interface LeaderboardData {
  period: string;
  metric: string;
  leaderboard: LeaderboardUser[];
}

interface LeaderboardState {
  data: Record<string, LeaderboardData>;
  loading: boolean;
  error: string | null;
  fetchLeaderboard: (period: string, metric: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
  data: {},
  loading: false,
  error: null,

  fetchLeaderboard: async (period: string, metric: string) => {
    const key = `${period}-${metric}`;

    // Return cached data if available
    if (get().data[key]) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(
        `/api/leaderboard?period=${period}&metric=${metric}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch leaderboard");
      }

      const data = await response.json();

      set((state) => ({
        data: {
          ...state.data,
          [key]: data,
        },
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch leaderboard",
        loading: false,
      });
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
