"use client";
import { useTranslation } from "@/app/i18n/client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Separator } from "./ui/separator";
import { v4 as uuidv4 } from "uuid";

export interface DirectoryInfo {
  id: string;
  handle: FileSystemDirectoryHandle;
  files: FileSystemFileHandle[];
}

interface FoldersListProps {
  folders: DirectoryInfo[];
  lng: string;
  addFolderFiles: (files: FileSystemFileHandle[]) => void;
  removeFolderFiles: (files: FileSystemFileHandle[]) => void;
  setDirHandles: (dirHandles: FileSystemDirectoryHandle[]) => void;
}

const FoldersListComponent = (props: FoldersListProps) => {
  const { t } = useTranslation(props.lng, "collection");

  const [folders, setFolders] = useState<DirectoryInfo[]>(props.folders);

  const verifyPermission = async (
    handle: FileSystemDirectoryHandle
  ): Promise<boolean> => {
    const options = { mode: "readwrite" };
    if ((await handle.queryPermission(options)) === "granted") {
      return true;
    }
    if ((await handle.requestPermission(options)) === "granted") {
      return true;
    }
    return false;
  };

  const addFolder = async () => {
    let dirHandle: FileSystemDirectoryHandle;
    try {
      dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    } catch (e) {
      return;
    }
    let exists = false;
    for (const item of folders) {
      if (await item.handle.isSameEntry(dirHandle)) {
        exists = true;
        break;
      }
    }
    if (exists) {
      return;
    }
    const hasPermission = await verifyPermission(dirHandle);
    if (!hasPermission) {
      return;
    }
    let numFiles = 0;
    const fileHandles = [];
    for await (const entry of dirHandle.values()) {
      if (entry.kind === "file") {
        numFiles++;
        fileHandles.push(entry);
      }
    }
    props.addFolderFiles(fileHandles);
    const item = {
      id: uuidv4(),
      handle: dirHandle,
      files: fileHandles,
    };
    setFolders((prevFolders) => {
      const updatedFolders = [...prevFolders];
      updatedFolders.push(item);
      return updatedFolders;
    });
  };

  const removeFolder = (info: DirectoryInfo) => {
    props.removeFolderFiles(info.files);
    setFolders((prevFolders) => {
      const updatedFolders = prevFolders.filter((item) => item.id !== info.id);
      return updatedFolders;
    });
  };

  useEffect(() => {
    props.setDirHandles(folders.map((item) => item.handle));
  }, [folders, props]);

  return (
    <>
      <h4 className="mb-1 py-1 font-semibold">{t("folders")}</h4>
      {folders.length !== 0 && (
        <div className="grid grid-flow-row auto-rows-max text-sm rounded-sm border">
          {folders.map((item) => (
            <div key={item.id}>
              <div className="flex justify-between items-center py-2 text-sm">
                <span className="pl-2">
                  {item.handle.name} ({t("num-files")}: {item.files.length})
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    className="pl-1 pr-3 py-1 h-6"
                    onClick={() => removeFolder(item)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>
              <Separator />
            </div>
          ))}
        </div>
      )}
      <div className="mt-2">
        <Button size="sm" className="h-8 px-4" onClick={() => addFolder()}>
          <PlusIcon />
        </Button>
      </div>
    </>
  );
};

export default FoldersListComponent;
