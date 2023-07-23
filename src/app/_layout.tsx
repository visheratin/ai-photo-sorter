import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { dir } from "i18next";
import { languages } from "./i18n/settings";
import HeaderComponent from "@/components/header";
import { useTranslation } from "./i18n";
import { Metadata } from "next";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({
  params,
}: {
  params: { lng: string };
}): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lng, "metadata");
  const metadata = {
    title: t("title"),
    description: t("description"),
    manifest: "/manifest.json",
    metadataBase: new URL("https://www.organizewith.ai/"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.organizewith.ai/",
      images: [
        {
          url: "https://www.organizewith.ai/og.jpg",
          width: 1024,
          height: 622,
        },
      ],
      locale: t("locale"),
      type: "website",
    },
    twitter: {
      title: t("title"),
      description: t("description"),
      card: "summary_large_image",
      creator: "@visheratin",
      images: "https://www.organizewith.ai/og.jpg",
    },
  };
  return metadata;
}

export default function RootLayout({ children, params: { lng } }) {
  console.log("lng", lng);
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className="min-h-screen bg-background">
        <HeaderComponent />
        <main className="relative flex min-h-screen flex-col">{children}</main>
      </body>
      <Analytics />
    </html>
  );
}
