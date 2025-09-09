/**
 * Utility functions for handling user subscription logic
 */

export interface UserSubscription {
  subscription?: string | null;
  premiumExpiresAt?: string | Date | null;
}

// Make the functions work with any object that has subscription fields
export type SubscriptionUser = {
  subscription?: string | null;
  premiumExpiresAt?: string | Date | null;
};

/**
 * Determines if a user should be considered a "free" user
 * This includes users with null/undefined subscription or expired premium
 */
export function isFreeUser(user: SubscriptionUser): boolean {
  // Handle null/undefined subscription as "free"
  const subscription = user.subscription || "free";
  const isFree = subscription === "free";
  const isExpired = Boolean(
    subscription === "premium" &&
    user.premiumExpiresAt &&
    new Date(user.premiumExpiresAt) < new Date()
  );

  return isFree || isExpired;
}

/**
 * Determines if a user has an active premium subscription
 */
export function isPremiumUser(user: SubscriptionUser): boolean {
  return !isFreeUser(user);
}

/**
 * Gets the display status for a user's subscription
 */
export function getSubscriptionStatus(user: SubscriptionUser): {
  status: "free" | "premium" | "expired";
  displayText: string;
  isExpired: boolean;
} {
  const subscription = user.subscription || "free";

  if (subscription === "free") {
    return {
      status: "free",
      displayText: "Free",
      isExpired: false,
    };
  }

  if (subscription === "premium") {
    const isExpired =
      user.premiumExpiresAt && new Date(user.premiumExpiresAt) < new Date();

    return {
      status: isExpired ? "expired" : "premium",
      displayText: isExpired ? "Expired" : "Premium",
      isExpired: !!isExpired,
    };
  }

  // Fallback for any other subscription type
  return {
    status: "free",
    displayText: "Free",
    isExpired: false,
  };
}

/**
 * Determines if a user should see the "Get Premium" button
 * Shows for free users or users with expired premium
 */
export function shouldShowGetPremiumButton(user: SubscriptionUser): boolean {
  return isFreeUser(user);
}

/**
 * Determines if a user should see the premium modal on login
 * Shows for free users or users with expired premium
 */
export function shouldShowPremiumModal(user: SubscriptionUser): boolean {
  return isFreeUser(user);
}
