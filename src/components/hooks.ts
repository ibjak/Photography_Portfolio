"use client";

import { getImageProps } from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type TouchEvent,
} from "react";
import type { ImageItem } from "@/lib/portfolio";

const SWIPE_THRESHOLD_PX = 40;
const PHOTO_PARAM = "photo";
const PHOTO_CHANGE_EVENT = "portfolio:photochange";

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

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

// false while the tab is in the background.
export function usePageVisible() {
  return useSyncExternalStore(
    subscribeToVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );
}

// Arrow keys step through photos; Escape (when given) leaves the slideshow.
export function useSlideKeys(
  onStep: (delta: number) => void,
  enabled = true,
  onEscape?: () => void,
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Leave browser shortcuts alone: Cmd/Alt+Arrow is Back and Forward.
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) {
        return;
      }

      if (event.key === "Escape" && onEscape) {
        onEscape();
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      event.preventDefault();
      onStep(event.key === "ArrowLeft" ? -1 : 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onEscape, onStep]);
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

function subscribeToPhotoParam(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(PHOTO_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(PHOTO_CHANGE_EVENT, onChange);
  };
}

// The open slideshow photo lives in the address bar (?photo=3), so a photo can
// be linked to and the browser's Back button returns to the grid. Returns the
// zero-based index, or null when no photo is open (and while server rendering).
export function useOpenPhoto(count: number) {
  const value = useSyncExternalStore(
    subscribeToPhotoParam,
    () => new URLSearchParams(window.location.search).get(PHOTO_PARAM),
    () => null,
  );
  const position = value === null ? Number.NaN : Number(value);

  return Number.isInteger(position) && position >= 1 && position <= count
    ? position - 1
    : null;
}

function writePhotoParam(
  index: number | null,
  method: "pushState" | "replaceState",
  openedFromGallery: boolean,
) {
  const url = new URL(window.location.href);

  if (index === null) {
    url.searchParams.delete(PHOTO_PARAM);
  } else {
    url.searchParams.set(PHOTO_PARAM, String(index + 1));
  }

  // Next.js copies its own router state into this object, so the entry stays
  // one it can navigate back to.
  window.history[method](
    { openedFromGallery },
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
  window.dispatchEvent(new Event(PHOTO_CHANGE_EVENT));
}

const wasOpenedFromGallery = () =>
  window.history.state?.openedFromGallery === true;

// Opening adds a history entry; stepping rewrites it, so one press of Back
// returns to the gallery however many photos were viewed.
export function openPhoto(index: number) {
  // On the way back the gallery scrolls to the photo last viewed (see
  // GalleryViewer), so the browser must not restore its own position on top.
  window.history.scrollRestoration = "manual";
  writePhotoParam(index, "pushState", true);
}

export function showPhoto(index: number) {
  writePhotoParam(index, "replaceState", wasOpenedFromGallery());
}

export function closePhoto() {
  if (wasOpenedFromGallery()) {
    window.history.back();
  } else {
    // Arrived by a direct link to a photo: there is no gallery entry behind it.
    writePhotoParam(null, "replaceState", false);
  }
}

type LoadableImage = Pick<ImageItem, "src" | "width" | "height">;

const DECODE_LIMIT_MS = 300;
const DOWNLOAD_LIMIT_MS = 10000;

const delay = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const preloads = new Map<string, Promise<void>>();

// Downloads the same file the visible <Image> will ask for, so swapping to it
// is instant. `sizes` must match the one the visible image uses.
export function preloadImage(image: LoadableImage, sizes: string) {
  const key = `${image.src}|${sizes}`;
  let pending = preloads.get(key);

  if (!pending) {
    const { props } = getImageProps({
      src: image.src,
      alt: "",
      width: image.width,
      height: image.height,
      sizes,
    });
    const loader = new window.Image();
    const downloaded = new Promise<void>((resolve) => {
      loader.onload = () => resolve();
      // A photo that fails to load must not block the slideshow.
      loader.onerror = () => resolve();
    });

    if (props.sizes) loader.sizes = props.sizes;
    if (props.srcSet) loader.srcset = props.srcSet;
    loader.src = props.src;
    // Decoding ahead makes the swap paint in one go, but browsers only decode
    // while the tab is being drawn, so it gets a short time limit; the
    // download gets a long one. Either way the slideshow can never hang.
    pending = Promise.race([
      downloaded.then(() =>
        Promise.race([loader.decode().catch(() => undefined), delay(DECODE_LIMIT_MS)]),
      ),
      delay(DOWNLOAD_LIMIT_MS),
    ]);
    preloads.set(key, pending);
  }

  return pending;
}

type LoadedSlide = { shown: number; previous: number | null };

// Keeps the current photo on screen until the requested one has downloaded,
// then swaps in one step, so the frame never goes blank. Also warms up both
// neighbours so the next step is immediate. `previous` is the photo that was
// just replaced, for cross-fades; call clearPrevious once the fade is over.
export function useLoadedSlide<T extends LoadableImage>(
  images: readonly T[],
  requested: number,
  sizesFor: (image: T) => string,
) {
  const [slide, setSlide] = useState<LoadedSlide>({
    shown: requested,
    previous: null,
  });
  const { shown } = slide;

  useEffect(() => {
    if (requested === shown) {
      return;
    }

    let cancelled = false;
    const image = images[requested];

    void preloadImage(image, sizesFor(image)).then(() => {
      if (!cancelled) {
        setSlide({ shown: requested, previous: shown });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [images, requested, shown, sizesFor]);

  useEffect(() => {
    for (const delta of [1, -1]) {
      const neighbour = images[wrapIndex(shown + delta, images.length)];
      void preloadImage(neighbour, sizesFor(neighbour));
    }
  }, [images, shown, sizesFor]);

  const clearPrevious = useCallback(
    () =>
      setSlide((current) =>
        current.previous === null ? current : { ...current, previous: null },
      ),
    [],
  );

  return {
    shown,
    previous: slide.previous,
    isWaiting: requested !== shown,
    clearPrevious,
  };
}

// Ref for lazily loaded photos: hides one that has not arrived yet and lets
// CSS fade it in when it does. Photos that are already loaded are left alone,
// and without JavaScript nothing is ever hidden.
export function fadeInOnLoad(image: HTMLImageElement | null) {
  if (!image || image.complete) {
    return;
  }

  const reveal = () => image.classList.remove("photo-pending");

  image.classList.add("photo-pending");
  image.addEventListener("load", reveal, { once: true });
  image.addEventListener("error", reveal, { once: true });
}
