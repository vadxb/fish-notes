import React, { useState, useEffect, useRef } from "react";
import { Fish, ChevronDown } from "lucide-react";

interface Fish {
  id: string;
  commonName: string;
  scientificName: string;
  imageUrl?: string;
}

interface FishSelectorProps {
  fishes: Fish[];
  selectedFish: string;
  customSpecies: string;
  onFishSelect: (fish: Fish) => void;
  onCustomSpeciesChange: (value: string) => void;
  loading?: boolean;
  error?: string;
}

export const FishSelector: React.FC<FishSelectorProps> = ({
  fishes,
  selectedFish,
  customSpecies,
  onFishSelect,
  onCustomSpeciesChange,
  loading = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFishSelect = (fish: Fish) => {
    onFishSelect(fish);
    setIsOpen(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCustomSpeciesChange(e.target.value);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Species *
        </label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-left flex items-center justify-between text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={selectedFish ? "text-white" : "text-gray-400"}>
              {selectedFish || "Select a species"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {fishes.map((fish) => (
                <button
                  key={fish.id}
                  type="button"
                  onClick={() => handleFishSelect(fish)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700/50 flex items-center space-x-3 transition-colors"
                >
                  {fish.imageUrl && (
                    <img
                      src={fish.imageUrl}
                      alt={fish.commonName}
                      className="w-8 h-8 object-cover rounded-lg border border-gray-600/50"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-white">
                      {fish.commonName}
                    </div>
                    <div className="text-sm text-gray-400">
                      {fish.scientificName}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Or enter custom species below
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Custom Species
        </label>
        <input
          type="text"
          value={customSpecies}
          onChange={handleCustomChange}
          placeholder="Enter custom fish species"
          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};
