"use client";
import { useTranslation } from "@/app/i18n/client";
import { Database } from "@/lib/database";
import { useEffect } from "react";

export default function CollectionsPage({
  params,
}: {
  params: { lng: string };
}) {
  const { t } = useTranslation(params.lng, "collections");

  const load = async () => {
    const collections = await Database.listCollections();
    console.log(collections);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container pt-10">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <div className="grid gap-4 md:grid-cols-4 mt-4"></div>
    </div>
  );
}
