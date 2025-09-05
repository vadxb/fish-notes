"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface PremiumModalContextType {
  isOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
}

const PremiumModalContext = createContext<PremiumModalContextType | undefined>(
  undefined
);

export const usePremiumModal = () => {
  const context = useContext(PremiumModalContext);
  if (context === undefined) {
    throw new Error(
      "usePremiumModal must be used within a PremiumModalProvider"
    );
  }
  return context;
};

export const PremiumModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const showModal = () => setIsOpen(true);
  const hideModal = () => setIsOpen(false);

  return (
    <PremiumModalContext.Provider value={{ isOpen, showModal, hideModal }}>
      {children}
    </PremiumModalContext.Provider>
  );
};
