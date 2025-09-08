"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Fish, Bug, ArrowLeft } from "lucide-react";
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
  countryId: string;
  country: {
    id: string;
    name: string;
    code: string;
  };
  habitat: string | null;
  imageUrl: string | null;
}

interface BaitData {
  id: string;
  commonName: string;
  countryId: string;
  country: {
    id: string;
    name: string;
    code: string;
  };
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
  const [fishesLoading, setFishesLoading] = useState(false);
  const [baitsLoading, setBaitsLoading] = useState(false);
  const [userCountryId, setUserCountryId] = useState<string | null>(null);
  const [countries, setCountries] = useState<
    Array<{ id: string; name: string; code: string }>
  >([]);

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch all countries
  useEffect(() => {
    if (!isClient) return;

    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/countries");
        if (response.ok) {
          const countriesData = await response.json();
          setCountries(countriesData);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [isClient]);

  // Fetch user profile to get country
  useEffect(() => {
    if (!isClient || !user) return;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const userData = await response.json();
          if (userData.countryId) {
            setUserCountryId(userData.countryId);
            setSelectedCountry(userData.country?.name || "Belarus");
          } else {
            // If no country set, default to Belarus
            setUserCountryId("cmfb05q9j0000z5nzihd81gci"); // Belarus ID
            setSelectedCountry("Belarus");
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback to Belarus if profile fetch fails
        setUserCountryId("cmfb05q9j0000z5nzihd81gci");
        setSelectedCountry("Belarus");
      }
    };

    fetchUserProfile();
  }, [isClient, user]);

  // Fetch fishes and baits data when country changes
  useEffect(() => {
    if (!isClient || !selectedCountry || countries.length === 0) return;

    const fetchData = async () => {
      try {
        // Find the country ID for the selected country name
        const selectedCountryData = countries.find(
          (country) => country.name === selectedCountry
        );

        if (!selectedCountryData) {
          console.error("Selected country not found in countries list");
          return;
        }

        // Fetch fishes and baits in parallel with separate loading states
        const [fishesResponse, baitsResponse] = await Promise.all([
          fetch(`/api/fishes?countryId=${selectedCountryData.id}`).then(
            async (res) => {
              setFishesLoading(true);
              if (res.ok) {
                const data = await res.json();
                setFishes(data);
              }
              setFishesLoading(false);
            }
          ),
          fetch(`/api/baits?countryId=${selectedCountryData.id}`).then(
            async (res) => {
              setBaitsLoading(true);
              if (res.ok) {
                const data = await res.json();
                setBaits(data);
              }
              setBaitsLoading(false);
            }
          ),
        ]);
      } catch (error) {
        console.error("Error fetching collection data:", error);
        setFishesLoading(false);
        setBaitsLoading(false);
      }
    };

    fetchData();
  }, [isClient, selectedCountry, countries]);

  // Show loading state while checking authentication
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading collection...</p>
        </div>
      </div>
    );
  }

  // Show message if countries haven't loaded or no country selected
  if (countries.length === 0 || !selectedCountry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg w-fit mx-auto mb-4">
            <Fish className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Loading Countries
          </h2>
          <p className="text-gray-400 mb-6">
            Loading available countries and collection data...
          </p>
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
    const matchesCountry = fish.country.name === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const filteredBaits = baits.filter((bait) => {
    const matchesSearch = bait.commonName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCountry = bait.country.name === selectedCountry;
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
            countries={countries}
            onBack={() => router.back()}
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
              loading={fishesLoading}
            />

            {/* Bait Collection */}
            <CollectionCard
              title="Fishing Baits"
              icon={<Bug className="w-5 h-5 text-green-400" />}
              items={filteredBaits}
              onItemClick={setSelectedBait}
              emptyMessage="No baits available"
              searchQuery={searchQuery}
              loading={baitsLoading}
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
