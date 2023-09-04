import { useTranslation } from "@/app/i18n/client";

export default function CollectionsPage({
  params,
}: {
  params: { lng: string };
}) {
  const { t } = useTranslation(params.lng, "collections");
  return (
    <div className="container pt-10">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <div className="grid gap-4 md:grid-cols-4 mt-4"></div>
    </div>
  );
}
