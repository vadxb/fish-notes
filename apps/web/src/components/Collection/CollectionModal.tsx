import { X } from "lucide-react";
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

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CollectionItem | null;
  type: "fish" | "bait";
}

export default function CollectionModal({
  isOpen,
  onClose,
  item,
  type,
}: CollectionModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{item.commonName}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-200 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Image */}
            <div className="flex justify-center">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.commonName}
                  className="w-48 h-48 object-contain rounded-xl"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-700/50 rounded-xl flex items-center justify-center">
                  <FishingLogo className="w-16 h-16" color="#9CA3AF" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              {item.scientificName && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Scientific Name
                  </h3>
                  <p className="text-lg text-white italic">
                    {item.scientificName}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Country
                </h3>
                <p className="text-lg text-white">{item.country.name}</p>
              </div>

              {item.habitat && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Habitat
                  </h3>
                  <p className="text-lg text-white capitalize">
                    {item.habitat}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Type</h3>
                <p className="text-lg text-white">
                  {type === "fish" ? "Fish Species" : "Fishing Bait"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
