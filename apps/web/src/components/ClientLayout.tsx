"use client";

import { AuthProvider } from "@web/hooks/useAuth";
import { ThemeProvider } from "@web/contexts/ThemeContext";
import AppLayout from "@web/components/AppLayout";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppLayout>{children}</AppLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}
