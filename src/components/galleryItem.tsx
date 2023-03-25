/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { FileInfo } from "./fileInfo";

interface GalleryItemProps {
  image: FileInfo;
  markDeleted: (src: string) => void;
  openImage: (src: string) => void;
}

const GalleryItem = (props: GalleryItemProps) => {
  return (
    <div className="cursor-pointer relative">
      <img
        className={
          props.image.toDelete
            ? "object-cover h-48 w-full grayscale blur-[1px]"
            : "object-cover h-48 w-full"
        }
        src={props.image.src}
        alt=""
        onClick={() => props.openImage(props.image.src)}
      />

      <button
        onClick={() => {
          if (props.markDeleted) props.markDeleted(props.image.name);
        }}
        className={
          props.image.toDelete
            ? "bg-green-500 text-white font-bold text-xs absolute top-0 right-0 mt-2 mr-2 w-5 h-5 flex items-center justify-center rounded-full"
            : "bg-red-500 text-white font-bold text-xs absolute top-0 right-0 mt-2 mr-2 w-5 h-5 flex items-center justify-center rounded-full"
        }
      >
        {props.image.toDelete ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="currentColor"
          >
            <path d="M8 1.41L6.59 0 4 2.59 1.41 0 0 1.41 2.59 4 0 6.59 1.41 8 4 5.41 6.59 8 8 6.59 5.41 4 8 1.41z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default GalleryItem;
