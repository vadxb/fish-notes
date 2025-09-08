import React from "react";
import { useRouter } from "next/navigation";
import { Star, MapPin } from "lucide-react";

interface Spot {
  id: string;
  name: string;
  notes?: string;
  isFavorite: boolean;
}

interface FavoriteSpotsCardProps {
  favoriteSpots: Spot[];
  favoriteCount: number;
}

export default function FavoriteSpotsCard({
  favoriteSpots,
  favoriteCount,
}: FavoriteSpotsCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push("/spots?favorites=true");
  };

  const handleSpotClick = (e: React.MouseEvent, spotId: string) => {
    e.stopPropagation();
    router.push(`/spots/${spotId}`);
  };

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-800/70 hover:border-blue-500/50 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 p-6 pb-4">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          <Star className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Favorite Spots</h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {favoriteCount === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-gray-700/50 rounded-lg w-fit mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-4">
              No favorite spots yet. Mark your favorite fishing locations!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/spots/new");
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-green-500/25"
            >
              Add First Spot
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteSpots.slice(0, 3).map((spot) => (
              <div
                key={spot.id}
                className="p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
                onClick={(e) => handleSpotClick(e, spot.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-gray-600/50 rounded-lg flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm text-white truncate">
                        {spot.name}
                      </p>
                      <div className="p-1.5 bg-yellow-500/20 rounded-lg ml-2 flex-shrink-0">
                        <Star className="w-4 h-4 text-yellow-400" />
                      </div>
                    </div>
                    {spot.notes && (
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {spot.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {favoriteCount > 3 && (
              <p className="text-xs text-gray-500 text-center pt-2">
                +{favoriteCount - 3} more favorite spots
              </p>
            )}
            <p className="text-xs text-gray-500 text-center pt-1">
              Click to manage all spots
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
