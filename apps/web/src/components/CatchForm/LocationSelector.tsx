import React from "react";
import { MapPin } from "lucide-react";

interface Spot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  coordinates?: Array<{ lat: number; lng: number; name?: string }>;
}

interface LocationSelectorProps {
  spots: Spot[];
  selectedSpotId: string;
  selectedMarkerIndexes: number[];
  location: string;
  onSpotChange: (spotId: string) => void;
  onMarkerToggle: (markerIndex: number) => void;
  onSelectAllMarkers: () => void;
  onLocationChange: (location: string) => void;
  loading?: boolean;
  error?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  spots,
  selectedSpotId,
  selectedMarkerIndexes,
  location,
  onSpotChange,
  onMarkerToggle,
  onSelectAllMarkers,
  onLocationChange,
  loading = false,
  error,
}) => {
  const selectedSpot = spots.find((spot) => spot.id === selectedSpotId);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Fishing Spot
        </label>
        <select
          value={selectedSpotId}
          onChange={(e) => onSpotChange(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select a spot (optional)</option>
          {spots.map((spot) => (
            <option key={spot.id} value={spot.id}>
              {spot.name}
            </option>
          ))}
        </select>
      </div>

      {/* Marker Selection - only show when spot is selected */}
      {selectedSpot && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-300">
              Select Markers (choose multiple)
            </label>
            <button
              type="button"
              onClick={onSelectAllMarkers}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {(() => {
                const allMarkers = [
                  -1, // Primary marker
                  ...(selectedSpot.coordinates?.map((_, index) => index) || []),
                ];
                const allSelected = allMarkers.every((markerIndex) =>
                  selectedMarkerIndexes.includes(markerIndex)
                );
                return allSelected ? "Deselect All" : "Select All";
              })()}
            </button>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-700/50 rounded-xl p-4 bg-gray-800/30">
            {/* Primary marker option */}
            <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700/30 p-3 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={selectedMarkerIndexes.includes(-1)}
                onChange={() => onMarkerToggle(-1)}
                className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-white">
                  {selectedSpot.name} - Primary Location
                </span>
                <p className="text-xs text-gray-400">
                  {selectedSpot.latitude.toFixed(4)},{" "}
                  {selectedSpot.longitude.toFixed(4)}
                </p>
              </div>
            </label>

            {/* Additional markers */}
            {selectedSpot.coordinates?.map((coord, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700/30 p-3 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedMarkerIndexes.includes(index)}
                  onChange={() => onMarkerToggle(index)}
                  className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500 bg-gray-800"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-white">
                    {selectedSpot.name} - {coord.name || `Marker ${index + 2}`}
                  </span>
                  <p className="text-xs text-gray-400">
                    {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
                  </p>
                </div>
              </label>
            ))}
          </div>
          {selectedMarkerIndexes.length > 0 && (
            <p className="text-xs text-blue-400 mt-2">
              {selectedMarkerIndexes.length} marker(s) selected
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Location (if not using a spot)
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="e.g., Lake Naroch, northern shore"
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};
