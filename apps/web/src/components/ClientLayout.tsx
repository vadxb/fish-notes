"use client";

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

  // On client side, dynamically import and render with full context providers
  const ClientLayoutContent = () => {
    const { AuthProvider } = require("@web/hooks/useAuth");
    const { ThemeProvider } = require("@web/contexts/ThemeContext");
    const AppLayout = require("@web/components/AppLayout").default;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900">
        <AuthProvider>
          <ThemeProvider>
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </AuthProvider>
      </div>
    );
  };

  return <ClientLayoutContent />;
}
