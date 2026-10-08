/** Track full-screen mobile overlays so floating chrome (chat FAB) can yield. */

let overlayCount = 0;

export function lockChromeOverlay(): void {
  if (typeof document === "undefined") return;
  overlayCount += 1;
  document.body.classList.add("chrome-overlay-open");
}

export function unlockChromeOverlay(): void {
  if (typeof document === "undefined") return;
  overlayCount = Math.max(0, overlayCount - 1);
  if (overlayCount === 0) {
    document.body.classList.remove("chrome-overlay-open");
  }
}
