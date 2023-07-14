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
    title: "Guess the images by asking AI",
    description: "Can you align your imagination with AI's vision?",
    url: "https://ai-photo-sorter.vercel.app/",
    siteName: "Ask. Imagine. Guess.",
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
