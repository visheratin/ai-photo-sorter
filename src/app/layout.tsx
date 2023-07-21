import Head from "next/head";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "AI photo organizer",
  description: "Organize your photos using the power of neural networks",
  manifest: "/manifest.json",
  keywords: [
    "AI photo",
    "photo organizer",
    "sort photos",
    "photo sorter",
    "AI photo organizer",
    "AI photo organizer",
  ],
  metadataBase: new URL("https://www.organizewith.ai/"),
  openGraph: {
    title: "AI photo organizer",
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
      <Head>
        <meta name="application-name" content="AI photo organizer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI photo organizer" />
        <meta
          name="description"
          content="Organize your photos using the power of neural networks"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.organizewith.ai/" />
        <meta name="twitter:title" content="AI photo organizer" />
        <meta
          name="twitter:description"
          content="Organize your photos using the power of neural networks"
        />
        <meta
          name="twitter:image"
          content="https://www.organizewith.ai/og.jpg"
        />
        <meta name="twitter:creator" content="@visheratin" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AI photo organizer" />
        <meta
          property="og:description"
          content="Organize your photos using the power of neural networks"
        />
        <meta property="og:site_name" content="AI photo organizer" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta
          property="og:image"
          content="https://www.organizewith.ai/og.jpg"
        />
      </Head>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
