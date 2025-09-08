import React from "react";
import { useRouter } from "next/navigation";
import {
  Fish,
  MapPin,
  Calendar,
  Weight,
  Share2,
  Edit,
  Trash2,
  Ruler,
} from "lucide-react";
import { formatDateTime } from "@web/lib/dateUtils";
import { isPremiumUser } from "@web/lib/subscriptionUtils";

interface CatchCardProps {
  catch_: {
    id: string;
    species: string;
    weight?: number;
    length?: number;
    bait?: string;
    location?: string;
    spot?: { name: string };
    event?: { title: string };
    comments?: string;
    photoUrls?: string[];
    createdAt: string;
    isShared?: boolean;
  };
  user: any;
  onEdit: () => void;
  onDelete: (catchId: string) => void;
  onToggleShared: (catchId: string) => void;
}

export const CatchCard: React.FC<CatchCardProps> = ({
  catch_,
  user,
  onEdit,
  onDelete,
  onToggleShared,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/catches/${catch_.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this catch?")) {
      // Disable the button to prevent double-clicks
      const button = e.currentTarget as HTMLButtonElement;
      button.disabled = true;
      try {
        await onDelete(catch_.id);
      } finally {
        button.disabled = false;
      }
    }
  };

  const handleToggleShared = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onToggleShared(catch_.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-800/70 hover:border-blue-500/50 focus-within:border-blue-500/50 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex flex-col h-full"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 p-6 pb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
            {catch_.species}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDateTime(catch_.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {isPremiumUser(user) && (
            <button
              onClick={handleToggleShared}
              className={`p-2 rounded-lg transition-all duration-200 ${
                catch_.isShared
                  ? "text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20"
                  : "text-gray-400 hover:text-green-400 hover:bg-gray-700/50"
              }`}
              title={
                catch_.isShared ? "Unshare from public" : "Share to public"
              }
            >
              <Share2
                className={`w-4 h-4 ${catch_.isShared ? "fill-current" : ""}`}
              />
            </button>
          )}
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-200"
            title="Edit catch"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200"
            title="Delete catch"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Catch Details */}
      <div className="space-y-3 flex-1 mb-4 px-6">
        {/* Weight & Length Stats */}
        {(catch_.weight || catch_.length) && (
          <div className="flex items-center space-x-4">
            {catch_.weight && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                  <Weight className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{catch_.weight}kg</p>
                </div>
              </div>
            )}
            {catch_.length && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                  <Ruler className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{catch_.length}cm</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bait */}
        {catch_.bait && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <Fish className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300 line-clamp-1">
                {catch_.bait}
              </p>
            </div>
          </div>
        )}

        {/* Location */}
        {(catch_.spot || catch_.location) && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <MapPin className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300 line-clamp-1">
                {catch_.spot ? catch_.spot.name : catch_.location}
              </p>
            </div>
          </div>
        )}

        {/* Event */}
        {catch_.event && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <Calendar className="w-4 h-4 text-pink-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300 line-clamp-1">
                {catch_.event.title}
              </p>
            </div>
          </div>
        )}

        {/* Comments */}
        {catch_.comments && (
          <div className="mt-2">
            <p className="text-sm text-gray-400 italic line-clamp-2">
              "{catch_.comments}"
            </p>
          </div>
        )}

        {/* Photos */}
        {catch_.photoUrls &&
          Array.isArray(catch_.photoUrls) &&
          catch_.photoUrls.length > 0 && (
            <div className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                {catch_.photoUrls.slice(0, 2).map((photoUrl, index) => (
                  <img
                    key={index}
                    src={photoUrl}
                    alt={`${catch_.species} catch ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border border-gray-700/50"
                  />
                ))}
              </div>
              {Array.isArray(catch_.photoUrls) &&
                catch_.photoUrls.length > 2 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{catch_.photoUrls.length - 2} more photos
                  </p>
                )}
            </div>
          )}
      </div>
    </div>
  );
};
