import { Calendar, Plus } from "lucide-react";

interface EventEmptyStateProps {
  searchQuery?: string;
  onCreateNew?: () => void;
}

export default function EventEmptyState({
  searchQuery,
  onCreateNew,
}: EventEmptyStateProps) {
  const isSearching = searchQuery && searchQuery.trim().length > 0;

  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
        <Calendar className="w-12 h-12 text-gray-400" />
      </div>

      {isSearching ? (
        <>
          <h3 className="text-xl font-semibold text-white mb-2">
            No events found
          </h3>
          <p className="text-gray-400 mb-6">
            No events match your search for "{searchQuery}"
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-white mb-2">
            No events yet
          </h3>
          <p className="text-gray-400 mb-6">
            Start by creating your first fishing event
          </p>
        </>
      )}

      {onCreateNew && (
        <button
          onClick={onCreateNew}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Event</span>
        </button>
      )}
    </div>
  );
}
