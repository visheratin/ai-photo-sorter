"use client";
import { useTranslation } from "@/app/i18n/client";
import { Database } from "@/lib/database";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Pencil2Icon } from "@radix-ui/react-icons";
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
    <div className="container pt-5">
      {notExists && <Navigate to={`/${params.lng}/collections`} />}
      {showCollection && (
        <>
          <div className="flex items-center">
            <h1 className="text-4xl font-bold">{collection.title}</h1>
            <Link
              to={`/${params.lng}/collections/edit?id=${collection.id}`}
              className="ml-1"
            >
              <Pencil2Icon className="w-5 h-5 inline-block ml-2" />
            </Link>
          </div>
          {collection.classes.map((classItem) => (
            <div key={classItem.id} className="border-b mt-2 pb-4">
              <h2 className="text-xl font-bold mb-3">{classItem.name}</h2>
              <PhotoGallery
                key={classItem.id}
                images={classItem.files.map((item) => item.handle)}
                lng={params.lng}
                markDeleted={() => {}}
                simple={true}
              />
            </div>
          ))}
          {collection.unsortedFiles.length > 0 && (
            <div className="border-b mt-3 pb-3">
              <h2 className="text-xl font-bold mb-2">{t("unsorted-items")}</h2>
              <PhotoGallery
                images={collection.unsortedFiles.map((item) => item.handle)}
                lng={params.lng}
                markDeleted={() => {}}
                simple={true}
              />
            </div>
          )}
        </>
      )}

      <AlertDialog open={alertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("permission-header")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("permission-body")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNotExists(true)}>
              {t("permission-deny")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={askPermissions}>
              {t("permission-allow")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
