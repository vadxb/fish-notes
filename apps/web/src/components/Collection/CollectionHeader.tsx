import { Search, Globe } from "lucide-react";

interface CollectionHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export default function CollectionHeader({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
}: CollectionHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent mb-4">
        Collection
      </h1>
      <p className="text-gray-400 mb-6">
        Browse available collection of fish species and fishing baits
      </p>

      {/* Search Input and Country Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search fish or baits..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          >
            <option value="Belarus">Belarus</option>
          </select>
        </div>
      </div>
    </div>
  );
}
