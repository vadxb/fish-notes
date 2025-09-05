import { ArrowLeft, Calendar, Trash2, Plus } from "lucide-react";

interface EventHeaderProps {
  onBack: () => void;
  title: string;
  subtitle?: string;
  showDelete?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  showNewButton?: boolean;
  onNew?: () => void;
  newButtonText?: string;
}

export default function EventHeader({
  onBack,
  title,
  subtitle,
  showDelete = false,
  onDelete,
  isDeleting = false,
  showNewButton = false,
  onNew,
  newButtonText = "New Event",
}: EventHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {showNewButton && onNew && (
          <button
            onClick={onNew}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>{newButtonText}</span>
          </button>
        )}

        {showDelete && onDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
