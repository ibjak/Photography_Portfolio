"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { Gallery, ImageItem } from "@/lib/portfolio";

type GalleryViewMode = "wall" | "sequence" | "slideshow";

const EXHIBITION_WALL_WIDTH = 320;
const EXHIBITION_WALL_HEIGHT = 170;

const JAIMA_EDITORIAL_PLACEMENTS = [
  "md:col-span-10 md:col-start-2",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6",
  "md:col-span-6 md:col-start-4",
] as const;

const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length;

function ViewModeButton({
  active,
  children,
  icon,
  onClick,
  separated = false,
}: {
  active: boolean;
  children: ReactNode;
  icon: ReactNode;
  onClick: () => void;
  separated?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-14 min-w-[4.75rem] flex-col items-center justify-center gap-1 px-2 py-1.5 text-[11px] leading-none transition-colors ${
        separated ? "border-l border-line" : ""
      } ${
        active
          ? "bg-[#1d1a16] text-white"
          : "bg-white text-muted hover:text-accent"
      }`}
      aria-pressed={active}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

function WallIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="2.5" y="5" width="7" height="6" />
      <rect x="13" y="3" width="8.5" height="8" />
      <rect x="6" y="14" width="10" height="7" />
    </svg>
  );
}

function SequenceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="8" height="6" />
      <rect x="13" y="3" width="8" height="10" />
      <rect x="3" y="11" width="8" height="10" />
      <rect x="13" y="15" width="8" height="6" />
    </svg>
  );
}

function SlideshowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="14" />
      <path d="m6.5 16 4-4 3 3 2-2 2 2" />
    </svg>
  );
}

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
      <div className="grid gap-4 font-sans text-[14px] leading-6 text-black [text-align:justify] md:text-[15px] md:leading-7">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export default function GalleryViewer({ gallery }: { gallery: Gallery }) {
  const isExhibitionGallery = gallery.layout === "exhibition-wall";
  const [viewMode, setViewMode] = useState<GalleryViewMode>(
    isExhibitionGallery ? "wall" : "sequence",
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const normalizedSlideIndex = gallery.images.length
    ? wrapIndex(slideIndex, gallery.images.length)
    : 0;
  const currentImage = gallery.images[normalizedSlideIndex] ?? null;

  useEffect(() => {
    if (viewMode !== "slideshow" || gallery.images.length === 0) {
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
      setSlideIndex((index) => index + (event.key === "ArrowLeft" ? -1 : 1));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gallery.images.length, viewMode]);

  const selectImage = (index: number) => {
    setSlideIndex(index);
    setViewMode("slideshow");
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
                active={viewMode === "wall"}
                icon={<WallIcon />}
                onClick={() => setViewMode("wall")}
              >
                Wall
              </ViewModeButton>
            ) : null}
            <ViewModeButton
              active={viewMode === "sequence"}
              icon={<SequenceIcon />}
              onClick={() => setViewMode("sequence")}
              separated={isExhibitionGallery}
            >
              {isExhibitionGallery ? "Grid" : "Sequence"}
            </ViewModeButton>
            <ViewModeButton
              active={viewMode === "slideshow"}
              icon={<SlideshowIcon />}
              onClick={() => setViewMode("slideshow")}
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

      {viewMode === "wall" && isExhibitionGallery ? (
        <ExhibitionWall images={gallery.images} onSelect={selectImage} />
      ) : viewMode === "sequence" ? (
        isExhibitionGallery ? (
          <JaimaEditorialSequence images={gallery.images} onSelect={selectImage} />
        ) : (
          <PhotoSequence images={gallery.images} onSelect={selectImage} />
        )
      ) : (
        <Slideshow
          currentImage={currentImage}
          currentIndex={normalizedSlideIndex}
          imageCount={gallery.images.length}
          onNext={() => setSlideIndex((index) => index + 1)}
          onPrevious={() => setSlideIndex((index) => index - 1)}
        />
      )}

      {isExhibitionGallery && gallery.introParagraphs?.length ? (
        <div className="mx-auto mt-6 w-full max-w-5xl bg-glass p-5 md:p-7">
          <ProjectStatement paragraphs={gallery.introParagraphs} withRule={false} />
        </div>
      ) : null}
    </section>
  );
}

function PhotoSequence({
  images,
  onSelect,
}: {
  images: readonly ImageItem[];
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16"
      aria-label="Photo sequence"
    >
      {images.map((image, index) => (
        <figure
          key={image.src}
          className={`w-full overflow-hidden ${
            index === 0 ? "md:col-span-2 md:mx-auto md:max-w-[78%]" : ""
          }`}
        >
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
              sizes={
                index === 0
                  ? "(max-width: 767px) calc(100vw - 3rem), 65vw"
                  : "(max-width: 767px) calc(100vw - 3rem), 40vw"
              }
              className="block h-auto w-full"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : undefined}
              decoding="async"
            />
          </button>
        </figure>
      ))}
    </div>
  );
}

function Slideshow({
  currentImage,
  currentIndex,
  imageCount,
  onNext,
  onPrevious,
}: {
  currentImage: ImageItem | null;
  currentIndex: number;
  imageCount: number;
  onNext: () => void;
  onPrevious: () => void;
}) {
  if (!currentImage) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-center">
      <figure className="inline-flex max-w-full flex-col items-end gap-3">
        <Image
          src={currentImage.src}
          alt={currentImage.alt}
          width={currentImage.width}
          height={currentImage.height}
          sizes="(max-width: 767px) calc(100vw - 3rem), calc(100vw - 20rem)"
          className="block h-auto w-auto max-h-[68vh] max-w-full"
          loading="eager"
          decoding="async"
        />
        <figcaption className="w-full text-sm text-muted">
          <div className="flex w-full items-center justify-between gap-4">
            <button
              type="button"
              onClick={onPrevious}
              className="inline-flex min-h-11 min-w-11 items-center gap-1 border-0 bg-transparent p-0 text-sm text-muted transition-colors hover:text-accent lg:min-h-0 lg:min-w-0"
              aria-label="Previous photo"
              aria-keyshortcuts="ArrowLeft"
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <span className="text-xs tabular-nums" aria-live="polite">
              <span className="sr-only">Photo </span>
              {currentIndex + 1} / {imageCount}
            </span>
            <button
              type="button"
              onClick={onNext}
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
}: {
  images: readonly ImageItem[];
  onSelect: (index: number) => void;
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
                  loading={index < 4 ? "eager" : "lazy"}
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

function JaimaEditorialSequence({
  images,
  onSelect,
}: {
  images: readonly ImageItem[];
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-12 md:gap-x-10 md:gap-y-16"
      aria-label="Jaima editorial photo sequence"
    >
      {images.map((image, index) => (
        <figure
          key={image.src}
          className={`m-0 self-start ${
            JAIMA_EDITORIAL_PLACEMENTS[index] ?? "md:col-span-6"
          }`}
        >
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
              sizes="(max-width: 767px) calc(100vw - 3rem), 45vw"
              className="block h-auto w-full"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : undefined}
              decoding="async"
            />
          </button>
        </figure>
      ))}
    </div>
  );
}
