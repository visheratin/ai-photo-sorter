import { Collection } from "./collection";
import { v4 as uuidv4 } from "uuid";
import { FileInfo } from "./info";

class Monitor {
  constructor() {}

  async checkFileExists(file: FileSystemFileHandle, collection: Collection) {
    for (let cls of collection.classes) {
      for (let clsFile of cls.files) {
        if (await clsFile.handle.isSameEntry(file)) {
          return true;
        }
      }
    }
    return false;
  }

  async collectionUpdates(collection: Collection) {
    const newFiles: FileInfo[] = [];
    for (let dirHandle of collection.dirHandles) {
      const files = await dirHandle.values();
      for (let file of files) {
        if (file.kind !== "file") continue;
        const handle = file as FileSystemFileHandle;
        const fileInfo = await handle.getFile();
        if (fileInfo.lastModified > collection.updateTime) {
          newFiles.push({
            id: uuidv4(),
            name: fileInfo.name,
            handle: file,
            updateTime: fileInfo.lastModified,
          });
        }
      }
    }
  }
}
