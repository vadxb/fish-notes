"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useTheme } from "@web/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
  const { themeConfig } = useTheme();
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
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const fetchInProgress = useRef(false);
  const hasMounted = useRef(false);

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Single effect: setup and fetch data once
  useEffect(() => {
    if (!isClient || !user || hasMounted.current) return;

    hasMounted.current = true;

    const initializePage = async () => {
      if (fetchInProgress.current) return;
      fetchInProgress.current = true;

      try {
        // Step 1: Fetch countries
        const countriesResponse = await fetch("/api/countries");
        let countriesData: Array<{ id: string; name: string; code: string }> =
          [];

        if (countriesResponse.ok) {
          countriesData = await countriesResponse.json();
          setCountries(countriesData);
        }

        setHasAttemptedFetch(true);

        // Step 2: Set country to Belarus (or user's country)
        const profileResponse = await fetch("/api/profile");
        let selectedCountryName = "Belarus";
        let selectedCountryId = "cmfb05q9j0000z5nzihd81gci"; // Belarus ID

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          if (userData.countryId && userData.country?.name) {
            selectedCountryId = userData.countryId;
            selectedCountryName = userData.country.name;
          }
        }

        setUserCountryId(selectedCountryId);
        setSelectedCountry(selectedCountryName);

        // Step 3: Fetch data for the selected country
        const selectedCountryData =
          countriesData.find(
            (country) => country.name === selectedCountryName
          ) ||
          countriesData.find((country) => country.id === selectedCountryId);

        if (selectedCountryData) {
          const [fishesResponse, baitsResponse] = await Promise.all([
            fetch(`/api/fishes?countryId=${selectedCountryData.id}`),
            fetch(`/api/baits?countryId=${selectedCountryData.id}`),
          ]);

          if (fishesResponse.ok) {
            const fishesData = await fishesResponse.json();
            setFishes(fishesData);
          }

          if (baitsResponse.ok) {
            const baitsData = await baitsResponse.json();
            setBaits(baitsData);
          }
        }

        // Mark initialization as complete
        setIsInitializing(false);
      } catch (error) {
        console.error("Error initializing page:", error);
        setIsInitializing(false);
      } finally {
        fetchInProgress.current = false;
      }
    };

    initializePage();
  }, [isClient, user]);

  // Handle manual country changes only
  useEffect(() => {
    if (
      !isClient ||
      !selectedCountry ||
      countries.length === 0 ||
      !hasAttemptedFetch ||
      !userCountryId // Only run for manual changes, not initial setup
    )
      return;

    const fetchDataForCountry = async () => {
      if (fetchInProgress.current) return;
      fetchInProgress.current = true;

      try {
        const selectedCountryData = countries.find(
          (country) => country.name === selectedCountry
        );

        if (!selectedCountryData) {
          console.error("Selected country not found in countries list");
          setFishesLoading(false);
          setBaitsLoading(false);
          return;
        }

        const [fishesResponse, baitsResponse] = await Promise.all([
          fetch(`/api/fishes?countryId=${selectedCountryData.id}`),
          fetch(`/api/baits?countryId=${selectedCountryData.id}`),
        ]);

        if (fishesResponse.ok) {
          const fishesData = await fishesResponse.json();
          setFishes(fishesData);
        }

        if (baitsResponse.ok) {
          const baitsData = await baitsResponse.json();
          setBaits(baitsData);
        }
      } catch (error) {
        console.error("Error fetching collection data:", error);
      } finally {
        fetchInProgress.current = false;
      }
    };

    fetchDataForCountry();
  }, [selectedCountry, countries, isClient, hasAttemptedFetch, userCountryId]);

  // Don't render if user is null (during logout)
  if (!user) {
    return null;
  }

  // Show loading state while checking authentication
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading collection...</p>
        </div>
      </div>
    );
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
    <div className={`min-h-screen ${themeConfig.gradients.background}`}>
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
              onItemClick={(item) =>
                setSelectedFish({
                  id: item.id,
                  commonName: item.commonName,
                  scientificName: item.scientificName || "",
                  countryId: item.country.id,
                  country: item.country,
                  habitat: item.habitat || null,
                  imageUrl: item.imageUrl,
                })
              }
              emptyMessage="No fish species available"
              searchQuery={searchQuery}
              loading={isInitializing}
            />

            {/* Bait Collection */}
            <CollectionCard
              title="Fishing Baits"
              icon={<Bug className="w-5 h-5 text-green-400" />}
              items={filteredBaits}
              onItemClick={(item) =>
                setSelectedBait({
                  id: item.id,
                  commonName: item.commonName,
                  countryId: item.country.id,
                  country: item.country,
                  imageUrl: item.imageUrl,
                })
              }
              emptyMessage="No baits available"
              searchQuery={searchQuery}
              loading={isInitializing}
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
