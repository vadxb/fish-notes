"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Fish,
  MapPin,
  Weight,
  Calendar,
  Save,
  X,
} from "lucide-react";
import { useSpotStore } from "@store/useSpotStore";
import { useFishStore } from "@store/useFishStore";
import { useBaitStore } from "@store/useBaitStore";
import { useEventStore } from "@store/useEventStore";
import { useCatchStore } from "@store/useCatchStore";
import { formatDate } from "@web/lib/dateUtils";
import {
  FishSelector,
  BaitSelector,
  LocationSelector,
  PhotoUpload,
  FormSection,
} from "../../../components/CatchForm";

// Using types from stores now

export default function NewCatchPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Use stores instead of local state
  const { spots, fetchSpots } = useSpotStore();
  const {
    fishes,
    loading: fishesLoading,
    error: fishesError,
    fetchFishes,
  } = useFishStore();
  const {
    baits,
    loading: baitsLoading,
    error: baitsError,
    fetchBaits,
  } = useBaitStore();
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    fetchEvents,
  } = useEventStore();
  const { addCatch } = useCatchStore();

  const [dataLoading, setDataLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showFishDropdown, setShowFishDropdown] = useState(false);
  const [showBaitDropdown, setShowBaitDropdown] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    species: "",
    speciesText: "",
    weight: "",
    bait: "",
    baitText: "",
    location: "",
    spotId: "",
    selectedMarkerIndexes: [] as number[],
    eventId: "",
    comments: "",
    weather: "",
  });

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFishDropdown || showBaitDropdown) {
        const target = event.target as Element;
        if (!target.closest(".relative")) {
          setShowFishDropdown(false);
          setShowBaitDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFishDropdown, showBaitDropdown]);

  // Fetch data for dropdowns
  useEffect(() => {
    if (!isClient || !user) return;

    const fetchData = async () => {
      try {
        setDataLoading(true);

        // Fetch all data using stores
        await Promise.all([
          fetchSpots(),
          fetchFishes(),
          fetchBaits(),
          fetchEvents(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [isClient, user, fetchSpots, fetchFishes, fetchBaits, fetchEvents]);

  // Show loading state while checking authentication or fetching data
  if (
    !isClient ||
    loading ||
    dataLoading ||
    fishesLoading ||
    baitsLoading ||
    eventsLoading
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is null (during logout)
  if (!user) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]: value,
      };

      // If the spot selection changed, clear the marker selection
      if (name === "spotId" && prev.spotId !== value) {
        newFormData.selectedMarkerIndexes = [];
      }

      return newFormData;
    });
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return `${file.name}: Not an image file`;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return `${file.name}: File too large (max 5MB)`;
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const errors: string[] = [];
      const validFiles: File[] = [];

      files.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          validFiles.push(file);
        }
      });

      setFileErrors(errors);
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFileErrors = () => {
    setFileErrors([]);
  };

  const handleFishSelect = (fish: { commonName: string }) => {
    setFormData((prev) => ({
      ...prev,
      species: fish.commonName,
      speciesText: "", // Clear custom text when selecting from dropdown
    }));
  };

  const handleBaitSelect = (bait: { commonName: string }) => {
    setFormData((prev) => ({
      ...prev,
      bait: bait.commonName,
      baitText: "", // Clear custom text when selecting from dropdown
    }));
  };

  const handleCustomSpeciesChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      speciesText: value,
      species: "", // Clear dropdown selection when custom text is entered
    }));
  };

  const handleCustomBaitChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      baitText: value,
      bait: "", // Clear dropdown selection when custom text is entered
    }));
  };

  const handleMarkerToggle = (markerIndex: number) => {
    setFormData((prev) => {
      const currentIndexes = prev.selectedMarkerIndexes;
      const isSelected = currentIndexes.includes(markerIndex);

      if (isSelected) {
        // Remove marker from selection
        return {
          ...prev,
          selectedMarkerIndexes: currentIndexes.filter(
            (index) => index !== markerIndex
          ),
        };
      } else {
        // Add marker to selection
        return {
          ...prev,
          selectedMarkerIndexes: [...currentIndexes, markerIndex],
        };
      }
    });
  };

  const handleSelectAllMarkers = () => {
    const selectedSpot = spots.find((spot) => spot.id === formData.spotId);
    if (!selectedSpot) return;

    setFormData((prev) => {
      const allMarkers = [
        -1, // Primary marker
        ...(selectedSpot.coordinates?.map((_, index) => index) || []),
      ];

      // Check if all markers are already selected
      const allSelected = allMarkers.every((markerIndex) =>
        prev.selectedMarkerIndexes.includes(markerIndex)
      );

      if (allSelected) {
        // Deselect all markers
        return {
          ...prev,
          selectedMarkerIndexes: [],
        };
      } else {
        // Select all markers
        return {
          ...prev,
          selectedMarkerIndexes: allMarkers,
        };
      }
    });
  };

  const handleSpotChange = (spotId: string) => {
    setFormData((prev) => ({
      ...prev,
      spotId,
      selectedMarkerIndexes: [], // Clear marker selection when spot changes
    }));
  };

  const handleLocationChange = (location: string) => {
    setFormData((prev) => ({ ...prev, location }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting || isUploading) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Validate required fields
      const species = formData.species || formData.speciesText;
      if (!species) {
        setError("Please select a species or enter a custom species name");
        setIsSubmitting(false);
        return;
      }

      // Upload files first if any are selected
      let photoUrls: string[] = [];
      if (selectedFiles.length > 0) {
        setIsUploading(true);
        setUploadProgress(0);

        try {
          const uploadFormData = new FormData();
          selectedFiles.forEach((file) => {
            uploadFormData.append("files", file);
          });

          // Simulate progress for better UX
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => Math.min(prev + 10, 90));
          }, 200);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          clearInterval(progressInterval);
          setUploadProgress(100);

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || "Failed to upload images");
          }

          const uploadData = await uploadResponse.json();
          photoUrls = uploadData.urls;
        } catch (error) {
          setIsUploading(false);
          setUploadProgress(0);
          throw error;
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }
      }

      // Prepare form data
      const submitData = {
        species,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        bait: formData.bait || formData.baitText,
        location: formData.location,
        spotId: formData.spotId || undefined,
        selectedMarkerIndexes:
          formData.selectedMarkerIndexes.length > 0
            ? formData.selectedMarkerIndexes
            : undefined,
        eventId: formData.eventId || undefined,
        comments: formData.comments,
        weather: formData.weather ? JSON.parse(formData.weather) : undefined,
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
      };

      // Use the store's addCatch function which handles the API call
      const newCatch = await addCatch(submitData);

      if (newCatch) {
        router.push("/catches");
      } else {
        setError("Failed to create catch");
      }
    } catch (error) {
      console.error("Catch creation error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create catch"
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent mb-2">
                Add New Catch
              </h1>
              <p className="text-gray-400">Log your latest fishing success</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fish Details */}
              <FormSection
                title="Fish Details"
                description="Information about the fish you caught"
                icon={Fish}
              >
                <FishSelector
                  fishes={fishes}
                  selectedFish={formData.species}
                  customSpecies={formData.speciesText}
                  onFishSelect={handleFishSelect}
                  onCustomSpeciesChange={handleCustomSpeciesChange}
                  loading={fishesLoading}
                  error={fishesError || undefined}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <Weight className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      placeholder="0.0"
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    />
                  </div>
                </div>
              </FormSection>

              {/* Fishing Details */}
              <FormSection
                title="Fishing Details"
                description="How and where you caught it"
                icon={MapPin}
              >
                <BaitSelector
                  baits={baits}
                  selectedBait={formData.bait}
                  customBait={formData.baitText}
                  onBaitSelect={handleBaitSelect}
                  onCustomBaitChange={handleCustomBaitChange}
                  loading={baitsLoading}
                  error={baitsError || undefined}
                />

                <LocationSelector
                  spots={spots}
                  selectedSpotId={formData.spotId}
                  selectedMarkerIndexes={formData.selectedMarkerIndexes}
                  location={formData.location}
                  onSpotChange={handleSpotChange}
                  onMarkerToggle={handleMarkerToggle}
                  onSelectAllMarkers={handleSelectAllMarkers}
                  onLocationChange={handleLocationChange}
                  loading={dataLoading}
                />
              </FormSection>
            </div>

            {/* Event and Additional Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FormSection
                title="Fishing Event"
                description="Link this catch to an existing event"
                icon={Calendar}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Event (Optional)
                  </label>
                  <select
                    name="eventId"
                    value={formData.eventId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  >
                    <option value="">Create new event automatically</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title} - {formatDate(event.startAt)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    If no event is selected, a new event will be created
                    automatically
                  </p>
                </div>
              </FormSection>

              <FormSection
                title="Additional Details"
                description="Optional information about your catch"
                icon={Calendar}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Comments
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any additional notes about this catch..."
                    className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Weather Conditions (JSON)
                  </label>
                  <textarea
                    name="weather"
                    value={formData.weather}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder='{"temperature": "15°C", "wind": "light", "conditions": "sunny"}'
                    className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional: Enter weather conditions as JSON format
                  </p>
                </div>
              </FormSection>
            </div>

            {/* Photo Upload */}
            <FormSection
              title="Photos"
              description="Upload photos of your catch"
              icon={Calendar}
            >
              <PhotoUpload
                selectedFiles={selectedFiles}
                fileErrors={fileErrors}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                onFileChange={handleFileChange}
                onFileRemove={removeFile}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add(
                    "border-blue-400/50",
                    "bg-blue-500/10"
                  );
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-blue-400/50",
                    "bg-blue-500/10"
                  );
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(
                    "border-blue-400/50",
                    "bg-blue-500/10"
                  );
                  const files = Array.from(e.dataTransfer.files);
                  const errors: string[] = [];
                  const validFiles: File[] = [];

                  files.forEach((file) => {
                    const error = validateFile(file);
                    if (error) {
                      errors.push(error);
                    } else {
                      validFiles.push(file);
                    }
                  });

                  setFileErrors(errors);
                  if (validFiles.length > 0) {
                    setSelectedFiles((prev) => [...prev, ...validFiles]);
                  }
                  if (errors.length === 0) {
                    clearFileErrors();
                  }
                }}
                disabled={isUploading}
              />
            </FormSection>

            {/* Error Messages */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Store Error Messages */}
            {(fishesError || baitsError || eventsError) && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-400 font-medium mb-2">
                  Data Loading Issues:
                </p>
                {fishesError && (
                  <p className="text-yellow-300 text-sm">
                    • Fishes: {fishesError}
                  </p>
                )}
                {baitsError && (
                  <p className="text-yellow-300 text-sm">
                    • Baits: {baitsError}
                  </p>
                )}
                {eventsError && (
                  <p className="text-yellow-300 text-sm">
                    • Events: {eventsError}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
              >
                <Save className="w-5 h-5" />
                <span>
                  {isUploading
                    ? "Uploading Photos..."
                    : isSubmitting
                      ? "Adding Catch..."
                      : "Add Catch"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
