"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useTheme } from "@web/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Fish,
  MapPin,
  Calendar,
  Users,
  Trophy,
  Camera,
  Share2,
  ArrowRight,
  Download,
  Globe,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const { themeConfig } = useTheme();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || loading) return;

    if (user) {
      router.push("/dashboard");
    }
  }, [user, loading, router, isClient]);

  // Show loading for authenticated users
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  if (user) {
    return (
      <div
        className={`min-h-screen ${themeConfig.gradients.background} flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className={themeConfig.colors.text.secondary}>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Public landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-800 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fisherman&apos;s Notes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              The ultimate outdoor companion app for anglers and hunters who
              want to track, discover, and share their outdoor adventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download for Mac
              </button>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download for Android
              </button>
              <button
                onClick={() => router.push("/login")}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Try Web Version
              </button>
              <button
                onClick={() => router.push("/about")}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Mode Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Two Modes, One App
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Switch between Fishing and Hunting modes to customize your
              experience for any outdoor activity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Fishing Mode */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <Fish className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Fishing Mode
                </h3>
              </div>
              <p className="text-gray-700 mb-6">
                Track your catches, discover fishing spots, plan fishing trips,
                and connect with fellow anglers. Perfect for freshwater,
                saltwater, and ice fishing adventures.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Catch Logging
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Spot Discovery
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Weather Tracking
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Community Sharing
                </div>
              </div>
            </div>

            {/* Hunting Mode */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Hunting Mode
                </h3>
              </div>
              <p className="text-gray-700 mb-6">
                Record your hunts, track game sightings, plan hunting trips, and
                share your hunting experiences. Designed for all types of
                hunting from big game to waterfowl.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Hunt Logging
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Stand Locations
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Game Tracking
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  Hunter Community
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Fishing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From logging catches to discovering new spots, Fisherman&apos;s Notes
              provides all the tools you need to enhance your fishing
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Fish className="w-8 h-8 text-blue-600" />,
                title: "Catch Logging",
                description:
                  "Record every catch with species, weight, bait used, and location. Add photos to document your success.",
              },
              {
                icon: <MapPin className="w-8 h-8 text-green-600" />,
                title: "Spot Discovery",
                description:
                  "Find and save the best fishing spots with GPS coordinates, notes, and community recommendations.",
              },
              {
                icon: <Calendar className="w-8 h-8 text-purple-600" />,
                title: "Event Planning",
                description:
                  "Plan fishing trips, track weather conditions, and organize group outings with friends.",
              },
              {
                icon: <Trophy className="w-8 h-8 text-yellow-600" />,
                title: "Achievements",
                description:
                  "Earn badges and compete on leaderboards. Track your progress and celebrate milestones.",
              },
              {
                icon: <Share2 className="w-8 h-8 text-pink-600" />,
                title: "Community Sharing",
                description:
                  "Share your best catches with the community, get likes and comments from fellow anglers.",
              },
              {
                icon: <Camera className="w-8 h-8 text-indigo-600" />,
                title: "Photo Gallery",
                description:
                  "Create stunning photo galleries of your catches with automatic organization by date and location.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Fishing Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the community of passionate anglers and take your fishing to
            the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download for Mac
            </button>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download for Android
            </button>
            <button
              onClick={() => router.push("/login")}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Globe className="w-5 h-5" />
              Try Web Version
            </button>
            <button
              onClick={() => router.push("/about")}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Globe className="w-5 h-5" />
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Fisherman&apos;s Notes</h3>
            <p className="text-gray-400 mb-6">
              The ultimate fishing companion for anglers worldwide.
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => router.push("/about")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                About
              </button>
              <button
                onClick={() => router.push("/login")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Login
              </button>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400">
              <p>&copy; 2024 Fisherman&apos;s Notes. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
