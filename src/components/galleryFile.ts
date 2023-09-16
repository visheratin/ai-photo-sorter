import Resizer from "react-image-file-resizer";

export interface GalleryFile {
  id: string;
  name: string;
  src: string;
  toDelete: boolean;
}

export const resizeFile = (file: File): Promise<File> =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      800,
      800,
      "JPEG",
      80,
      0,
      (uri) => {
        resolve(uri as File);
      },
      "file"
    );
  });
