"use client";

import { useTheme } from "@web/contexts/ThemeContext";
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";

export interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
}

export default function ConfirmationPopup({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}: ConfirmationPopupProps) {
  const { themeConfig } = useTheme();

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-500" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      default:
        return "bg-red-600 hover:bg-red-700 text-white";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        // Prevent bubbling to parent components like cards
        e.stopPropagation();
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Modal */}
      <div
        className={`relative ${themeConfig.gradients.card} rounded-2xl shadow-2xl border ${themeConfig.colors.border} max-w-md w-full mx-4 transform transition-all duration-300`}
        onClick={(e) => {
          // Prevent click-through to backdrop or parents
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${themeConfig.colors.border}`}
        >
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3
              className={`text-xl font-semibold ${themeConfig.colors.text.primary}`}
            >
              {title}
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={`p-2 rounded-lg ${themeConfig.colors.background.hover} transition-colors`}
            disabled={isLoading}
          >
            <X className={`w-5 h-5 ${themeConfig.colors.text.secondary}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p
            className={`text-base ${themeConfig.colors.text.secondary} leading-relaxed`}
          >
            {message}
          </p>
        </div>

        {/* Actions */}
        <div
          className={`flex items-center justify-end space-x-3 p-6 border-t ${themeConfig.colors.border}`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading) onClose();
            }}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isLoading
                ? `${themeConfig.colors.background.card} ${themeConfig.colors.text.muted} cursor-not-allowed`
                : `${themeConfig.colors.background.hover} ${themeConfig.colors.text.secondary} hover:${themeConfig.colors.text.primary}`
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading) onConfirm();
            }}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : getConfirmButtonStyle()
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
