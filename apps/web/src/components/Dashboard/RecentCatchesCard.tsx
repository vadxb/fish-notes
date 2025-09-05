import React from "react";
import { useRouter } from "next/navigation";
import { Fish, Weight, Calendar, MapPin } from "lucide-react";
import { formatDate } from "@web/lib/dateUtils";

interface Catch {
  id: string;
  species: string;
  weight?: number;
  bait?: string;
  createdAt: string;
  spot?: {
    name: string;
  };
}

interface RecentCatchesCardProps {
  recentCatches: Catch[];
  catchesLoading: boolean;
}

export default function RecentCatchesCard({
  recentCatches,
  catchesLoading,
}: RecentCatchesCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if clicking on the card itself, not on individual catches
    if (
      e.target === e.currentTarget ||
      (e.target as Element).closest(".catch-item") === null
    ) {
      router.push("/catches");
    }
  };

  const handleCatchClick = (e: React.MouseEvent, catchId: string) => {
    e.stopPropagation();
    router.push(`/catches/${catchId}`);
  };

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-800/70 hover:border-blue-500/50 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 p-6 pb-4">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          <Fish className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            My Recent Catches
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {catchesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading catches...</p>
          </div>
        ) : recentCatches.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-gray-700/50 rounded-lg w-fit mx-auto mb-4">
              <Fish className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-4">
              No catches yet. Start logging your fishing adventures!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/catches/new");
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              Log First Catch
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentCatches.map((catch_) => (
              <div
                key={catch_.id}
                className="catch-item flex items-center justify-between text-sm p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
                onClick={(e) => handleCatchClick(e, catch_.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-gray-600/50 rounded-lg">
                    <Fish className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <span className="font-medium text-white">
                      {catch_.species}
                    </span>
                    {catch_.spot && (
                      <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{catch_.spot.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  {catch_.weight && (
                    <div className="flex items-center space-x-1">
                      <Weight className="w-3 h-3" />
                      <span className="text-xs">{catch_.weight}kg</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs">
                      {formatDate(catch_.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {recentCatches.length === 3 && (
              <p className="text-xs text-gray-500 mt-3 text-center">
                Click on a catch to edit, or click anywhere else to see all
                catches
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
