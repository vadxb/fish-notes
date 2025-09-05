import { Search, Globe, ArrowLeft } from "lucide-react";

interface CollectionHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  onBack?: () => void;
}

export default function CollectionHeader({
  searchQuery,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  onBack,
}: CollectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 mb-4">
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
            Collection
          </h1>
          <p className="text-gray-400 mt-1">
            Browse available collection of fish species and fishing baits
          </p>
        </div>
      </div>

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
