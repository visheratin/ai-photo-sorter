"use client";
import { useTranslation } from "@/app/i18n/client";
import ClassListComponent from "@/components/classList";
import FoldersListComponent from "@/components/foldersList";
import PhotoGallery from "@/components/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageClass } from "@/lib/class";
import { Collection } from "@/lib/collection";
import { useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { Navigate } from "react-router-dom";
import { Database } from "@/lib/database";
import { useModelStore } from "@/components/modelContext";

export default function NewCollectionPage({
  params,
}: {
  params: { lng: string };
}) {
  const { t } = useTranslation(params.lng, "collection");

  const modelStore = useModelStore();

  const [fileHandles, setFileHandles] = useState<FileSystemFileHandle[]>([]);
  const [dirHandles, setDirHandles] = useState<FileSystemDirectoryHandle[]>([]);
  const [classes, setClasses] = useState<ImageClass[]>([]);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [collectionCreated, setCollectionCreated] = useState(false);

  const addFileHandles = (files: FileSystemFileHandle[]) => {
    setFileHandles([...fileHandles, ...files]);
  };

  const removeFileHandles = (files: FileSystemFileHandle[]) => {
    const updatedData = fileHandles.filter((item) => {
      let exists = false;
      for (const file of files) {
        if (file === item) {
          exists = true;
          break;
        }
      }
      return !exists;
    });
    setFileHandles(updatedData);
  };

  const create = async () => {
    const title = titleInputRef.current?.value;
    if (!title) return;
    const collection: Collection = {
      id: uuidv4(),
      title: title,
      serializedIndex: "",
      classes: classes,
      dirHandles: dirHandles,
    };
    await Database.createCollection(collection);
    setCollectionCreated(true);
    modelStore.processCollection(collection);
  };

  return (
    <>
      {collectionCreated && (
        <Navigate to={`/${params.lng}/collections`} replace={true} />
      )}
      <div className="container-full px-10 pt-3 pb-3">
        <div className="grid gap-4 md:grid-cols-6 mt-4">
          <div>
            <h4 className="mb-1 py-1 font-semibold">{t("class-name")}</h4>
            <Input ref={titleInputRef} type="text" id="title" />
            <FoldersListComponent
              folders={[]}
              lng={params.lng}
              addFolderFiles={addFileHandles}
              removeFolderFiles={removeFileHandles}
              setDirHandles={setDirHandles}
            />
            <ClassListComponent
              data={[]}
              lng={params.lng}
              setClasses={setClasses}
            />
            <Button className="mt-3" onClick={create}>
              {t("create-new")}
            </Button>
          </div>
          <div className="md:col-span-5">
            <PhotoGallery
              images={fileHandles}
              markDeleted={() => {}}
              lng={params.lng}
              simple={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
