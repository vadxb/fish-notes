import React from "react";
import { X, Users, User, UserCheck } from "lucide-react";

interface CatchFilterProps {
  currentFilter: "all" | "user" | "me";
  onFilterChange: (filter: "all" | "user" | "me") => void;
  onClose: () => void;
  showSelectedUser?: boolean;
}

const CatchFilter = ({
  currentFilter,
  onFilterChange,
  onClose,
  showSelectedUser = true,
}: CatchFilterProps) => {
  const filters = [
    {
      key: "all" as const,
      label: "All Users",
      icon: Users,
      description: "Show catches from all users",
    },
    ...(showSelectedUser
      ? [
          {
            key: "user" as const,
            label: "Selected User",
            icon: User,
            description: "Show catches from selected user only",
          },
        ]
      : []),
    {
      key: "me" as const,
      label: "My Catches",
      icon: UserCheck,
      description: "Show only my catches",
    },
  ];

  return (
    <div className="absolute top-16 right-0 z-50 w-80 bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
        <h3 className="text-lg font-bold text-white">Filter Catches</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Filter Options */}
      <div className="p-4 space-y-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isSelected = currentFilter === filter.key;

          return (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                isSelected
                  ? "bg-blue-600/20 border border-blue-500/30 text-blue-400"
                  : "bg-gray-700/30 hover:bg-gray-700/50 text-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 ${isSelected ? "text-blue-400" : "text-gray-400"}`}
                />
                <div>
                  <p className="font-medium">{filter.label}</p>
                  <p className="text-sm opacity-75">{filter.description}</p>
                </div>
                {isSelected && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CatchFilter;
