import { create } from "zustand";

export interface Event {
  id: string;
  title: string;
  notes?: string;
  startAt: string;
  endAt?: string;
  locationType: string;
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
  catches?: Array<{
    id: string;
    species: string;
    weight?: number;
    bait?: string;
    comments?: string;
    photoUrls?: string[];
    createdAt: string;
  }>;
}

interface EventStore {
  events: Event[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchEvents: () => Promise<void>;
  refreshEvents: () => Promise<void>;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updatedEvent: Event) => void;
  deleteEvent: (id: string) => void;
  updateEventCatch: (
    eventId: string,
    catchId: string,
    updatedCatch: any
  ) => void;
  addEventCatch: (eventId: string, newCatch: any) => void;
  removeEventCatch: (eventId: string, catchId: string) => void;
  resetFetchState: () => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  loading: false,
  error: null,
  hasFetched: false,

  fetchEvents: async () => {
    const state = get();
    // Don't fetch if already loading or if we have already fetched
    if (state.loading || state.hasFetched) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch("/api/events");

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const eventsData = await response.json();

      if (Array.isArray(eventsData)) {
        set({
          events: eventsData,
          loading: false,
          error: null,
          hasFetched: true,
        });
      } else {
        throw new Error("Invalid events data format");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      set({
        events: [],
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch events",
      });
    }
  },

  refreshEvents: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch("/api/events");

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const eventsData = await response.json();

      if (Array.isArray(eventsData)) {
        set({
          events: eventsData,
          loading: false,
          error: null,
          hasFetched: true,
        });
      } else {
        throw new Error("Invalid events data format");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      set({
        events: [],
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch events",
      });
    }
  },

  addEvent: (event) => {
    set((state) => {
      // Check if event already exists to prevent duplicates
      const eventExists = state.events.some(
        (existingEvent) => existingEvent.id === event.id
      );
      if (eventExists) {
        return state; // Don't add if already exists
      }
      return {
        events: [...state.events, event],
      };
    });
  },

  updateEvent: (id, updatedEvent) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? updatedEvent : event
      ),
    }));
  },

  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    }));
  },

  updateEventCatch: (eventId, catchId, updatedCatch) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              catches: event.catches?.map((catch_) =>
                catch_.id === catchId ? { ...catch_, ...updatedCatch } : catch_
              ),
            }
          : event
      ),
    }));
  },

  addEventCatch: (eventId, newCatch) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              catches: [...(event.catches || []), newCatch],
            }
          : event
      ),
    }));
  },

  removeEventCatch: (eventId, catchId) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? {
              ...event,
              catches: event.catches?.filter((catch_) => catch_.id !== catchId),
            }
          : event
      ),
    }));
  },

  resetFetchState: () => {
    set({ hasFetched: false, events: [], loading: false, error: null });
  },
}));
