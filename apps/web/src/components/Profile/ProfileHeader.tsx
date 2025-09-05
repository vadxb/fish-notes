import { ArrowLeft } from "lucide-react";

interface ProfileHeaderProps {
  onBack: () => void;
  title?: string;
  description?: string;
}

export default function ProfileHeader({
  onBack,
  title = "My Profile",
  description = "Manage your account settings and preferences",
}: ProfileHeaderProps) {
  return (
    <div className="flex items-center space-x-4 mb-8">
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
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}
