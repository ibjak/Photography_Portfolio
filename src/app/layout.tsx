import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Source_Serif_4 } from "next/font/google";
import PortfolioShell, {
  type NavigationGroupView,
} from "@/components/PortfolioShell";
import {
  contact,
  galleries,
  getGalleryHref,
  navigationGroups,
  presences,
} from "@/lib/portfolio";
import {
  personJsonLd,
  siteDescription,
  siteName,
  siteTitle,
  siteUrl,
} from "@/lib/siteMetadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "photography",
    "documentary photography",
    "photojournalism",
    "portrait photography",
    "Ivan Badanjak",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
};

// Stand-ins for Avenir Next and Iowan Old Style, which only Apple devices
// have. They sit behind those two in the font stacks (globals.css) and are
// not preloaded, so a browser downloads them only when it needs them.
const webSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-web-sans",
});

const webSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-web-serif",
});

// The design is light only; see the note on color-scheme in globals.css.
export const viewport: Viewport = {
  colorScheme: "only light",
};

const navigation: readonly NavigationGroupView[] = navigationGroups.map(
  (group) => ({
    key: group.key,
    title: group.title,
    items: group.galleryKeys.map((galleryKey) => ({
      href: getGalleryHref(galleryKey),
      label: galleries[galleryKey].navLabel,
    })),
  }),
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${webSans.variable} ${webSerif.variable}`}>
      <body>
        <PortfolioShell
          contact={contact}
          currentYear={new Date().getFullYear()}
          navigationGroups={navigation}
          presences={presences}
        >
          {children}
        </PortfolioShell>
        {/* Tells search engines who the site belongs to. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd(presences)).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
      </body>
    </html>
  );
}
