import React from "react";
import LeaderboardCard from "./LeaderboardCard";

interface LeaderboardData {
  id: string;
  title: string;
  timeframe: string;
  theme: "today" | "month" | "alltime";
  entries: Array<{
    username: string;
    avatar: string | null;
    stat: string;
  }>;
}

interface LeaderboardSectionProps {
  leaderboardData: LeaderboardData[];
}

const LeaderboardSection = ({ leaderboardData }: LeaderboardSectionProps) => {
  // Group cards by timeframe
  const todayCards = leaderboardData.filter((card) => card.theme === "today");
  const monthCards = leaderboardData.filter((card) => card.theme === "month");
  const alltimeCards = leaderboardData.filter(
    (card) => card.theme === "alltime"
  );

  return (
    <section className="text-white">
      {/* Today's Rankings Section */}
      {todayCards.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">
            Today&apos;s Rankings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayCards.map((card) => (
              <LeaderboardCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      )}

      {/* This Month's Rankings Section */}
      {monthCards.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">
            This Month&apos;s Rankings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monthCards.map((card) => (
              <LeaderboardCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      )}

      {/* All Time Rankings Section */}
      {alltimeCards.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-white text-center">
            All Time Rankings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alltimeCards.map((card) => (
              <LeaderboardCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default LeaderboardSection;
