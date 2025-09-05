import React from "react";

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
}

export default function DashboardHeader({
  userName,
  userEmail,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent mb-2">
        Welcome back, {userName || userEmail}!
      </h1>
      <p className="text-gray-400">
        Here's what's happening with your fishing adventures
      </p>
    </div>
  );
}
