import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface Bait {
  id: string;
  commonName: string;
  imageUrl?: string;
}

interface BaitSelectorProps {
  baits: Bait[];
  selectedBait: string;
  customBait: string;
  onBaitSelect: (bait: Bait) => void;
  onCustomBaitChange: (value: string) => void;
  loading?: boolean;
  error?: string;
}

export const BaitSelector: React.FC<BaitSelectorProps> = ({
  baits,
  selectedBait,
  customBait,
  onBaitSelect,
  onCustomBaitChange,
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

  const handleBaitSelect = (bait: Bait) => {
    onBaitSelect(bait);
    setIsOpen(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCustomBaitChange(e.target.value);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bait Used
        </label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-left flex items-center justify-between text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className={selectedBait ? "text-white" : "text-gray-400"}>
              {selectedBait || "Select bait used"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {baits.map((bait) => (
                <button
                  key={bait.id}
                  type="button"
                  onClick={() => handleBaitSelect(bait)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700/50 flex items-center space-x-3 transition-colors"
                >
                  {bait.imageUrl && (
                    <img
                      src={bait.imageUrl}
                      alt={bait.commonName}
                      className="w-8 h-8 object-cover rounded-lg border border-gray-600/50"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-white">
                      {bait.commonName}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Or enter custom bait below</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Custom Bait
        </label>
        <input
          type="text"
          value={customBait}
          onChange={handleCustomChange}
          placeholder="Enter custom bait"
          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};
