"use client";
import {
  ZeroShotClassificationModel,
  MultimodalModel,
} from "@visheratin/web-ai/multimodal";
import { createContext, useEffect, useState } from "react";

export enum ModelStatus {
  Unknown,
  Loading,
  Ready,
  Error,
}

export interface ModelInfo {
  model: ZeroShotClassificationModel | null;
  status: ModelStatus;
  createModel: () => Promise<void>;
}

export const ModelContext = createContext<ModelInfo | null>(null);

interface ModelContextProviderProps {
  children: React.ReactNode;
}

export const ModelContextProvider: React.FunctionComponent<
  ModelContextProviderProps
> = ({ children }) => {
  const [instance, setInstance] = useState<ModelInfo>({
    model: null,
    status: ModelStatus.Unknown,
    createModel: async () => {},
  });

  const init = async () => {
    console.log("init");
    setInstance({
      model: null,
      status: ModelStatus.Loading,
      createModel: init,
    });
    try {
      const result = await MultimodalModel.create("nllb-clip-base");
      setInstance({
        model: result.model as ZeroShotClassificationModel,
        status: ModelStatus.Ready,
        createModel: init,
      });
    } catch (e) {
      console.error(e);
      setInstance({
        model: null,
        status: ModelStatus.Error,
        createModel: init,
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("model-set") !== null) {
      init();
    } else {
      setInstance({
        model: null,
        status: ModelStatus.Unknown,
        createModel: init,
      });
    }
  }, []);

  return (
    <ModelContext.Provider value={instance}>{children}</ModelContext.Provider>
  );
};
