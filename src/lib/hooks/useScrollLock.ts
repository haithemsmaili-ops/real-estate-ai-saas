"use client";

import { useEffect } from "react";

/**
 * Custom hook to lock document body scrolling when a modal or drawer is open.
 * Automatically restores previous body overflow style upon closing or unmounting.
 */
export function useScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (typeof window === "undefined" || !document?.body) return;

    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Calculate scrollbar width to prevent horizontal page jump
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);
}
