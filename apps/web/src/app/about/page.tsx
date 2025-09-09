"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Fish,
  Calendar,
  Trophy,
  Camera,
  Share2,
  Star,
  Download,
  CheckCircle,
  Globe,
  ChevronLeft,
  ChevronRight,
  Palette,
  Target,
} from "lucide-react";

export default function AboutPage() {
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [activeTheme, setActiveTheme] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const nextTheme = () => {
    setActiveTheme((prev) => (prev + 1) % themes.length);
  };

  const prevTheme = () => {
    setActiveTheme((prev) => (prev - 1 + themes.length) % themes.length);
  };

  const nextScreenshot = () => {
    setActiveScreenshot((prev) => (prev + 1) % screenshots.length);
  };

  const prevScreenshot = () => {
    setActiveScreenshot(
      (prev) => (prev - 1 + screenshots.length) % screenshots.length
    );
  };

  const screenshots = [
    {
      id: 1,
      title: "Dashboard Overview",
      description:
        "Track your fishing progress with comprehensive statistics and recent catches",
      image: "/screenshots/dashboard.png",
      alt: "Fisherman&apos;s Notes Dashboard showing fishing statistics and recent catches",
    },
    {
      id: 2,
      title: "Catch Logging",
      description:
        "Log your catches with detailed information including species, weight, and photos",
      image: "/screenshots/catch-logging.png",
      alt: "Fisherman&apos;s Notes catch logging interface with species selection and photo upload",
    },
    {
      id: 3,
      title: "Spot Management",
      description:
        "Discover and save your favorite fishing spots with interactive maps",
      image: "/screenshots/spots.png",
      alt: "Fisherman&apos;s Notes spot management with map view and location details",
    },
    {
      id: 4,
      title: "Event Planning",
      description:
        "Plan and organize your fishing trips with calendar integration",
      image: "/screenshots/events.png",
      alt: "Fisherman&apos;s Notes event planning calendar with fishing trip details",
    },
    {
      id: 5,
      title: "Community Sharing",
      description:
        "Share your catches with the community and discover others&apos; achievements",
      image: "/screenshots/shared-catches.png",
      alt: "Fisherman&apos;s Notes community sharing with catch photos and comments",
    },
    {
      id: 6,
      title: "Leaderboards",
      description: "Compete with other anglers and track your rankings",
      image: "/screenshots/leaderboard.png",
      alt: "Fisherman&apos;s Notes leaderboard showing top anglers and rankings",
    },
  ];

  const themes = [
    {
      id: 1,
      name: "Night Fishing",
      description: "Dark, mysterious atmosphere perfect for nocturnal angling",
      icon: "🌙",
      image: "/themes/night.png",
      colors: ["#1e40af", "#3b82f6", "#60a5fa"],
      features: [
        "Dark blue gradients",
        "Mysterious atmosphere",
        "Perfect for night fishing",
      ],
    },
    {
      id: 2,
      name: "Rustic Nature",
      description: "Warm earth tones inspired by natural outdoor environments",
      icon: "🌲",
      image: "/themes/nature.png",
      colors: ["#92400e", "#10b981", "#34d399"],
      features: ["Earth tones", "Natural feel", "Outdoor inspired"],
    },
    {
      id: 3,
      name: "Ice Fishing",
      description: "Cool, crisp whites and blues for winter fishing adventures",
      icon: "❄️",
      image: "/themes/ice.png",
      colors: ["#0ea5e9", "#38bdf8", "#7dd3fc"],
      features: ["Cool blues", "Winter vibes", "Ice fishing ready"],
    },
    {
      id: 4,
      name: "Sunset Adventure",
      description:
        "Warm oranges and purples capturing the magic of golden hour",
      icon: "🌅",
      image: "/themes/sunset.png",
      colors: ["#dc2626", "#f97316", "#fb923c"],
      features: ["Warm oranges", "Golden hour", "Adventure ready"],
    },
    {
      id: 5,
      name: "Tech-Driven Angler",
      description:
        "Modern, high-tech aesthetic with neon accents and sleek design",
      icon: "⚡",
      image: "/themes/tech.png",
      colors: ["#7c3aed", "#a855f7", "#c084fc"],
      features: ["Modern design", "Tech aesthetic", "Sleek interface"],
    },
  ];

  const features = [
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
  ];

  const stats = [
    { number: "10K+", label: "Active Anglers" },
    { number: "50K+", label: "Catches Logged" },
    { number: "5K+", label: "Fishing Spots" },
    { number: "100+", label: "Fish Species" },
  ];

  const testimonials = [
    {
      name: "Mike Johnson",
      role: "Professional Angler",
      content:
        "Fisherman&apos;s Notes has completely transformed how I track my fishing. The spot discovery feature helped me find incredible new locations I never knew existed.",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "Weekend Angler",
      content:
        "As a beginner, the community features and leaderboards keep me motivated. I love seeing what others are catching and learning from their techniques.",
      rating: 5,
    },
    {
      name: "David Rodriguez",
      role: "Fishing Guide",
      content:
        "The event planning tools are perfect for organizing group trips. My clients love being able to see all the details and photos from our outings.",
      rating: 5,
    },
  ];

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
                onClick={() => (window.location.href = "/login")}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Try Web Version
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Mode Section */}
      <section className="py-20 bg-white">
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
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                  Catch logging with species, weight, and bait tracking
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                  Interactive fishing spot maps and GPS coordinates
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                  Weather conditions and fishing forecasts
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                  Community sharing and leaderboards
                </li>
              </ul>
            </div>

            {/* Hunting Mode */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
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
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  Hunt logging with game species and harvest details
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  Hunting stand locations and game trails
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  Weather patterns and hunting conditions
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  Hunter community and achievement tracking
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gray-50 rounded-xl p-8 max-w-4xl mx-auto">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Seamless Mode Switching
              </h4>
              <p className="text-gray-600 mb-6">
                Switch between Fishing and Hunting modes instantly. Your data is
                organized by mode, so you can easily track both activities
                without any confusion. Perfect for outdoor enthusiasts who enjoy
                both fishing and hunting.
              </p>
              <div className="flex justify-center">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                    Fishing Data
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                    Hunting Data
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                    Shared Community
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Fishing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From logging catches to discovering new spots, Fisherman&apos;s
              Notes provides all the tools you need to enhance your fishing
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
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

      {/* Themes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Palette className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Customizable Themes
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Personalize your fishing experience with beautiful, carefully
              crafted themes that match your style and mood. Switch between
              themes instantly to find the perfect look for your fishing
              adventures.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
            {/* Theme Carousel */}
            <div className="relative lg:col-span-2">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center min-h-[600px]">
                  {isClient ? (
                    <>
                      <img
                        src={themes[activeTheme].image}
                        alt={`${themes[activeTheme].name} theme preview`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback to placeholder if image doesn't exist
                          e.currentTarget.style.display = "none";
                          const nextElement = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = "flex";
                          }
                        }}
                      />
                      <div className="hidden flex-col items-center justify-center text-gray-500 bg-gray-100 w-full h-full">
                        <div className="text-6xl mb-4">
                          {themes[activeTheme].icon}
                        </div>
                        <p className="text-lg font-medium mb-2">
                          {themes[activeTheme].name} Theme
                        </p>
                        <p className="text-sm text-center max-w-xs">
                          Theme preview placeholder - Replace with actual image
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          File: {themes[activeTheme].image}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 bg-gray-100 w-full h-full">
                      <div className="text-6xl mb-4">{themes[0].icon}</div>
                      <p className="text-lg font-medium mb-2">
                        {themes[0].name} Theme
                      </p>
                      <p className="text-sm text-center max-w-xs">
                        Theme preview placeholder - Replace with actual image
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        File: {themes[0].image}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Carousel Navigation */}
              {isClient && (
                <>
                  <button
                    onClick={prevTheme}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full p-2 shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextTheme}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full p-2 shadow-lg transition-all duration-200"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Theme Details */}
            <div className="space-y-6 lg:col-span-1">
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">
                    {isClient ? themes[activeTheme].icon : themes[0].icon}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {isClient ? themes[activeTheme].name : themes[0].name}
                  </h3>
                </div>
                <p className="text-gray-600 text-lg mb-6">
                  {isClient
                    ? themes[activeTheme].description
                    : themes[0].description}
                </p>
              </div>

              {/* Color Palette */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Color Palette
                </h4>
                <div className="flex space-x-3">
                  {(isClient
                    ? themes[activeTheme].colors
                    : themes[0].colors
                  ).map((color, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-lg shadow-md"
                      style={{ backgroundColor: color }}
                      title={`Color ${index + 1}: ${color}`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Theme Features */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  {(isClient
                    ? themes[activeTheme].features
                    : themes[0].features
                  ).map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Theme Navigation Dots */}
              {isClient && (
                <div className="flex space-x-2">
                  {themes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTheme(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        activeTheme === index
                          ? "bg-blue-600 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Theme Benefits */}
          <div className="mt-16 text-center">
            <div className="bg-gray-50 rounded-xl p-8 max-w-4xl mx-auto">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Why Customizable Themes Matter
              </h4>
              <p className="text-gray-600 mb-6">
                Your fishing app should reflect your personality and enhance
                your experience. Our themes are designed to match different
                fishing styles, times of day, and personal preferences, making
                every fishing session feel unique and personal.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                  Instant Theme Switching
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                  Mood-Based Customization
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                  Personal Expression
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See Fisherman&apos;s Notes in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take a look at the beautiful, intuitive interface that makes
              fishing management effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Screenshot Column - Bigger */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center min-h-[600px] shadow-lg">
                  {isClient ? (
                    <>
                      <img
                        src={screenshots[activeScreenshot].image}
                        alt={screenshots[activeScreenshot].alt}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback to placeholder if image doesn't exist
                          e.currentTarget.style.display = "none";
                          const nextElement = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = "flex";
                          }
                        }}
                      />
                      <div className="hidden flex-col items-center justify-center text-gray-500 bg-gray-100 w-full h-full">
                        <Camera className="w-16 h-16 mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">
                          {screenshots[activeScreenshot].title}
                        </p>
                        <p className="text-sm text-center max-w-xs">
                          Screenshot placeholder - Replace with actual image
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          File: {screenshots[activeScreenshot].image}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 bg-gray-100 w-full h-full">
                      <Camera className="w-16 h-16 mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">
                        {screenshots[0].title}
                      </p>
                      <p className="text-sm text-center max-w-xs">
                        Screenshot placeholder - Replace with actual image
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        File: {screenshots[0].image}
                      </p>
                    </div>
                  )}
                </div>

                {/* Screenshot Navigation */}
                {isClient && (
                  <>
                    <button
                      onClick={prevScreenshot}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full p-2 shadow-lg transition-all duration-200"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextScreenshot}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full p-2 shadow-lg transition-all duration-200"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Description Column - Smaller */}
            <div className="lg:col-span-1">
              <div className="space-y-3">
                {screenshots.map((screenshot, index) => (
                  <div
                    key={screenshot.id}
                    className={`p-4 rounded-lg transition-all ${
                      isClient && activeScreenshot === index
                        ? "bg-blue-50 border-2 border-blue-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    } ${isClient ? "cursor-pointer" : ""}`}
                    onClick={
                      isClient ? () => setActiveScreenshot(index) : undefined
                    }
                  >
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {screenshot.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {screenshot.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Anglers Are Saying
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of satisfied anglers who have transformed their
              fishing experience with Fisherman&apos;s Notes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-blue-100 mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-blue-200 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Fishing Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the community of passionate anglers and take your fishing to
            the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download for Mac
            </button>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download for Android
            </button>
            <button
              onClick={() => (window.location.href = "/login")}
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Globe className="w-5 h-5" />
              Try Web Version
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
              The ultimate outdoor companion for anglers and hunters worldwide.
            </p>
            <div className="flex justify-center space-x-6">
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
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400">
              <p>&copy; 2025 Fisherman&apos;s Notes. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
