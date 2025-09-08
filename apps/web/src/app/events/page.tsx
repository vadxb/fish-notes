"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useEventStore } from "@store/useEventStore";
import { useCatchStore } from "@store/useCatchStore";
import ManageCatchesModal from "@web/components/ManageCatchesModal";
import {
  EventCard,
  EventSearchBar,
  EventEmptyState,
  EventHeader,
} from "@web/components/Events";

export default function EventsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [showManageCatchesModal, setShowManageCatchesModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const {
    events,
    loading: eventsLoading,
    error,
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

  // Fetch events when user is available
  useEffect(() => {
    if (user && isClient) {
      refreshEvents();
    }
  }, [user, isClient, refreshEvents]);

  // Show loading state for SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  // Handle event deletion
  const handleDeleteEvent = async (eventId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Remove the event from the store
          deleteEventFromStore(eventId);
        } else {
          console.error("Failed to delete event");
          alert("Failed to delete event. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Error deleting event. Please try again.");
      }
    }
  };

  // Handle delete catch
  const handleDeleteCatch = async (catchId: string) => {
    if (confirm("Are you sure you want to delete this catch?")) {
      try {
        await deleteCatch(catchId);
        // Refresh events to get updated catch counts
        await refreshEvents();
      } catch (error) {
        console.error("Failed to delete catch:", error);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
            /* Calendar View - Coming Soon */
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
                <CalendarDays className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Calendar View Coming Soon
              </h3>
              <p className="text-gray-400">
                We&apos;re working on a calendar view for your events.
              </p>
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
        </div>
      </div>
    </div>
  );
}
