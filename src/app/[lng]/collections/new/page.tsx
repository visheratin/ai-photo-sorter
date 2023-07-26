import { useTranslation } from "@/app/i18n";
import ClassListComponent from "@/components/classList";
import { ImageClass } from "@/lib/class";

export default async function New({ params }: { params: { lng: string } }) {
  const { t } = await useTranslation(params.lng, "collections");
  const data: ImageClass[] = [
    {
      id: "1",
      name: "Class 1",
      prompts: [],
    },
    {
      id: "2",
      name: "Class 2",
      prompts: [],
    },
  ];
  return (
    <div className="container-full px-10 pt-3">
      <div className="grid gap-4 md:grid-cols-6 mt-4">
        <div>
          <ClassListComponent data={data} lng={params.lng} />
        </div>
      </div>
    </div>
  );
}
