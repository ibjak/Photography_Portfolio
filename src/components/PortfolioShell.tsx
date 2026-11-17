"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { contact, presences } from "@/lib/portfolio";

export type NavigationItem = {
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
  children: ReactNode;
  navigationGroups: readonly NavigationGroupView[];
};

// Rows grow to a comfortable 44px wherever the pointer is a finger.
const navLinkClass = (active: boolean) =>
  `flex items-center font-sans text-[13px] leading-5 tracking-[0.015em] transition-colors hover:text-accent pointer-coarse:min-h-11 ${
    active ? "text-accent underline underline-offset-4" : "text-ink"
  }`;

const contactLinkClass =
  "inline-flex items-center text-ink transition-colors hover:text-accent pointer-coarse:min-h-11";

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
            className="flex h-8 w-7 items-center justify-start transition-opacity hover:opacity-60 pointer-coarse:h-11 pointer-coarse:w-11"
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
        <a href={contact.phoneHref} className={contactLinkClass}>
          {contact.phoneLabel}
        </a>
        <a href={`mailto:${contact.email}`} className={contactLinkClass}>
          {contact.email}
        </a>
      </address>
      <div className="mt-4 text-xs text-muted">
        © {currentYear} Ivan Badanjak. All rights reserved.
      </div>
    </footer>
  );
}

// Rendered once by the root layout, so it stays in place while pages change.
export default function PortfolioShell({
  children,
  navigationGroups,
  ...contactDetails
}: PortfolioShellProps) {
  const pathname = usePathname();
  // Remembering the page the phone menu was opened on closes it on navigation.
  const [menuOpenedOn, setMenuOpenedOn] = useState<string | null>(null);
  const isMobileNavOpen = menuOpenedOn === pathname;
  const closeMobileNav = () => setMenuOpenedOn(null);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="flex w-full flex-1 flex-col gap-12 px-6 pb-12 pt-6 md:flex-row md:gap-12 md:px-10 lg:gap-16 lg:pb-16">
        {/* When the screen is shorter than the sidebar (a phone held sideways),
            the sidebar scrolls on its own. The padding and matching negative
            margin leave room for focus outlines inside the scrolling box. */}
        <aside className="w-full md:sticky md:top-6 md:-m-2 md:h-fit md:max-h-[calc(100dvh-2rem)] md:w-44 md:flex-none md:self-start md:overflow-y-auto md:p-2 md:[scrollbar-width:thin] lg:w-52">
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
                onClick={() => setMenuOpenedOn(isMobileNavOpen ? null : pathname)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-line text-ink transition-colors hover:text-accent md:hidden"
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
              <nav className="mt-7 grid gap-6" aria-label="Portfolio">
                {navigationGroups.map((group) => (
                  <div key={group.key}>
                    <p
                      id={`nav-${group.key}`}
                      className="font-sans text-[11px] leading-5 tracking-[0.14em] text-muted uppercase"
                    >
                      {group.title}
                    </p>
                    <ul
                      className="mt-1.5 grid gap-1.5 pointer-coarse:mt-0 pointer-coarse:gap-0"
                      aria-labelledby={`nav-${group.key}`}
                    >
                      {group.items.map((item) => {
                        const isActive = item.href === pathname;

                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={navLinkClass(isActive)}
                              aria-current={isActive ? "page" : undefined}
                              onClick={closeMobileNav}
                            >
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                <Link
                  href="/about"
                  className={navLinkClass(pathname === "/about")}
                  aria-current={pathname === "/about" ? "page" : undefined}
                  onClick={closeMobileNav}
                >
                  About
                </Link>
              </nav>

              <ContactFooter className="mt-12" {...contactDetails} />
            </div>
          </div>
        </aside>

        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 outline-none"
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

        {/* On phones the sidebar footer only shows inside the open menu, so the
            contact details are repeated here, after the content. */}
        <ContactFooter
          className="border-t border-line pt-8 md:hidden"
          {...contactDetails}
        />
      </div>
    </div>
  );
}
