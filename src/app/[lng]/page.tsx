import { useTranslation } from "@/app/i18n";

export default async function Page({ params }: { params: { lng: string } }) {
  const { t } = await useTranslation(params.lng);
  return <div>{t("title")}</div>;
}
