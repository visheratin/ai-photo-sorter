import InputFieldsComponent from "@/components/classes";
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
  classNum: number;
}

export const NavbarComponent: React.FC<NavbarComponentProps> = (
  props: NavbarComponentProps
) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const powerRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState({
    progress: 0,
    busy: false,
    message: "Waiting the model",
  });

  const setProgressValue = (percentage: number) => {
    progressRef.current!.style.width = `${percentage}%`;
  };

  const loadModel = async () => {
    const power = parseFloat(powerRef.current!.value);
    SessionParams.numThreads = power;
    setStatus({ ...status, busy: true, message: "Loading model..." });
    const modelResult = await MultimodalModel.create("clip-base-quant");
    console.log(`Model loading time: ${modelResult.elapsed}s`);
    props.modelCallback(modelResult.model as ZeroShotClassificationModel);
    setStatus({ ...status, busy: false, message: "Model was loaded!" });
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
    <nav className="bg-white p-6 shadow lg:w-80 lg:h-screen">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h4 className="text-xl">Model setup</h4>
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
        <button
          disabled={status.busy}
          onClick={() => loadModel()}
          className="bg-blue-600 text-white w-full py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Load model
        </button>
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <div>
          <h4 className="text-xl">Image types ({props.classNum})</h4>
        </div>
        <InputFieldsComponent
          onInputChange={props.onInputChange}
          busy={status.busy}
        />
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <button
          disabled={status.busy}
          onClick={() => process()}
          className="bg-green-600 text-white w-full py-2 px-4 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
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
  );
};
