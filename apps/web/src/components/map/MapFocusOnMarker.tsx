"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapFocusOnMarkerProps {
  latitude: number;
  longitude: number;
  selectedMarkerIndex: number | null;
  coordinates?: Array<{ lat: number; lng: number; name?: string }>;
}

export default function MapFocusOnMarker({
  latitude,
  longitude,
  selectedMarkerIndex,
  coordinates = [],
}: MapFocusOnMarkerProps) {
  const map = useMap();

  useEffect(() => {
    if (selectedMarkerIndex === null) return;

    // Check if map is ready and not in the middle of a zoom operation
    if (
      !map ||
      !map.getContainer() ||
      (map as unknown as { _zooming?: boolean; _animatingZoom?: boolean })
        ._zooming ||
      (map as unknown as { _zooming?: boolean; _animatingZoom?: boolean })
        ._animatingZoom
    )
      return;

    let targetLat: number;
    let targetLng: number;

    if (selectedMarkerIndex === -1) {
      // Focus on primary marker
      targetLat = latitude;
      targetLng = longitude;
    } else if (coordinates[selectedMarkerIndex]) {
      // Focus on selected additional marker
      targetLat = coordinates[selectedMarkerIndex].lat;
      targetLng = coordinates[selectedMarkerIndex].lng;
    } else {
      return; // Invalid selection
    }

    // Add a delay to avoid conflicts with other map operations
    const timeoutId = setTimeout(() => {
      // Double-check map state before panning
      if (
        !map ||
        !map.getContainer() ||
        (map as unknown as { _zooming?: boolean; _animatingZoom?: boolean })
          ._zooming ||
        (map as unknown as { _zooming?: boolean; _animatingZoom?: boolean })
          ._animatingZoom
      ) {
        return;
      }

      try {
        // Smoothly pan to the selected marker (keep current zoom level)
        map.panTo([targetLat, targetLng], {
          animate: true,
          duration: 0.8, // Animation duration in seconds
        });
      } catch (error) {
        console.warn("MapFocusOnMarker: Pan operation failed:", error);
      }
    }, 100); // Reduced delay for better responsiveness

    return () => clearTimeout(timeoutId);
  }, [map, latitude, longitude, selectedMarkerIndex, coordinates]);

  return null;
}
