import { Search, Grid3X3, CalendarDays } from "lucide-react";

interface EventSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "grid" | "calendar";
  onViewModeChange: (mode: "grid" | "calendar") => void;
  totalEvents: number;
}

export default function EventSearchBar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalEvents,
}: EventSearchBarProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
            />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400 mr-2">
            {totalEvents} event{totalEvents !== 1 ? "s" : ""}
          </span>
          <div className="flex bg-gray-700/50 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => onViewModeChange("calendar")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === "calendar"
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Calendar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
