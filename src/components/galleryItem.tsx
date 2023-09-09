/* eslint-disable @next/next/no-img-element */
import { FileInfo } from "./fileInfo";

interface GalleryItemProps {
  image: FileInfo;
  markDeleted: (src: string) => void;
  openImage: (file: FileInfo) => void;
}

const GalleryItem = (props: GalleryItemProps) => {
  return (
    <div key={props.image.src} className="cursor-pointer relative">
      <img
        className={
          props.image.toDelete
            ? "object-cover h-[220px] w-full grayscale blur-[1px]"
            : "object-cover h-[220px] w-full"
        }
        src={props.image.src}
        alt=""
        onClick={() => props.openImage(props.image)}
      />

      <button
        onClick={() => {
          if (props.markDeleted) props.markDeleted(props.image.hash);
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
      <button
        onClick={() => {
          props.moveToClass(props.image);
        }}
        className="bg-blue-500 text-white font-bold text-xs absolute top-0 right-0 mt-8 mr-2 w-5 h-5 flex items-center justify-center rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="9"
          viewBox="0 0 984.85 984.85"
          fill="currentColor"
        >
          <path
            d="M652.075,954.791c12.101,12,28.7,20.1,45.7,21.5c17.2,1.399,34.9-2.8,49.2-12.5c3.9-2.601,7.6-5.7,10.9-9l0.1-0.101
    l204.9-204.899c29.3-29.3,29.3-76.8,0-106.101c-29.301-29.3-76.801-29.3-106.101,0l-76.899,76.9v-637c0-41.4-33.601-75-75-75
    c-41.4,0-75,33.6-75,75v637l-78.9-78.9c-29.3-29.3-76.8-29.3-106.1,0c-29.301,29.301-29.301,76.801,0,106.101l207,207
    C651.975,954.69,651.975,954.791,652.075,954.791z"
          />
          <path
            d="M74.975,365.491c19.2,0,38.4-7.3,53-22l78.9-78.9v637c0,41.4,33.6,75,75,75s75-33.6,75-75v-637l76.899,76.9
    c14.601,14.6,33.8,22,53,22s38.4-7.3,53-22c29.3-29.3,29.3-76.8,0-106.1c-5.399-5.4-10.899-10.9-16.3-16.3
    c-13.3-13.3-26.5-26.7-39.9-39.9c-17.199-17.1-34.3-34.2-51.399-51.4c-16.8-17-34.2-33.5-50.9-50.7
    c-16.2-16.6-32.6-32.9-49.899-48.5c-18-16.2-41.5-24.2-65.7-18.5c-6.2,1.4-12.8,3.8-18.4,6.9c-16.7,9.4-30,24.9-43.5,38.3
    c-16.5,16.3-32.7,32.9-49.1,49.4c-19.5,19.6-39.2,39.1-58.8,58.6c-16.4,16.6-33,33.2-49.5,49.8c-8,8-16,15.9-24,23.9
    c-0.1,0.1-0.3,0.3-0.4,0.4c-29.3,29.3-29.3,76.8,0,106.1C36.575,358.191,55.775,365.491,74.975,365.491z"
          />
        </svg>
      </button>
    </div>
  );
};

export default GalleryItem;
