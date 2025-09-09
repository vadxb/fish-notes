import { ArrowLeft } from "lucide-react";
import { useTheme } from "@web/contexts/ThemeContext";

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
  const { themeConfig } = useTheme();
  return (
    <div className="flex items-center space-x-4 mb-8">
      <button
        onClick={onBack}
        className="p-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div>
        <h1 className={`text-3xl font-bold ${themeConfig.header.text} mb-2`}>
          {title}
        </h1>
        <p className={themeConfig.colors.text.muted}>{description}</p>
      </div>
    </div>
  );
}
