"use client";

import Image from "next/image";
import { useState, type CSSProperties, type ReactNode } from "react";
import type { Gallery, ImageItem } from "@/lib/portfolio";
import { useArrowKeys, useMediaQuery, useSwipe, wrapIndex } from "./hooks";

type GalleryViewMode = "wall" | "sequence" | "slideshow";

const EXHIBITION_WALL_WIDTH = 320;
const EXHIBITION_WALL_HEIGHT = 170;
const PHONE_QUERY = "(max-width: 767px)";

// Every other Jaima grid photo spans half the row.
const JAIMA_EDITORIAL_PLACEMENTS: Partial<Record<number, string>> = {
  0: "md:col-span-10 md:col-start-2",
  13: "md:col-span-6 md:col-start-4",
};

// "desktop" and "phone" mark the pressed button before hydration, when
// Jaima's default view is chosen by CSS breakpoint.
const viewModeButtonStates = {
  on: "bg-ink text-white",
  off: "bg-white text-muted hover:text-accent",
  desktop: "bg-white text-muted max-md:hover:text-accent md:bg-ink md:text-white",
  phone: "bg-ink text-white md:bg-white md:text-muted md:hover:text-accent",
};

function ViewModeButton({
  active,
  children,
  icon,
  onClick,
  separated = false,
}: {
  active: boolean | "desktop" | "phone";
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
  separated?: boolean;
}) {
  const state = active === true ? "on" : active === false ? "off" : active;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-14 min-w-[4.75rem] flex-col items-center justify-center gap-1 px-2 py-1.5 text-[11px] leading-none transition-colors ${
        separated ? "border-l border-line" : ""
      } ${viewModeButtonStates[state]}`}
      aria-pressed={active === true}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

function ViewIcon({
  children,
  strokeWidth = 1.5,
}: {
  children: ReactNode;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const wallIcon = (
  <ViewIcon>
    <rect x="2.5" y="5" width="7" height="6" />
    <rect x="13" y="3" width="8.5" height="8" />
    <rect x="6" y="14" width="10" height="7" />
  </ViewIcon>
);

const sequenceIcon = (
  <ViewIcon>
    <rect x="3" y="3" width="8" height="6" />
    <rect x="13" y="3" width="8" height="10" />
    <rect x="3" y="11" width="8" height="10" />
    <rect x="13" y="15" width="8" height="6" />
  </ViewIcon>
);

const slideshowIcon = (
  <ViewIcon strokeWidth={1.75}>
    <rect x="3.5" y="5" width="17" height="14" />
    <path d="m6.5 16 4-4 3 3 2-2 2 2" />
  </ViewIcon>
);

function ProjectStatement({
  paragraphs,
  withRule = true,
}: {
  paragraphs: readonly string[];
  withRule?: boolean;
}) {
  return (
    <div
      className={`mx-auto max-w-[44rem] ${
        withRule ? "border-t border-line pt-5" : ""
      }`}
    >
      <div className="grid gap-4 font-sans text-[14px] leading-6 text-pretty text-black md:text-[15px] md:leading-7">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export default function GalleryViewer({ gallery }: { gallery: Gallery }) {
  const { images } = gallery;
  const isExhibitionGallery = gallery.layout === "exhibition-wall";
  const [chosenView, setChosenView] = useState<GalleryViewMode | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const isPhone = useMediaQuery(PHONE_QUERY);
  // Jaima opens on the wall, except on phones where its prints are too small
  // to read. Until the viewport is known, CSS shows the right one (no flash).
  const defaultView = !isExhibitionGallery
    ? "sequence"
    : isPhone === null
      ? null
      : isPhone
        ? "sequence"
        : "wall";
  const viewMode = chosenView ?? defaultView;
  const isUndecided = viewMode === null;
  const stepSlide = (delta: number) => setSlideIndex((index) => index + delta);

  useArrowKeys(stepSlide, viewMode === "slideshow");

  const selectImage = (index: number) => {
    setSlideIndex(index);
    setChosenView("slideshow");
  };

  return (
    <section aria-labelledby="gallery-title">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-start">
        <h1
          id="gallery-title"
          className="min-w-0 text-center font-sans text-[1.75rem] leading-tight font-semibold text-black sm:col-start-2 sm:text-3xl"
        >
          {gallery.title}
        </h1>
        <div className="inline-flex shrink-0 justify-self-center sm:col-start-3 sm:row-start-1 sm:justify-self-end">
          <div
            className="inline-flex border border-line bg-white"
            role="group"
            aria-label="Gallery view"
          >
            {isExhibitionGallery ? (
              <ViewModeButton
                active={isUndecided ? "desktop" : viewMode === "wall"}
                icon={wallIcon}
                onClick={() => setChosenView("wall")}
              >
                Wall
              </ViewModeButton>
            ) : null}
            <ViewModeButton
              active={isUndecided ? "phone" : viewMode === "sequence"}
              icon={sequenceIcon}
              onClick={() => setChosenView("sequence")}
              separated={isExhibitionGallery}
            >
              {isExhibitionGallery ? "Grid" : "Sequence"}
            </ViewModeButton>
            <ViewModeButton
              active={viewMode === "slideshow"}
              icon={slideshowIcon}
              onClick={() => setChosenView("slideshow")}
              separated
            >
              Slideshow
            </ViewModeButton>
          </div>
        </div>
      </div>

      {!isExhibitionGallery && gallery.introParagraphs?.length ? (
        <div className="mx-auto mt-8 w-full max-w-5xl">
          <ProjectStatement paragraphs={gallery.introParagraphs} />
        </div>
      ) : null}

      {isExhibitionGallery && (isUndecided || viewMode === "wall") ? (
        <div className={isUndecided ? "max-md:hidden" : undefined}>
          <ExhibitionWall
            images={images}
            onSelect={selectImage}
            eager={!isUndecided}
          />
        </div>
      ) : null}
      {isUndecided || viewMode === "sequence" ? (
        <div className={isUndecided ? "md:hidden" : undefined}>
          <PhotoSequence
            images={images}
            onSelect={selectImage}
            editorial={isExhibitionGallery}
            eager={!isUndecided}
          />
        </div>
      ) : null}
      {viewMode === "slideshow" ? (
        <Slideshow
          image={images[wrapIndex(slideIndex, images.length)]}
          index={wrapIndex(slideIndex, images.length)}
          count={images.length}
          onStep={stepSlide}
        />
      ) : null}

      {isExhibitionGallery && gallery.introParagraphs?.length ? (
        <div className="mx-auto mt-6 w-full max-w-5xl p-5 md:p-7">
          <ProjectStatement paragraphs={gallery.introParagraphs} withRule={false} />
        </div>
      ) : null}
    </section>
  );
}

// `editorial` is Jaima's 12-column grid; other galleries lead with one wide
// photo followed by two columns. `eager` is false while a hidden copy is
// server-rendered, so its first photo doesn't download for nothing.
function PhotoSequence({
  images,
  onSelect,
  editorial,
  eager,
}: {
  images: readonly ImageItem[];
  onSelect: (index: number) => void;
  editorial: boolean;
  eager: boolean;
}) {
  return (
    <div
      className={`mx-auto mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:gap-x-10 md:gap-y-16 ${
        editorial ? "max-w-6xl md:grid-cols-12" : "max-w-5xl md:grid-cols-2"
      }`}
      aria-label={editorial ? "Jaima editorial photo sequence" : "Photo sequence"}
    >
      {images.map((image, index) => {
        const isLead = index === 0;
        const placement = editorial
          ? (JAIMA_EDITORIAL_PLACEMENTS[index] ?? "md:col-span-6")
          : isLead
            ? "md:col-span-2 md:mx-auto md:max-w-[78%]"
            : "";
        const desktopWidth = editorial ? "45vw" : isLead ? "65vw" : "40vw";

        return (
          <figure key={image.src} className={`w-full self-start ${placement}`}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              className="block w-full cursor-zoom-in border-0 bg-transparent p-0"
              aria-label={`Open photo ${index + 1} of ${images.length} in slideshow`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes={`(max-width: 767px) calc(100vw - 3rem), ${desktopWidth}`}
                className="block h-auto w-full"
                loading={isLead && eager ? "eager" : "lazy"}
                fetchPriority={isLead && eager ? "high" : undefined}
                decoding="async"
              />
            </button>
          </figure>
        );
      })}
    </div>
  );
}

function Slideshow({
  image,
  index,
  count,
  onStep,
}: {
  image: ImageItem;
  index: number;
  count: number;
  onStep: (delta: number) => void;
}) {
  const swipeHandlers = useSwipe(onStep);

  return (
    <div className="@container mt-6 flex justify-center">
      <figure
        className="inline-flex max-w-full flex-col items-end gap-3"
        {...swipeHandlers}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 767px) calc(100vw - 3rem), calc(100vw - 20rem)"
          className="block h-auto"
          // An explicit width: with w-auto, retina srcset density math can
          // shrink the photo well below the 80vh it's allowed to fill.
          style={{
            width: `min(100cqw, ${((80 * image.width) / image.height).toFixed(2)}vh)`,
          }}
          loading="eager"
          decoding="async"
        />
        <figcaption className="w-full text-sm text-muted">
          <div className="flex w-full items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onStep(-1)}
              className="inline-flex min-h-11 min-w-11 items-center gap-1 border-0 bg-transparent p-0 text-sm text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
              aria-label="Previous photo"
              aria-keyshortcuts="ArrowLeft"
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <span className="text-xs tabular-nums" aria-live="polite">
              <span className="sr-only">Photo </span>
              {index + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => onStep(1)}
              className="inline-flex min-h-11 min-w-11 items-center justify-end gap-1 border-0 bg-transparent p-0 text-sm text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
              aria-label="Next photo"
              aria-keyshortcuts="ArrowRight"
            >
              Next <span aria-hidden="true">→</span>
            </button>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

function ExhibitionWall({
  images,
  onSelect,
  eager,
}: {
  images: readonly ImageItem[];
  onSelect: (index: number) => void;
  eager: boolean;
}) {
  return (
    <div
      className="exhibition-wall-scroll mx-auto mt-6 max-w-[82rem] overflow-x-auto pb-4"
      aria-label="Scrollable Jaima exhibition wall"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          event.currentTarget.scrollBy({
            left: event.key === "ArrowLeft" ? -96 : 96,
          });
        }
      }}
    >
      <div className="exhibition-wall" aria-label="Jaima exhibition wall layout">
        {images.map((image, index) => {
          if (!image.wallPlacement) {
            return null;
          }

          const { x, y, width, height } = image.wallPlacement;
          const style = {
            "--x": `${(x / EXHIBITION_WALL_WIDTH) * 100}%`,
            "--y": `${(y / EXHIBITION_WALL_HEIGHT) * 100}%`,
            "--w": `${(width / EXHIBITION_WALL_WIDTH) * 100}%`,
            "--h": `${(height / EXHIBITION_WALL_HEIGHT) * 100}%`,
          } as CSSProperties;

          return (
            <figure key={image.src} className="exhibition-wall-print" style={style}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                className="block h-full w-full border-0 bg-transparent p-0"
                aria-label={`Open photo ${index + 1} of ${images.length} in slideshow`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="320px"
                  className="h-full w-full object-cover"
                  loading={eager && index < 4 ? "eager" : "lazy"}
                  decoding="async"
                />
              </button>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
