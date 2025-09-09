"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@store/useAuthStore";

export const useAuth = () => {
  const {
    user,
    login: storeLogin,
    logout: storeLogout,
    setUser,
    syncCookie,
  } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        // Clear auth state on any error (401, 404, etc.)
        setUser(null);
        storeLogout();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      storeLogout();
    } finally {
      setLoading(false);
    }
  }, [setUser, storeLogout]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Sync cookie from localStorage on mount
    syncCookie();
    checkAuth();
  }, [isClient, syncCookie, checkAuth]);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    storeLogin(data.user, data.token);
    return data.user;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with logout even if API call fails
    }
    storeLogout();

    // Force a page reload to ensure clean state
    window.location.href = "/login";
  };

  return {
    user,
    loading,
    login,
    logout,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
