import React from "react";
import { Search, Filter } from "lucide-react";

interface CatchSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CatchSearchBar: React.FC<CatchSearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search catches by species, bait, location, spot, comments, or event..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
      />
      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-300 transition-colors">
        <Filter className="w-5 h-5" />
      </button>
    </div>
  );
};
