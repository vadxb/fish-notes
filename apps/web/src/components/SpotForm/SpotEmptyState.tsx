import { MapPin, Plus } from "lucide-react";

interface SpotEmptyStateProps {
  type: "map" | "markers";
}

export default function SpotEmptyState({ type }: SpotEmptyStateProps) {
  if (type === "map") {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-700/50 rounded-lg">
            <MapPin className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Map Preview</h3>
            <p className="text-sm text-gray-400">
              Enter coordinates above to see the map
            </p>
          </div>
        </div>

        <div className="h-96 bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600/50 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-600/50 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-300 text-lg font-medium mb-2">
              No coordinates entered
            </p>
            <p className="text-gray-400 text-sm">
              Fill in latitude and longitude to see the map
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          <Plus className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Marker Management
          </h3>
          <p className="text-sm text-gray-400">
            Add markers after entering coordinates
          </p>
        </div>
      </div>

      <div className="h-64 bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-600/50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-600/50 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-300 font-medium mb-1">
            Markers will appear here
          </p>
          <p className="text-gray-400 text-sm">After entering coordinates</p>
        </div>
      </div>
    </div>
  );
}
