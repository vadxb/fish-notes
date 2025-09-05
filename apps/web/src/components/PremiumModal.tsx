"use client";
import { useState } from "react";
import {
  X,
  Crown,
  Check,
  Share2,
  MapPin,
  Fish,
  Star,
  Trophy,
} from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => Promise<void>;
}

export default function PremiumModal({
  isOpen,
  onClose,
  onPurchase,
}: PremiumModalProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      await onPurchase();
    } catch (error) {
      console.error("Purchase error:", error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const benefits = [
    {
      icon: Share2,
      title: "Share Your Catches",
      description:
        "Share your fishing success with the community and inspire others",
    },
    {
      icon: MapPin,
      title: "Unlimited Spots",
      description:
        "Store unlimited fishing spots with detailed coordinates and notes",
    },
    {
      icon: Fish,
      title: "Custom Baits & Species",
      description: "Add your own baits and fish species to the database",
    },
    {
      icon: Star,
      title: "Community Ratings",
      description:
        "Your account will be included in community ratings and leaderboards",
    },
    {
      icon: Trophy,
      title: "Advanced Analytics",
      description:
        "Get detailed insights about your fishing patterns and success rates",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-6 text-center flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-yellow-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">
            Upgrade to Premium
          </h2>
          <p className="text-yellow-100 text-sm">
            Unlock the full potential of your fishing experience
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Benefits List */}
            <div className="space-y-4 mb-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  $9.99
                  <span className="text-base font-normal text-gray-500">
                    /month
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Cancel anytime • 30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isPurchasing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Get Premium
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
