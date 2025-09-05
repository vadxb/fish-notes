import React from "react";
import { Fish, Weight, Ruler, Calendar } from "lucide-react";

interface CatchStatsProps {
  catches: Array<{
    weight?: number;
    length?: number;
    createdAt: string;
  }>;
}

export const CatchStats: React.FC<CatchStatsProps> = ({ catches }) => {
  const totalCatches = catches.length;
  const totalWeight = catches.reduce(
    (sum, catch_) => sum + (catch_.weight || 0),
    0
  );
  const avgWeight = totalCatches > 0 ? totalWeight / totalCatches : 0;
  const avgLength =
    catches.reduce((sum, catch_) => sum + (catch_.length || 0), 0) /
      totalCatches || 0;

  // Get this month's catches
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthCatches = catches.filter((catch_) => {
    const catchDate = new Date(catch_.createdAt);
    return (
      catchDate.getMonth() === thisMonth && catchDate.getFullYear() === thisYear
    );
  });

  const stats = [
    {
      label: "Total Catches",
      value: totalCatches.toString(),
      icon: Fish,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "This Month",
      value: thisMonthCatches.length.toString(),
      icon: Calendar,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Avg Weight",
      value: avgWeight > 0 ? `${avgWeight.toFixed(1)}kg` : "N/A",
      icon: Weight,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Avg Length",
      value: avgLength > 0 ? `${avgLength.toFixed(0)}cm` : "N/A",
      icon: Ruler,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-lg p-4 border border-gray-700/50`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gray-800/50`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
