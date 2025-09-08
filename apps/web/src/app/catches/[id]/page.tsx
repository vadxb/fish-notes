"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  X,
  Fish,
  MapPin,
  Calendar,
  Weight,
  Camera,
  Save,
  Trash2,
} from "lucide-react";
import { useSpotStore } from "@store/useSpotStore";
import { useFishStore } from "@store/useFishStore";
import { useBaitStore } from "@store/useBaitStore";
import { useEventStore } from "@store/useEventStore";
import { useCatchStore } from "@store/useCatchStore";
import { formatDate } from "@web/lib/dateUtils";
import ImageModal from "@web/components/ImageModal";
import {
  FishSelector,
  BaitSelector,
  LocationSelector,
  PhotoUpload,
  FormSection,
} from "../../../components/CatchForm";

interface Catch {
  id: string;
  species: string;
  weight?: number;
  bait?: string;
  location?: string;
  spotId?: string;
  selectedMarkerIndexes?: number[];
  eventId?: string;
  photoUrls?: string[];
  comments?: string;
  weather?: Record<string, unknown>;
  createdAt: string;
  spot?: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    coordinates?: Array<{ lat: number; lng: number; name?: string }>;
  };
  event?: {
    id: string;
    title: string;
    startAt: string;
  };
}

export default function CatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = React.use(params);
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [catch_, setCatch] = useState<Catch | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [userCountryId, setUserCountryId] = useState<string | null>(null);
  const [showFishDropdown, setShowFishDropdown] = useState(false);
  const [showBaitDropdown, setShowBaitDropdown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [photosToRemove, setPhotosToRemove] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use stores
  const { spots, fetchSpots } = useSpotStore();
  const { fishes, fetchFishes } = useFishStore();
  const { baits, fetchBaits } = useBaitStore();
  const { events, fetchEvents, addEvent } = useEventStore();
  const { updateCatch } = useCatchStore();

  const [formData, setFormData] = useState({
    species: "",
    speciesText: "", // For free text input
    weight: "",
    bait: "",
    baitText: "", // For free text input
    location: "",
    spotId: "",
    selectedMarkerIndexes: [] as number[],
    eventId: "",
    comments: "",
    weather: "",
  });

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user profile to get country
  useEffect(() => {
    if (!isClient || !user) return;

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
  }, [isClient, user]);

  // Fetch catch data and related data
  useEffect(() => {
    if (!isClient || !user || !userCountryId) return;

    const fetchData = async () => {
      try {
        setDataLoading(true);

        // Fetch catch data
        const catchResponse = await fetch(`/api/catches/${id}`);
        if (catchResponse.ok) {
          const catchData = await catchResponse.json();
          setCatch(catchData);

          // Populate form data
          // Determine if species/bait came from dropdown or custom text
          const speciesFromDropdown = fishes.some(
            (fish) => fish.commonName === catchData.species
          );
          const baitFromDropdown = baits.some(
            (bait) => bait.commonName === catchData.bait
          );

          setFormData({
            species: speciesFromDropdown ? catchData.species || "" : "",
            speciesText: !speciesFromDropdown ? catchData.species || "" : "",
            weight: catchData.weight?.toString() || "",
            bait: baitFromDropdown ? catchData.bait || "" : "",
            baitText: !baitFromDropdown ? catchData.bait || "" : "",
            location: catchData.location || "",
            spotId: catchData.spotId || "",
            selectedMarkerIndexes: catchData.selectedMarkerIndexes || [],
            eventId: catchData.eventId || "",
            comments: catchData.comments || "",
            weather: catchData.weather
              ? JSON.stringify(catchData.weather, null, 2)
              : "",
          });

          // Reset photo removal state when loading new catch
          setPhotosToRemove([]);
          setSelectedFiles([]);

          // If the catch has an eventId, fetch the event details
          if (catchData.eventId) {
            try {
              const eventResponse = await fetch(
                `/api/events/${catchData.eventId}`
              );
              if (eventResponse.ok) {
                const eventData = await eventResponse.json();
                // Add event data to catch object
                setCatch((prev) =>
                  prev ? { ...prev, event: eventData } : null
                );
                // Add event to events store so it appears in dropdown
                addEvent(eventData);
              } else {
                const errorData = await eventResponse.json();
                console.error("Failed to fetch event:", errorData);
              }
            } catch (error) {
              console.error("Error fetching event:", error);
            }
          }
        } else {
          setError("Catch not found");
        }

        // Fetch related data for editing with user's country
        await Promise.all([
          fetchSpots(),
          fetchFishes(userCountryId),
          fetchBaits(userCountryId),
          fetchEvents(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load catch data");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [isClient, user, userCountryId, id]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFishDropdown || showBaitDropdown) {
        const target = event.target as Element;
        if (!target.closest(".dropdown-container")) {
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

  const handleFishSelect = (fish: { commonName: string }) => {
    setFormData((prev) => ({
      ...prev,
      species: fish.commonName,
      speciesText: "", // Clear custom text when selecting from dropdown
    }));
    setShowFishDropdown(false);
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Clear dropdown selections when custom text is entered
      if (name === "speciesText" && value) {
        newData.species = "";
      }
      if (name === "baitText" && value) {
        newData.bait = "";
      }

      return newData;
    });
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
      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
      }
      // Clear errors after processing
      if (errors.length === 0) {
        clearFileErrors();
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // Always clear the file input to prevent browser display issues
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return newFiles;
    });
  };

  const removeExistingPhoto = (photoUrl: string) => {
    setPhotosToRemove((prev) => [...prev, photoUrl]);
  };

  const undoRemovePhoto = (photoUrl: string) => {
    setPhotosToRemove((prev) => prev.filter((url) => url !== photoUrl));
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

  const clearFileErrors = () => {
    setFileErrors([]);
  };

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleMarkerToggle = (markerIndex: number) => {
    setFormData((prev) => {
      const currentIndexes = prev.selectedMarkerIndexes;
      const isSelected = currentIndexes.includes(markerIndex);

      if (isSelected) {
        return {
          ...prev,
          selectedMarkerIndexes: currentIndexes.filter(
            (index) => index !== markerIndex
          ),
        };
      } else {
        return {
          ...prev,
          selectedMarkerIndexes: [...currentIndexes, markerIndex],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Upload new files first if any are selected
      let newPhotoUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const uploadFormData = new FormData();
        selectedFiles.forEach((file) => {
          uploadFormData.append("files", file);
        });

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Failed to upload images");
        }

        const uploadData = await uploadResponse.json();
        newPhotoUrls = uploadData.urls;
      }

      // Combine existing photos with new ones, excluding removed photos
      const existingPhotoUrls = catch_?.photoUrls || [];
      // Ensure existingPhotoUrls is an array
      const existingArray = Array.isArray(existingPhotoUrls)
        ? existingPhotoUrls
        : [];
      // Filter out photos marked for removal
      const remainingPhotos = existingArray.filter(
        (photoUrl) => !photosToRemove.includes(photoUrl)
      );
      const allPhotoUrls = [...remainingPhotos, ...newPhotoUrls];

      const submitData = {
        species: formData.species || formData.speciesText,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        bait: formData.bait || formData.baitText,
        location: formData.location,
        spotId: formData.spotId || null,
        selectedMarkerIndexes:
          formData.selectedMarkerIndexes.length > 0
            ? formData.selectedMarkerIndexes
            : null,
        eventId: formData.eventId || null,
        comments: formData.comments,
        weather: formData.weather ? JSON.parse(formData.weather) : null,
        photoUrls: allPhotoUrls.length > 0 ? allPhotoUrls : null,
      };

      const response = await fetch(`/api/catches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const updatedCatch = await response.json();
        setCatch(updatedCatch);
        // Update the catch in the Zustand store
        updateCatch(id, updatedCatch);
        // Clear selected files after successful update
        setSelectedFiles([]);
        // Redirect to catches list after successful update
        router.push("/catches");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update catch");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update catch"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this catch?")) return;

    try {
      const response = await fetch(`/api/catches/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/catches");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete catch");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete catch"
      );
    }
  };

  // Show loading state
  if (!isClient || loading || !userCountryId || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is null
  if (!user) {
    return null;
  }

  if (!catch_) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Catch Not Found
          </h1>
          <button
            onClick={() => router.push("/catches")}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Back to Catches
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-blue-600/50 bg-clip-text text-transparent mb-2">
                  Edit Catch
                </h1>
                <p className="text-gray-400">Update your catch information</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 hover:text-red-300 transition-all duration-200"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
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
                  loading={false}
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
                  loading={false}
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
                  loading={false}
                />
              </FormSection>
            </div>

            {/* Event and Additional Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FormSection
                title="Fishing Event"
                description="Link to a fishing event"
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
                    <option value="">No event linked</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title} - {formatDate(event.startAt)}
                      </option>
                    ))}
                  </select>
                </div>
              </FormSection>

              <FormSection
                title="Additional Details"
                description="Comments and weather conditions"
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
              title="Add Photos"
              description="Upload additional photos of your catch"
              icon={Camera}
            >
              <PhotoUpload
                selectedFiles={selectedFiles}
                fileErrors={fileErrors}
                isUploading={false}
                uploadProgress={0}
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
                disabled={isSubmitting}
              />
            </FormSection>

            {/* Existing Photos */}
            {catch_.photoUrls && catch_.photoUrls.length > 0 && (
              <FormSection
                title="Current Photos"
                description="Images of your catch"
                icon={Camera}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {catch_.photoUrls
                    .filter((photoUrl) => !photosToRemove.includes(photoUrl))
                    .map((photoUrl, index) => (
                      <div key={photoUrl} className="relative group">
                        <img
                          src={photoUrl}
                          alt={`${catch_.species} catch ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl border border-gray-700/50 shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-200">
                            <button
                              type="button"
                              onClick={() => openImageModal(index)}
                              className="bg-white bg-opacity-90 hover:bg-opacity-100 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => removeExistingPhoto(photoUrl)}
                              className="bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white px-3 py-1 rounded-full text-sm font-medium transition-all duration-200"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Show removed photos with undo option */}
                {photosToRemove.length > 0 && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-sm font-medium mb-2">
                      Photos marked for removal ({photosToRemove.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {photosToRemove.map((photoUrl) => (
                        <div
                          key={photoUrl}
                          className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-lg"
                        >
                          <span className="text-red-300 text-xs truncate max-w-32">
                            {photoUrl.split("/").pop()}
                          </span>
                          <button
                            type="button"
                            onClick={() => undoRemovePhoto(photoUrl)}
                            className="text-red-300 hover:text-red-200 text-xs font-medium"
                          >
                            Undo
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FormSection>
            )}
          </form>

          {/* Bottom Action Buttons */}
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
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600/20 text-white rounded-xl hover:bg-blue-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
            >
              <Save className="w-5 h-5" />
              <span>{isSubmitting ? "Updating..." : "Update Catch"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {catch_.photoUrls && catch_.photoUrls.length > 0 && (
        <ImageModal
          images={catch_.photoUrls}
          currentIndex={currentImageIndex}
          isOpen={isImageModalOpen}
          onClose={closeImageModal}
        />
      )}
    </div>
  );
}
