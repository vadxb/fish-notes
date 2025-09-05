import {
  Calendar,
  MapPin,
  Clock,
  Fish,
  Edit,
  Trash2,
  Settings,
} from "lucide-react";
import { formatDate, formatTime, formatDuration } from "@web/lib/dateUtils";

interface Event {
  id: string;
  userId?: string;
  title: string;
  notes?: string;
  startAt: string;
  endAt?: string;
  locationType: string;
  locationText?: string;
  spotId?: string;
  selectedMarkerIndexes?: number[];
  createdAt: string;
  spot?: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    coordinates?: Array<{ lat: number; lng: number; name?: string }>;
  };
  catches?: Array<{
    id: string;
    species: string;
    weight?: number;
    bait?: string;
    comments?: string;
    photoUrls?: string[];
    createdAt: string;
  }>;
}

interface EventCardProps {
  event: Event;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
  onManageCatches: (eventId: string) => void;
}

export default function EventCard({
  event,
  onEdit,
  onDelete,
  onManageCatches,
}: EventCardProps) {
  const getLocationDisplay = () => {
    if (event.locationType === "text") {
      return event.locationText || "No location specified";
    } else if (event.spot) {
      const markerCount = event.selectedMarkerIndexes?.length || 0;
      return `${event.spot.name}${markerCount > 0 ? ` (${markerCount} marker${markerCount > 1 ? "s" : ""})` : ""}`;
    }
    return "No location specified";
  };

  const getDuration = () => {
    if (!event.endAt) return null;
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);
    return formatDuration(start, end);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger edit if clicking on action buttons
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    onEdit(event.id);
  };

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:bg-gray-800/70 hover:border-blue-500/50 focus-within:border-blue-500/50 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex flex-col h-full"
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(event.id);
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
            {event.title}
          </h3>
          {event.notes && (
            <p className="text-sm text-gray-400 line-clamp-2">{event.notes}</p>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event.id);
            }}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white transition-all duration-200"
            title="Edit event"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event.id);
            }}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200"
            title="Delete event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-3 flex-1 mb-4">
        {/* Date & Time */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-700/50 rounded-lg">
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              {formatDate(event.startAt)} at {formatTime(event.startAt)}
            </p>
            {event.endAt && (
              <p className="text-xs text-gray-500">Duration: {getDuration()}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-700/50 rounded-lg">
            <MapPin className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-300 line-clamp-1">
              {getLocationDisplay()}
            </p>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-700/50 rounded-lg">
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">
              Created {formatDate(event.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Catches section */}
      <div className="border-t border-gray-700/50 pt-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <Fish className="w-4 h-4 text-pink-400" />
            </div>
            <span className="text-sm font-medium text-white">
              Catches ({event.catches?.length || 0})
              {event.catches &&
                event.catches.length > 0 &&
                (() => {
                  const totalWeight = event.catches.reduce(
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
            onClick={(e) => {
              e.stopPropagation();
              onManageCatches(event.id);
            }}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Manage catches"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        {event.catches && event.catches.length > 0 ? (
          <div className="space-y-2">
            {event.catches.slice(0, 2).map((catch_, index) => (
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
            {event.catches.length > 2 && (
              <div className="text-xs text-gray-500 italic pt-1">
                +{event.catches.length - 2} more catches
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">No catches yet</div>
        )}
      </div>
    </div>
  );
}
