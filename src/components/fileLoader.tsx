import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Resizer from "react-image-file-resizer";
import { FileInfo } from "./fileInfo";

interface FileLoaderProps {
  setNewFiles: (files: FileInfo[]) => void;
}

const FileLoader = (props: FileLoaderProps) => {
  const [loading, setLoading] = useState(false);

  const resizeFile = (file: File): Promise<File> =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        600,
        600,
        "JPEG",
        80,
        0,
        (uri) => {
          resolve(uri as File);
        },
        "file"
      );
    });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setLoading(true);
      const resizedFiles: File[] = await Promise.all(
        acceptedFiles.map((image: any) => {
          return resizeFile(image);
        })
      );
      const newFiles: FileInfo[] = resizedFiles.map((file, index) => {
        return {
          name: acceptedFiles[index].name,
          src: URL.createObjectURL(file),
          embedding: null,
          toDelete: false,
        };
      });
      console.log(newFiles);
      props.setNewFiles(newFiles);
      setLoading(false);
    },
    [props]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
  });

  return (
    <div className="flex justify-center">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-blue-400 rounded-lg p-4 w-full h-32 text-center hover:bg-gray-200 cursor-pointer transition-all duration-200"
      >
        <input
          {...getInputProps()}
          className="hidden"
          type="file"
          name="file"
          id="file"
          multiple
        />
        {loading ? (
          <label className="text-gray-600 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-2 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-opacity="1"
                stroke-width="2"
              ></circle>
              <path
                className="opacity-75"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0 4 4 0 010-5.656"
              ></path>
            </svg>
            Loading files
          </label>
        ) : (
          <label className="text-gray-600 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Click or drag and drop files here
          </label>
        )}
      </div>
    </div>
  );
};

export default FileLoader;
