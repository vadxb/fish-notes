"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useTheme } from "@web/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSpotStore } from "@store/useSpotStore";
import { useEventStore } from "@store/useEventStore";
import { getCurrentDateTime } from "@web/lib/dateUtils";
import { EventHeader, EventForm } from "@web/components/Events";

export default function NewEventPage() {
  const { user, loading } = useAuth();
  const { themeConfig } = useTheme();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch spots for location selector
  const { spots, fetchSpots } = useSpotStore();
  const { addEvent } = useEventStore();

  // Form state
  const [formData, setFormData] = useState(() => {
    const { date, time } = getCurrentDateTime();
    return {
      title: "",
      notes: "",
      startDate: date,
      startTime: time,
      endDate: "",
      endTime: "",
      locationType: "text" as "text" | "spot", // "text" or "spot"
      selectedSpotId: "",
      selectedMarkerIndexes: [] as number[], // Array of marker indexes: [-1] for primary, [0,1,2...] for additional
      locationText: "",
    };
  });

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch spots when user is available
  useEffect(() => {
    if (user && isClient) {
      fetchSpots();
    }
  }, [user, isClient, fetchSpots]);

  // Show loading state while checking authentication (only on client)
  if (!isClient || loading) {
    return (
      <div
        className={`min-h-screen ${themeConfig.gradients.background} flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className={themeConfig.colors.text.secondary}>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is null (during logout)
  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare location data based on type
      let locationData = {};

      if (formData.locationType === "text") {
        locationData = {
          locationText: formData.locationText,
        };
      } else if (
        formData.locationType === "spot" &&
        formData.selectedSpotId &&
        formData.selectedMarkerIndexes.length > 0
      ) {
        locationData = {
          spotId: formData.selectedSpotId,
          selectedMarkerIndexes: formData.selectedMarkerIndexes,
        };
      }

      const eventData = {
        title: formData.title,
        notes: formData.notes,
        startAt:
          formData.startDate && formData.startTime
            ? new Date(
                `${formData.startDate}T${formData.startTime}`
              ).toISOString()
            : null,
        endAt:
          formData.endDate && formData.endTime
            ? new Date(`${formData.endDate}T${formData.endTime}`).toISOString()
            : null,
        locationType: formData.locationType,
        ...locationData,
      };

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const newEvent = await response.json();
        // Add the new event to the Zustand store
        addEvent(newEvent);
        router.push("/events");
      } else {
        const errorData = await response.json();
        console.error("Failed to create event:", errorData);
        // TODO: Show error to user
      }
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      if (name === "selectedSpotId" && prev.selectedSpotId !== value) {
        newFormData.selectedMarkerIndexes = [];
      }

      return newFormData;
    });
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
    const selectedSpot = spots.find(
      (spot) => spot.id === formData.selectedSpotId
    );
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

  return (
    <div className={`min-h-screen ${themeConfig.gradients.background}`}>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <EventHeader
            onBack={() => router.back()}
            title="New Event"
            subtitle="Create a new fishing event"
          />

          {/* Form */}
          <EventForm
            formData={formData}
            spots={spots}
            isSubmitting={isSubmitting}
            onInputChange={handleInputChange}
            onMarkerToggle={handleMarkerToggle}
            onSelectAllMarkers={handleSelectAllMarkers}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            submitButtonText="Create Event"
          />
        </div>
      </div>
    </div>
  );
}
