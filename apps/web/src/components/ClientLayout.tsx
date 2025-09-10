"use client";

import { AuthProvider } from "@web/hooks/useAuth";
import { ThemeProvider } from "@web/contexts/ThemeContext";
import AppLayout from "@web/components/AppLayout";
import { useEffect, useState } from "react";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
        {children}
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
