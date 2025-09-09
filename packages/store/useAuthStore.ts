import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSpotStore } from "./useSpotStore";

interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string | null;
  subscription?: string | null;
  premiumExpiresAt?: string | Date | null;
  theme?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  syncCookie: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => {
        set({ user, token });
        // Also set the HTTP cookie for middleware compatibility
        document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
      },
      logout: () => {
        set({ user: null, token: null });
        // Clear the HTTP cookie
        document.cookie = `auth-token=; path=/; max-age=0; samesite=lax`;
        // Reset spot store when logging out
        useSpotStore.getState().resetFetchState();
      },
      setUser: (user) => set({ user }),
      syncCookie: () => {
        const state = useAuthStore.getState();
        if (state.token) {
          document.cookie = `auth-token=${state.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
          console.log(
            "Synced cookie for token:",
            state.token.substring(0, 50) + "..."
          );
        }
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage
    }
  )
);
