import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Calendar, MapPin, Scale, Ruler } from "lucide-react";

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

interface CatchSidebarProps {
  catches: SharedCatch[];
  selectedCatchId?: string;
  onCatchSelect: (catchId: string) => void;
  filter: "all" | "user" | "me";
  currentUserId?: string;
  selectedUserId?: string;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const CatchSidebar = ({
  catches,
  selectedCatchId,
  onCatchSelect,
  filter,
  currentUserId,
  selectedUserId,
  loading = false,
  hasMore = false,
  onLoadMore,
}: CatchSidebarProps) => {
  // Use server-side pagination - no client-side state needed

  // Ensure unique catches to prevent React key conflicts
  const uniqueCatches = useMemo(() => {
    const unique = catches.filter(
      (catchItem, index, self) =>
        index === self.findIndex((c) => c.id === catchItem.id)
    );

    // Debug: Log if we found duplicates
    if (unique.length !== catches.length) {
      console.warn(
        `Found ${catches.length - unique.length} duplicate catches in catches array`
      );
    }

    return unique;
  }, [catches]);

  const filteredCatches = useMemo(() => {
    return uniqueCatches.filter((catchItem) => {
      switch (filter) {
        case "user":
          return selectedUserId ? catchItem.user.id === selectedUserId : false;
        case "me":
          return currentUserId ? catchItem.user.id === currentUserId : false;
        default:
          return true;
      }
    });
  }, [uniqueCatches, filter, selectedUserId, currentUserId]);

  // No client-side pagination logic needed - server handles it

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Track if we just loaded data to prevent immediate scroll trigger
  const justLoadedRef = useRef(false);

  // Set justLoaded flag when catches change (new data loaded)
  useEffect(() => {
    if (catches.length > 0) {
      justLoadedRef.current = true;
      // Clear the flag after a short delay to allow normal scroll behavior
      const timer = setTimeout(() => {
        justLoadedRef.current = false;
      }, 500); // 500ms delay

      return () => clearTimeout(timer);
    }
  }, [catches.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight + 20;

    // Don't trigger if we just loaded data (prevents auto-load when switching filters)
    if (
      isNearBottom &&
      hasMore &&
      !loading &&
      onLoadMore &&
      !justLoadedRef.current
    ) {
      onLoadMore();
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg h-full flex flex-col max-h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
        <h3 className="text-lg font-bold text-white">
          {filter === "all" && "All Users"}
          {filter === "user" && "Selected User"}
          {filter === "me" && "My Catches"}
        </h3>
        <p className="text-gray-400 text-sm">
          {uniqueCatches.length}{" "}
          {uniqueCatches.length === 1 ? "catch" : "catches"}
          {hasMore && " (more available)"}
          {!hasMore && uniqueCatches.length > 0 && " (no more available)"}
        </p>
      </div>

      {/* Catches List */}
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {uniqueCatches.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p>No catches found</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {uniqueCatches.map((catchItem) => (
              <div
                key={catchItem.id}
                onClick={() => onCatchSelect(catchItem.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedCatchId === catchItem.id
                    ? "bg-blue-600/20 border border-blue-500/30"
                    : "bg-gray-700/30 hover:bg-gray-700/50"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                  {catchItem.images.length > 0 ? (
                    <img
                      src={catchItem.images[0]}
                      alt={catchItem.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium text-sm line-clamp-2">
                    {catchItem.title}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{catchItem.fishType}</span>
                    <span>•</span>
                    <span>{catchItem.weight}kg</span>
                    {catchItem.length && (
                      <>
                        <span>•</span>
                        <span>{catchItem.length}cm</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(catchItem.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-20">
                        {catchItem.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border border-gray-600 overflow-hidden">
                        {catchItem.user.avatar ? (
                          <img
                            src={catchItem.user.avatar}
                            alt={catchItem.user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {catchItem.user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-gray-300 text-xs">
                        {catchItem.user.username}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {catchItem.likes} likes
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto"></div>
              </div>
            )}

            {/* End of list */}
            {!hasMore && uniqueCatches.length > 0 && (
              <div className="p-4 text-center text-gray-400 text-sm">
                <p>No more catches to load</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatchSidebar;
