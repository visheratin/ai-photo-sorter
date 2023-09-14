import { ImageClass } from "./class";

export type Collection = {
  id: string;
  title: string;
  serializedIndex: string;
  classes: ImageClass[];
  dirHandles: FileSystemDirectoryHandle[];
};
