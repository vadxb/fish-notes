"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import components to avoid SSR issues
const AuthProvider = dynamic(
  () =>
    import("@web/hooks/useAuth").then((mod) => ({ default: mod.AuthProvider })),
  { ssr: false }
);
const ThemeProvider = dynamic(
  () =>
    import("@web/contexts/ThemeContext").then((mod) => ({
      default: mod.ThemeProvider,
    })),
  { ssr: false }
);
const AppLayout = dynamic(() => import("@web/components/AppLayout"), {
  ssr: false,
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR/prerendering, render minimal structure without context providers
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // On client side, render with full context providers
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
      <AuthProvider>
        <ThemeProvider>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}
