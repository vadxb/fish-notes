"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Filter } from "lucide-react";
import CatchDetails from "../../components/SharedCatches/CatchDetails";
import CatchSidebar from "../../components/SharedCatches/CatchSidebar";
import CatchFilter from "../../components/SharedCatches/CatchFilter";

interface SharedCatch {
  id: string;
  title: string;
  description: string;
  images: string[];
  weight: number;
  length: number | null; // Will be added later
  fishType: string;
  bait: string;
  location: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
  likes: number;
  isLiked: boolean;
  comments: Array<{
    id: string;
    content: string;
    user: {
      id: string;
      username: string;
      avatar: string | null;
    };
    createdAt: string;
  }>;
}

const SharedCatchesPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");

  const [selectedCatch, setSelectedCatch] = useState<SharedCatch | null>(null);
  const [allCatches, setAllCatches] = useState<SharedCatch[]>([]); // All catches for main content
  const [sidebarCatches, setSidebarCatches] = useState<SharedCatch[]>([]); // Filtered catches for sidebar
  const [loading, setLoading] = useState(true);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "user" | "me">(
    userId ? "user" : "all"
  );
  const [showFilter, setShowFilter] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setCurrentUserId(userData.id);
      } else {
        // We'll set the user ID after fetching catches
      }
    } catch (err) {
      // We'll set the user ID after fetching catches
    }
  };

  // Set current user ID from catches data as fallback
  const setCurrentUserFromCatches = () => {
    if (!currentUserId && allCatches.length > 0) {
      const firstCatchUserId = allCatches[0].user.id;
      setCurrentUserId(firstCatchUserId);
    }
  };

  // Fetch all shared catches for main content
  const fetchAllCatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append("limit", "100");

      const response = await fetch(`/api/shared-catches?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch shared catches");
      }

      const data = await response.json();
      setAllCatches(data.catches);
      setSidebarCatches(data.catches); // Initially show all catches in sidebar

      // Select first catch if available
      if (data.catches.length > 0) {
        setSelectedCatch(data.catches[0]);
      } else {
        setSelectedCatch(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch catches");
    } finally {
      setLoading(false);
    }
  };

  // Fetch filtered catches for sidebar only
  const fetchSidebarCatches = async (filterType: "all" | "user" | "me") => {
    try {
      setSidebarLoading(true);

      const params = new URLSearchParams();
      params.append("limit", "100");

      // Determine which user to fetch catches for based on filter
      let targetUserId: string | null = null;

      switch (filterType) {
        case "user":
          targetUserId = userId;
          break;
        case "me":
          // For "me" filter, ensure we have a currentUserId
          if (currentUserId) {
            targetUserId = currentUserId;
          }
          break;
        case "all":
        default:
          // Don't set user parameter, fetch all
          break;
      }

      if (targetUserId) {
        params.append("user", targetUserId);
      }

      const response = await fetch(`/api/shared-catches?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch shared catches");
      }

      const data = await response.json();
      setSidebarCatches(data.catches);

      // Don't change selected catch, keep main content as is
    } catch (err) {
      // Handle error silently
    } finally {
      setSidebarLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      // First try to get current user
      await fetchCurrentUser();
      // Then fetch all catches
      await fetchAllCatches();
    };
    initializeData();
  }, []);

  // Set current user ID from catches when allCatches changes
  useEffect(() => {
    setCurrentUserFromCatches();
  }, [allCatches]);

  const handleCatchSelect = (catchId: string) => {
    const selected = allCatches.find((c) => c.id === catchId);
    if (selected) {
      setSelectedCatch(selected);
    }
  };

  const handleFilterChange = async (newFilter: "all" | "user" | "me") => {
    setFilter(newFilter);
    setShowFilter(false);

    // Only fetch sidebar data, keep main content unchanged
    await fetchSidebarCatches(newFilter);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => fetchSharedCatches(userId)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-3xl font-bold bg-blue-600/50 bg-clip-text text-transparent">
              Shared Catches
            </h1>
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4 text-white" />
            <span className="text-white">Filter</span>
          </button>
        </div>

        {/* Filter Dropdown */}
        {showFilter && (
          <CatchFilter
            currentFilter={filter}
            onFilterChange={handleFilterChange}
            onClose={() => setShowFilter(false)}
            showSelectedUser={!!userId}
          />
        )}

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            {selectedCatch ? (
              <CatchDetails catch={selectedCatch} />
            ) : (
              <div className="text-center py-12 text-white/60">
                <p>Select a catch to view details</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <CatchSidebar
              catches={sidebarCatches}
              selectedCatchId={selectedCatch?.id}
              onCatchSelect={handleCatchSelect}
              filter={filter}
              currentUserId={currentUserId || undefined}
              selectedUserId={userId || undefined}
              loading={sidebarLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedCatchesPage;
