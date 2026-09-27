"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { contact, GalleryKey, presences } from "@/lib/portfolio";

export type NavigationItem = {
  galleryKey: GalleryKey;
  href: string;
  label: string;
};

export type NavigationGroupView = {
  key: string;
  title: string;
  items: readonly NavigationItem[];
};

type ContactDetails = {
  contact: typeof contact;
  currentYear: number;
  presences: typeof presences;
};

type PortfolioShellProps = ContactDetails & {
  activeGalleryKey: GalleryKey | null;
  children: ReactNode;
  isAboutView: boolean;
  navigationGroups: readonly NavigationGroupView[];
};

const navLinkClass = (active: boolean) =>
  `flex min-h-11 items-center border-0 bg-transparent p-0 text-left font-sans text-[13px] leading-5 font-normal tracking-[0.015em] transition-colors hover:text-[#0B2A6F] lg:block lg:min-h-0 ${
    active ? "text-accent underline underline-offset-4" : "text-[#534941]"
  }`;

function DisclosureIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="h-3 w-3 shrink-0 transition-transform group-open:rotate-180"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
    >
      <path d="m2.5 4.25 3.5 3.5 3.5-3.5" />
    </svg>
  );
}

function ContactFooter({
  className,
  contact,
  currentYear,
  presences,
}: ContactDetails & { className: string }) {
  return (
    <footer className={className}>
      <div className="flex items-center gap-3">
        {presences.map((presence) => (
          <a
            key={presence.name}
            href={presence.href}
            aria-label={presence.name}
            className="flex h-11 w-11 items-center justify-start lg:h-8 lg:w-7"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={presence.iconSrc}
              alt=""
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          </a>
        ))}
      </div>
      <address className="mt-2 grid gap-1 font-sans text-[12px] leading-[1.45] not-italic">
        <a
          href={contact.phoneHref}
          className="inline-flex min-h-11 items-center text-black transition-colors hover:text-accent lg:min-h-0"
        >
          {contact.phoneLabel}
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex min-h-11 items-center text-black transition-colors hover:text-accent lg:min-h-0"
        >
          {contact.email}
        </a>
      </address>
      <div className="mt-4 text-xs text-muted">
        © {currentYear} Ivan Badanjak. All rights reserved.
      </div>
    </footer>
  );
}

export default function PortfolioShell({
  activeGalleryKey,
  children,
  isAboutView,
  navigationGroups,
  ...contactDetails
}: PortfolioShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="flex w-full flex-1 flex-col gap-12 px-6 pb-12 pt-6 md:flex-row md:gap-12 md:px-10 lg:gap-16 lg:pb-16">
        <aside className="w-full md:sticky md:top-6 md:h-fit md:w-40 md:flex-none md:self-start lg:w-48">
          <div className="mt-4 md:mt-0">
            <div className="mb-4 flex items-center justify-between gap-3 md:block md:pt-2">
              <Link
                href="/"
                className="font-display text-[clamp(1.55rem,7vw,1.9rem)] leading-none font-semibold tracking-[-0.01em] whitespace-nowrap text-ink md:text-[1.9rem] md:leading-[0.95] md:tracking-[-0.015em] md:whitespace-normal lg:text-[2.2rem]"
                onClick={closeMobileNav}
              >
                Ivan Badanjak
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen((open) => !open)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-line text-ink transition-colors hover:text-[#0B2A6F] md:hidden"
                aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileNavOpen}
                aria-controls="portfolio-navigation"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d={
                      isMobileNavOpen
                        ? "M6 6l12 12M18 6L6 18"
                        : "M4 7h16M4 12h16M4 17h16"
                    }
                  />
                </svg>
              </button>
            </div>

            <div
              id="portfolio-navigation"
              className={isMobileNavOpen ? "md:block" : "hidden md:block"}
            >
              <nav className="mt-7" aria-label="Portfolio">
                {navigationGroups.map((group, index) => {
                  const isGroupActive = group.items.some(
                    (item) => item.galleryKey === activeGalleryKey,
                  );

                  return (
                    <details
                      key={group.key}
                      className={`group ${index > 0 ? "mt-4" : ""}`}
                      open={isGroupActive || undefined}
                    >
                      <summary className="summary-clean flex min-h-11 items-center justify-between gap-3 font-sans text-[13px] leading-5 font-normal tracking-[0.015em] text-[#534941] transition-colors hover:text-[#0B2A6F] lg:min-h-0">
                        <span>{group.title}</span>
                        <DisclosureIcon />
                      </summary>
                      <div className="mt-2 grid gap-2 border-l border-line pl-4">
                        {group.items.map((item) => {
                          const isActive = item.galleryKey === activeGalleryKey;

                          return (
                            <Link
                              key={item.galleryKey}
                              href={item.href}
                              className={navLinkClass(isActive)}
                              aria-current={isActive ? "page" : undefined}
                              onClick={closeMobileNav}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}

                <Link
                  href="/about"
                  className={`mt-4 ${navLinkClass(isAboutView)}`}
                  aria-current={isAboutView ? "page" : undefined}
                  onClick={closeMobileNav}
                >
                  About
                </Link>
              </nav>

              <ContactFooter className="mt-14" {...contactDetails} />
            </div>
          </div>
        </aside>

        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1"
          onContextMenu={(event) => {
            if (
              event.target instanceof Element &&
              event.target.closest("img, figure > button")
            ) {
              event.preventDefault();
            }
          }}
        >
          {children}
        </main>

        {/* On phones the sidebar footer only shows inside the open menu. */}
        <ContactFooter
          className="border-t border-line pt-8 md:hidden"
          {...contactDetails}
        />
      </div>
    </div>
  );
}
