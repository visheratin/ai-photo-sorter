"use client";
import { Collection } from "@/lib/collection";
import {
  ZeroShotClassificationModel,
  MultimodalModel,
} from "@visheratin/web-ai/multimodal";
import { create } from "zustand";
import { Database } from "@/lib/database";

export enum ModelStatus {
  Unknown,
  Loading,
  Ready,
  Processing,
  Error,
}

export interface ModelState {
  model: ZeroShotClassificationModel | null;
  status: ModelStatus;
  init: () => Promise<void>;
  processCollection: (collection: Collection) => Promise<void>;
}

export const useModelStore = create<ModelState>((set, get) => ({
  model: null,
  status: ModelStatus.Unknown,
  init: async () => {
    set({ status: ModelStatus.Loading });
    try {
      const result = await MultimodalModel.create("nllb-clip-base");
      set({
        model: result.model as ZeroShotClassificationModel,
        status: ModelStatus.Ready,
      });
    } catch (e) {
      console.error(e);
      set({ model: null, status: ModelStatus.Error });
    }
  },
  processCollection: async (collection: Collection) => {
    const model = get().model;
    if (!model) return;
    set({ status: ModelStatus.Processing });
    for (let i = 0; i < collection.classes.length; i++) {
      const classItem = collection.classes[i];
      for (let j = 0; j < classItem.prompts.length; j++) {
        const prompt = classItem.prompts[j];
        const result = await model.embedTexts(prompt.text);
        prompt.vector = result ? result[0] : [];
        collection.classes[i].prompts[j] = prompt;
      }
    }
    Database.updateCollection(collection);
    set({ status: ModelStatus.Ready });
  },
}));
