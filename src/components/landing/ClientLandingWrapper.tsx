"use client";
import { ReactNode } from "react";
import { LeadModal } from "./LeadModal";
import { useLeadModal } from "./useLeadModal";

export function ClientLandingWrapper({ children }: { children: ReactNode }) {
    const { isOpen, selectedPlan, closeModal } = useLeadModal();

    return (
        <>
            {children}
            <LeadModal
                open={isOpen}
                onClose={closeModal}
                selectedPlan={selectedPlan}
            />
        </>
    );
}