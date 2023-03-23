import InputFieldsComponent from "@/components/classes";
import Tooltip from "@/components/tooltip";
import * as wai from "@visheratin/web-ai";
import React, { useEffect, useRef, useState } from "react";

interface NavbarComponentProps {
  onInputChange: (inputs: string[]) => void;
  modelCallback: (model: wai.ZeroShotClassificationModel) => void;
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
    message: "Waiting for the model",
  });

  const [modelLoaded, setModelLoaded] = useState(false);

  const setProgressValue = (percentage: number) => {
    progressRef.current!.style.width = `${percentage}%`;
  };

  const loadModel = async () => {
    console.log(wai);
    const power = parseFloat(powerRef.current!.value);
    wai.SessionParams.numThreads = power;
    setStatus({ ...status, busy: true, message: "Loading model..." });
    const modelResult = await wai.MultimodalModel.create("clip-base-quant");
    console.log(`Model loading time: ${modelResult.elapsed}s`);
    props.modelCallback(modelResult.model as wai.ZeroShotClassificationModel);
    setModelLoaded(true);
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
    <nav className="bg-white p-6 lg:w-80 lg:h-screen">
      <div className="grid grid-cols-1 gap-4">
        <div
          className="grid grid-cols-1 gap-4"
          style={modelLoaded ? { display: "none" } : {}}
        >
          <div>
            <h4 className="text-xl">Load the model</h4>
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
            className="bg-blue-600 text-white w-full py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Load model
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
          hidden={!modelLoaded || props.classNum === 0}
          onClick={() => process()}
          className="bg-emerald-500 text-white text-xl py-2 my-5 px-4 rounded-full focus:outline-none glowing-emerald"
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
