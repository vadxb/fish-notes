"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Filter } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../contexts/ThemeContext";
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
    updatedAt?: string;
  }>;
}

const SharedCatchesPage = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");
  const { user: currentUser, loading: authLoading } = useAuth();
  const { themeConfig } = useTheme();

  const [selectedCatch, setSelectedCatch] = useState<SharedCatch | null>(null);
  const [allCatches, setAllCatches] = useState<SharedCatch[]>([]); // All catches for main content
  const [sidebarCatches, setSidebarCatches] = useState<SharedCatch[]>([]); // Filtered catches for sidebar
  const [loading, setLoading] = useState(true);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "user" | "me">("all");
  const [showFilter, setShowFilter] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState("calc(100vh - 8rem)");
  const filterRef = useRef<HTMLDivElement>(null);

  // Get current user ID from auth hook
  const currentUserId = currentUser?.id || null;

  // Get selected user's name
  const selectedUserName = userId
    ? allCatches.find((catchItem) => catchItem.user.id === userId)?.user
        .username
    : undefined;

  // Auto-set filter based on URL and current user
  const setInitialFilter = () => {
    if (userId && currentUserId) {
      if (userId === currentUserId) {
        // Same user, show all catches
        setFilter("all");
      } else {
        // Different user, show selected user's catches
        setFilter("user");
      }
    } else if (userId && !currentUserId) {
      // Have userId but no currentUserId yet, show selected user
      setFilter("user");
    } else {
      // No userId, show all
      setFilter("all");
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
          // Use userId from URL for selected user
          targetUserId = userId;
          break;
        case "me":
          // For "me" filter, use currentUserId
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
      console.error("Error fetching sidebar catches:", err);
    } finally {
      setSidebarLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      // Wait for auth to load, then fetch all catches
      if (!authLoading) {
        await fetchAllCatches();
      }
    };
    initializeData();
  }, [authLoading]);

  // Set initial filter when currentUserId or userId changes
  useEffect(() => {
    if (!authLoading) {
      setInitialFilter();
    }
  }, [currentUserId, userId, authLoading]);

  // Fetch sidebar data when filter changes
  useEffect(() => {
    if (currentUserId && !authLoading) {
      fetchSidebarCatches(filter);
    }
  }, [filter, currentUserId, authLoading]);

  // Calculate sidebar height based on document height
  useEffect(() => {
    const calculateHeight = () => {
      const headerHeight = 8 * 16; // 8rem in pixels
      const availableHeight = Math.max(
        window.innerHeight - headerHeight,
        document.documentElement.scrollHeight - headerHeight
      );
      setSidebarHeight(`${availableHeight}px`);
    };

    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    window.addEventListener("scroll", calculateHeight);

    return () => {
      window.removeEventListener("resize", calculateHeight);
      window.removeEventListener("scroll", calculateHeight);
    };
  }, []);

  // Handle click outside filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  const handleCatchSelect = async (catchId: string) => {
    const selected = allCatches.find((c) => c.id === catchId);
    if (selected) {
      // Refresh the catch data to get current likes and comments
      try {
        const response = await fetch(`/api/shared-catches?limit=100`);
        if (response.ok) {
          const data = await response.json();
          const updatedCatch = data.catches.find((c: { id: string }) => c.id === catchId);
          if (updatedCatch) {
            setSelectedCatch(updatedCatch);
          } else {
            setSelectedCatch(selected);
          }
        } else {
          setSelectedCatch(selected);
        }
      } catch (error) {
        console.error("Error refreshing catch data:", error);
        setSelectedCatch(selected);
      }
    }
  };

  const handleFilterChange = async (newFilter: "all" | "user" | "me") => {
    setFilter(newFilter);
    setShowFilter(false);

    // Only fetch sidebar data, keep main content unchanged
    await fetchSidebarCatches(newFilter);
  };

  if (authLoading || loading) {
    return (
      <div
        className={`min-h-screen ${themeConfig.gradients.background} flex items-center justify-center`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen ${themeConfig.gradients.background} flex items-center justify-center`}
      >
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
    <div className={`min-h-screen ${themeConfig.gradients.background}`}>
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
            <div>
              <h1 className={`text-3xl font-bold ${themeConfig.header.text}`}>
                Shared Catches
              </h1>
              <p className={`${themeConfig.colors.text.muted} mt-1`}>
                Discover and explore catches shared by the community
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4 text-white" />
              <span className="text-white">Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdown */}
        {showFilter && (
          <div ref={filterRef}>
            <CatchFilter
              currentFilter={filter}
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilter(false)}
              showSelectedUser={!!userId && userId !== currentUserId}
              selectedUserName={selectedUserName}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            {selectedCatch ? (
              <CatchDetails
                catch={selectedCatch}
                currentUserId={currentUserId || undefined}
              />
            ) : (
              <div className="text-center py-12 text-white/60">
                <p>Select a catch to view details</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div
            className="w-80"
            style={{ height: sidebarHeight, maxHeight: sidebarHeight }}
          >
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
