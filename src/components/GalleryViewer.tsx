"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { Gallery, ImageItem } from "@/lib/portfolio";
import {
  closePhoto,
  fadeInOnLoad,
  openPhoto,
  showPhoto,
  useLoadedSlide,
  useMediaQuery,
  useOpenPhoto,
  useSlideKeys,
  useSwipe,
  wrapIndex,
} from "./hooks";

type BaseView = "wall" | "sequence";

// The grid version of a photo, shown instantly while the slideshow's larger
// version of the same photo downloads.
type Placeholder = { index: number; src: string };

const EXHIBITION_WALL_WIDTH = 320;
const EXHIBITION_WALL_HEIGHT = 170;
const PHONE_QUERY = "(max-width: 767px)";

// Every other Jaima grid photo spans half the row.
const JAIMA_EDITORIAL_PLACEMENTS: Partial<Record<number, string>> = {
  0: "md:col-span-10 md:col-start-2",
  13: "md:col-span-6 md:col-start-4",
};

// Mirrors .photo-stage in globals.css: the photo is as large as fits the
// column and the screen height left under the title and controls.
const slideshowSizes = (image: ImageItem) =>
  `(max-width: 767px) calc(100vw - 3rem), min(calc(100vw - 20rem), calc((100vh - 14rem) * ${(
    image.width / image.height
  ).toFixed(4)}))`;

const photoButtonLabel = (image: ImageItem, index: number, count: number) =>
  `Photo ${index + 1} of ${count}: ${image.alt.replace(/[.\s]+$/, "")}. Open in slideshow.`;

// "desktop" and "phone" mark the selected view before hydration, when
// Jaima's default view is chosen by CSS breakpoint.
const viewModeButtonStates = {
  on: "text-accent underline",
  off: "text-muted hover:text-accent",
  desktop: "text-muted max-md:hover:text-accent md:text-accent md:underline",
  phone: "text-accent underline md:text-muted md:no-underline md:hover:text-accent",
};

const controlClass =
  "inline-flex items-center gap-1 text-muted transition-colors hover:text-accent pointer-coarse:min-h-11 pointer-coarse:min-w-11";

function ViewModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean | "desktop" | "phone";
  children: ReactNode;
  onClick: () => void;
}) {
  const state = active === true ? "on" : active === false ? "off" : active;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center underline-offset-4 transition-colors pointer-coarse:min-h-11 ${viewModeButtonStates[state]}`}
      aria-pressed={active === true}
    >
      {children}
    </button>
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
      className={`mx-auto max-w-[34rem] ${
        withRule ? "border-t border-line pt-5" : ""
      }`}
    >
      <div className="grid gap-4 font-sans text-[14px] leading-6 text-justify text-pretty hyphens-auto [text-align-last:center] md:text-[15px] md:leading-7">
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
  const [chosenBaseView, setChosenBaseView] = useState<BaseView | null>(null);
  const [placeholder, setPlaceholder] = useState<Placeholder | null>(null);
  const isPhone = useMediaQuery(PHONE_QUERY);
  const openIndex = useOpenPhoto(images.length);
  const isSlideshow = openIndex !== null;
  // Jaima opens on the wall, except on phones where its prints are too small
  // to read. Until the viewport is known, CSS shows the right one (no flash).
  const defaultBaseView = !isExhibitionGallery
    ? "sequence"
    : isPhone === null
      ? null
      : isPhone
        ? "sequence"
        : "wall";
  const baseView = chosenBaseView ?? defaultBaseView;
  const isUndecided = baseView === null;
  const lastOpenIndex = useRef(0);
  const wasSlideshow = useRef(false);

  const stepSlide = (delta: number) =>
    showPhoto(wrapIndex((openIndex ?? 0) + delta, images.length));

  useSlideKeys(stepSlide, isSlideshow, closePhoto);

  useEffect(() => {
    if (openIndex !== null) {
      lastOpenIndex.current = openIndex;
      wasSlideshow.current = true;
      return;
    }

    if (!wasSlideshow.current) {
      return;
    }

    // Back in the gallery: return to the photo that was last on screen.
    wasSlideshow.current = false;
    const position = lastOpenIndex.current + 1;
    const button = document.querySelector<HTMLElement>(
      `#photo-${position} button, #print-${position} button`,
    );
    button?.focus({ preventScroll: true });
    button?.scrollIntoView({ block: "center" });
    // openPhoto switched this off for the trip into the slideshow and back.
    window.history.scrollRestoration = "auto";
  }, [openIndex]);

  const selectImage = (index: number, thumbnail: HTMLImageElement | null) => {
    setPlaceholder(
      thumbnail?.currentSrc ? { index, src: thumbnail.currentSrc } : null,
    );
    openPhoto(index);
  };

  const chooseBaseView = (view: BaseView) => {
    setChosenBaseView(view);
    if (isSlideshow) {
      closePhoto();
    }
  };

  const statement = gallery.introParagraphs?.length
    ? gallery.introParagraphs
    : null;

  return (
    <section className="scroll-mt-6" aria-labelledby="gallery-title">
      <div className="flex flex-col items-center gap-1 text-center lg:gap-2">
        <h1
          id="gallery-title"
          className="font-display text-[1.75rem] leading-tight tracking-[-0.01em] text-balance sm:text-[2rem]"
        >
          {gallery.title}
        </h1>
        <div
          className="flex items-center gap-2 text-[13px] tracking-[0.015em] text-muted"
          role="group"
          aria-label="Gallery view"
        >
          {isExhibitionGallery ? (
            <>
              <ViewModeButton
                active={
                  isSlideshow ? false : isUndecided ? "desktop" : baseView === "wall"
                }
                onClick={() => chooseBaseView("wall")}
              >
                Wall
              </ViewModeButton>
              <span aria-hidden="true">/</span>
            </>
          ) : null}
          <ViewModeButton
            active={
              isSlideshow ? false : isUndecided ? "phone" : baseView === "sequence"
            }
            onClick={() => chooseBaseView("sequence")}
          >
            {isExhibitionGallery ? "Grid" : "Sequence"}
          </ViewModeButton>
          <span aria-hidden="true">/</span>
          <ViewModeButton
            active={isSlideshow}
            onClick={() => {
              if (!isSlideshow) {
                setPlaceholder(null);
                openPhoto(lastOpenIndex.current);
              }
            }}
          >
            Slideshow
          </ViewModeButton>
        </div>
      </div>

      {/* Above the photos in the sequence; below the photo in the slideshow,
          so the photo always fits the screen. */}
      {statement && !isExhibitionGallery && !isSlideshow ? (
        <div className="mx-auto mt-8 w-full max-w-5xl">
          <ProjectStatement paragraphs={statement} />
        </div>
      ) : null}

      {isSlideshow ? (
        <Slideshow
          images={images}
          index={openIndex}
          placeholder={placeholder}
          onStep={stepSlide}
        />
      ) : null}
      {!isSlideshow && isExhibitionGallery && (isUndecided || baseView === "wall") ? (
        <div className={isUndecided ? "max-md:hidden" : undefined}>
          <ExhibitionWall
            images={images}
            onSelect={selectImage}
            eager={!isUndecided}
          />
        </div>
      ) : null}
      {!isSlideshow && (isUndecided || baseView === "sequence") ? (
        <div className={isUndecided ? "md:hidden" : undefined}>
          <PhotoSequence
            images={images}
            onSelect={selectImage}
            editorial={isExhibitionGallery}
            eager={!isUndecided}
          />
        </div>
      ) : null}

      {statement && isExhibitionGallery ? (
        <div className="mx-auto mt-6 w-full max-w-5xl p-5 md:p-7">
          <ProjectStatement paragraphs={statement} withRule={false} />
        </div>
      ) : null}
      {statement && !isExhibitionGallery && isSlideshow ? (
        <div className="mx-auto mt-10 w-full max-w-5xl">
          <ProjectStatement paragraphs={statement} />
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
  onSelect: (index: number, thumbnail: HTMLImageElement | null) => void;
  editorial: boolean;
  eager: boolean;
}) {
  return (
    <div
      className={`mx-auto mt-8 grid grid-cols-1 gap-x-8 gap-y-12 md:gap-x-10 md:gap-y-16 ${
        editorial ? "max-w-6xl md:grid-cols-12" : "max-w-5xl md:grid-cols-2"
      }`}
      role="list"
      aria-label="Photographs"
    >
      {images.map((image, index) => {
        const isLead = index === 0;
        const placement = editorial
          ? (JAIMA_EDITORIAL_PLACEMENTS[index] ?? "md:col-span-6")
          : isLead
            ? "md:col-span-2 md:mx-auto md:max-w-[78%]"
            : "";
        // The width each photo is shown at on desktop, capped where its grid
        // stops growing, so large screens don't download more than they show.
        const desktopWidth = editorial
          ? isLead
            ? "min(75vw, 60rem)"
            : "min(40vw, 35rem)"
          : isLead
            ? "min(65vw, 50rem)"
            : "min(40vw, 31rem)";
        const isPriority = isLead && eager;

        return (
          <figure
            key={image.src}
            id={`photo-${index + 1}`}
            className={`w-full self-start ${placement}`}
            role="listitem"
          >
            <button
              type="button"
              onClick={(event) =>
                onSelect(index, event.currentTarget.querySelector("img"))
              }
              className="block w-full cursor-zoom-in bg-wash"
              aria-label={photoButtonLabel(image, index, images.length)}
            >
              <Image
                ref={isPriority ? undefined : fadeInOnLoad}
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes={`(max-width: 767px) calc(100vw - 3rem), ${desktopWidth}`}
                className="photo-fade block h-auto w-full"
                loading={isPriority ? "eager" : "lazy"}
                fetchPriority={isPriority ? "high" : undefined}
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
  images,
  index,
  placeholder,
  onStep,
}: {
  images: readonly ImageItem[];
  index: number;
  placeholder: Placeholder | null;
  onStep: (delta: number) => void;
}) {
  // `index` is the photo asked for; `shown` trails it until that photo has
  // downloaded, so the frame never goes blank between photos.
  const { shown, isWaiting } = useLoadedSlide(images, index, slideshowSizes);
  const image = images[shown];
  const swipeHandlers = useSwipe(onStep);
  const nextButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // The grid may have been scrolled a long way down; start at the title.
    nextButton.current?.closest("section")?.scrollIntoView({ block: "start" });

    // Opening the slideshow removes the photo button that had focus, so carry
    // on from "Next". A direct link to a photo leaves focus at the page top.
    if (window.history.state?.openedFromGallery === true) {
      nextButton.current?.focus({ preventScroll: true });
    }
  }, []);

  return (
    <div className="mt-2 lg:mt-3">
      {/* Above the photo and a fixed width, so the controls never move. */}
      <div className="mx-auto flex max-w-[19rem] items-center justify-between text-[13px] tracking-[0.015em] text-muted">
        <button
          type="button"
          onClick={() => onStep(-1)}
          className={controlClass}
          aria-label="Previous photo"
          aria-keyshortcuts="ArrowLeft"
        >
          <span aria-hidden="true">←</span> Previous
        </button>
        <span className="text-xs tabular-nums" aria-live="polite">
          <span className="sr-only">Photo </span>
          {index + 1} / {images.length}
        </span>
        <button
          ref={nextButton}
          type="button"
          onClick={() => onStep(1)}
          className={`${controlClass} justify-end`}
          aria-label="Next photo"
          aria-keyshortcuts="ArrowRight"
        >
          Next <span aria-hidden="true">→</span>
        </button>
      </div>

      <figure className="mt-4" {...swipeHandlers}>
        <div
          className="photo-stage"
          data-waiting={isWaiting || undefined}
          style={
            { "--photo-ratio": `${image.width} / ${image.height}` } as CSSProperties
          }
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={slideshowSizes(image)}
            className="slide-photo object-contain"
            style={
              placeholder?.index === shown
                ? {
                    backgroundImage: `url("${placeholder.src}")`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "contain",
                  }
                : undefined
            }
            loading="eager"
            // The photo was decoded while it preloaded, so it can be painted
            // in the same frame it is swapped in.
            decoding="sync"
          />
        </div>
        {image.caption ? (
          // The caption is also the photo's description, so screen readers
          // already have it from the image.
          <figcaption
            className="mx-auto mt-3 max-w-[36rem] text-center text-[13px] leading-5 text-pretty text-muted"
            aria-hidden="true"
          >
            {image.caption}
          </figcaption>
        ) : null}
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
  onSelect: (index: number, thumbnail: HTMLImageElement | null) => void;
  eager: boolean;
}) {
  return (
    <div className="exhibition-wall-scroll mx-auto mt-6 max-w-[82rem] overflow-x-auto pb-4">
      <div
        className="exhibition-wall"
        style={{
          aspectRatio: `${EXHIBITION_WALL_WIDTH} / ${EXHIBITION_WALL_HEIGHT}`,
        }}
        role="list"
        aria-label="Jaima exhibition wall"
      >
        {images.map((image, index) => {
          if (!image.wallPlacement) {
            return null;
          }

          const { x, y, width, height } = image.wallPlacement;
          const share = width / EXHIBITION_WALL_WIDTH;
          const style = {
            "--x": `${(x / EXHIBITION_WALL_WIDTH) * 100}%`,
            "--y": `${(y / EXHIBITION_WALL_HEIGHT) * 100}%`,
            "--w": `${share * 100}%`,
            "--h": `${(height / EXHIBITION_WALL_HEIGHT) * 100}%`,
          } as CSSProperties;
          const isPriority = eager && index < 4;

          return (
            <figure
              key={image.src}
              id={`print-${index + 1}`}
              className="exhibition-wall-print"
              style={style}
              role="listitem"
            >
              <button
                type="button"
                onClick={(event) =>
                  onSelect(index, event.currentTarget.querySelector("img"))
                }
                className="block h-full w-full"
                aria-label={photoButtonLabel(image, index, images.length)}
              >
                <Image
                  ref={isPriority ? undefined : fadeInOnLoad}
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  // This print's share of the wall: 780px wide on phones,
                  // otherwise the column, between 640px and 82rem.
                  sizes={`(max-width: 767px) ${Math.ceil(780 * share)}px, clamp(${Math.ceil(
                    640 * share,
                  )}px, calc((100vw - 20rem) * ${share.toFixed(4)}), ${Math.ceil(1312 * share)}px)`}
                  className="photo-fade h-full w-full object-cover"
                  loading={isPriority ? "eager" : "lazy"}
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
