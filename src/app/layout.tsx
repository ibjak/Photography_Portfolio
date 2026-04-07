import type { Metadata } from "next";
import "./globals.css";

// ✅ Viewport (important for responsiveness)
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// ✅ Global metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://ivanbjak.com"), // FIXED

  title: {
    default: "Ivan Badanjak | Photography",
    template: "%s | Ivan Badanjak",
  },

  description:
    "Documentary photography exploring identity, diaspora, and everyday life.",

  keywords: [
    "photography",
    "documentary photography",
    "photojournalism",
    "portrait photography",
    "Ivan Badanjak",
  ],

  authors: [{ name: "Ivan Badanjak" }],
  creator: "Ivan Badanjak",

  // ✅ Canonical URL (SEO boost)
  alternates: {
    canonical: "https://ivanbjak.com",
  },

  // ✅ Open Graph (for social previews)
  openGraph: {
    title: "Ivan Badanjak | Photography",
    description:
      "Documentary photography exploring identity and diaspora.",
    url: "https://ivanbjak.com",
    siteName: "Ivan Badanjak",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Photography by Ivan Badanjak",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // ✅ Twitter preview
  twitter: {
    card: "summary_large_image",
    title: "Ivan Badanjak | Photography",
    description:
      "Documentary and portrait photography exploring identity and diaspora.",
    images: ["/og-image.jpg"],
  },

  // ✅ Crawling rules
  robots: {
    index: true,
    follow: true,
  },

  // ✅ Favicon
  icons: {
    icon: "/favicon.ico",
  },
};

// ✅ Root layout component (don’t forget this part)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}