"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";
import { useSpotStore } from "@store/useSpotStore";
import { useEventStore } from "@store/useEventStore";
import { getCurrentDateTime, formatDate } from "@web/lib/dateUtils";
import { EventHeader, EventForm } from "@web/components/Events";
import ConfirmationPopup from "@web/components/ConfirmationPopup";
import { useTheme } from "@web/contexts/ThemeContext";

interface Event {
  id: string;
  userId: string;
  title: string;
  notes?: string;
  startAt: string;
  endAt?: string;
  locationType: "text" | "spot";
  locationText?: string;
  spotId?: string;
  selectedMarkerIndexes?: number[];
  createdAt: string;
  spot?: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    coordinates?: Array<{ lat: number; lng: number; name?: string }>;
  };
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { themeConfig } = useTheme();
  const { id } = React.use(params);
  const { spots, fetchSpots } = useSpotStore();
  const { updateEvent } = useEventStore();

  const [event, setEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      locationType: "text" as "text" | "spot",
      selectedSpotId: "",
      selectedMarkerIndexes: [] as number[],
      locationText: "",
    };
  });

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        if (response.ok) {
          const eventData = await response.json();
          setEvent(eventData);

          // Populate form with event data
          const startDate = new Date(eventData.startAt);
          const endDate = eventData.endAt ? new Date(eventData.endAt) : null;

          setFormData({
            title: eventData.title || "",
            notes: eventData.notes || "",
            startDate: startDate.toISOString().split("T")[0],
            startTime: startDate.toTimeString().slice(0, 5),
            endDate: endDate ? endDate.toISOString().split("T")[0] : "",
            endTime: endDate ? endDate.toTimeString().slice(0, 5) : "",
            locationType: eventData.locationType || "text",
            selectedSpotId: eventData.spotId || "",
            selectedMarkerIndexes: eventData.selectedMarkerIndexes || [],
            locationText: eventData.locationText || "",
          });
        } else {
          setError("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to fetch event");
      } finally {
        setLoadingEvent(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  // Fetch spots when user is available
  useEffect(() => {
    if (user) {
      fetchSpots();
    }
  }, [user, fetchSpots]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMarkerToggle = (markerIndex: number) => {
    setFormData((prev) => {
      const newIndexes = prev.selectedMarkerIndexes.includes(markerIndex)
        ? prev.selectedMarkerIndexes.filter((i) => i !== markerIndex)
        : [...prev.selectedMarkerIndexes, markerIndex];
      return {
        ...prev,
        selectedMarkerIndexes: newIndexes,
      };
    });
  };

  const handleSelectAllMarkers = () => {
    if (!formData.selectedSpotId) return;
    const selectedSpot = spots.find(
      (spot) => spot.id === formData.selectedSpotId
    );
    if (!selectedSpot?.coordinates) return;

    const allMarkerIndexes = [
      -1,
      ...Array.from({ length: selectedSpot.coordinates.length }, (_, i) => i),
    ];
    setFormData((prev) => ({
      ...prev,
      selectedMarkerIndexes: allMarkerIndexes,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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

      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvent(updatedEvent);
        // Update the event in the store
        updateEvent(id, updatedEvent);
        router.push("/events");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update event");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update event"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/events");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete event");
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete event"
      );
      setShowDeleteConfirm(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Event not found
          </h1>
          <button
            onClick={() => router.push("/events")}
            className="bg-blue-600/20 text-white px-4 py-2 rounded-lg hover:bg-blue-600/30 transition-all duration-200"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeConfig.gradients.background}`}>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <EventHeader
            onBack={() => router.back()}
            title={event ? `Edit ${event.title}` : "Edit Event"}
            subtitle={`Created ${formatDate(event?.createdAt || new Date().toString())}`}
            showDelete={true}
            onDelete={handleDelete}
            isDeleting={isSubmitting}
          />

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400">{error}</p>
            </div>
          )}

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
            submitButtonText="Update Event"
          />

          {/* Delete Confirmation Popup */}
          <ConfirmationPopup
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={confirmDelete}
            title="Delete Event"
            message="Are you sure you want to delete this event? This action cannot be undone."
            type="danger"
            confirmText="Delete"
            cancelText="Cancel"
          />
        </div>
      </div>
    </div>
  );
}
