/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { FileInfo } from "./fileInfo";
import GalleryItem from "./galleryItem";
import { v4 as uuidv4 } from "uuid";
import Resizer from "react-image-file-resizer";
import { Button } from "./ui/button";
import { useTranslation } from "@/app/i18n/client";
import { ScrollArea } from "./ui/scroll-area";

interface PhotoGalleryProps {
  images: FileSystemFileHandle[];
  markDeleted: (src: string) => void;
  lng: string;
  simple: boolean;
}

const resizeFile = (file: File): Promise<File> =>
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

const PhotoGallery = (props: PhotoGalleryProps) => {
  const { t } = useTranslation(props.lng, "gallery");
  const [selectedImage, setSelectedImage] = useState<FileInfo | undefined>(
    undefined
  );

  const version = useRef(0);

  const cache = new Map<FileSystemFileHandle, File>();

  const threshold = 30;

  const [currentImages, setCurrentImages] = useState<FileInfo[]>([]);

  const [placeholdersNum, setPlaceholdersNum] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(props.images.length / threshold);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeImage();
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        if (selectedImage) {
          const index = currentImages.findIndex(
            (item) => item === selectedImage
          );
          if (index <= 0) return;
          setSelectedImage(currentImages[index - 1]);
        } else {
          goToPreviousPage();
        }
      } else if (event.key === "ArrowRight") {
        if (selectedImage) {
          const index = currentImages.findIndex(
            (item) => item === selectedImage
          );
          if (index === currentImages.length - 1 || index === -1) return;
          setSelectedImage(currentImages[index + 1]);
        } else {
          goToNextPage();
        }
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  });

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const updateImages = useCallback(
    async (offset: number, limit: number) => {
      if (offset + limit > props.images.length) {
        limit = props.images.length - offset;
      }
      limit = Math.max(limit, 0);
      let num = limit;
      setCurrentImages([]);
      setPlaceholdersNum(num);
      const newImages: FileInfo[] = [];
      const currentVersion = version.current;
      for (let i = offset; i < offset + limit; i++) {
        if (version.current !== currentVersion) return;
        if (i >= props.images.length) break;
        if (cache.has(props.images[i])) {
          const file = cache.get(props.images[i]);
          if (file) {
            newImages.push({
              id: uuidv4(),
              name: props.images[i].name,
              src: URL.createObjectURL(file),
              hash: "",
              embedding: null,
              toDelete: false,
            });
            setCurrentImages(newImages);
            num -= 1;
            setPlaceholdersNum(num);
          }
          continue;
        }
        const file = await props.images[i].getFile();
        const resizedFile = await resizeFile(file);
        cache.set(props.images[i], resizedFile);
        newImages.push({
          id: uuidv4(),
          name: props.images[i].name,
          src: URL.createObjectURL(resizedFile),
          hash: "",
          embedding: null,
          toDelete: false,
        });
        if (version.current !== currentVersion) return;
        setCurrentImages(newImages);
        num -= 1;
        setPlaceholdersNum(num);
      }
    },
    [props.images]
  );

  useEffect(() => {
    version.current += 1;
    updateImages((currentPage - 1) * threshold, threshold);
  }, [currentPage, updateImages]);

  const openImage = (file: FileInfo) => {
    setSelectedImage(file);
  };

  const closeImage = () => {
    setSelectedImage(undefined);
  };

  return (
    <div>
      <ScrollArea>
        <div className="h-[calc(100vh-15.5rem)]">
          <div className="grid grid-cols-2 2xl:grid-cols-10 md:grid-cols-5 gap-4">
            {currentImages.map((image, index) => (
              <GalleryItem
                image={image}
                key={image.id}
                openImage={openImage}
                markDeleted={props.markDeleted}
                simple={props.simple}
              />
            ))}
            {Array.from(Array(placeholdersNum).keys()).map((index) => (
              <div key={index} className="bg-gray-200 h-[220px] w-full"></div>
            ))}
          </div>
        </div>
      </ScrollArea>
      {currentImages.length !== 0 && (
        <div className="flex justify-center mt-4">
          <Button
            className="px-4 py-2 border rounded-md mr-2"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            size="sm"
          >
            {t("previous")}
          </Button>
          <Button
            className="px-4 py-2 border rounded-md"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            size="sm"
          >
            {t("next")}
          </Button>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeImage}
        >
          <div className="bg-white p-2 rounded flex flex-col items-center">
            <img
              className="max-w-3xl max-h-[75%] max-w-[75%] cursor-pointer mb-1"
              src={selectedImage.src}
              alt="Selected"
            />
            <h3 className="font-semibold mb-2">{selectedImage.name}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
