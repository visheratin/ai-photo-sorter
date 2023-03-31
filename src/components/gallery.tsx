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
  const [selectedImage, setSelectedImage] = useState<FileInfo | undefined>(
    undefined
  );

  const openImage = (file: FileInfo) => {
    setSelectedImage(file);
  };

  const closeImage = () => {
    setSelectedImage(undefined);
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
          <div className="bg-white p-2 rounded flex flex-col items-center">
            <img
              className="max-w-3xl max-h-[75%] max-w-[75%] cursor-pointer mb-1"
              src={selectedImage.src}
              alt="Selected"
            />
            <h3 className="font-semibold mb-2">{selectedImage.name}</h3>
            {selectedImage.classPredictions.length > 0 && (
              <table className="table-auto w-1/2">
                <thead>
                  <tr>
                    <th className="font-semibold text-sm text-left">Class</th>
                    <th className="font-semibold text-sm text-right">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedImage.classPredictions.map((prediction, index) => (
                    <>
                      {prediction.confidence > 0.05 && (
                        <tr key={index}>
                          <td className="text-sm py-1 text-left">
                            {prediction.class}
                          </td>
                          <td className="text-sm py-1 text-right">
                            {prediction.confidence.toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
