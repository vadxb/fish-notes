import { ArrowLeft, MapPin } from "lucide-react";

interface SpotHeaderProps {
  onBack: () => void;
  title: string;
  subtitle: string;
  showDelete?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function SpotHeader({
  onBack,
  title,
  subtitle,
  showDelete = false,
  onDelete,
  isDeleting = false,
}: SpotHeaderProps) {
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
          <p className="text-gray-400">{subtitle}</p>
        </div>
      </div>

      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MapPin className="w-4 h-4" />
          <span>{isDeleting ? "Deleting..." : "Delete Spot"}</span>
        </button>
      )}
    </div>
  );
}
