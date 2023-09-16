import { ImageClass } from "./class";
import { FileInfo } from "./info";

export type Collection = {
  id: string;
  title: string;
  filesNumber: number;
  serializedIndex: string;
  classes: ImageClass[];
  dirHandles: FileSystemDirectoryHandle[];
  unsortedFiles: FileInfo[];
  updateTime: number;
};
