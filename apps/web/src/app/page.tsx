"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useTheme } from "@web/contexts/ThemeContext";

// Force dynamic rendering to prevent prerendering issues
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Removed unused imports since landing page content moved to /about

export default function HomePage() {
  const { user, loading } = useAuth();
  const { themeConfig } = useTheme();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || loading) return;

    if (user) {
      router.push("/dashboard");
    }
  }, [user, loading, router, isClient]);

  // Show loading only when actually loading on client
  if (isClient && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  if (user) {
    return (
      <div
        className={`min-h-screen ${
          isClient
            ? themeConfig.gradients.background
            : "bg-gradient-to-br from-slate-900 to-blue-900"
        } flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p
            className={
              isClient ? themeConfig.colors.text.secondary : "text-gray-400"
            }
          >
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Fisherman&apos;s Notes
        </h1>
        <p className="text-xl text-blue-100 mb-8">
          Redirecting to your dashboard...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  );
}
