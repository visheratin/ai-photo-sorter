import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "AI photo sorter",
  description: "Organize your photos using the power of neural networks",
  manifest: "/manifest.json",
  keywords: [
    "AI photo",
    "photo organizer",
    "sort photos",
    "photo sorter",
    "AI photo sorter",
  ],
  metadataBase: new URL("https://www.organizewith.ai/"),
  openGraph: {
    title: "AI photo sorter",
    description: "Organize your photos using the power of neural networks",
    url: "https://www.organizewith.ai/",
    images: [
      {
        url: "https://www.organizewith.ai/og.jpg",
        width: 1024,
        height: 622,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@visheratin",
    images: "https://www.organizewith.ai/og.jpg",
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
