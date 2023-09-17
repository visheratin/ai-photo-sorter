"use client";
import { useTranslation } from "@/app/i18n/client";
import { Database } from "@/lib/database";
import { Navigate, useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PhotoGallery from "@/components/gallery";
import { Collection } from "@/lib/collection";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CollectionPage({
  params,
}: {
  params: { lng: string };
}) {
  const { t } = useTranslation(params.lng, "collection");

  const location = useLocation();

  const [alertOpen, setAlertOpen] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  const [collection, setCollection] = useState<Collection>({
    id: "",
    title: "",
    classes: [],
    unsortedFiles: [],
    filesNumber: 0,
    serializedIndex: "",
    dirHandles: [],
    updateTime: 0,
  });

  const [notExists, setNotExists] = useState(false);

  const checkPermissions = async (collection: Collection): Promise<boolean> => {
    const options = { mode: "readwrite" };
    for (const handle of collection.dirHandles) {
      if ((await handle.queryPermission(options)) !== "granted") {
        return false;
      }
    }
    return true;
  };

  const askPermissions = async () => {
    setAlertOpen(false);
    const options = { mode: "readwrite" };
    for (let handle of collection.dirHandles) {
      if ((await handle.requestPermission(options)) !== "granted") {
        setAlertOpen(true);
        return;
      }
    }
    setShowCollection(true);
  };

  const load = async () => {
    const query = new URLSearchParams(location.search);
    const id = query.get("id");
    if (!id) {
      setNotExists(true);
      return;
    }
    const collection = await Database.getCollection(id);
    if (!collection) {
      setNotExists(true);
      return;
    }
    setCollection(collection);
    const hasPermission = await checkPermissions(collection);
    if (!hasPermission) {
      setAlertOpen(true);
      return;
    }
    setShowCollection(true);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container pt-10">
      {notExists && <Navigate to={`/${params.lng}/collections`} />}
      {showCollection && (
        <>
          <h1 className="text-4xl font-bold">{collection.title}</h1>
          <Accordion type="single" collapsible>
            {collection.classes.map((classItem) => (
              <AccordionItem key={classItem.id} value={classItem.name}>
                <AccordionTrigger>{classItem.name}</AccordionTrigger>
                <AccordionContent>
                  <PhotoGallery
                    key={classItem.id}
                    images={classItem.files.map((item) => item.handle)}
                    lng={params.lng}
                    markDeleted={() => {}}
                    simple={true}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
            {collection.unsortedFiles.length > 0 && (
              <AccordionItem key="__unsorted" value={t("unsorted-items")}>
                <AccordionTrigger>{t("unsorted-items")}</AccordionTrigger>
                <AccordionContent>
                  <PhotoGallery
                    images={collection.unsortedFiles.map((item) => item.handle)}
                    lng={params.lng}
                    markDeleted={() => {}}
                    simple={true}
                  />
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </>
      )}

      <AlertDialog open={alertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("load-header")}</AlertDialogTitle>
            <AlertDialogDescription>{t("load-body")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("load-cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={askPermissions}>
              {t("load-confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
