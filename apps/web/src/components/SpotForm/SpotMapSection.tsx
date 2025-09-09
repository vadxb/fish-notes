import { MapPin, Camera } from "lucide-react";
import { FishingLogo } from "@ui/Logo/FishingLogo";
import SpotMap from "@web/components/map/SpotMap";

interface SpotMapSectionProps {
  latitude: number;
  longitude: number;
  coordinates: Array<{ lat: number; lng: number; name?: string }>;
  mapImage: string;
  selectedMarkerIndex: number | null;
  primaryMarkerName: string;
  isAddingMarker: boolean;
  isSubmitting: boolean;
  onMapClick: (lat: number, lng: number) => void;
  onMapScreenshot: (imageData: string) => void;
  onMapClickHandler?: (
    handler: ((lat: number, lng: number) => void) | null
  ) => void;
}

export default function SpotMapSection({
  latitude,
  longitude,
  coordinates,
  mapImage,
  selectedMarkerIndex,
  primaryMarkerName,
  isAddingMarker,
  isSubmitting,
  onMapClick,
  onMapScreenshot,
  onMapClickHandler,
}: SpotMapSectionProps) {
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
            Click on the map to update the spot location
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Map */}
        <SpotMap
          latitude={latitude}
          longitude={longitude}
          coordinates={coordinates}
          interactive={true}
          onMapClick={onMapClick}
          className="h-96"
          onScreenshot={onMapScreenshot}
          selectedMarkerIndex={selectedMarkerIndex}
          primaryMarkerName={primaryMarkerName}
          currentImageUrl={mapImage}
        />

        {/* Map Screenshot */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Camera className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-400">Map Screenshot:</p>
          </div>
          {mapImage ? (
            <img
              src={mapImage}
              alt="Map preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-700/50"
            />
          ) : (
            <div className="w-full h-48 bg-gray-700/50 rounded-lg border border-gray-700/50 flex items-center justify-center">
              <div className="text-center">
                <FishingLogo
                  className="w-16 h-16 mx-auto mb-2"
                  color="#9CA3AF"
                />
                <p className="text-sm text-gray-400">No screenshot available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
