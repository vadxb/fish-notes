import React, { useState, useEffect, useCallback, useMemo } from "react";
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
}

const CatchSidebar = ({
  catches,
  selectedCatchId,
  onCatchSelect,
  filter,
  currentUserId,
  selectedUserId,
  loading = false,
}: CatchSidebarProps) => {
  const [displayedCatches, setDisplayedCatches] = useState<SharedCatch[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Ensure displayedCatches never contains duplicates
  const uniqueDisplayedCatches = useMemo(() => {
    const unique = displayedCatches.filter(
      (catchItem, index, self) =>
        index === self.findIndex((c) => c.id === catchItem.id)
    );

    if (unique.length !== displayedCatches.length) {
      console.warn(
        `Found ${displayedCatches.length - unique.length} duplicate catches in displayedCatches`
      );
    }

    return unique;
  }, [displayedCatches]);

  const ITEMS_PER_PAGE = 10;

  const filteredCatches = useMemo(() => {
    return catches.filter((catchItem) => {
      switch (filter) {
        case "user":
          return selectedUserId ? catchItem.user.id === selectedUserId : false;
        case "me":
          return currentUserId ? catchItem.user.id === currentUserId : false;
        default:
          return true;
      }
    });
  }, [catches, filter, selectedUserId, currentUserId]);

  const uniqueFilteredCatches = useMemo(() => {
    const unique = filteredCatches.filter(
      (catchItem, index, self) =>
        index === self.findIndex((c) => c.id === catchItem.id)
    );

    // Debug: Log if we found duplicates
    if (unique.length !== filteredCatches.length) {
      console.warn(
        `Found ${filteredCatches.length - unique.length} duplicate catches in filteredCatches`
      );
    }

    return unique;
  }, [filteredCatches]);

  const loadMoreCatches = useCallback(() => {
    if (loading || !hasMore) return;

    // Simulate API call delay
    setTimeout(() => {
      const startIndex = uniqueDisplayedCatches.length;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newCatches = uniqueFilteredCatches.slice(startIndex, endIndex);

      // Filter out any catches that are already displayed to prevent duplicates
      const existingIds = new Set(
        uniqueDisplayedCatches.map((catchItem) => catchItem.id)
      );
      const uniqueNewCatches = newCatches.filter(
        (catchItem) => !existingIds.has(catchItem.id)
      );

      // Additional safety check: ensure no duplicates in the new catches array itself
      const finalNewCatches = uniqueNewCatches.filter(
        (catchItem, index, self) =>
          index === self.findIndex((c) => c.id === catchItem.id)
      );

      if (finalNewCatches.length > 0) {
        setDisplayedCatches((prev) => [...prev, ...finalNewCatches]);
      }
      setHasMore(endIndex < uniqueFilteredCatches.length);
    }, 500);
  }, [uniqueDisplayedCatches.length, uniqueFilteredCatches]);

  // Reset when filter changes or catches array changes
  useEffect(() => {
    setDisplayedCatches(uniqueFilteredCatches.slice(0, ITEMS_PER_PAGE));
    setHasMore(uniqueFilteredCatches.length > ITEMS_PER_PAGE);
  }, [filter, uniqueFilteredCatches]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop <= clientHeight + 20;

    if (isNearBottom && hasMore && !loading) {
      loadMoreCatches();
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
          {uniqueFilteredCatches.length}{" "}
          {uniqueFilteredCatches.length === 1 ? "catch" : "catches"}
        </p>
      </div>

      {/* Catches List */}
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {uniqueDisplayedCatches.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p>No catches found</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {uniqueDisplayedCatches.map((catchItem) => (
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
            {!hasMore && displayedCatches.length > 0 && (
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
