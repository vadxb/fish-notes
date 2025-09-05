import { MapPin, Plus } from "lucide-react";

interface SpotsEmptyStateProps {
  showFavoritesOnly: boolean;
  onCreateNew: () => void;
}

export default function SpotsEmptyState({
  showFavoritesOnly,
  onCreateNew,
}: SpotsEmptyStateProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12 text-center">
      <div className="mx-auto w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
        <MapPin className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {showFavoritesOnly ? "No favorite spots yet" : "No spots yet"}
      </h3>
      <p className="text-gray-400 mb-6">
        {showFavoritesOnly
          ? "Mark some spots as favorites to see them here!"
          : "Start marking your favorite fishing locations!"}
      </p>
      <button
        onClick={onCreateNew}
        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
      >
        <Plus className="w-5 h-5" />
        <span>Add Your First Spot</span>
      </button>
    </div>
  );
}
