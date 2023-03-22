import React, { useState } from "react";
import { FileInfo } from "./fileInfo";

interface PhotoGalleryProps {
  images: FileInfo[];
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {props.images.map((image, index) => (
          <div
            key={index}
            onClick={() => openImage(image.src)}
            className="cursor-pointer"
          >
            <img className="object-cover h-48 w-full" src={image.src} alt="" />
          </div>
        ))}
      </div>

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
