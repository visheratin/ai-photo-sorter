/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { FileInfo } from "./fileInfo";
import { ClassData } from "./classData";
import GalleryItem from "./galleryItem";

interface PhotoGalleryProps {
  images: FileInfo[];
  duplicates: ClassData[];
  markDeleted: (src: string) => void;
}

const PhotoGallery = (props: PhotoGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState("");

  const openImage = (src: string) => {
    setSelectedImage(src);
  };

  const closeImage = () => {
    setSelectedImage("");
  };

  return (
    <div>
      <div className="grid grid-cols-2 2xl:grid-cols-10 md:grid-cols-5 gap-4">
        {props.images.map((image, index) => (
          <GalleryItem
            image={image}
            key={image.src}
            openImage={openImage}
            markDeleted={props.markDeleted}
          />
        ))}
      </div>

      {props.duplicates.map((info, index) => (
        <div className="my-2" key={info.name}>
          <h4 className="mb-2 text-lg font-semibold">Possible duplicates</h4>
          <div className="grid grid-cols-2 2xl:grid-cols-10 md:grid-cols-5 gap-4">
            {info.files.map((image, index) => (
              <GalleryItem
                image={image}
                key={image.src}
                openImage={openImage}
                markDeleted={props.markDeleted}
              />
            ))}
          </div>
        </div>
      ))}

      {selectedImage && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeImage}
        >
          <img
            className="max-w-3xl max-h-[75%] max-w-[75%] p-4 cursor-pointer"
            src={selectedImage}
            alt="Selected"
          />
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
