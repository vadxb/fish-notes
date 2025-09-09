"use client";
import { useState } from "react";

interface MapScreenshotProps {
  onScreenshot?: (imageData: string) => void;
  currentImageUrl?: string;
}

export default function MapScreenshot({ onScreenshot }: MapScreenshotProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleScreenshot = async () => {
    if (!onScreenshot || isCapturing) return;

    setIsCapturing(true);

    try {
      // Import html2canvas dynamically
      const html2canvas = (await import("html2canvas")).default;

      // Find the map container by looking for the leaflet map
      const mapContainer = document.querySelector(
        ".leaflet-container"
      ) as HTMLElement;

      if (!mapContainer) {
        console.error("Map container not found");
        return;
      }

      console.log("Taking screenshot of map container...");

      // Take screenshot with simple, reliable settings
      const canvas = await html2canvas(mapContainer, {
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        scale: 1,
        logging: false,
        // Simple settings to avoid issues
        removeContainer: false,
        foreignObjectRendering: false,
        // Ignore UI elements that shouldn't be in screenshot
        ignoreElements: (element) => {
          // Ignore any elements with specific classes that are UI controls
          return (
            element.classList?.contains("leaflet-control") ||
            element.classList?.contains("leaflet-popup") ||
            element.classList?.contains("leaflet-tooltip") ||
            element.id?.includes("screenshot") ||
            false
          );
        },
      });

      console.log(
        "Screenshot captured, size:",
        canvas.width,
        "x",
        canvas.height
      );

      // Convert to blob and then to data URL
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, "image/png");
      });

      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        console.log("Screenshot ready, data length:", imageData.length);
        onScreenshot(imageData);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to take screenshot:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!onScreenshot) {
    return null;
  }

  return (
    <div className="absolute top-2 right-2 z-[1000]">
      <button
        onClick={handleScreenshot}
        disabled={isCapturing}
        className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Take screenshot of the map"
      >
        {isCapturing ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Capturing...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Take Screenshot
          </>
        )}
      </button>
    </div>
  );
}
