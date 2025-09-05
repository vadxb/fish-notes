"use client";
import { useState, useEffect } from "react";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Fish,
  Weight,
  Heart,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";

interface LeaderboardUser {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  rank: number;
  total_weight: number;
  catch_count: number;
  total_likes: number;
}

interface LeaderboardData {
  period: string;
  metric: string;
  leaderboard: LeaderboardUser[];
}

const Leaderboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [leaderboards, setLeaderboards] = useState<
    Record<string, LeaderboardData>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const periods = [{ key: "day", label: "Today", icon: "🌅" }];

  const metrics = [
    { key: "weight", label: "Weight", icon: Weight, color: "text-yellow-400" },
    { key: "count", label: "Count", icon: Fish, color: "text-blue-400" },
    { key: "likes", label: "Likes", icon: Heart, color: "text-red-400" },
  ];

  const fetchAllLeaderboards = async () => {
    setLoading(true);
    setError(null);

    try {
      const promises = periods.flatMap((period) =>
        metrics.map((metric) =>
          fetch(`/api/leaderboard?period=${period.key}&metric=${metric.key}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Failed to fetch ${period.key}-${metric.key}`);
              }
              return response.json();
            })
            .then((data) => ({ key: `${period.key}-${metric.key}`, data }))
        )
      );

      const results = await Promise.all(promises);
      const leaderboardData: Record<string, LeaderboardData> = {};

      results.forEach(({ key, data }) => {
        leaderboardData[key] = data;
      });

      setLeaderboards(leaderboardData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch leaderboards"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLeaderboards();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-400" />;
      default:
        return <Trophy className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 border-l-4 border-yellow-400 text-white";
      case 2:
        return "bg-gray-700/50 border-l-4 border-gray-400 text-white";
      case 3:
        return "bg-amber-500/10 border-l-4 border-amber-400 text-white";
      default:
        return "bg-gray-700/30 text-gray-300";
    }
  };

  const formatValue = (user: LeaderboardUser, metric: string) => {
    switch (metric) {
      case "weight":
        return `${user.total_weight.toFixed(1)}kg`;
      case "count":
        return `${user.catch_count} catches`;
      case "likes":
        return `${user.total_likes} likes`;
      default:
        return "";
    }
  };

  const getDisplayName = (user: LeaderboardUser) => {
    return user.username || user.name || "Anonymous";
  };

  const renderLeaderboardSection = (
    period: string,
    metric: string,
    data: LeaderboardData
  ) => {
    if (!data.leaderboard || data.leaderboard.length === 0) {
      return null;
    }

    const periodInfo = periods.find((p) => p.key === period);
    const metricInfo = metrics.find((m) => m.key === metric);
    const Icon = metricInfo?.icon || Trophy;

    return (
      <div key={`${period}-${metric}`} className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-gray-700/50 rounded-lg">
            <Icon className={`w-4 h-4 ${metricInfo?.color}`} />
          </div>
          <span className="text-sm font-medium text-white">
            {metricInfo?.label}
          </span>
        </div>

        <div className="space-y-2">
          {data.leaderboard.map((leaderboardUser) => {
            const isCurrentUser =
              user &&
              (user.id === leaderboardUser.id ||
                user.email === leaderboardUser.email);
            return (
              <div
                key={leaderboardUser.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${getRankColor(leaderboardUser.rank)} ${
                  isCurrentUser ? "ring-2 ring-blue-500/50 ring-opacity-50" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(leaderboardUser.rank)}
                    <span className="font-bold text-sm">
                      #{leaderboardUser.rank}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {leaderboardUser.avatar ? (
                      <img
                        src={leaderboardUser.avatar}
                        alt={getDisplayName(leaderboardUser)}
                        className="w-8 h-8 rounded-full border-2 border-gray-600/50"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-600/50 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {getDisplayName(leaderboardUser)
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span
                      className={`font-medium text-sm ${
                        isCurrentUser ? "font-bold text-base text-blue-300" : ""
                      }`}
                    >
                      {getDisplayName(leaderboardUser)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    {formatValue(leaderboardUser, metric)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {leaderboardUser.catch_count} catches
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-700/50 rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Today's Rankings
            </h3>
            <p className="text-sm text-gray-400">
              See how you stack up against other anglers
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/rankings")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 text-white rounded-xl hover:bg-blue-600/30 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
        >
          <span className="text-sm">See all rankings</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading rankings...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg w-fit mx-auto mb-4">
            <Trophy className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-300 mb-4">Error: {error}</p>
          <button
            onClick={fetchAllLeaderboards}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {periods.map((period) =>
            metrics.map((metric) => {
              const key = `${period.key}-${metric.key}`;
              const data = leaderboards[key];
              return data
                ? renderLeaderboardSection(period.key, metric.key, data)
                : null;
            })
          )}

          {Object.keys(leaderboards).length === 0 && (
            <div className="text-center py-8">
              <div className="p-4 bg-gray-700/50 rounded-lg w-fit mx-auto mb-4">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">No leaderboard data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
