"use client";

import { useState } from "react";
import ConfirmationPopup, { ConfirmationPopupProps } from "./ConfirmationPopup";
import { Trash2, AlertTriangle, Info, CheckCircle } from "lucide-react";

export default function ConfirmationPopupExample() {
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    props: Partial<ConfirmationPopupProps>;
  }>({
    isOpen: false,
    props: {},
  });

  const showPopup = (props: Partial<ConfirmationPopupProps>) => {
    setPopup({
      isOpen: true,
      props,
    });
  };

  const closePopup = () => {
    setPopup({
      isOpen: false,
      props: {},
    });
  };

  const handleConfirm = () => {
    // Simulate async operation
    console.log("Confirmed action");
    closePopup();
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Confirmation Popup Examples</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() =>
            showPopup({
              title: "Delete Item",
              message:
                "Are you sure you want to delete this item? This action cannot be undone.",
              type: "danger",
              confirmText: "Delete",
              onConfirm: handleConfirm,
            })
          }
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Danger</span>
        </button>

        <button
          onClick={() =>
            showPopup({
              title: "Warning",
              message:
                "This action will affect multiple items. Please review before proceeding.",
              type: "warning",
              confirmText: "Continue",
              onConfirm: handleConfirm,
            })
          }
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Warning</span>
        </button>

        <button
          onClick={() =>
            showPopup({
              title: "Information",
              message:
                "This feature requires additional permissions. Would you like to proceed?",
              type: "info",
              confirmText: "Learn More",
              onConfirm: handleConfirm,
            })
          }
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Info className="w-4 h-4" />
          <span>Info</span>
        </button>

        <button
          onClick={() =>
            showPopup({
              title: "Success",
              message:
                "Your changes have been saved successfully. Would you like to continue?",
              type: "success",
              confirmText: "Great!",
              onConfirm: handleConfirm,
            })
          }
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Success</span>
        </button>
      </div>

      <button
        onClick={() =>
          showPopup({
            title: "Loading Example",
            message:
              "This will show the loading state. Click confirm to see it in action.",
            type: "info",
            confirmText: "Start Process",
            onConfirm: () => {
              // Simulate loading state
              setPopup((prev) => ({
                ...prev,
                props: {
                  ...prev.props,
                  isLoading: true,
                },
              }));

              // Simulate async operation
              setTimeout(() => {
                closePopup();
              }, 3000);
            },
          })
        }
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Show Loading State
      </button>

      <ConfirmationPopup
        isOpen={popup.isOpen}
        onClose={closePopup}
        onConfirm={popup.props.onConfirm || handleConfirm}
        title={popup.props.title || ""}
        message={popup.props.message || ""}
        confirmText={popup.props.confirmText}
        cancelText={popup.props.cancelText}
        type={popup.props.type}
        isLoading={popup.props.isLoading}
      />
    </div>
  );
}
