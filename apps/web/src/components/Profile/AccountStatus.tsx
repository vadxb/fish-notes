import { Crown } from "lucide-react";
import {
  getSubscriptionStatus,
  shouldShowGetPremiumButton,
} from "@web/lib/subscriptionUtils";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  subscription: "free" | "premium";
  premiumExpiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface AccountStatusProps {
  profile: UserProfile;
  isSubmitting: boolean;
  onGetPremium: () => void;
  onCancelSubscription: () => void;
}

export default function AccountStatus({
  profile,
  isSubmitting,
  onGetPremium,
  onCancelSubscription,
}: AccountStatusProps) {
  const status = getSubscriptionStatus(profile);
  const showGetPremium = shouldShowGetPremiumButton(profile);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          <Crown className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Account Status</h3>
          <p className="text-sm text-gray-400">
            Your current subscription plan
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-white">
            {status.displayText}
          </p>
          {status.status === "premium" && profile.premiumExpiresAt && (
            <p className="text-sm text-gray-400">
              Expires: {new Date(profile.premiumExpiresAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="text-right">
          {showGetPremium ? (
            <button
              onClick={onGetPremium}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
            >
              Get Premium
            </button>
          ) : (
            <button
              onClick={onCancelSubscription}
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 rounded-xl font-medium hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Canceling..." : "Cancel Subscription"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
