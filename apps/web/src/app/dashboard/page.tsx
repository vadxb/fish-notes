// apps/web/src/app/dashboard/page.tsx
"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useSpotStore } from "@store/useSpotStore";
import { useEventStore } from "@store/useEventStore";
import { useEffect, useState, useRef } from "react";
import ManageCatchesModal from "@web/components/ManageCatchesModal";
import Leaderboard from "@web/components/Leaderboard";
import { Fish, Calendar, MapPin } from "lucide-react";
import {
  DashboardHeader,
  CurrentEventCard,
  RecentCatchesCard,
  FavoriteSpotsCard,
} from "@web/components/Dashboard";

interface Catch {
  id: string;
  species: string;
  weight?: number;
  bait?: string;
  createdAt: string;
  spot?: {
    name: string;
  };
}

interface Event {
  id: string;
  title: string;
  notes?: string;
  startAt: string;
  endAt?: string;
  locationType: string;
  locationText?: string;
  spotId?: string;
  catches?: Array<{
    id: string;
    species: string;
    weight?: number;
    bait?: string;
    comments?: string;
    createdAt: string;
  }>;
  spot?: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { spots, fetchSpots } = useSpotStore();
  const { events, fetchEvents } = useEventStore();
  const [recentCatches, setRecentCatches] = useState<Catch[]>([]);
  const [catchesLoading, setCatchesLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [showManageCatchesModal, setShowManageCatchesModal] = useState(false);
  const fetchInProgress = useRef(false);
  const loadingSet = useRef(false);

  useEffect(() => {
    if (user) {
      if (!loadingSet.current) {
        setCatchesLoading(true);
        loadingSet.current = true;
      }
      fetchSpots();
      fetchEvents();
      fetchRecentCatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchRecentCatches = async () => {
    if (fetchInProgress.current) {
      return;
    }

    fetchInProgress.current = true;
    try {
      const response = await fetch("/api/catches");
      if (response.ok) {
        const catchesData = await response.json();
        // Get the 3 most recent catches
        setRecentCatches(catchesData.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching recent catches:", error);
    } finally {
      setCatchesLoading(false);
      fetchInProgress.current = false;
      // Don't reset loadingSet.current - keep it true to prevent future loading states
    }
  };

  // Find the current event (most recent one)
  useEffect(() => {
    if (events.length > 0) {
      // Sort events by startAt date (most recent first)
      const sortedEvents = [...events].sort(
        (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
      );
      setCurrentEvent(sortedEvents[0]);
    }
  }, [events]);

  // Don't render if user is null (during logout)
  if (!user) {
    return null;
  }

  const favoriteSpots = spots.filter((spot) => spot.isFavorite);
  const favoriteCount = favoriteSpots.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <DashboardHeader
            userName={user.name || ""}
            userEmail={user.email || ""}
          />

          {/* Quick Actions Row */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/catches/new")}
                className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 group"
              >
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-200">
                  <Fish className="w-5 h-5" />
                </div>
                <span className="font-medium">Log New Catch</span>
              </button>
              <button
                onClick={() => router.push("/events/new")}
                className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-green-500/25 group"
              >
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-200">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-medium">New Event</span>
              </button>
              <button
                onClick={() => router.push("/spots/new")}
                className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 group"
              >
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-200">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-medium">Add New Spot</span>
              </button>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="mb-8">
            <Leaderboard />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* My Current Event */}
            <CurrentEventCard
              currentEvent={currentEvent}
              onManageCatches={() => setShowManageCatchesModal(true)}
            />

            {/* My Recent Catches */}
            <RecentCatchesCard
              recentCatches={recentCatches}
              catchesLoading={catchesLoading}
            />

            {/* Favorite Spots */}
            <FavoriteSpotsCard
              favoriteSpots={favoriteSpots}
              favoriteCount={favoriteCount}
            />
          </div>

          {/* Manage Catches Modal */}
          <ManageCatchesModal
            isOpen={showManageCatchesModal}
            onClose={() => setShowManageCatchesModal(false)}
            event={currentEvent}
          />
        </div>
      </div>
    </div>
  );
}
