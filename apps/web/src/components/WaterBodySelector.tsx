"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { X, MapPin, Search } from "lucide-react";

interface WaterBody {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  country: string;
  region: string | null;
}

interface WaterBodySelectorProps {
  onSelect: (waterBody: WaterBody | null) => void;
  selectedWaterBody: WaterBody | null;
  countryId?: string;
  className?: string;
}

export default function WaterBodySelector({
  onSelect,
  selectedWaterBody,
  countryId,
  className = "",
}: WaterBodySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [waterBodies, setWaterBodies] = useState<WaterBody[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch water bodies
  const fetchWaterBodies = useCallback(
    async (search: string = "", type: string = "") => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (type) params.append("type", type);
        if (countryId) params.append("countryId", countryId);

        const response = await fetch(`/api/water-bodies?${params}`);
        if (response.ok) {
          const data = await response.json();
          setWaterBodies(data);
        }
      } catch (error) {
        console.error("Error fetching water bodies:", error);
      } finally {
        setLoading(false);
      }
    },
    [countryId]
  );

  // Initial load and when countryId changes
  useEffect(() => {
    fetchWaterBodies();
  }, [countryId, fetchWaterBodies]);

  // Search and filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchWaterBodies(searchTerm, selectedType);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (waterBody: WaterBody) => {
    onSelect(waterBody);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleReset = () => {
    onSelect(null);
    setSearchTerm("");
    setSelectedType("");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lake":
        return "🏞️";
      case "river":
        return "🌊";
      case "stream":
        return "💧";
      case "reservoir":
        return "🏔️";
      default:
        return "💧";
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-sm font-medium text-white mb-3">
        Water Body (Optional)
      </label>

      {selectedWaterBody ? (
        // Selected water body display
        <div className="relative">
          <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {getTypeIcon(selectedWaterBody.type)}
              </span>
              <div>
                <div className="font-medium text-blue-300">
                  {selectedWaterBody.name}
                </div>
                <div className="text-sm text-blue-400">
                  {selectedWaterBody.type} •{" "}
                  {selectedWaterBody.region || selectedWaterBody.country}
                </div>
                <div className="text-xs text-blue-500">
                  {selectedWaterBody.latitude.toFixed(4)},{" "}
                  {selectedWaterBody.longitude.toFixed(4)}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        // Search input
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for lakes, rivers, streams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
          </div>

          {/* Type filter */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedType("")}
              className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 ${
                selectedType === ""
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                  : "bg-gray-700/50 text-gray-300 border-gray-600/50 hover:bg-gray-700/70"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("lake")}
              className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 ${
                selectedType === "lake"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                  : "bg-gray-700/50 text-gray-300 border-gray-600/50 hover:bg-gray-700/70"
              }`}
            >
              🏞️ Lakes
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("river")}
              className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 ${
                selectedType === "river"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                  : "bg-gray-700/50 text-gray-300 border-gray-600/50 hover:bg-gray-700/70"
              }`}
            >
              🌊 Rivers
            </button>
            <button
              type="button"
              onClick={() => setSelectedType("stream")}
              className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 ${
                selectedType === "stream"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                  : "bg-gray-700/50 text-gray-300 border-gray-600/50 hover:bg-gray-700/70"
              }`}
            >
              💧 Streams
            </button>
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-300">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
                  <div className="mt-2">Loading...</div>
                </div>
              ) : waterBodies.length === 0 ? (
                <div className="p-4 text-center text-gray-300">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <div>No water bodies found</div>
                  <div className="text-sm text-gray-400">
                    {countryId
                      ? "No water bodies available for this country. Try selecting a different country or contact support to add water bodies for your region."
                      : "Try a different search term"}
                  </div>
                </div>
              ) : (
                waterBodies.map((waterBody) => (
                  <button
                    key={waterBody.id}
                    type="button"
                    onClick={() => handleSelect(waterBody)}
                    className="w-full p-4 text-left hover:bg-gray-700/50 border-b border-gray-600/30 last:border-b-0 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {getTypeIcon(waterBody.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">
                          {waterBody.name}
                        </div>
                        <div className="text-sm text-gray-300">
                          {waterBody.type} •{" "}
                          {waterBody.region || waterBody.country}
                        </div>
                        <div className="text-xs text-gray-400">
                          {waterBody.latitude.toFixed(4)},{" "}
                          {waterBody.longitude.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
