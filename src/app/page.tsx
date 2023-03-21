"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MultimodalModel,
  ZeroShotClassificationModel,
} from "@visheratin/web-ai";
import { useDropzone } from "react-dropzone";
import PhotoGallery from "@/components/gallery";
import { FileInfo } from "@/components/fileInfo";
import { InputData } from "@/components/inputData";
import InputFieldsComponent from "@/components/classes";

export default function Home() {
  const progressRef = useRef<HTMLDivElement>(null);
  const groupDuplicatesRef = useRef<HTMLInputElement>(null);
  const powerRef = useRef<HTMLInputElement>(null);
  const confidenceRef = useRef<HTMLInputElement>(null);

  const [classInputs, setClassInputs] = useState<InputData[]>([]);

  const [files, setFiles] = useState<FileInfo[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: FileInfo[] = acceptedFiles.map((file) => {
        return {
          name: file.name,
          src: URL.createObjectURL(file),
        };
      });
      const existingFiles = files.map((file) => file.name);
      const filteredNewFiles = newFiles.filter(
        (file) => !existingFiles.includes(file.name)
      );
      setFiles([...files, ...filteredNewFiles]);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
  });

  const [status, setStatus] = useState({
    progress: 0,
    busy: false,
    message: "Initalizing...",
  });

  const [model, setModel] = useState<ZeroShotClassificationModel>();

  const loadModel = async () => {
    setStatus({ ...status, busy: true, message: "Loading model..." });
    const modelResult = await MultimodalModel.create("clip-base-quant");
    console.log(`Model loading time: ${modelResult.elapsed}s`);
    setModel(modelResult.model as ZeroShotClassificationModel);
    setStatus({ ...status, busy: false, message: "Model was loaded!" });
    setTimeout(() => {
      setStatus({ ...status, message: "Ready" });
    }, 2000);
  };

  const setProgressValue = (percentage: number) => {
    progressRef.current!.style.width = `${percentage}%`;
  };

  const handleInputChange = (inputs: InputData[]) => {
    setClassInputs(inputs);
  };

  useEffect(() => {
    setProgressValue(status.progress);
    loadModel();
  }, []);

  return (
    <>
      <header className="text-center py-6 bg-blue-600 text-white">
        <h1 className="text-4xl font-semibold">Sort your photos with AI</h1>
        <h5 className="text-xl text-white-600">Powered by Web AI</h5>
      </header>
      <div className="flex flex-col lg:flex-row">
        <nav className="bg-white p-6 shadow lg:w-80 lg:h-screen">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h4 className="text-xl">Classes</h4>
            </div>
            <InputFieldsComponent onInputChange={handleInputChange} />
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div>
              <h4 className="text-xl">Parameters</h4>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                ref={groupDuplicatesRef}
                id="group-duplicates"
                className="form-checkbox h-5 w-5 text-blue-600"
                disabled={status.busy}
              />
              <label className="ml-2 text-gray-700">Group duplicates</label>
            </div>
            <div className="w-full">
              <label className="mr-2 text-gray-700">Power</label>
              <input
                type="range"
                id="power"
                ref={powerRef}
                name="power"
                min="1"
                max="4"
                defaultValue="1"
                step="1"
                className="slider w-full"
                title="How many cores to use for computation"
                disabled={status.busy}
              />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-600">1</span>
                <span className="text-gray-600">4</span>
              </div>
            </div>
            <div className="w-full">
              <label className="mr-2 text-gray-700">Confidence</label>
              <input
                type="range"
                id="confidence"
                ref={confidenceRef}
                name="confidence"
                min="50"
                max="90"
                defaultValue="70"
                step="1"
                className="slider w-full"
                title="Confidence level for AI computation (50-80)"
                disabled={status.busy}
              />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-600">50</span>
                <span className="text-gray-600">80</span>
              </div>
            </div>
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <button
              disabled={status.busy}
              className="bg-blue-600 text-white w-full py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Start
            </button>
            <div className="h-2 mt-4 bg-gray-200 rounded">
              <div
                id="progress-bar"
                ref={progressRef}
                className="h-full bg-blue-600 rounded"
                style={{ width: `${status.progress}%` }}
              ></div>
            </div>
            <div>
              <p className="font-semibold text-gray-700">
                Status: <span className="font-normal">{status.message}</span>
              </p>
            </div>
          </div>
        </nav>

        <main className="flex-grow p-6 shadow lg:w-80 lg:h-screen">
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
          {files.length > 0 && (
            <section className="rounded-md border border-blue-400 p-4">
              <h3 className="mb-4 text-xl font-semibold">Unsorted</h3>
              <PhotoGallery images={files} />
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
