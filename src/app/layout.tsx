import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ivan Badanjak - Photographer",
  description: "Portfolio of visual stories, portraiture, and interiors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
