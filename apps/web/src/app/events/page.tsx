"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useTheme } from "@web/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useEventStore } from "@store/useEventStore";
import { useCatchStore } from "@store/useCatchStore";
import ManageCatchesModal from "@web/components/ManageCatchesModal";
import ConfirmationPopup from "@web/components/ConfirmationPopup";
import {
  EventCard,
  EventSearchBar,
  EventEmptyState,
  EventHeader,
  EventCalendar,
} from "@web/components/Events";

export default function EventsPage() {
  const { user, loading } = useAuth();
  const { themeConfig } = useTheme();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [showManageCatchesModal, setShowManageCatchesModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const {
    events,
    loading: eventsLoading,
    error,
    fetchEvents,
    refreshEvents,
    deleteEvent: deleteEventFromStore,
  } = useEventStore();
  const { deleteCatch } = useCatchStore();

  // Get the current selected event from the events store
  const selectedEvent = selectedEventId
    ? events.find((event) => event.id === selectedEventId) || null
    : null;

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch events when user is available (only if not already loaded)
  useEffect(() => {
    if (user && isClient) {
      fetchEvents();
    }
  }, [user, isClient, fetchEvents]);

  // Show loading state for SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show loading state here - AppLayout handles it

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  // Handle event deletion
  const handleDeleteEvent = (eventId: string) => {
    setShowDeleteConfirm(eventId);
  };

  const confirmDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the event from the store
        deleteEventFromStore(eventId);
        setShowDeleteConfirm(null);
      } else {
        console.error("Failed to delete event");
        alert("Failed to delete event. Please try again.");
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event. Please try again.");
      setShowDeleteConfirm(null);
    }
  };

  // Handle delete catch
  const handleDeleteCatch = async (catchId: string) => {
    // This is handled by the ManageCatchesModal component
    // which now uses ConfirmationPopup internally
    try {
      await deleteCatch(catchId);
      // Refresh events to get updated catch counts
      await refreshEvents();
    } catch (error) {
      console.error("Failed to delete catch:", error);
    }
  };

  // Handle manage catches
  const handleManageCatches = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowManageCatchesModal(true);
  };

  // Filter events based on search query
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.notes &&
        event.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.locationText &&
        event.locationText.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className={`min-h-screen ${themeConfig.gradients.background}`}>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <EventHeader
            onBack={() => router.back()}
            title="My Events"
            subtitle="Track your fishing events and catches"
            showNewButton={true}
            onNew={() => router.push("/events/new")}
            newButtonText="New Event"
          />

          {/* Search and View Controls */}
          <EventSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalEvents={filteredEvents.length}
          />

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {eventsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Loading events...</p>
              </div>
            </div>
          ) : /* Events Content */
          viewMode === "grid" ? (
            /* Grid View */
            filteredEvents.length === 0 ? (
              <EventEmptyState
                searchQuery={searchQuery}
                onCreateNew={() => router.push("/events/new")}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="flex flex-col h-full">
                    <EventCard
                      event={event}
                      onEdit={(eventId) => router.push(`/events/${eventId}`)}
                      onDelete={handleDeleteEvent}
                      onManageCatches={handleManageCatches}
                    />
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Calendar View */
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <EventCalendar
                events={filteredEvents}
                onEventClick={(event) => router.push(`/events/${event.id}`)}
                onEventEdit={(eventId) => router.push(`/events/${eventId}`)}
                onEventDelete={handleDeleteEvent}
              />
            </div>
          )}

          {/* Manage Catches Modal */}
          <ManageCatchesModal
            isOpen={showManageCatchesModal}
            onClose={() => {
              setShowManageCatchesModal(false);
              setSelectedEventId(null);
            }}
            event={selectedEvent}
            onDeleteCatch={handleDeleteCatch}
          />

          {/* Delete Event Confirmation Popup */}
          <ConfirmationPopup
            isOpen={showDeleteConfirm !== null}
            onClose={() => setShowDeleteConfirm(null)}
            onConfirm={() =>
              showDeleteConfirm && confirmDeleteEvent(showDeleteConfirm)
            }
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
