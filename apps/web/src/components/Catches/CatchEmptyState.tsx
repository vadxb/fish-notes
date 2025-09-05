import React from "react";
import { Fish, Plus } from "lucide-react";

interface CatchEmptyStateProps {
  hasCatches: boolean;
  onAddCatch: () => void;
}

export const CatchEmptyState: React.FC<CatchEmptyStateProps> = ({
  hasCatches,
  onAddCatch,
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Fish className="w-10 h-10 text-gray-400" />
        </div>

        <h3 className="text-2xl font-semibold text-white mb-3">
          {hasCatches ? "No catches found" : "No catches yet"}
        </h3>

        <p className="text-gray-400 text-lg mb-8">
          {hasCatches
            ? "Try adjusting your search terms to find catches."
            : "Start logging your fishing catches to track your success!"}
        </p>

        {!hasCatches && (
          <button
            onClick={onAddCatch}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600/20 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 border border-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Your First Catch</span>
          </button>
        )}
      </div>
    </div>
  );
};
