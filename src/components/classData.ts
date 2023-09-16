import { GalleryFile } from "./galleryFile";

export interface ClassData {
  name: string;
  files: GalleryFile[];
  duplicates: ClassData[];
}
