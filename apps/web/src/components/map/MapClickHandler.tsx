"use client";
import { useMapEvents } from "react-leaflet";
import { useRef } from "react";

interface MapClickHandlerProps {
  onClick: (lat: number, lng: number) => void;
  interactive: boolean;
}

export function MapClickHandler({
  onClick,
  interactive,
}: MapClickHandlerProps) {
  const lastClickTimeRef = useRef(0);
  const map = useMapEvents({
    click: (e: {
      latlng: { lat: number; lng: number };
      originalEvent?: Event;
    }) => {
      if (!interactive) return;

      // Check if map is in a stable state
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

      // Debounce rapid clicks
      const now = Date.now();
      if (now - lastClickTimeRef.current < 500) {
        return; // Ignore clicks within 500ms of the last click
      }
      lastClickTimeRef.current = now;

      // Check if the click originated from a control element
      const originalEvent = e.originalEvent;
      if (originalEvent && originalEvent.target) {
        const target = originalEvent.target as HTMLElement;

        // Check if click is on any leaflet control or its children
        if (
          target.closest(".leaflet-control") ||
          target.closest(".leaflet-control-zoom") ||
          target.closest(".leaflet-control-attribution") ||
          target.closest(".leaflet-control-layers") ||
          target.classList.contains("leaflet-control-zoom-in") ||
          target.classList.contains("leaflet-control-zoom-out") ||
          target.classList.contains("leaflet-control-zoom") ||
          target.classList.contains("leaflet-control")
        ) {
          // Ignore clicks on controls
          return;
        }
      }

      // Only process clicks on the actual map area
      try {
        const { lat, lng } = e.latlng;
        onClick(lat, lng);
      } catch (error) {
        console.warn("Map click handler error:", error);
      }
    },
  });
  return null;
}
