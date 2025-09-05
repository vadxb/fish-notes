"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@web/hooks/useAuth";
import { FishingLogo } from "@ui/Logo/FishingLogo";
import { getSubscriptionStatus } from "@web/lib/subscriptionUtils";
import {
  MapPin,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Plus,
  Calendar,
  BookOpen,
  Fish,
  Users,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMiscExpanded, setIsMiscExpanded] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMiscSection = () => {
    setIsMiscExpanded(!isMiscExpanded);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    console.log("Sidebar: Starting logout process");
    setIsLoggingOut(true);
    try {
      await logout();
      console.log("Sidebar: Logout completed");
      // Note: logout() now handles the redirect with window.location.href
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const navigationSections = [
    {
      title: "Personal",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: Home,
          current: pathname === "/dashboard",
        },
        {
          name: "My Catches",
          href: "/catches",
          icon: Fish,
          current: pathname === "/catches" || pathname.startsWith("/catches/"),
        },
        {
          name: "My Spots",
          href: "/spots",
          icon: MapPin,
          current: pathname === "/spots" || pathname.startsWith("/spots/"),
        },
        {
          name: "My Events",
          href: "/events",
          icon: Calendar,
          current: pathname === "/events" || pathname.startsWith("/events/"),
        },
      ],
    },
    {
      title: "Community",
      items: [
        {
          name: "Shared Catches",
          href: "/shared-catches",
          icon: Share2,
          current:
            pathname === "/shared-catches" ||
            pathname.startsWith("/shared-catches/"),
        },
        {
          name: "Rankings",
          href: "/rankings",
          icon: Users,
          current:
            pathname === "/rankings" || pathname.startsWith("/rankings/"),
        },
      ],
    },
    {
      title: "Miscellaneous",
      items: [
        {
          name: "Collection",
          href: "/collection",
          icon: BookOpen,
          current:
            pathname === "/collection" || pathname.startsWith("/collection/"),
        },
      ],
    },
  ];

  return (
    <div
      className={`bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 transition-all duration-300 flex flex-col h-screen ${
        isExpanded ? "w-64" : "w-16"
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 flex-shrink-0">
        {isExpanded && (
          <div className="flex items-center space-x-3">
            <FishingLogo className="w-8 h-8" color="#60a5fa" />
            <div>
              <h1 className="text-lg font-semibold bg-blue-600/50 bg-clip-text text-transparent">
                Fisherman's Notes
              </h1>
            </div>
          </div>
        )}
        {!isExpanded && (
          <div className="flex justify-center w-full">
            <FishingLogo className="w-8 h-8" color="#60a5fa" />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors"
          title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-300" />
          )}
        </button>
      </div>

      {/* User Section - Moved to top */}
      {user && (
        <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
          <div className="space-y-3">
            {/* User Info */}
            <button
              onClick={() => router.push("/profile")}
              className={`w-full flex items-center ${
                isExpanded ? "space-x-3" : "justify-center"
              } hover:bg-gray-800/50 rounded-xl p-3 transition-all duration-200`}
              title={isExpanded ? "" : "Profile"}
            >
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-600">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white truncate">
                    {user.username || user.name || "User"}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {(() => {
                      const status = getSubscriptionStatus(user);
                      return (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            status.status === "premium"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-gray-700/50 text-gray-300 border border-gray-600/30"
                          }`}
                        >
                          {status.displayText}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                !isExpanded ? "justify-center" : ""
              }`}
              title={
                !isExpanded
                  ? isLoggingOut
                    ? "Logging out..."
                    : "Logout"
                  : undefined
              }
            >
              {isLoggingOut ? (
                <div
                  className={`animate-spin rounded-full h-5 w-5 border-b-2 border-red-400 ${isExpanded ? "mr-3" : ""}`}
                />
              ) : (
                <LogOut className={`w-5 h-5 ${isExpanded ? "mr-3" : ""}`} />
              )}
              {isExpanded && (
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Navigation - Now scrollable */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {navigationSections.map((section) => {
            const isMiscSection = section.title === "Miscellaneous";
            const shouldShowItems = !isMiscSection || isMiscExpanded;

            return (
              <div key={section.title}>
                {isExpanded && (
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </h3>
                    {isMiscSection && (
                      <button
                        onClick={toggleMiscSection}
                        className="p-1 rounded hover:bg-gray-800/50 transition-colors"
                        title={
                          isMiscExpanded ? "Collapse section" : "Expand section"
                        }
                      >
                        {isMiscExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                )}
                {shouldShowItems && (
                  <ul className="space-y-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.name}>
                          <button
                            onClick={() => router.push(item.href)}
                            className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                              item.current
                                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-blue-500/20 shadow-lg"
                                : "text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-lg"
                            } ${!isExpanded ? "justify-center" : ""}`}
                            title={!isExpanded ? item.name : undefined}
                          >
                            <Icon
                              className={`w-5 h-5 ${isExpanded ? "mr-3" : ""}`}
                            />
                            {isExpanded && <span>{item.name}</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
