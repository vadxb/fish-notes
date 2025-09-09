"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, X, MapPin } from "lucide-react";

interface MarkerManagerProps {
  coordinates: Array<{ lat: number; lng: number; name?: string }>;
  onCoordinatesChange: (
    coordinates: Array<{ lat: number; lng: number; name?: string }>
  ) => void;
  onMapClick?: (lat: number, lng: number) => void;
  disabled?: boolean;
  isAddingMarker?: boolean;
  onToggleAddingMarker?: (isAdding: boolean) => void;
  selectedMarkerIndex?: number | null;
  onSelectMarker?: (index: number | null) => void;
  onMarkerSelect?: (index: number) => void; // Callback when marker is selected for map focus
  primaryMarkerName?: string;
  onPrimaryMarkerNameChange?: (name: string) => void;
  onMapClickHandler?: (handler: (lat: number, lng: number) => void) => void; // Callback to get the map click handler
}

export default function MarkerManager({
  coordinates,
  onCoordinatesChange,
  onMapClick,
  disabled = false,
  isAddingMarker: externalIsAddingMarker,
  onToggleAddingMarker,
  selectedMarkerIndex: externalSelectedMarkerIndex,
  onSelectMarker,
  onMarkerSelect,
  primaryMarkerName = "Primary Location",
  onPrimaryMarkerNameChange,
  onMapClickHandler,
}: MarkerManagerProps) {
  const [internalIsAddingMarker, setInternalIsAddingMarker] = useState(false);
  const [internalSelectedMarkerIndex, setInternalSelectedMarkerIndex] =
    useState<number | null>(null);

  // Use external state if provided, otherwise use internal state
  const isAddingMarker =
    externalIsAddingMarker !== undefined
      ? externalIsAddingMarker
      : internalIsAddingMarker;
  const setIsAddingMarker = onToggleAddingMarker || setInternalIsAddingMarker;

  const selectedMarkerIndex =
    externalSelectedMarkerIndex !== undefined
      ? externalSelectedMarkerIndex
      : internalSelectedMarkerIndex;
  const setSelectedMarkerIndex =
    onSelectMarker || setInternalSelectedMarkerIndex;

  const addMarker = useCallback(
    (lat: number, lng: number) => {
      // Validate coordinates
      if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates in addMarker:", { lat, lng });
        return;
      }

      // Prevent adding multiple markers if not in adding mode
      if (!isAddingMarkerRef.current) {
        return;
      }

      const newCoordinates = [
        ...coordinates,
        {
          lat,
          lng,
          name: `Marker ${coordinates.length + 2}`, // Default name
        },
      ];

      onCoordinatesChange(newCoordinates);
      isAddingMarkerRef.current = false; // Set ref to false immediately
      setIsAddingMarker(false);
      // Keep the newly added marker selected
      setSelectedMarkerIndex(newCoordinates.length - 1);
    },
    [
      coordinates,
      onCoordinatesChange,
      setIsAddingMarker,
      setSelectedMarkerIndex,
      isAddingMarker,
    ]
  );

  const removeMarker = (index: number) => {
    const newCoordinates = coordinates.filter((_, i) => i !== index);
    onCoordinatesChange(newCoordinates);

    // If we're removing the selected marker, clear selection
    if (selectedMarkerIndex === index) {
      setSelectedMarkerIndex(null);
    } else if (selectedMarkerIndex !== null && selectedMarkerIndex > index) {
      // Adjust selected index if we removed a marker before the selected one
      setSelectedMarkerIndex(selectedMarkerIndex - 1);
    }
  };

  const selectMarker = (index: number) => {
    setSelectedMarkerIndex(index);
    setIsAddingMarker(false); // Exit add mode when selecting a marker

    // Notify parent component for map focus
    if (onMarkerSelect) {
      onMarkerSelect(index);
    }
  };

  const updateMarkerName = (index: number, name: string) => {
    const newCoordinates = [...coordinates];
    newCoordinates[index] = { ...newCoordinates[index], name };
    onCoordinatesChange(newCoordinates);
  };

  const handleMapClickRef = useRef<
    ((lat: number, lng: number) => void) | undefined
  >(undefined);
  const isAddingMarkerRef = useRef(false);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      // Validate coordinates first
      if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
        console.error(
          "MarkerManager handleMapClick: Invalid coordinates - ignoring call",
          { lat, lng }
        );
        return;
      }

      if (isAddingMarkerRef.current) {
        addMarker(lat, lng);
      } else if (onMapClick) {
        onMapClick(lat, lng);
      }
    },
    [onMapClick, addMarker]
  );

  // Store the function in ref
  handleMapClickRef.current = handleMapClick;

  // Keep the ref in sync with the state
  useEffect(() => {
    isAddingMarkerRef.current = isAddingMarker;
  }, [isAddingMarker]);

  // Expose the handleMapClick function to parent component
  useEffect(() => {
    if (onMapClickHandler) {
      onMapClickHandler(
        handleMapClickRef.current || ((lat: number, lng: number) => {})
      );
    }
  }, [onMapClickHandler]);

  return (
    <div className="space-y-4">
      {/* Marker Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gray-700/50 rounded-lg">
            <MapPin className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-white">
            Markers ({coordinates.length + 1})
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            const newValue = !isAddingMarker;
            isAddingMarkerRef.current = newValue;
            setIsAddingMarker(newValue);
          }}
          disabled={disabled}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isAddingMarker
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 border border-red-500/30"
              : "bg-blue-600/20 text-white hover:bg-blue-600/30 shadow-lg hover:shadow-blue-500/25"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isAddingMarker ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add Marker</span>
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      {isAddingMarker && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            Click on the map to add a new marker at that location. The new
            marker will be automatically selected.
          </p>
        </div>
      )}

      {selectedMarkerIndex !== null && !isAddingMarker && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-300">
            {selectedMarkerIndex === -1
              ? primaryMarkerName
              : coordinates[selectedMarkerIndex]?.name ||
                `Marker ${selectedMarkerIndex + 2}`}{" "}
            is selected. Click on the map to move it to a new location. The
            marker will remain selected after moving.
          </p>
        </div>
      )}

      {/* Primary Marker Selection */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white">Markers:</h4>
        <div
          className={`p-4 rounded-lg transition-all duration-200 ${
            selectedMarkerIndex === -1
              ? "bg-green-500/10 border-2 border-green-500/50"
              : "bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50"
          }`}
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setSelectedMarkerIndex(-1)}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-600/50 rounded-lg">
                <MapPin
                  className={`w-4 h-4 ${
                    selectedMarkerIndex === -1
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <span
                className={`text-sm ${
                  selectedMarkerIndex === -1
                    ? "text-green-300 font-medium"
                    : "text-gray-300"
                }`}
              >
                {primaryMarkerName}
              </span>
              {selectedMarkerIndex === -1 && (
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                  Selected
                </span>
              )}
            </div>
          </div>

          {/* Primary marker name input field */}
          <div className="mt-3">
            <input
              type="text"
              value={primaryMarkerName}
              onChange={(e) => onPrimaryMarkerNameChange?.(e.target.value)}
              onClick={(e) => e.stopPropagation()} // Prevent selecting marker when typing
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }} // Prevent Enter key from submitting form
              disabled={disabled}
              className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 disabled:bg-gray-800/30"
              placeholder="Primary Location"
            />
          </div>
        </div>
      </div>

      {/* Additional Markers List */}
      {coordinates.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">
            Additional Markers:
          </h4>
          <div className="space-y-3">
            {coordinates.map((coord, index) => {
              const isSelected = selectedMarkerIndex === index;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? "bg-green-500/10 border-2 border-green-500/50"
                      : "bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600/50"
                  }`}
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => selectMarker(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-600/50 rounded-lg">
                        <MapPin
                          className={`w-4 h-4 ${
                            isSelected ? "text-green-400" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm ${
                          isSelected
                            ? "text-green-300 font-medium"
                            : "text-gray-300"
                        }`}
                      >
                        {coord.name || `Marker ${index + 2}`}
                      </span>
                      {isSelected && (
                        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                          Selected
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent selecting when clicking remove
                        removeMarker(index);
                      }}
                      disabled={disabled}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Remove marker"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Name input field */}
                  <div className="mt-3">
                    <input
                      type="text"
                      value={coord.name || ""}
                      onChange={(e) => updateMarkerName(index, e.target.value)}
                      onClick={(e) => e.stopPropagation()} // Prevent selecting marker when typing
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }} // Prevent Enter key from submitting form
                      disabled={disabled}
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50 disabled:bg-gray-800/30"
                      placeholder={`Marker ${index + 2}`}
                    />
                  </div>

                  {/* Coordinates display */}
                  <div className="mt-2 text-xs text-gray-400">
                    {coord.lat != null && coord.lng != null
                      ? `${coord.lat.toFixed(6)}, ${coord.lng.toFixed(6)}`
                      : "Invalid coordinates"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Map Click Handler */}
      {isAddingMarker && (
        <div className="hidden">
          {/* This will be handled by the parent component */}
        </div>
      )}
    </div>
  );
}

// Export the map click handler for use in parent components
export { MarkerManager };
