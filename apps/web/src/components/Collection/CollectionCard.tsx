import { Fish, Bug } from "lucide-react";
import { FishingLogo } from "@ui/Logo/FishingLogo";

interface CollectionItem {
  id: string;
  commonName: string;
  scientificName?: string;
  country: {
    id: string;
    name: string;
    code: string;
  };
  habitat?: string | null;
  imageUrl: string | null;
}

interface CollectionCardProps {
  title: string;
  icon: React.ReactNode;
  items: CollectionItem[];
  onItemClick: (item: CollectionItem) => void;
  emptyMessage: string;
  searchQuery: string;
  loading?: boolean;
}

export default function CollectionCard({
  title,
  icon,
  items,
  onItemClick,
  emptyMessage,
  searchQuery,
  loading = false,
}: CollectionCardProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gray-700/50 rounded-lg">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">
            {items.length} {items.length === 1 ? "item" : "items"} available
          </p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading {title.toLowerCase()}...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
            {icon}
          </div>
          <p className="text-gray-400">
            {searchQuery ? "No items found matching your search" : emptyMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.commonName}
                    className="w-16 h-16 object-contain rounded-lg"
                    onError={(e) => {
                      // Fallback to public directory if database URL fails
                      const target = e.target as HTMLImageElement;
                      const fallbackPath = title.includes("Fish")
                        ? `/fishes/${item.commonName.toLowerCase().replace(/\s+/g, "-")}.png`
                        : `/baits/${item.commonName.toLowerCase().replace(/\s+/g, "-")}.png`;
                      target.src = fallbackPath;
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <FishingLogo className="w-8 h-8" color="#9CA3AF" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                  {item.commonName}
                </h4>
                {item.scientificName && (
                  <p className="text-xs text-gray-400 truncate italic">
                    {item.scientificName}
                  </p>
                )}
                <p className="text-xs text-blue-400 capitalize">
                  {item.habitat || item.country.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
