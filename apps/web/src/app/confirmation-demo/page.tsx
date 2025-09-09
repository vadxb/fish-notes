"use client";

import { useTheme } from "@web/contexts/ThemeContext";
import ConfirmationPopupExample from "@web/components/ConfirmationPopupExample";

export default function ConfirmationDemoPage() {
  const { themeConfig } = useTheme();

  return (
    <div className={`min-h-screen ${themeConfig.gradients.background}`}>
      <div className="container mx-auto px-4 py-8">
        <div
          className={`${themeConfig.gradients.card} rounded-2xl p-8 shadow-xl border ${themeConfig.colors.border}`}
        >
          <h1 className={`text-3xl font-bold mb-2 ${themeConfig.header.text}`}>
            Confirmation Popup Demo
          </h1>
          <p className={`text-lg ${themeConfig.colors.text.muted} mb-8`}>
            Test the theme-aware confirmation popup component with different
            types and states.
          </p>

          <ConfirmationPopupExample />
        </div>
      </div>
    </div>
  );
}
