"use client";

import { useCallback, useEffect, useState } from "react";
import * as wai from "@visheratin/web-ai";
import { useDropzone } from "react-dropzone";
import PhotoGallery from "@/components/gallery";
import { FileInfo } from "@/components/fileInfo";
import { NavbarComponent } from "./navbar";
import { ClassData } from "@/components/classData";
import Resizer from "react-image-file-resizer";

export default function Home() {
  const [classNames, setClassNames] = useState<string[]>([]);

  const [unsortedFiles, setUnsortedFiles] = useState<FileInfo[]>([]);

  const [files, setFiles] = useState<FileInfo[]>([]);

  const [classes, setClasses] = useState<ClassData[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const resizedFiles: File[] = await Promise.all(
        acceptedFiles.map((image: any) => {
          return resizeFile(image);
        })
      );
      const newFiles: FileInfo[] = resizedFiles.map((file) => {
        return {
          name: file.name,
          src: URL.createObjectURL(file),
        };
      });
      const existingFiles = files.map((file) => file.name);
      const filteredNewFiles = newFiles.filter(
        (file) => !existingFiles.includes(file.name)
      );
      setUnsortedFiles([...unsortedFiles, ...filteredNewFiles]);
      setFiles([...files, ...filteredNewFiles]);
    },
    [files, unsortedFiles]
  );

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
  });

  const [model, setModel] = useState<wai.ZeroShotClassificationModel>();

  const processFiles = async (
    power: number,
    setStatus: (status: {
      progress: number;
      busy: boolean;
      message: string;
    }) => void
  ) => {
    if (!model) {
      setStatus({ busy: false, progress: 0, message: "Model was not loaded!" });
      setTimeout(() => {
        setStatus({
          busy: false,
          progress: 0,
          message: "Waiting for the model",
        });
      }, 2000);
      return;
    }
    const classes = [...classNames];
    if (
      classes.length === 0 ||
      classes.filter((c) => c.length > 0).length === 0
    ) {
      setStatus({
        busy: false,
        progress: 0,
        message: "No classes were set!",
      });
      return;
    }
    const newClasses = classes.map((name): ClassData => {
      return {
        name: name,
        files: [],
      };
    });
    setStatus({ progress: 0, busy: true, message: "Processing..." });
    const start = performance.now();
    const batch = power;
    const dataFiles = [...files];
    for (let i = 0; i < dataFiles.length; i += batch) {
      setStatus({
        busy: true,
        message: "Processing...",
        progress: (i / dataFiles.length) * 100,
      });
      const toProcess = dataFiles.slice(i, i + batch).map((file) => file.src);
      const toProcessFiles = dataFiles.slice(i, i + batch);
      const result = await model.process(toProcess, classes);
      if (toProcess.length === 1) {
        const res = result.results as wai.ClassificationPrediction[];
        processResult(toProcessFiles[0], res, newClasses, classes);
      } else {
        const resItems = result.results as wai.ClassificationPrediction[][];
        resItems.forEach((item, index) => {
          const res = item as wai.ClassificationPrediction[];
          processResult(toProcessFiles[index], res, newClasses, classes);
        });
      }
    }
    const end = performance.now();
    const elapsed = Math.round((end - start) / 10) / 100;
    setStatus({
      progress: 100,
      busy: false,
      message: `Finished in ${elapsed}s`,
    });
  };

  const processResult = (
    file: FileInfo,
    result: wai.ClassificationPrediction[],
    classData: ClassData[],
    classes: string[]
  ) => {
    if (result.length === 0) {
      return;
    }
    console.log(file.name, result);
    if (result[0].confidence < 0.5) {
      return;
    }
    const foundClass = result[0].class;
    const foundClassIndex = classes.indexOf(foundClass);
    classData[foundClassIndex].files.push(file);
    setClasses([...classData]);
    const unsortedIdx = unsortedFiles.indexOf(file);
    unsortedFiles.splice(unsortedIdx, 1);
    setUnsortedFiles([...unsortedFiles]);
    return;
  };

  return (
    <>
      <header className="text-center py-6 bg-blue-600 moving-gradient">
        <h1 className="text-4xl font-semibold">Sort your photos with AI</h1>
        <h5 className="text-xl text-white-600">Powered by Web AI</h5>
      </header>
      <div className="flex flex-col lg:flex-row">
        <NavbarComponent
          onInputChange={setClassNames}
          modelCallback={setModel}
          process={processFiles}
          classNum={classNames.filter((c) => c.length > 0).length}
        />
        <div className="border-l border-gray-300 h-auto my-2"></div>
        <main className="flex-grow p-6 lg:w-80 lg:h-full">
          <section>
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
              </div>
            </div>
          </section>
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          {classes.length > 0 &&
            classes.map(
              (item) =>
                item.files.length > 0 && (
                  <>
                    <section
                      key={item.name}
                      className="rounded-md border border-blue-400 p-4 my-4"
                    >
                      <h3 className="mb-4 text-xl font-semibold">
                        {item.name}
                      </h3>
                      <PhotoGallery images={item.files} />
                    </section>
                  </>
                )
            )}
          {unsortedFiles.length > 0 && (
            <section className="rounded-md border border-blue-400 p-4">
              <h3 className="mb-4 text-xl font-semibold">Unsorted</h3>
              <PhotoGallery images={unsortedFiles} />
              {/* <div className="mt-6">
              <h4 className="mb-2 text-lg font-semibold">
                Possible duplicates
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Image description"
                  className="rounded-md"
                />
                <img
                  src="https://via.placeholder.com/150"
                  alt="Image description"
                  className="rounded-md"
                />
              </div>
            </div> */}
            </section>
          )}
        </main>
      </div>
    </>
  );
}
