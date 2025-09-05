import { MapPin } from "lucide-react";
import MarkerManager from "@web/components/MarkerManager";

interface SpotMarkerManagerProps {
  coordinates: Array<{ lat: number; lng: number; name?: string }>;
  isAddingMarker: boolean;
  selectedMarkerIndex: number | null;
  primaryMarkerName: string;
  isSubmitting: boolean;
  onCoordinatesChange: (
    coordinates: Array<{ lat: number; lng: number; name?: string }>
  ) => void;
  onMapClick: (lat: number, lng: number) => void;
  onMapClickHandler: (
    handler: ((lat: number, lng: number) => void) | null
  ) => void;
  onToggleAddingMarker: (adding: boolean) => void;
  onSelectMarker: (index: number | null) => void;
  onMarkerSelect: () => void;
  onPrimaryMarkerNameChange: (name: string) => void;
}

export default function SpotMarkerManager({
  coordinates,
  isAddingMarker,
  selectedMarkerIndex,
  primaryMarkerName,
  isSubmitting,
  onCoordinatesChange,
  onMapClick,
  onMapClickHandler,
  onToggleAddingMarker,
  onSelectMarker,
  onMarkerSelect,
  onPrimaryMarkerNameChange,
}: SpotMarkerManagerProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Marker Management
          </h3>
          <p className="text-sm text-gray-400">
            Manage multiple fishing locations for this spot
          </p>
        </div>
      </div>

      <MarkerManager
        coordinates={coordinates}
        onCoordinatesChange={onCoordinatesChange}
        onMapClick={onMapClick}
        onMapClickHandler={onMapClickHandler}
        disabled={isSubmitting}
        isAddingMarker={isAddingMarker}
        onToggleAddingMarker={onToggleAddingMarker}
        selectedMarkerIndex={selectedMarkerIndex}
        onSelectMarker={onSelectMarker}
        onMarkerSelect={onMarkerSelect}
        primaryMarkerName={primaryMarkerName}
        onPrimaryMarkerNameChange={onPrimaryMarkerNameChange}
      />
    </div>
  );
}
