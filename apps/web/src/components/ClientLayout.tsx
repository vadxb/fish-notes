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

  // Don't render contexts during SSR - just return children
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
        {children}
      </div>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <AppLayout>{children}</AppLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}
