import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "AI photo sorter",
  description: "Organize your photos using the power of neural networks",
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
