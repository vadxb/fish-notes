"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useTheme } from "@web/contexts/ThemeContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useSpotStore, type Spot } from "@store/useSpotStore";
import {
  SpotsHeader,
  SpotCard,
  SpotsEmptyState,
  SpotsError,
} from "@web/components/Spots";
import ConfirmationPopup from "@web/components/ConfirmationPopup";

export default function SpotsPage() {
  const { user, loading } = useAuth();
  const { themeConfig } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

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

  // Show loading state only during SSR (not during navigation)
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

  const handleDeleteSpot = (spotId: string) => {
    setShowDeleteConfirm(spotId);
  };

  const confirmDeleteSpot = async (spotId: string) => {
    try {
      await deleteSpotAPI(spotId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting spot:", error);
      setShowDeleteConfirm(null);
    }
  };

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
    <div className={`min-h-screen ${themeConfig.gradients.background}`}>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <SpotsHeader
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddNew={() => router.push("/spots/new")}
            onBack={() => router.back()}
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
                  onDelete={handleDeleteSpot}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showDeleteConfirm !== null}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() =>
          showDeleteConfirm && confirmDeleteSpot(showDeleteConfirm)
        }
        title="Delete Spot"
        message="Are you sure you want to delete this spot? This action cannot be undone."
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
