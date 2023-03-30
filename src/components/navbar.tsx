import InputFieldsComponent from "@/components/classes";
import Tooltip from "@/components/tooltip";
import {
  MultimodalModel,
  SessionParams,
  ZeroShotClassificationModel,
} from "@visheratin/web-ai";
import React, { useEffect, useRef, useState } from "react";

interface NavbarComponentProps {
  onInputChange: (inputs: string[]) => void;
  modelCallback: (model: ZeroShotClassificationModel) => void;
  process: (
    power: number,
    statusCallback: (status: {
      progress: number;
      busy: boolean;
      message: string;
    }) => void
  ) => void;
  generateScript: () => void;
  classNum: number;
  stopProcessing: () => void;
}

export const NavbarComponent: React.FC<NavbarComponentProps> = (
  props: NavbarComponentProps
) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const powerRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState({
    progress: 0,
    busy: false,
    message: "Waiting for AI",
  });

  const [modelLoaded, setModelLoaded] = useState(false);

  const setProgressValue = (percentage: number) => {
    progressRef.current!.style.width = `${percentage}%`;
  };

  const loadModel = async () => {
    const power = parseFloat(powerRef.current!.value);
    SessionParams.numThreads = power;
    setStatus({ ...status, busy: true, message: "Initializing AI..." });
    const modelResult = await MultimodalModel.create("clip-base-quant");
    console.log(`Model loading time: ${modelResult.elapsed}s`);
    props.modelCallback(modelResult.model as ZeroShotClassificationModel);
    setModelLoaded(true);
    setStatus({ ...status, busy: false, message: "AI was initialized!" });
    setTimeout(() => {
      setStatus({ ...status, message: "Ready" });
    }, 2000);
  };

  const process = () => {
    const power = parseFloat(powerRef.current!.value);
    props.process(power, setStatus);
  };

  useEffect(() => {
    setProgressValue(status.progress);
  }, [status.progress]);

  return (
    <nav className="bg-white p-6 lg:w-80 lg:h-screen">
      <div className="grid grid-cols-1 gap-4">
        <div
          className="grid grid-cols-1 gap-4"
          style={modelLoaded ? { display: "none" } : {}}
        >
          <div>
            <h4 className="text-xl">AI setup</h4>
          </div>
          <div className="w-full">
            <label className="mr-2 text-gray-700">
              <span>Select power</span>
            </label>
            <Tooltip tooltipContent="How many CPU cores to use for processing" />
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
              title="How many CPU cores to use for processing"
              disabled={status.busy}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-600">1</span>
              <span className="text-gray-600">4</span>
            </div>
          </div>
          <button
            disabled={status.busy}
            onClick={() => loadModel()}
            className="bg-blue-600 text-white w-full py-2 px-4 rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Initialize
          </button>
        </div>
        <div
          className="grid grid-cols-1 gap-4"
          style={modelLoaded ? {} : { display: "none" }}
        >
          <div>
            <h4 className="text-xl">Set photo classes</h4>
          </div>
          <InputFieldsComponent
            onInputChange={props.onInputChange}
            busy={status.busy}
            modelLoaded={modelLoaded}
          />
        </div>
        <button
          disabled={status.busy || !modelLoaded}
          hidden={!modelLoaded || props.classNum === 0 || status.busy}
          onClick={() => process()}
          className="bg-emerald-500 text-white text-xl py-2 my-2 px-4 rounded focus:outline-none"
        >
          Start
        </button>
        <button
          hidden={!modelLoaded || props.classNum === 0 || !status.busy}
          onClick={() => {
            console.log("stopping");
            props.stopProcessing();
          }}
          className="bg-red-500 text-white text-xl py-2 my-2 px-4 rounded focus:outline-none"
        >
          Stop
        </button>
        <button
          disabled={status.busy || !modelLoaded}
          hidden={
            !modelLoaded || props.classNum === 0 || status.progress !== 100
          }
          onClick={() => props.generateScript()}
          className="bg-rose-400 text-white text-xl py-2 px-4 rounded focus:outline-none"
        >
          Generate script
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
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
      </div>
    </nav>
  );
};
