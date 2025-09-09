import React from "react";
import { useTheme } from "@web/contexts/ThemeContext";

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
}

export default function DashboardHeader({
  userName,
  userEmail,
}: DashboardHeaderProps) {
  const { themeConfig } = useTheme();

  return (
    <div className="mb-8">
      <h1 className={`text-3xl font-bold ${themeConfig.header.text} mb-2`}>
        Welcome back, {userName || userEmail}!
      </h1>
      <p className={themeConfig.colors.text.muted}>
        Here&apos;s what&apos;s happening with your fishing adventures
      </p>
    </div>
  );
}
