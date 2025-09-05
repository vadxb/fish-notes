"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Search, Filter, ArrowLeft } from "lucide-react";
import { useCatchStore } from "@store/useCatchStore";
import { CatchCard } from "../../components/Catches/CatchCard";
import { CatchSearchBar } from "../../components/Catches/CatchSearchBar";
import { CatchEmptyState } from "../../components/Catches/CatchEmptyState";
import { CatchStats } from "../../components/Catches/CatchStats";

export default function CatchesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Use Zustand store for catches
  const {
    catches,
    loading: dataLoading,
    error,
    fetchCatches,
    deleteCatch: deleteCatchFromStore,
    toggleShared,
  } = useCatchStore();

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch catches when component mounts
  useEffect(() => {
    if (isClient && user) {
      fetchCatches();
    }
  }, [isClient, user, fetchCatches]);

  // Show loading state for SSR
  if (!isClient) {
    return <div>Loading...</div>;
  }

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  // Don't render if user is null (during logout)
  if (!user) {
    return null;
  }

  // Filter catches based on search query
  const filteredCatches = catches.filter((catch_) => {
    const matchesSearch =
      catch_.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (catch_.bait &&
        catch_.bait.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (catch_.location &&
        catch_.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (catch_.spot?.name &&
        catch_.spot.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (catch_.comments &&
        catch_.comments.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (catch_.event?.title &&
        catch_.event.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const deleteCatch = async (catchId: string) => {
    try {
      const response = await fetch(`/api/catches/${catchId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        deleteCatchFromStore(catchId);
      } else {
        console.error("Failed to delete catch");
      }
    } catch (error) {
      console.error("Error deleting catch:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-blue-600/50 bg-clip-text text-transparent mb-2">
                  My Catches
                </h1>
                <p className="text-gray-400">
                  Track and manage your fishing catches
                </p>
              </div>
              <button
                onClick={() => router.push("/catches/new")}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600/20 text-white rounded-xl hover:bg-blue-600/30 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 border border-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Catch</span>
              </button>
            </div>

            {/* Stats and Search */}
            <div className="space-y-6">
              <div>
                <CatchStats catches={catches} />
              </div>
              <div>
                <CatchSearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          {filteredCatches.length === 0 ? (
            <CatchEmptyState
              hasCatches={catches.length > 0}
              onAddCatch={() => router.push("/catches/new")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCatches.map((catch_) => (
                <CatchCard
                  key={catch_.id}
                  catch_={catch_}
                  user={user}
                  onEdit={() => router.push(`/catches/${catch_.id}`)}
                  onDelete={deleteCatch}
                  onToggleShared={toggleShared}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
