"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Fish,
  Edit,
  Trash2,
  Plus,
  Weight,
  Save,
  Calendar,
} from "lucide-react";
import { formatDate } from "@web/lib/dateUtils";
import { useFishStore } from "@store/useFishStore";
import { useBaitStore } from "@store/useBaitStore";
import { useCatchStore } from "@store/useCatchStore";
import { useSpotStore } from "@store/useSpotStore";
import { useEventStore } from "@store/useEventStore";
import {
  FishSelector,
  BaitSelector,
  LocationSelector,
  PhotoUpload,
  FormSection,
} from "./CatchForm";
import ConfirmationPopup from "@web/components/ConfirmationPopup";

interface Catch {
  id: string;
  species: string;
  weight?: number;
  bait?: string;
  comments?: string;
  createdAt: string;
  photoUrls?: string[];
  selectedMarkerIndexes?: number[];
  location?: string;
  spotId?: string;
}

interface Event {
  id: string;
  title: string;
  catches?: Catch[];
}

interface ManageCatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEditCatch?: (catch_: Catch) => void;
  onDeleteCatch?: (catchId: string) => void;
  showFullManagement?: boolean;
  onNavigateToFullManagement?: () => void;
}

export default function ManageCatchesModal({
  isOpen,
  onClose,
  event,
  onDeleteCatch,
  showFullManagement = false,
  onNavigateToFullManagement,
}: ManageCatchesModalProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAddingCatch, setIsAddingCatch] = useState(false);
  const [editingCatchId, setEditingCatchId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [showFishDropdown, setShowFishDropdown] = useState(false);
  const [showBaitDropdown, setShowBaitDropdown] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [removedExistingPhotos, setRemovedExistingPhotos] = useState<number[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const addCatchBlockRef = useRef<HTMLDivElement>(null);

  const { fishes, fetchFishes } = useFishStore();
  const { baits, fetchBaits } = useBaitStore();
  const { spots, fetchSpots } = useSpotStore();
  const { addCatch, updateCatch, deleteCatch } = useCatchStore();
  const { updateEventCatch, addEventCatch, removeEventCatch } = useEventStore();

  // Reset form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditingCatchId(null);
      setIsAddingCatch(false);
      setShowFishDropdown(false);
      setShowBaitDropdown(false);
      setCatchFormData({
        species: "",
        speciesText: "",
        weight: "",
        bait: "",
        baitText: "",
        location: "",
        spotId: "",
        selectedMarkerIndexes: [],
        comments: "",
      });
      setSelectedFiles([]);
      setRemovedExistingPhotos([]);
      setError("");
    }
  }, [isOpen, event?.id]);

  const [catchFormData, setCatchFormData] = useState({
    species: "",
    speciesText: "",
    weight: "",
    bait: "",
    baitText: "",
    location: "",
    spotId: "",
    selectedMarkerIndexes: [] as number[],
    comments: "",
  });

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchFishes();
      fetchBaits();
      fetchSpots();
    }
  }, [isOpen, fetchFishes, fetchBaits, fetchSpots]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFishDropdown || showBaitDropdown) {
        const target = event.target as Element;
        if (!target.closest(".relative") && !target.closest("button")) {
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

  if (!isOpen || !event) return null;

  // Handle edit catch - start inline editing
  const handleEditCatch = (catch_: Catch) => {
    setEditingCatchId(catch_.id);
    setCatchFormData({
      species: catch_.species,
      speciesText: "",
      weight: catch_.weight?.toString() || "",
      bait: catch_.bait || "",
      baitText: "",
      location: catch_.location || "",
      spotId: catch_.spotId || "",
      selectedMarkerIndexes: catch_.selectedMarkerIndexes || [],
      comments: catch_.comments || "",
    });
    setIsAddingCatch(false);
    setShowFishDropdown(false);
    setShowBaitDropdown(false);
    setSelectedFiles([]);

    // Scroll to the form after a short delay
    setTimeout(() => {
      if (addCatchBlockRef.current) {
        addCatchBlockRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // Handle delete catch
  const handleDeleteCatch = (catchId: string) => {
    if (onDeleteCatch) {
      // Parent component handles confirmation
      onDeleteCatch(catchId);
    } else {
      // Show confirmation popup
      setShowDeleteConfirm(catchId);
    }
  };

  const confirmDeleteCatch = async (catchId: string) => {
    setIsDeleting(catchId);
    try {
      await deleteCatch(catchId);
      // Update the event's catches list to remove the deleted catch
      if (event?.id) {
        removeEventCatch(event.id, catchId);
      }
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting catch:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle add catch - start inline adding
  const handleAddCatch = () => {
    setEditingCatchId(null);
    setCatchFormData({
      species: "",
      speciesText: "",
      weight: "",
      bait: "",
      baitText: "",
      location: "",
      spotId: "",
      selectedMarkerIndexes: [],
      comments: "",
    });
    setIsAddingCatch(true);
    setShowFishDropdown(false);
    setShowBaitDropdown(false);
    setSelectedFiles([]);

    // Scroll to the form after a short delay
    setTimeout(() => {
      if (addCatchBlockRef.current) {
        addCatchBlockRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // Handle form input changes
  const handleCatchInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCatchFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Clear dropdown selections when custom text is entered
      if (name === "speciesText" && value) {
        newData.species = "";
      }
      if (name === "baitText" && value) {
        newData.bait = "";
      }

      // If the spot selection changed, clear the marker selection
      if (name === "spotId" && prev.spotId !== value) {
        newData.selectedMarkerIndexes = [];
      }

      return newData;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (index: number) => {
    setRemovedExistingPhotos((prev) => [...prev, index]);
  };

  const handleMarkerToggle = (markerIndex: number) => {
    setCatchFormData((prev) => {
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
    const selectedSpot = spots.find((spot) => spot.id === catchFormData.spotId);
    if (!selectedSpot) return;

    setCatchFormData((prev) => {
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

  // Handle fish selection
  const handleFishSelect = (fish: { commonName: string }) => {
    setCatchFormData((prev) => ({
      ...prev,
      species: fish.commonName,
      speciesText: "", // Clear custom text when selecting from dropdown
    }));
  };

  // Handle bait selection
  const handleBaitSelect = (bait: { commonName: string }) => {
    setCatchFormData((prev) => ({
      ...prev,
      bait: bait.commonName,
      baitText: "", // Clear custom text when selecting from dropdown
    }));
  };

  // Handle custom species change
  const handleCustomSpeciesChange = (value: string) => {
    setCatchFormData((prev) => ({
      ...prev,
      speciesText: value,
      species: "", // Clear dropdown selection when custom text is entered
    }));
  };

  // Handle custom bait change
  const handleCustomBaitChange = (value: string) => {
    setCatchFormData((prev) => ({
      ...prev,
      baitText: value,
      bait: "", // Clear dropdown selection when custom text is entered
    }));
  };

  // Handle spot change
  const handleSpotChange = (spotId: string) => {
    setCatchFormData((prev) => ({
      ...prev,
      spotId,
      selectedMarkerIndexes: [], // Clear marker selection when spot changes
    }));
  };

  // Handle location change
  const handleLocationChange = (location: string) => {
    setCatchFormData((prev) => ({ ...prev, location }));
  };

  // Handle form submission
  const handleCatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      // Validate required fields
      const species = catchFormData.species || catchFormData.speciesText;
      if (!species) {
        setError("Please select a species or enter a custom species name");
        setIsSubmitting(false);
        return;
      }

      // Upload files first if any are selected
      let photoUrls: string[] = [];
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
        photoUrls = uploadData.urls;
      }

      // If editing, combine existing photos (excluding removed ones) with new ones
      if (editingCatchId && event.catches) {
        const editingCatch = event.catches.find((c) => c.id === editingCatchId);
        if (
          editingCatch?.photoUrls &&
          Array.isArray(editingCatch.photoUrls) &&
          editingCatch.photoUrls.length > 0
        ) {
          const existingPhotoUrls = editingCatch.photoUrls;
          // Filter out removed photos
          const keptExistingPhotos = existingPhotoUrls.filter(
            (_, index) => !removedExistingPhotos.includes(index)
          );
          photoUrls = [...keptExistingPhotos, ...photoUrls];
        }
      }

      const catchData = {
        species,
        weight: catchFormData.weight
          ? parseFloat(catchFormData.weight)
          : undefined,
        bait: catchFormData.bait || catchFormData.baitText,
        comments: catchFormData.comments,
        eventId: event.id,
        spotId: catchFormData.spotId || undefined,
        selectedMarkerIndexes:
          catchFormData.selectedMarkerIndexes.length > 0
            ? catchFormData.selectedMarkerIndexes
            : undefined,
        location: catchFormData.location,
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
      };

      if (isAddingCatch) {
        const newCatch = await addCatch(catchData);
        if (newCatch) {
          // Update the event's catches list to show new catch
          if (event?.id) {
            addEventCatch(event.id, newCatch);
          }
          // Reset form
          setCatchFormData({
            species: "",
            speciesText: "",
            weight: "",
            bait: "",
            baitText: "",
            location: "",
            spotId: "",
            selectedMarkerIndexes: [],
            comments: "",
          });
          setSelectedFiles([]);
          setRemovedExistingPhotos([]);
          setIsAddingCatch(false);
          setError("");
        }
      } else {
        const updatedCatch = await updateCatch(editingCatchId!, catchData);
        if (updatedCatch) {
          // Update the event's catches list to show updated data
          if (event?.id) {
            updateEventCatch(event.id, editingCatchId!, updatedCatch);
          }
          // Reset form
          setCatchFormData({
            species: "",
            speciesText: "",
            weight: "",
            bait: "",
            baitText: "",
            location: "",
            spotId: "",
            selectedMarkerIndexes: [],
            comments: "",
          });
          setSelectedFiles([]);
          setRemovedExistingPhotos([]);
          setEditingCatchId(null);
          setError("");
        }
      }
    } catch (error) {
      console.error("Failed to save catch:", error);
      setError(error instanceof Error ? error.message : "Failed to save catch");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setEditingCatchId(null);
    setIsAddingCatch(false);
    setShowFishDropdown(false);
    setShowBaitDropdown(false);
    setSelectedFiles([]);
    setRemovedExistingPhotos([]);
    setCatchFormData({
      species: "",
      speciesText: "",
      weight: "",
      bait: "",
      baitText: "",
      location: "",
      spotId: "",
      selectedMarkerIndexes: [],
      comments: "",
    });
    setError("");
  };

  const handleFullManagement = () => {
    if (onNavigateToFullManagement) {
      onNavigateToFullManagement();
    } else {
      onClose();
      router.push(`/events/${event.id}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold bg-blue-600/50 bg-clip-text text-transparent">
              Manage Catches
            </h2>
            <p className="text-gray-400 mt-1 flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{event.title}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {event.catches && event.catches.length > 0 ? (
            <div className="space-y-4">
              {event.catches.map((catch_) => (
                <div
                  key={catch_.id}
                  className={`flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:bg-gray-700/50 transition-all duration-200 ${
                    editingCatchId === catch_.id
                      ? "bg-blue-500/10 border-blue-500/30"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <Fish className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 flex-wrap">
                        <p className="text-sm font-medium text-white">
                          {catch_.species}
                        </p>
                        {catch_.weight && (
                          <div className="flex items-center space-x-1">
                            <Weight className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-300">
                              {catch_.weight}kg
                            </span>
                          </div>
                        )}
                        {catch_.bait && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-sm text-gray-300">
                              {catch_.bait}
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDate(catch_.createdAt)}
                        </span>
                      </div>
                      {catch_.comments && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {catch_.comments}
                        </p>
                      )}
                      {catch_.photoUrls &&
                        Array.isArray(catch_.photoUrls) &&
                        catch_.photoUrls.length > 0 && (
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex -space-x-1">
                              {catch_.photoUrls
                                .slice(0, 3)
                                .map((photoUrl, index) => (
                                  <div
                                    key={index}
                                    className="w-8 h-8 rounded-full border-2 border-gray-600 overflow-hidden bg-gray-700"
                                  >
                                    <img
                                      src={photoUrl}
                                      alt={`Catch photo ${index + 1}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  </div>
                                ))}
                            </div>
                            {Array.isArray(catch_.photoUrls) &&
                              catch_.photoUrls.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{catch_.photoUrls.length - 3} more
                                </span>
                              )}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditCatch(catch_)}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                      title="Edit catch"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCatch(catch_.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                      title="Delete catch"
                      disabled={isDeleting === catch_.id}
                    >
                      {isDeleting === catch_.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fish className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No catches yet
              </h3>
              <p className="text-gray-400">
                This event doesn&apos;t have any catches recorded.
              </p>
            </div>
          )}

          {/* Add/Edit Catch Form */}
          {(isAddingCatch || editingCatchId) && (
            <div ref={addCatchBlockRef} className="mt-8 space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                  <Fish className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold bg-blue-600/50 bg-clip-text text-transparent">
                  {isAddingCatch ? "Add New Catch" : "Edit Catch"}
                </h3>
              </div>

              <form onSubmit={handleCatchSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Fish Details */}
                  <FormSection
                    title="Fish Details"
                    description="Information about the fish you caught"
                    icon={Fish}
                  >
                    <FishSelector
                      fishes={fishes}
                      selectedFish={catchFormData.species}
                      customSpecies={catchFormData.speciesText}
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
                          step="0.1"
                          placeholder="e.g., 2.5"
                          value={catchFormData.weight}
                          onChange={handleCatchInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* Fishing Details */}
                  <FormSection
                    title="Fishing Details"
                    description="How and where you caught it"
                    icon={Weight}
                  >
                    <BaitSelector
                      baits={baits}
                      selectedBait={catchFormData.bait}
                      customBait={catchFormData.baitText}
                      onBaitSelect={handleBaitSelect}
                      onCustomBaitChange={handleCustomBaitChange}
                      loading={false}
                    />

                    <LocationSelector
                      spots={spots}
                      selectedSpotId={catchFormData.spotId}
                      selectedMarkerIndexes={
                        catchFormData.selectedMarkerIndexes
                      }
                      location={catchFormData.location}
                      onSpotChange={handleSpotChange}
                      onMarkerToggle={handleMarkerToggle}
                      onSelectAllMarkers={handleSelectAllMarkers}
                      onLocationChange={handleLocationChange}
                      loading={false}
                    />
                  </FormSection>
                </div>

                {/* Existing Photos Display */}
                {editingCatchId &&
                  event.catches &&
                  (() => {
                    const editingCatch = event.catches.find(
                      (c) => c.id === editingCatchId
                    );
                    return editingCatch?.photoUrls &&
                      Array.isArray(editingCatch.photoUrls) &&
                      editingCatch.photoUrls.length > 0 ? (
                      <FormSection
                        title="Current Photos"
                        description="Images of your catch"
                        icon={Fish}
                      >
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {editingCatch.photoUrls.map((photoUrl, index) => {
                            const isRemoved =
                              removedExistingPhotos.includes(index);
                            return (
                              <div
                                key={index}
                                className={`relative group ${isRemoved ? "opacity-50" : ""}`}
                              >
                                <img
                                  src={photoUrl}
                                  alt={`Catch photo ${index + 1}`}
                                  className="w-full h-32 object-cover rounded-xl border border-gray-700/50 shadow-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => removeExistingPhoto(index)}
                                    className={`opacity-0 group-hover:opacity-100 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                                      isRemoved
                                        ? "bg-gray-500 text-white"
                                        : "bg-red-500 hover:bg-red-600 text-white"
                                    }`}
                                    title={
                                      isRemoved
                                        ? "Photo will be removed"
                                        : "Remove photo"
                                    }
                                  >
                                    {isRemoved ? "Removed" : "Remove"}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Click &quot;Remove&quot; on photos you want to delete.
                          Add new photos below.
                        </p>
                      </FormSection>
                    ) : null;
                  })()}

                {/* Photo Upload */}
                <FormSection
                  title={editingCatchId ? "Add New Photos" : "Photos"}
                  description="Upload photos of your catch"
                  icon={Fish}
                >
                  <PhotoUpload
                    selectedFiles={selectedFiles}
                    fileErrors={[]}
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
                      setSelectedFiles((prev) => [...prev, ...files]);
                    }}
                    disabled={isSubmitting}
                  />
                </FormSection>

                {/* Comments */}
                <FormSection
                  title="Comments"
                  description="Any additional notes about your catch"
                  icon={Fish}
                >
                  <textarea
                    name="comments"
                    rows={3}
                    placeholder="Any additional notes..."
                    value={catchFormData.comments}
                    onChange={handleCatchInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                  />
                </FormSection>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-400">{error}</p>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600/20 text-white rounded-xl hover:bg-blue-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
                  >
                    <Save className="w-5 h-5" />
                    <span>
                      {isSubmitting
                        ? isAddingCatch
                          ? "Adding Catch..."
                          : "Updating Catch..."
                        : isAddingCatch
                          ? "Add Catch"
                          : "Update Catch"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-700/50 flex-shrink-0">
          {showFullManagement && onNavigateToFullManagement && (
            <button
              onClick={handleFullManagement}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span>View Full Event Page</span>
            </button>
          )}

          <div className="flex space-x-3 ml-auto">
            <button
              onClick={handleAddCatch}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 text-white rounded-xl hover:bg-blue-600/30 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>Add Catch</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() =>
          showDeleteConfirm && confirmDeleteCatch(showDeleteConfirm)
        }
        title="Delete Catch"
        message="Are you sure you want to delete this catch? This action cannot be undone."
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting === showDeleteConfirm}
      />
    </div>
  );
}
