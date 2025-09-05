"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Fish, Bug } from "lucide-react";
import {
  CollectionHeader,
  CollectionCard,
  CollectionModal,
} from "@web/components/Collection";
// Types for our data
interface FishData {
  id: string;
  commonName: string;
  scientificName: string;
  country: string;
  habitat: string | null;
  imageUrl: string | null;
}

interface BaitData {
  id: string;
  commonName: string;
  country: string;
  imageUrl: string | null;
}

export default function CollectionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Belarus");
  const [selectedFish, setSelectedFish] = useState<FishData | null>(null);
  const [selectedBait, setSelectedBait] = useState<BaitData | null>(null);
  const [fishes, setFishes] = useState<FishData[]>([]);
  const [baits, setBaits] = useState<BaitData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch fishes and baits data
  useEffect(() => {
    if (!isClient || !user) return;

    const fetchData = async () => {
      try {
        setDataLoading(true);

        // Fetch fishes
        const fishesResponse = await fetch("/api/fishes");
        if (fishesResponse.ok) {
          const fishesData = await fishesResponse.json();
          setFishes(fishesData);
        }

        // Fetch baits
        const baitsResponse = await fetch("/api/baits");
        if (baitsResponse.ok) {
          const baitsData = await baitsResponse.json();
          setBaits(baitsData);
        }
      } catch (error) {
        console.error("Error fetching collection data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [isClient, user]);

  // Show loading state while checking authentication or fetching data
  if (!isClient || loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading collection...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is null (during logout)
  if (!user) {
    return null;
  }

  // Filter fishes and baits based on search query and country
  const filteredFishes = fishes.filter((fish) => {
    const matchesSearch =
      fish.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fish.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = fish.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const filteredBaits = baits.filter((bait) => {
    const matchesSearch = bait.commonName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCountry = bait.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const closeModals = () => {
    setSelectedFish(null);
    setSelectedBait(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <CollectionHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
          />

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fish Collection */}
            <CollectionCard
              title="Fish Species"
              icon={<Fish className="w-5 h-5 text-blue-400" />}
              items={filteredFishes}
              onItemClick={setSelectedFish}
              emptyMessage="No fish species available"
              searchQuery={searchQuery}
            />

            {/* Bait Collection */}
            <CollectionCard
              title="Fishing Baits"
              icon={<Bug className="w-5 h-5 text-green-400" />}
              items={filteredBaits}
              onItemClick={setSelectedBait}
              emptyMessage="No baits available"
              searchQuery={searchQuery}
            />
          </div>

          {/* Modals */}
          <CollectionModal
            isOpen={!!selectedFish}
            onClose={closeModals}
            item={selectedFish}
            type="fish"
          />
          <CollectionModal
            isOpen={!!selectedBait}
            onClose={closeModals}
            item={selectedBait}
            type="bait"
          />
        </div>
      </div>
    </div>
  );
}
