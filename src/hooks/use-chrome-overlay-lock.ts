"use client";

import { useEffect } from "react";

import { lockChromeOverlay, unlockChromeOverlay } from "@/lib/chrome-overlay";

export function useChromeOverlayLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    lockChromeOverlay();
    return () => unlockChromeOverlay();
  }, [active]);
}
