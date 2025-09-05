"use client";
import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

interface MapZoomToSpotProps {
  latitude: number;
  longitude: number;
  zoom: number;
}

export function MapZoomToSpot({
  latitude,
  longitude,
  zoom,
}: MapZoomToSpotProps) {
  const map = useMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only set initial view once, don't interfere with marker selection
    if (!hasInitialized.current) {
      map.setView([latitude, longitude], zoom);
      hasInitialized.current = true;
    }
  }, [map, latitude, longitude, zoom]);

  return null;
}
