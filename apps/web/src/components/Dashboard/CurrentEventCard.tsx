import React from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Fish, Settings } from "lucide-react";
import { formatDate, formatTime } from "@web/lib/dateUtils";

interface Event {
  id: string;
  title: string;
  notes?: string;
  startAt: string;
  endAt?: string;
  locationType: string;
  locationText?: string;
  spotId?: string;
  catches?: Array<{
    id: string;
    species: string;
    weight?: number;
    bait?: string;
    comments?: string;
    createdAt: string;
  }>;
  spot?: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  };
}

interface CurrentEventCardProps {
  currentEvent: Event | null;
  onManageCatches: () => void;
}

export default function CurrentEventCard({
  currentEvent,
  onManageCatches,
}: CurrentEventCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (currentEvent) {
      router.push(`/events/${currentEvent.id}`);
    }
  };

  const handleManageCatches = (e: React.MouseEvent) => {
    e.stopPropagation();
    onManageCatches();
  };

  const handleCreateEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push("/events/new");
  };

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:bg-gray-800/70 hover:border-blue-500/50 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 p-6 pb-4">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          <Calendar className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">My Current Event</h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {currentEvent ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-xl text-white mb-2">
                {currentEvent.title}
              </h4>
              {currentEvent.notes && (
                <p className="text-sm text-gray-400">{currentEvent.notes}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm text-gray-300">
                  {formatDate(currentEvent.startAt)}
                </span>
              </div>

              {currentEvent.startAt && currentEvent.endAt && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    <Clock className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm text-gray-300">
                    {formatTime(currentEvent.startAt)} -{" "}
                    {formatTime(currentEvent.endAt)}
                  </span>
                </div>
              )}

              {currentEvent.locationType === "text" &&
                currentEvent.locationText && (
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-700/50 rounded-lg">
                      <MapPin className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="text-sm text-gray-300">
                      {currentEvent.locationText}
                    </span>
                  </div>
                )}

              {currentEvent.locationType === "spot" && currentEvent.spot && (
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    <MapPin className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-sm text-gray-300">
                    {currentEvent.spot.name}
                  </span>
                </div>
              )}
            </div>

            {/* Catches section */}
            <div className="border-t border-gray-700/50 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    <Fish className="w-4 h-4 text-pink-400" />
                  </div>
                  <span className="text-sm font-medium text-white">
                    Catches ({currentEvent.catches?.length || 0})
                    {currentEvent.catches &&
                      currentEvent.catches.length > 0 &&
                      (() => {
                        const totalWeight = currentEvent.catches.reduce(
                          (sum, catch_) => sum + (catch_.weight || 0),
                          0
                        );
                        return totalWeight > 0
                          ? ` • ${totalWeight.toFixed(1)}kg`
                          : "";
                      })()}
                  </span>
                </div>
                <button
                  onClick={handleManageCatches}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                  title="Manage catches"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              {currentEvent.catches && currentEvent.catches.length > 0 ? (
                <div className="space-y-2">
                  {currentEvent.catches.slice(0, 2).map((catch_, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm p-2 bg-gray-700/30 rounded-lg"
                    >
                      <span className="text-gray-300">{catch_.species}</span>
                      <div className="flex space-x-3 text-gray-400">
                        {catch_.weight && <span>{catch_.weight}kg</span>}
                        {catch_.bait && <span>• {catch_.bait}</span>}
                      </div>
                    </div>
                  ))}
                  {currentEvent.catches.length > 2 && (
                    <div className="text-xs text-gray-500 italic pt-1">
                      +{currentEvent.catches.length - 2} more catches
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic">
                  No catches yet
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="p-4 bg-gray-700/50 rounded-lg w-fit mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-4">
              No events yet. Create your first fishing event!
            </p>
            <button
              onClick={handleCreateEvent}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              Create Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
