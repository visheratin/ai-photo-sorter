import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "AI photo sorter",
  description: "Organize your photos using the power of neural networks",
  keywords: [
    "AI photo",
    "photo organizer",
    "sort photos",
    "photo sorter",
    "AI photo sorter",
  ],
  metadataBase: new URL("https://ai-photo-sorter.vercel.app/"),
  openGraph: {
    title: "AI photo sorter",
    description: "Organize your photos using the power of neural networks",
    url: "https://ai-photo-sorter.vercel.app/",
    images: [
      {
        url: "https://ai-photo-sorter.vercel.app/og.jpg",
        width: 1024,
        height: 622,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
