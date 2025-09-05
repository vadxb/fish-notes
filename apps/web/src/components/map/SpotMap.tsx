"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapClickHandler } from "./MapClickHandler";
import { MapZoomToSpot } from "./MapZoomToSpot";
import MapScreenshot from "./MapScreenshot";
import CustomMarker from "./CustomMarker";
import MapFocusOnMarker from "./MapFocusOnMarker";

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

interface SpotMapProps {
  latitude: number;
  longitude: number;
  coordinates?: Array<{ lat: number; lng: number; name?: string }>; // Multiple marker positions with names
  onMapClick?: (lat: number, lng: number) => void;
  interactive?: boolean;
  className?: string;
  onScreenshot?: (imageData: string) => void;
  selectedMarkerIndex?: number | null;
  primaryMarkerName?: string;
  currentImageUrl?: string;
}

export default function SpotMap({
  latitude,
  longitude,
  coordinates,
  onMapClick,
  interactive = true,
  className = "h-96",
  onScreenshot,
  selectedMarkerIndex,
  primaryMarkerName = "Primary Location",
  currentImageUrl,
}: SpotMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Fix for default markers in Leaflet with Next.js
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
          ._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
      });
    }
  }, []);

  if (!isClient) {
    return (
      <div
        className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="text-gray-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Zoom to spot */}
        <MapZoomToSpot latitude={latitude} longitude={longitude} zoom={12} />

        {/* Focus on selected marker */}
        <MapFocusOnMarker
          latitude={latitude}
          longitude={longitude}
          selectedMarkerIndex={selectedMarkerIndex ?? null}
          coordinates={coordinates}
        />

        {/* Primary marker */}

        <CustomMarker
          position={[latitude, longitude]}
          isSelected={selectedMarkerIndex === -1} // -1 represents primary marker
          markerIndex={-1}
          markerName={primaryMarkerName}
        />

        {/* Additional markers if coordinates are provided */}
        {coordinates &&
          coordinates.map((coord, index) => (
            <CustomMarker
              key={`marker-${index}`}
              position={[coord.lat, coord.lng]}
              isSelected={selectedMarkerIndex === index}
              markerIndex={index}
              markerName={coord.name || `Marker ${index + 2}`}
            />
          ))}
        {interactive && onMapClick && (
          <MapClickHandler onClick={onMapClick} interactive={interactive} />
        )}
      </MapContainer>

      {/* Screenshot button outside of map container */}
      {onScreenshot && (
        <MapScreenshot
          onScreenshot={onScreenshot}
          currentImageUrl={currentImageUrl}
        />
      )}
    </div>
  );
}
