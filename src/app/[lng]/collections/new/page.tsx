"use client";
import ClassListComponent from "@/components/classList";
import FoldersListComponent from "@/components/foldersList";
import PhotoGallery from "@/components/gallery";
import { ImageClass } from "@/lib/class";
import { isPropertySignature } from "typescript";

import {
  ZeroShotClassificationModel,
  ModelType,
} from "@visheratin/web-ai/multimodal";
import { useState } from "react";

export default function NewCollectionPage({
  params,
}: {
  params: { lng: string };
}) {
  const [fileHandles, setFileHandles] = useState<FileSystemFileHandle[]>([]);

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

  return (
    <div className="container-full px-10 pt-3 pb-3">
      <div className="grid gap-4 md:grid-cols-6 mt-4">
        <div>
          <FoldersListComponent
            folders={[]}
            lng={params.lng}
            addFolderFiles={addFileHandles}
            removeFolderFiles={removeFileHandles}
          />
          <ClassListComponent data={[]} lng={params.lng} />
        </div>
        <div className="md:col-span-5">
          <PhotoGallery
            images={fileHandles}
            markDeleted={() => {}}
            lng={params.lng}
          />
        </div>
      </div>
    </div>
  );
}
