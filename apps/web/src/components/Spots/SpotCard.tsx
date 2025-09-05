import { Heart, Edit, Trash2, MapPin } from "lucide-react";
import { FishingLogo } from "@ui/Logo/FishingLogo";
import { Spot } from "@store/useSpotStore";

interface SpotCardProps {
  spot: Spot;
  isSelected: boolean;
  onCardClick: (spotId: string) => void;
  onToggleFavorite: (spotId: string) => void;
  onEdit: (spotId: string) => void;
  onDelete: (spotId: string) => void;
}

export default function SpotCard({
  spot,
  isSelected,
  onCardClick,
  onToggleFavorite,
  onEdit,
  onDelete,
}: SpotCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger edit if clicking on action buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    onCardClick(spot.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(spot.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this spot?")) {
      await onDelete(spot.id);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onToggleFavorite(spot.id);
  };

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-800/70 hover:border-blue-500/50 focus-within:border-blue-500/50 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex flex-col h-full"
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCardClick(spot.id);
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4 h-24">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
            {spot.name}
          </h3>
          {spot.notes && (
            <p className="text-sm text-gray-400 line-clamp-2">{spot.notes}</p>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-lg transition-all duration-200 ${
              spot.isFavorite
                ? "text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20"
                : "text-gray-400 hover:text-red-400 hover:bg-gray-700/50"
            }`}
            title={
              spot.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={`w-4 h-4 ${spot.isFavorite ? "fill-current" : ""}`}
            />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-200"
            title="Edit spot"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200"
            title="Delete spot"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Image - Fixed position */}
      <div className="px-6 mb-4">
        {spot.mapImageUrl ? (
          <img
            src={spot.mapImageUrl}
            alt={`Map of ${spot.name}`}
            className="w-full h-48 object-cover rounded-lg border border-gray-700/50"
          />
        ) : (
          <div className="w-full h-48 bg-gray-700/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No map available</p>
            </div>
          </div>
        )}
      </div>

      {/* Spot Details */}
      <div className="space-y-3 flex-1 mb-4 px-6">
        {/* Markers Count */}
        {spot.coordinates && spot.coordinates.length > 0 && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <MapPin className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300">
                {spot.coordinates.length} marker
                {spot.coordinates.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {/* Location Info */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-700/50 rounded-lg">
            <MapPin className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              {spot.latitude && spot.longitude
                ? `${spot.latitude.toFixed(4)}, ${spot.longitude.toFixed(4)}`
                : "Location not specified"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
