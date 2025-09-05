"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useSpotStore } from "@store/useSpotStore";
import {
  SpotHeader,
  SpotDetailsForm,
  SpotMapSection,
  SpotMarkerManager,
  SpotEmptyState,
  SpotError,
} from "@web/components/SpotForm";
import { X, Save } from "lucide-react";

interface WaterBody {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  country: string;
  region: string | null;
}

export default function NewSpotPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { createSpot } = useSpotStore();
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    notes: "",
  });
  const [coordinates, setCoordinates] = useState<
    Array<{ lat: number; lng: number; name?: string }>
  >([]);
  const [primaryMarkerName, setPrimaryMarkerName] =
    useState("Primary Location");
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(
    -1 // Default to primary marker selected
  );

  const markerManagerMapClickRef = useRef<
    ((lat: number, lng: number) => void) | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mapImage, setMapImage] = useState<string>("");
  const [selectedWaterBody, setSelectedWaterBody] = useState<WaterBody | null>(
    null
  );

  // Don't render if user is null (during logout)
  if (!user) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMapScreenshot = (imageData: string) => {
    setMapImage(imageData);
  };

  const handleWaterBodySelect = (waterBody: WaterBody | null) => {
    setSelectedWaterBody(waterBody);
    if (waterBody) {
      setFormData((prev) => ({
        ...prev,
        name: waterBody.name,
        latitude: waterBody.latitude.toString(),
        longitude: waterBody.longitude.toString(),
      }));
    }
  };

  const handleMarkerSelect = () => {
    // No need to re-render the map since MapFocusOnMarker handles panning
  };

  const handleMapClick = (lat: number, lng: number) => {
    // Validate coordinates
    if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
      console.error("Invalid coordinates received:", { lat, lng });
      return;
    }

    if (isAddingMarker) {
      // Add new marker to coordinates array
      const newCoordinates = [...coordinates, { lat, lng }];
      setCoordinates(newCoordinates);
      setIsAddingMarker(false);
      // Keep the newly added marker selected
      setSelectedMarkerIndex(newCoordinates.length - 1);
    } else if (selectedMarkerIndex !== null) {
      // Update selected marker position
      if (selectedMarkerIndex === -1) {
        // Update primary marker
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));
        // Keep primary marker selected
      } else {
        // Update additional marker
        const newCoordinates = [...coordinates];
        newCoordinates[selectedMarkerIndex] = {
          ...newCoordinates[selectedMarkerIndex],
          lat,
          lng,
        };
        setCoordinates(newCoordinates);
        // Keep the same marker selected
      }
      // Don't clear selection - keep the marker selected after moving
    } else {
      // Update primary marker position (default behavior)
      setFormData((prev) => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const newSpot = await createSpot({
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        coordinates: coordinates,
        notes: formData.notes,
        mapImage: mapImage || null,
      });

      if (newSpot) {
        // Redirect to spots page after successful creation
        router.push("/spots");
      } else {
        setError("Failed to create spot");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create spot"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
        },
        (error) => {
          setError("Unable to get your location: " + error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <SpotHeader
            onBack={() => router.back()}
            title="Add New Spot"
            subtitle="Mark a new fishing location with coordinates and notes"
          />

          {/* Error State */}
          {error && <SpotError error={error} />}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Spot Details */}
            <div className="xl:col-span-1">
              <form
                id="spot-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <SpotDetailsForm
                  formData={formData}
                  selectedWaterBody={selectedWaterBody}
                  isSubmitting={isSubmitting}
                  onInputChange={handleInputChange}
                  onWaterBodySelect={handleWaterBodySelect}
                  onGetCurrentLocation={getCurrentLocation}
                />
              </form>
            </div>

            {/* Right Column - Map and Markers */}
            <div className="xl:col-span-2 space-y-8">
              {formData.latitude && formData.longitude ? (
                /* Map and Marker Management Row */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Map Section */}
                  <SpotMapSection
                    latitude={parseFloat(formData.latitude)}
                    longitude={parseFloat(formData.longitude)}
                    coordinates={coordinates}
                    mapImage={mapImage}
                    selectedMarkerIndex={selectedMarkerIndex}
                    primaryMarkerName={primaryMarkerName}
                    isAddingMarker={isAddingMarker}
                    isSubmitting={isSubmitting}
                    onMapClick={handleMapClick}
                    onMapScreenshot={handleMapScreenshot}
                    onMapClickHandler={(handler) => {
                      markerManagerMapClickRef.current = handler;
                    }}
                  />

                  {/* Marker Management Section */}
                  <SpotMarkerManager
                    coordinates={coordinates}
                    isAddingMarker={isAddingMarker}
                    selectedMarkerIndex={selectedMarkerIndex}
                    primaryMarkerName={primaryMarkerName}
                    isSubmitting={isSubmitting}
                    onCoordinatesChange={setCoordinates}
                    onMapClick={(lat, lng) => {
                      // Validate coordinates first
                      if (
                        lat == null ||
                        lng == null ||
                        isNaN(lat) ||
                        isNaN(lng)
                      ) {
                        console.error(
                          "New page onMapClick: Invalid coordinates",
                          {
                            lat,
                            lng,
                          }
                        );
                        return;
                      }
                      handleMapClick(lat, lng);
                    }}
                    onMapClickHandler={(handler) => {
                      markerManagerMapClickRef.current = handler;
                    }}
                    onToggleAddingMarker={setIsAddingMarker}
                    onSelectMarker={setSelectedMarkerIndex}
                    onMarkerSelect={handleMarkerSelect}
                    onPrimaryMarkerNameChange={setPrimaryMarkerName}
                  />
                </div>
              ) : (
                /* Placeholder when no coordinates */
                <div className="space-y-6">
                  <SpotEmptyState type="map" />
                  <SpotEmptyState type="markers" />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex justify-end space-x-4 pt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              form="spot-form"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
              disabled={isSubmitting}
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "Creating Spot..." : "Create Spot"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
