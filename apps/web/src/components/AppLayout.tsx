"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@web/contexts/ThemeContext";
import Sidebar from "./Sidebar";
import PremiumModal from "./PremiumModal";
import {
  PremiumModalProvider,
  usePremiumModal,
} from "@web/contexts/PremiumModalContext";
import { shouldShowPremiumModal } from "@web/lib/subscriptionUtils";
import { useAuthStore } from "@store/useAuthStore";

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { user, loading } = useAuth();
  const { themeConfig } = useTheme();
  const { setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [hasShownPremiumModal, setHasShownPremiumModal] = useState(false);
  const { isOpen, showModal, hideModal } = usePremiumModal();

  // Don't show sidebar on login/signup pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // Public routes that don't require authentication
  const publicRoutes = ["/about"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // About page should always be standalone (no sidebar)
  const isAboutPage = pathname === "/about";

  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Only redirect if we're not loading, user is null, and it's not a public route
    if (!loading && user === null && !isPublicRoute) {
      router.push("/login");
    }
  }, [user, loading, router, isClient, isPublicRoute]);

  // Show premium modal for free users or expired premium users on login
  useEffect(() => {
    if (!isClient || loading || !user || isAuthPage || isPublicRoute) return;

    // Show premium modal for free users or expired premium users (only once per session)
    if (shouldShowPremiumModal(user) && !hasShownPremiumModal) {
      const timer = setTimeout(() => {
        showModal();
        setHasShownPremiumModal(true);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [isClient, loading, user, isAuthPage, hasShownPremiumModal, showModal]);

  // Handle premium purchase
  const handlePremiumPurchase = async () => {
    try {
      const response = await fetch("/api/premium/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = data.user;

        // Update auth store with new user data
        setUser(updatedUser);

        // Close modal
        hideModal();

        // Redirect to profile page to show success
        router.push("/profile");
      } else {
        const errorData = await response.json();
        console.error("Premium purchase failed:", errorData.error);
        // You could add a toast notification here
      }
    } catch (error) {
      console.error("Premium purchase error:", error);
      // You could add a toast notification here
    }
  };

  // For public pages (About, Auth), don't show loading state
  if (isAuthPage || isAboutPage) {
    return <>{children}</>;
  }

  // Show loading state only when actually loading on client (not during SSR)
  if (isClient && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${themeConfig.gradients.background}`}>
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>

      {/* Premium Modal for Free Users or Expired Premium Users */}
      {user && shouldShowPremiumModal(user) && (
        <PremiumModal
          isOpen={isOpen}
          onClose={hideModal}
          onPurchase={handlePremiumPurchase}
        />
      )}
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <PremiumModalProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </PremiumModalProvider>
  );
}
