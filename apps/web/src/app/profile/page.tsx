"use client";
import { useAuth } from "@web/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@web/contexts/ThemeContext";
import { useAuthStore } from "@store/useAuthStore";
import ImageModal from "@web/components/ImageModal";
import PremiumModal from "@web/components/PremiumModal";
import ConfirmationPopup from "@web/components/ConfirmationPopup";
import {
  MessageAlert,
  ProfileHeader,
  AccountStatus,
  ProfilePicture,
  ProfileForm,
} from "@web/components/Profile";
import ThemeSelector from "@web/components/Profile/ThemeSelector";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  subscription: "free" | "premium";
  premiumExpiresAt?: string;
  countryId?: string;
  theme?: string;
  country?: {
    id: string;
    name: string;
    code: string;
  };
  createdAt: string;
  updatedAt?: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const { themeConfig } = useTheme();
  const { setUser } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isCancelingSubscription, setIsCancelingSubscription] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    countryId: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [countries, setCountries] = useState<Country[]>([]);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch countries
  useEffect(() => {
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
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (!isClient || !user) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const userData = await response.json();
          setProfile(userData);
          setFormData({
            name: userData.name || "",
            username: userData.username || "",
            countryId: userData.countryId || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        } else {
          console.error("Failed to load profile, status:", response.status);
          setError("Failed to load profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
      }
    };

    fetchProfile();
  }, [isClient, user]);

  // Show loading state
  if (!isClient || loading) {
    return (
      <div className="min-h-screen ${themeConfig.gradients.background} flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is null
  if (!user) {
    return (
      <div
        className={`min-h-screen ${themeConfig.gradients.background} flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If profile is not loaded yet, show loading state
  if (!profile) {
    return (
      <div
        className={`min-h-screen ${themeConfig.gradients.background} flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile data...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to sync user data with auth store
  const syncUserData = (updatedProfile: UserProfile) => {
    if (user) {
      setUser({
        ...user,
        name: updatedProfile.name,
        username: updatedProfile.username,
        avatar: updatedProfile.avatar,
        subscription: updatedProfile.subscription,
        premiumExpiresAt: updatedProfile.premiumExpiresAt,
      });
    }
  };

  // Handle premium purchase
  const handlePremiumPurchase = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/premium/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updatedProfile = data.user;

        // Update local profile state
        setProfile(updatedProfile);

        // Sync with auth store
        syncUserData(updatedProfile);

        // Show success message
        setSuccess(
          "Premium subscription activated! Welcome to the premium experience!"
        );

        // Close modal
        setIsPremiumModalOpen(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to purchase premium");
      }
    } catch (error) {
      console.error("Premium purchase error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to purchase premium"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle premium cancellation
  const handleCancelSubscription = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelSubscription = async () => {
    try {
      setIsCancelingSubscription(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/premium/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updatedProfile = data.user;

        // Update local profile state
        setProfile(updatedProfile);

        // Sync with auth store
        syncUserData(updatedProfile);

        // Show success message
        setSuccess(
          "Premium subscription canceled successfully. You are now on the free plan."
        );
        setShowCancelConfirm(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to cancel subscription"
      );
      setShowCancelConfirm(false);
    } finally {
      setIsCancelingSubscription(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setError("");

      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Update profile with base64 avatar
      const updateResponse = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: base64 }),
      });

      if (updateResponse.ok) {
        const updatedProfile = await updateResponse.json();
        setProfile(updatedProfile);
        syncUserData(updatedProfile);
        setSuccess("Avatar updated successfully");
      } else {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update avatar");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload avatar"
      );
    } finally {
      setIsUploadingAvatar(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploadingAvatar(true);
      setError("");

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: null }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        syncUserData(updatedProfile);
        setSuccess("Avatar removed successfully");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove avatar");
      }
    } catch (error) {
      console.error("Avatar removal error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to remove avatar"
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("New passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);

      const updateData: {
        name: string;
        username: string;
        countryId?: string;
        currentPassword?: string;
        newPassword?: string;
      } = {
        name: formData.name,
        username: formData.username,
        countryId: formData.countryId || undefined,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        syncUserData(updatedProfile);
        setSuccess("Profile updated successfully");
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openImageModal = () => {
    if (profile.avatar) {
      setIsImageModalOpen(true);
    }
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <div className="min-h-screen ${themeConfig.gradients.background}">
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <ProfileHeader onBack={() => router.back()} />

          {/* Error/Success Messages */}
          <MessageAlert type="error" message={error} />
          <MessageAlert type="success" message={success} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Status */}
            <AccountStatus
              profile={profile}
              isSubmitting={isCancelingSubscription}
              onGetPremium={() => setIsPremiumModalOpen(true)}
              onCancelSubscription={handleCancelSubscription}
            />

            {/* Profile Picture */}
            <ProfilePicture
              profile={profile}
              isSubmitting={isUploadingAvatar}
              fileInputRef={fileInputRef}
              onAvatarUpload={handleAvatarUpload}
              onRemoveAvatar={handleRemoveAvatar}
              onImageClick={openImageModal}
            />
          </div>

          {/* Theme Selection */}
          <div className="mt-6">
            <ThemeSelector isSubmitting={isSubmitting} />
          </div>

          {/* Profile Information */}
          <div className="mt-6">
            <ProfileForm
              profile={profile}
              formData={formData}
              countries={countries}
              isSubmitting={isSubmitting}
              onInputChange={handleInputChange}
              onSubmit={handleProfileUpdate}
            />
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      {profile && profile.avatar && (
        <ImageModal
          images={[profile.avatar]}
          currentIndex={0}
          isOpen={isImageModalOpen}
          onClose={closeImageModal}
        />
      )}

      {/* Premium Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onPurchase={handlePremiumPurchase}
      />

      {/* Cancel Subscription Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={confirmCancelSubscription}
        title="Cancel Premium Subscription"
        message="Are you sure you want to cancel your premium subscription? This action cannot be undone and you will lose access to premium features."
        type="warning"
        confirmText="Cancel Subscription"
        cancelText="Keep Premium"
        isLoading={isCancelingSubscription}
      />
    </div>
  );
}
