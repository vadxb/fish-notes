"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSpotStore, type Spot } from "@store/useSpotStore";
import {
  SpotsHeader,
  SpotCard,
  SpotsEmptyState,
  SpotsError,
} from "@web/components/Spots";

export default function SpotsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);

  const {
    spots,
    selectedSpotId,
    fetchSpots,
    deleteSpotAPI,
    toggleFavoriteAPI,
    loading: spotsLoading,
    error: spotsError,
  } = useSpotStore();

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !user) return;
    fetchSpots();
  }, [user, fetchSpots, isClient]);

  useEffect(() => {
    if (!isClient) return;

    // Check if we came from the dashboard favorites card
    const favoritesParam = searchParams.get("favorites");
    if (favoritesParam === "true") {
      setShowFavoritesOnly(true);
    }
  }, [searchParams, isClient]);

  // Show loading state while checking authentication (only on client)
  if (!isClient || loading) {
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

  // Filter spots based on search query and favorites toggle
  const filteredSpots = spots.filter((spot) => {
    const matchesSearch =
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (spot.notes &&
        spot.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFavorites = showFavoritesOnly ? spot.isFavorite : true;
    return matchesSearch && matchesFavorites;
  });

  if (spotsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading spots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <SpotsHeader
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddNew={() => router.push("/spots/new")}
          />

          {/* Error State */}
          {spotsError && <SpotsError error={spotsError} />}

          {/* Content */}
          {filteredSpots.length === 0 ? (
            <SpotsEmptyState
              showFavoritesOnly={showFavoritesOnly}
              onCreateNew={() => router.push("/spots/new")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpots.map((spot: Spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  isSelected={selectedSpotId === spot.id}
                  onCardClick={(spotId) => router.push(`/spots/${spotId}`)}
                  onToggleFavorite={toggleFavoriteAPI}
                  onEdit={(spotId) => router.push(`/spots/${spotId}`)}
                  onDelete={deleteSpotAPI}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
