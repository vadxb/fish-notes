import React, { useState } from "react";
import LeaderboardEntry from "./LeaderboardEntry";

const colorThemes = {
  today: "from-purple-600 to-purple-900",
  month: "from-teal-500 to-teal-800",
  alltime: "from-orange-500 to-orange-800",
};

interface LeaderboardCardProps {
  title: string;
  timeframe: string;
  entries: Array<{
    username: string;
    avatar: string | null;
    stat: string;
    userId?: string;
  }>;
  theme: "today" | "month" | "alltime";
}

const LeaderboardCard = ({
  title,
  timeframe,
  entries,
  theme,
}: LeaderboardCardProps) => {
  const [showAll, setShowAll] = useState(false);
  const displayEntries = showAll ? entries : entries.slice(0, 3);
  const hasMoreEntries = entries.length > 3;

  return (
    <div
      className={`rounded-xl p-4 bg-gradient-to-br ${colorThemes[theme]} shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="uppercase text-sm text-white/70 mb-2">{timeframe}</div>
      <h3 className="text-white text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {displayEntries.map((entry, index) => (
          <LeaderboardEntry
            key={`${entry.username}-${index}`}
            rank={index + 1}
            {...entry}
          />
        ))}
      </div>
      {hasMoreEntries && (
        <div className="mt-3 pt-2 border-t border-white/20">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full text-center text-white/70 hover:text-white text-sm font-medium transition-colors duration-200"
          >
            {showAll ? "Show less" : `Show all (${entries.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaderboardCard;
