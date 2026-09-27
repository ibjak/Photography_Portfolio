"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { HomeSlide } from "@/lib/portfolio";
import { useArrowKeys, useMediaQuery, useSwipe, wrapIndex } from "./hooks";

const AUTOPLAY_INTERVAL_MS = 4200;
const TRANSITION_CLEANUP_MS = 1400;

type HomeSlideshowProps = {
  slides: readonly HomeSlide[];
};

export default function HomeSlideshow({ slides }: HomeSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const allowsMotion =
    useMediaQuery("(prefers-reduced-motion: no-preference)") === true;

  const stepSlide = useCallback(
    (delta: number) => {
      setCurrentIndex((index) => {
        setPreviousIndex(index);
        return wrapIndex(index + delta, slides.length);
      });
    },
    [slides.length],
  );

  const swipeHandlers = useSwipe(stepSlide);

  useArrowKeys(stepSlide, slides.length > 1);

  useEffect(() => {
    if (isPaused || !allowsMotion || slides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(
      () => stepSlide(1),
      AUTOPLAY_INTERVAL_MS,
    );
    return () => window.clearInterval(intervalId);
  }, [allowsMotion, isPaused, slides.length, stepSlide]);

  useEffect(() => {
    if (previousIndex === null) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setPreviousIndex(null),
      TRANSITION_CLEANUP_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [previousIndex]);

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[currentIndex];
  const previousSlide = previousIndex === null ? null : slides[previousIndex];

  return (
    <section
      className="flex h-full items-center justify-center"
      aria-labelledby="home-title"
    >
      <h1 id="home-title" className="sr-only">
        Ivan Badanjak Photography
      </h1>
      <figure
        className="inline-flex max-w-full flex-col gap-4"
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
          className="relative inline-block max-w-full overflow-hidden"
          {...swipeHandlers}
        >
          <Image
            src={currentSlide.src}
            alt={currentSlide.alt}
            width={currentSlide.width}
            height={currentSlide.height}
            sizes="(max-width: 767px) calc(100vw - 3rem), calc(100vw - 20rem)"
            className={`home-slide-layer block h-auto w-auto max-h-[74vh] max-w-full object-contain ${
              previousSlide ? "home-slide-enter" : ""
            }`}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          {previousSlide ? (
            <div className="home-slide-layer home-slide-exit absolute inset-0 flex items-center justify-center">
              <Image
                src={previousSlide.src}
                alt=""
                width={previousSlide.width}
                height={previousSlide.height}
                sizes="(max-width: 767px) calc(100vw - 3rem), calc(100vw - 20rem)"
                aria-hidden="true"
                className="h-auto w-auto max-h-[74vh] max-w-full object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          ) : null}
        </div>

        <figcaption className="flex w-full flex-wrap items-center justify-between gap-4 text-sm">
          <Link
            href={currentSlide.href}
            className="inline-flex min-h-11 items-center border-0 bg-transparent p-0 text-muted transition-colors hover:text-accent lg:min-h-0"
          >
            {currentSlide.albumLabel}
          </Link>
          <div className="flex items-center gap-2 text-muted">
            <button
              type="button"
              onClick={() => stepSlide(-1)}
              className="min-h-11 min-w-11 border-0 bg-transparent p-0 text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
              aria-label="Previous homepage image"
              aria-keyshortcuts="ArrowLeft"
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => stepSlide(1)}
              className="min-h-11 min-w-11 border-0 bg-transparent p-0 text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
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
