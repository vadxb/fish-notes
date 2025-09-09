"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@web/hooks/useAuth";
import { useAuthStore } from "@store/useAuthStore";
import { ThemeId, ThemeConfig, getTheme } from "@web/lib/themes";

interface ThemeContextType {
  currentTheme: ThemeId;
  themeConfig: ThemeConfig;
  setTheme: (themeId: ThemeId) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("night-fishing");
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from user data
  useEffect(() => {
    if (user) {
      if (user.theme) {
        setCurrentTheme(user.theme as ThemeId);
      } else {
        // If user doesn't have a theme set, use default
        setCurrentTheme("night-fishing");
      }
      setIsLoading(false);
    }
  }, [user]);

  const setTheme = async (themeId: ThemeId) => {
    try {
      // Update theme in database
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme: themeId }),
      });

      if (response.ok) {
        setCurrentTheme(themeId);
        // Update user in auth store
        const updatedUser = await response.json();
        setUser(updatedUser);
      } else {
        console.error("Failed to update theme");
      }
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  };

  const themeConfig = getTheme(currentTheme);

  const value: ThemeContextType = {
    currentTheme,
    themeConfig,
    setTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
