import { Palette, Check } from "lucide-react";
import { useTheme } from "@web/contexts/ThemeContext";
import { themes, ThemeId } from "@web/lib/themes";

interface ThemeSelectorProps {
  isSubmitting: boolean;
}

export default function ThemeSelector({ isSubmitting }: ThemeSelectorProps) {
  const { currentTheme, setTheme } = useTheme();

  const handleThemeChange = async (themeId: ThemeId) => {
    if (themeId !== currentTheme) {
      await setTheme(themeId);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          <Palette className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Theme</h3>
          <p className="text-sm text-gray-400">
            Choose your preferred visual style
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(themes).map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            disabled={isSubmitting}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              currentTheme === theme.id
                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                : "border-gray-600 bg-gray-700/30 hover:border-gray-500 hover:bg-gray-700/50"
            }`}
          >
            {/* Theme Preview */}
            <div
              className={`w-full h-20 rounded-lg mb-3 ${theme.gradients.background}`}
            >
              <div className="flex items-center justify-center h-full">
                <span className="text-2xl">{theme.icon}</span>
              </div>
            </div>

            {/* Theme Info */}
            <div className="text-left">
              <h4 className="font-medium text-white text-sm mb-1">
                {theme.name}
              </h4>
              <p className="text-xs text-gray-400 line-clamp-2">
                {theme.description}
              </p>
            </div>

            {/* Selected Indicator */}
            {currentTheme === theme.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
        <p className="text-xs text-gray-400 text-center">
          Theme changes are applied immediately and saved to your profile
        </p>
      </div>
    </div>
  );
}
