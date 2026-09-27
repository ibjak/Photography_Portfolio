"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
  type TouchEvent,
} from "react";

const SWIPE_THRESHOLD_PX = 40;

export const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length;

// null while server rendering and hydrating, when the viewport is still unknown.
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore<boolean | null>(
    subscribe,
    () => window.matchMedia(query).matches,
    () => null,
  );
}

export function useArrowKeys(onStep: (delta: number) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) {
        return;
      }

      event.preventDefault();
      onStep(event.key === "ArrowLeft" ? -1 : 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onStep]);
}

export function useSwipe(onStep: (delta: number) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onTouchStart: (event: TouchEvent) => {
      // Ignore pinch-zoom and other multi-finger gestures.
      const touch = event.touches.length === 1 ? event.touches[0] : null;
      start.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
    },
    onTouchEnd: (event: TouchEvent) => {
      const origin = start.current;
      const touch = event.changedTouches[0];
      start.current = null;

      if (!origin || !touch) {
        return;
      }

      const dx = touch.clientX - origin.x;
      const dy = touch.clientY - origin.y;

      if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
        onStep(dx < 0 ? 1 : -1);
      }
    },
  };
}
