import type { Metadata } from "next";
import {
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
