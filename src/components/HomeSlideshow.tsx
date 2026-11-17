"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { HomeSlide } from "@/lib/portfolio";
import {
  useLoadedSlide,
  useMediaQuery,
  usePageVisible,
  useSlideKeys,
  useSwipe,
  wrapIndex,
} from "./hooks";

const AUTOPLAY_INTERVAL_MS = 4200;

// Mirrors .photo-stage-home in globals.css: a frame 74% of the screen high.
const homeSizes = (slide: HomeSlide) =>
  `(max-width: 767px) calc(100vw - 3rem), min(calc(100vw - 20rem), calc(74vh * ${(
    slide.width / slide.height
  ).toFixed(4)}))`;

const controlClass =
  "text-muted transition-colors hover:text-accent pointer-coarse:min-h-11 pointer-coarse:min-w-11";

type HomeSlideshowProps = {
  slides: readonly HomeSlide[];
};

export default function HomeSlideshow({ slides }: HomeSlideshowProps) {
  const [requested, setRequested] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const allowsMotion =
    useMediaQuery("(prefers-reduced-motion: no-preference)") === true;
  const isPageVisible = usePageVisible();
  // `shown` trails `requested` until that photo has downloaded, so slides
  // cross-fade between two finished photos and never through a blank frame.
  const { shown, previous, clearPrevious } = useLoadedSlide(
    slides,
    requested,
    homeSizes,
  );

  const stepSlide = useCallback(
    (delta: number) =>
      setRequested((index) => wrapIndex(index + delta, slides.length)),
    [slides.length],
  );

  const swipeHandlers = useSwipe(stepSlide);

  useSlideKeys(stepSlide, slides.length > 1);

  // The clock starts once a photo is actually on screen, so a slow connection
  // never makes autoplay skip ahead; it also rests while the tab is hidden.
  useEffect(() => {
    if (
      isPaused ||
      !allowsMotion ||
      !isPageVisible ||
      slides.length <= 1 ||
      requested !== shown
    ) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setRequested(wrapIndex(shown + 1, slides.length)),
      AUTOPLAY_INTERVAL_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [allowsMotion, isPageVisible, isPaused, requested, shown, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[shown];
  const previousSlide =
    allowsMotion && previous !== null ? slides[previous] : null;
  // On phones the frame takes the shape of the tallest slide, so it stays one
  // size while landscape and portrait photos alternate.
  const tallestRatio = Math.min(
    ...slides.map((slide) => slide.width / slide.height),
  );

  return (
    <section
      className="flex h-full flex-col justify-center"
      aria-labelledby="home-title"
    >
      <h1 id="home-title" className="sr-only">
        Ivan Badanjak Photography
      </h1>
      <figure
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false);
          }
        }}
      >
        <div
          className="photo-stage photo-stage-home"
          style={{ "--photo-ratio": tallestRatio } as CSSProperties}
          {...swipeHandlers}
        >
          {/* Keyed by photo, so the outgoing one keeps its element while it
              fades and the incoming one starts its own fade. */}
          <Image
            key={currentSlide.src}
            src={currentSlide.src}
            alt={currentSlide.alt}
            fill
            sizes={homeSizes(currentSlide)}
            className={`home-slide-layer object-contain ${
              previousSlide ? "home-slide-enter" : ""
            }`}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          {previousSlide ? (
            <Image
              key={previousSlide.src}
              src={previousSlide.src}
              alt=""
              fill
              sizes={homeSizes(previousSlide)}
              aria-hidden="true"
              className="home-slide-layer home-slide-exit object-contain"
              loading="eager"
              decoding="async"
              onAnimationEnd={clearPrevious}
            />
          ) : null}
        </div>

        {/* A fixed width, so the controls stay put whatever the photo's shape. */}
        <figcaption className="mx-auto mt-4 flex w-full max-w-[36rem] items-center justify-between gap-4 text-sm">
          <Link
            href={currentSlide.href}
            className="inline-flex items-center text-muted transition-colors hover:text-accent pointer-coarse:min-h-11"
          >
            {currentSlide.albumLabel}
          </Link>
          <div className="flex items-center gap-2 text-muted">
            <button
              type="button"
              onClick={() => stepSlide(-1)}
              className={controlClass}
              aria-label="Previous homepage image"
              aria-keyshortcuts="ArrowLeft"
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => stepSlide(1)}
              className={controlClass}
              aria-label="Next homepage image"
              aria-keyshortcuts="ArrowRight"
            >
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
