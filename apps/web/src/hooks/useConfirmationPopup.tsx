"use client";

import { useState } from "react";
import { ConfirmationPopupProps } from "@web/components/ConfirmationPopup";

export interface UseConfirmationPopupReturn {
  showPopup: (props: Partial<ConfirmationPopupProps>) => void;
  hidePopup: () => void;
  popupProps: ConfirmationPopupProps;
}

export function useConfirmationPopup(): UseConfirmationPopupReturn {
  const [popupProps, setPopupProps] = useState<ConfirmationPopupProps>({
    isOpen: false,
    onClose: () => {},
    onConfirm: () => {},
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "danger",
    isLoading: false,
  });

  const showPopup = (props: Partial<ConfirmationPopupProps>) => {
    setPopupProps((prev) => ({
      ...prev,
      ...props,
      isOpen: true,
    }));
  };

  const hidePopup = () => {
    setPopupProps((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return {
    showPopup,
    hidePopup,
    popupProps,
  };
}
