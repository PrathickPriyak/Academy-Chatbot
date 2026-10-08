"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1 && element.offsetParent !== null,
  );
}

/** Trap Tab inside a container while active; Escape calls onEscape; restores focus on cleanup. */
export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  options?: {
    onEscape?: () => void;
    initialFocusRef?: RefObject<HTMLElement | null>;
  },
): void {
  const previousFocus = useRef<HTMLElement | null>(null);
  const onEscape = options?.onEscape;
  const initialFocusRef = options?.initialFocusRef;

  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusInitial = () => {
      const preferred = initialFocusRef?.current;
      if (preferred) {
        preferred.focus();
        return;
      }
      const focusable = getFocusableElements(container);
      focusable[0]?.focus();
    };

    const frame = window.requestAnimationFrame(focusInitial);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape?.();
        return;
      }
      if (event.key !== "Tab") return;

      const root = containerRef.current;
      if (!root) return;

      const focusable = getFocusableElements(root);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === first || !root.contains(activeElement)) {
          event.preventDefault();
          last.focus();
        }
      } else if (activeElement === last || !root.contains(activeElement)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      previousFocus.current?.focus();
    };
  }, [active, containerRef, onEscape, initialFocusRef]);
}
