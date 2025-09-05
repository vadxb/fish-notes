"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import LeaderboardSection from "@web/components/Leaderboard/LeaderboardSection";

interface LeaderboardUser {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  rank: number;
  total_weight: number;
  catch_count: number;
}

interface LeaderboardData {
  period: string;
  metric: string;
  leaderboard: LeaderboardUser[];
}

interface LeaderboardCardData {
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

const RankingsPage = () => {
  const router = useRouter();
  const [leaderboards, setLeaderboards] = useState<
    Record<string, LeaderboardData>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const periods = useMemo(
    () => [
      { key: "day", label: "TODAY", icon: "🌅" },
      { key: "month", label: "THIS MONTH", icon: "📅" },
      { key: "alltime", label: "ALL TIME", icon: "🏆" },
    ],
    []
  );

  const metrics = useMemo(
    () => [
      {
        key: "weight",
        label: "Top 50 Users by Total Catch Weight",
        color: "text-blue-600",
      },
      {
        key: "count",
        label: "Top 50 Users by Catch Count",
        color: "text-green-600",
      },
    ],
    []
  );

  const fetchAllLeaderboards = useCallback(async () => {
    if (Object.keys(leaderboards).length > 0) {
      return; // Already fetched
    }

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
  }, [leaderboards, periods, metrics]);

  useEffect(() => {
    fetchAllLeaderboards();
  }, [fetchAllLeaderboards]);

  const formatValue = (user: LeaderboardUser, metric: string) => {
    switch (metric) {
      case "weight":
        return `${user.total_weight.toFixed(1)}kg`;
      case "count":
        return `${user.catch_count}`;
      default:
        return "";
    }
  };

  const getDisplayName = (user: LeaderboardUser) => {
    return user.username || user.name || "Anonymous";
  };

  const transformLeaderboardData = useCallback((): LeaderboardCardData[] => {
    const cardData: LeaderboardCardData[] = [];

    periods.forEach((period) => {
      metrics.forEach((metric) => {
        const key = `${period.key}-${metric.key}`;
        const data = leaderboards[key];

        if (data && data.leaderboard && data.leaderboard.length > 0) {
          const entries = data.leaderboard.map((user) => ({
            username: getDisplayName(user),
            avatar: user.avatar,
            stat: formatValue(user, metric.key),
            userId: user.id,
          }));

          cardData.push({
            id: key,
            title: metric.label,
            timeframe: period.label,
            theme:
              period.key === "day"
                ? "today"
                : period.key === "month"
                  ? "month"
                  : "alltime",
            entries,
          });
        }
      });
    });

    return cardData;
  }, [leaderboards, periods, metrics]);

  const leaderboardData = transformLeaderboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent mb-2">
              Rankings & Leaderboards
            </h1>
            <p className="text-gray-400">
              See how you stack up against other anglers across different
              metrics and time periods.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            <p>Error: {error}</p>
            <button
              onClick={fetchAllLeaderboards}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <LeaderboardSection leaderboardData={leaderboardData} />
        )}
      </div>
    </div>
  );
};

export default RankingsPage;
