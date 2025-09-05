import { Search, Filter, Plus, ArrowLeft } from "lucide-react";

interface SpotsHeaderProps {
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNew: () => void;
  onBack?: () => void;
}

export default function SpotsHeader({
  showFavoritesOnly,
  onToggleFavorites,
  searchQuery,
  onSearchChange,
  onAddNew,
  onBack,
}: SpotsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <div>
          <h1 className="text-3xl font-bold bg-blue-600/50 bg-clip-text text-transparent">
            {showFavoritesOnly ? "Favorite Spots" : "Fishing Spots"}
          </h1>
          <p className="text-gray-400 mt-1">
            {showFavoritesOnly
              ? "Your favorite fishing locations"
              : "Discover and manage your fishing spots"}
          </p>
        </div>
      </div>

      {/* Search Input and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search spots by name or notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleFavorites}
            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              showFavoritesOnly
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50"
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFavoritesOnly ? "Show All" : "Show Favorites"}
          </button>
          <button
            onClick={onAddNew}
            className="flex items-center space-x-2 px-4 py-3 bg-blue-600/20 text-white rounded-xl hover:bg-blue-600/30 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Spot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
