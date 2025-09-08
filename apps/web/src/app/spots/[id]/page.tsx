"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, use, useCallback, useRef } from "react";
import { useSpotStore, type Spot } from "@store/useSpotStore";
import { formatDate } from "@web/lib/dateUtils";
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

interface EditSpotPageProps {
  params: Promise<{ id: string }>;
}

export default function EditSpotPage({ params }: EditSpotPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { deleteSpotAPI, updateSpotAPI } = useSpotStore();
  const { id } = use(params);

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
    -1
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loadingSpot, setLoadingSpot] = useState(true);
  const [mapImage, setMapImage] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [userCountryId, setUserCountryId] = useState<string | null>(null);
  const [selectedWaterBody, setSelectedWaterBody] = useState<WaterBody | null>(
    null
  );

  // Use refs to avoid dependency issues
  const coordinatesRef = useRef(coordinates);
  const isAddingMarkerRef = useRef(isAddingMarker);
  const selectedMarkerIndexRef = useRef(selectedMarkerIndex);
  const lastClickTimeRef = useRef(0);
  const formDataRef = useRef(formData);
  const markerManagerMapClickRef = useRef<
    ((lat: number, lng: number) => void) | null
  >(null);

  // Keep refs in sync with state
  useEffect(() => {
    coordinatesRef.current = coordinates;
  }, [coordinates]);

  useEffect(() => {
    isAddingMarkerRef.current = isAddingMarker;
  }, [isAddingMarker]);

  useEffect(() => {
    selectedMarkerIndexRef.current = selectedMarkerIndex;
  }, [selectedMarkerIndex]);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Fetch user profile to get country
  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const userData = await response.json();
          if (userData.countryId) {
            setUserCountryId(userData.countryId);
          } else {
            // If no country set, default to Belarus
            setUserCountryId("cmfb05q9j0000z5nzihd81gci"); // Belarus ID
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback to Belarus if profile fetch fails
        setUserCountryId("cmfb05q9j0000z5nzihd81gci");
      }
    };

    fetchUserProfile();
  }, [user]);

  // Simple map click handler - ONE source of truth
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      const now = Date.now();

      // Debounce rapid clicks (within 100ms)
      if (now - lastClickTimeRef.current < 100) {
        return;
      }
      lastClickTimeRef.current = now;

      if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
        return;
      }

      if (isAddingMarkerRef.current) {
        // Add new marker
        const newCoordinates = [...coordinatesRef.current, { lat, lng }];
        setCoordinates(newCoordinates);
        setIsAddingMarker(false);
        setSelectedMarkerIndex(newCoordinates.length - 1);
      } else if (selectedMarkerIndexRef.current === -1) {
        // Update primary marker
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));

        // No need to force map re-render - React will handle the update
      } else if (
        selectedMarkerIndexRef.current !== null &&
        selectedMarkerIndexRef.current >= 0
      ) {
        // Update additional marker
        const newCoordinates = [...coordinatesRef.current];
        newCoordinates[selectedMarkerIndexRef.current] = {
          ...newCoordinates[selectedMarkerIndexRef.current],
          lat,
          lng,
        };
        setCoordinates(newCoordinates);

        // No need to force map re-render - React will handle the update
      }
    },
    [] // Empty dependency array - function never changes
  );

  const handleMapScreenshot = useCallback((imageData: string) => {
    console.log(
      "handleMapScreenshot called with imageData length:",
      imageData.length
    );
    setMapImage(imageData);
  }, []);

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

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this spot? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteSpotAPI(id);
      if (success) {
        router.push("/spots");
      } else {
        setError("Failed to delete spot");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete spot"
      );
    } finally {
      setIsDeleting(false);
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

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await fetch(`/api/spots/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch spot");
        }
        const data = await response.json();
        setSpot(data.spot);
        setFormData({
          name: data.spot.name,
          latitude: data.spot.latitude.toString(),
          longitude: data.spot.longitude.toString(),
          notes: data.spot.notes || "",
        });
        // Set the map image if it exists
        if (data.spot.mapImageUrl) {
          setMapImage(data.spot.mapImageUrl);
        }
        // Filter out the primary marker from coordinates array
        const additionalCoordinates = (data.spot.coordinates || []).filter(
          (coord: { lat: number; lng: number }) =>
            !(
              coord.lat === data.spot.latitude &&
              coord.lng === data.spot.longitude
            )
        );
        setCoordinates(additionalCoordinates);
        setPrimaryMarkerName("Primary Location");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch spot"
        );
      } finally {
        setLoadingSpot(false);
      }
    };

    if (user && id) {
      fetchSpot();
    }
  }, [user, id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const updatedSpot = await updateSpotAPI(id, {
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        coordinates: coordinates,
        notes: formData.notes,
        mapImage: mapImage || null,
      });

      if (updatedSpot) {
        setSpot(updatedSpot);
        router.push("/spots");
      } else {
        throw new Error("Failed to update spot");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update spot"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loadingSpot || !userCountryId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">
            {loadingSpot ? "Loading spot..." : "Loading your country data..."}
          </p>
        </div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Spot not found</h1>
          <button
            onClick={() => router.push("/spots")}
            className="px-4 py-2 bg-blue-600/20 text-white rounded-xl hover:bg-blue-600/30 transition-all duration-200"
          >
            Back to Spots
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <SpotHeader
            onBack={() => router.back()}
            title={spot?.name || "Edit Spot"}
            subtitle={
              spot
                ? `Created on ${formatDate(spot.createdAt)}`
                : "Update your fishing spot details and location"
            }
            showDelete={true}
            onDelete={handleDelete}
            isDeleting={isDeleting}
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
                  countryId={userCountryId || undefined}
                  onInputChange={handleInputChange}
                  onWaterBodySelect={handleWaterBodySelect}
                  onGetCurrentLocation={getCurrentLocation}
                />
              </form>
            </div>

            {/* Right Column - Map and Markers */}
            <div className="xl:col-span-2 space-y-8">
              {formData.latitude && formData.longitude ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                  <SpotMarkerManager
                    coordinates={coordinates}
                    isAddingMarker={isAddingMarker}
                    selectedMarkerIndex={selectedMarkerIndex}
                    primaryMarkerName={primaryMarkerName}
                    isSubmitting={isSubmitting}
                    onCoordinatesChange={setCoordinates}
                    onMapClick={(lat, lng) => {
                      if (
                        lat == null ||
                        lng == null ||
                        isNaN(lat) ||
                        isNaN(lng)
                      ) {
                        console.error(
                          "Edit page onMapClick: Invalid coordinates",
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
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600/20 text-white rounded-xl hover:bg-blue-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
              disabled={isSubmitting}
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "Updating Spot..." : "Update Spot"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
