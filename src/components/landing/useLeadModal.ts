"use client";

import { useState, useEffect } from "react";

export interface LeadModalState {
  isOpen: boolean;
  selectedPlan?: string;
}

let globalState: LeadModalState = {
  isOpen: false,
  selectedPlan: undefined,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function openModal(plan?: string) {
  globalState = { isOpen: true, selectedPlan: plan };
  notify();
}

export function closeModal() {
  globalState = { isOpen: false, selectedPlan: undefined };
  notify();
}

export function useLeadModal() {
  const [modalState, setModalState] = useState<LeadModalState>(globalState);

  useEffect(() => {
    const handleChange = () => setModalState(globalState);
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  return {
    isOpen: modalState.isOpen,
    selectedPlan: modalState.selectedPlan,
    openModal,
    closeModal,
  };
}
