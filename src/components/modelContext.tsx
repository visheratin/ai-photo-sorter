"use client";
import { Collection } from "@/lib/collection";
import {
  ZeroShotClassificationModel,
  MultimodalModel,
} from "@visheratin/web-ai/multimodal";
import { create } from "zustand";
import { Database } from "@/lib/database";
import { EmbeddedResource } from "voy-search";
import { resizeFile } from "./galleryFile";
import { FileInfo } from "@/lib/info";
import { langMap } from "@/lib/langMap";
import { SessionParams } from "@visheratin/web-ai";

export enum ModelStatus {
  Unknown,
  Loading,
  Ready,
  Processing,
  Error,
}

export interface ModelState {
  language: string;
  model: ZeroShotClassificationModel | null;
  status: ModelStatus;
  init: () => Promise<void>;
  setLanguage: (lang: string) => void;
  processCollection: (collection: Collection) => Promise<void>;
}

export const useModelStore = create<ModelState>((set, get) => ({
  language: "en",
  model: null,
  status: ModelStatus.Unknown,
  setLanguage: (lang: string) => {
    set({ language: lang });
  },
  init: async () => {
    set({ status: ModelStatus.Loading });
    try {
      SessionParams.numThreads = 4;
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
    const lang = get().language;
    const langID = langMap.get(lang);
    if (!model || !langID) return;
    set({ status: ModelStatus.Processing });
    for (let i = 0; i < collection.classes.length; i++) {
      const classItem = collection.classes[i];
      for (let j = 0; j < classItem.prompts.length; j++) {
        const prompt = classItem.prompts[j];
        const text = `${langID} ${prompt.text}`;
        const result = await model.embedTexts(text);
        prompt.vector = result ? result[0] : [];
        collection.classes[i].prompts[j] = prompt;
      }
    }
    const embeddings = await processFiles(collection.unsortedFiles, model);
    const { Voy } = await import("voy-search");
    const index = new Voy({ embeddings: embeddings });
    collection.serializedIndex = index.serialize();
    await classify(collection, embeddings, model);
    Database.updateCollection(collection);
    set({ status: ModelStatus.Ready });
  },
}));

const classify = async (
  collection: Collection,
  embeddings: EmbeddedResource[],
  model: ZeroShotClassificationModel
) => {
  const newUnsorted = [];
  const textVectors = [];
  for (const classItem of collection.classes) {
    for (const prompt of classItem.prompts) {
      textVectors.push(prompt.vector);
    }
  }
  const imageVectors = [];
  for (const embedding of embeddings) {
    imageVectors.push(embedding.embeddings);
  }
  const batchSize = 20;
  for (let i = 0; i < imageVectors.length; i += batchSize) {
    const batchImageVectors = imageVectors.slice(i, i + batchSize);
    const logits = await model.imageLogits(batchImageVectors, textVectors);
    console.log(logits);
    for (let j = 0; j < logits.length; j++) {
      const max = Math.max(...logits[j]);
      const index = logits[j].indexOf(max);
      if (max > 0.75) {
        let c = 0;
        for (const classItem of collection.classes) {
          for (const _ of classItem.prompts) {
            if (c === index) {
              classItem.files.push(collection.unsortedFiles[i + j]);
            }
            c++;
          }
        }
      } else {
        newUnsorted.push(collection.unsortedFiles[i + j]);
      }
    }
  }
  collection.unsortedFiles = newUnsorted;
};

const processFiles = async (
  files: FileInfo[],
  model: ZeroShotClassificationModel
): Promise<EmbeddedResource[]> => {
  const resources: EmbeddedResource[] = [];
  const batchSize = 4;
  for (let i = 0; i < files.length; i += batchSize) {
    const batchHandles = files
      .slice(i, i + batchSize)
      .map((item) => item.handle);
    const batchURLs = await handlesToURLs(batchHandles);
    const output = await model.embedImages(batchURLs);
    const batchResources = output.map((embedding, index) => ({
      id: files[i + index].id,
      title: files[i + index].name,
      url: "",
      embeddings: embedding,
    }));
    resources.push(...batchResources);
  }
  return resources;
};

const handlesToURLs = async (handles: FileSystemFileHandle[]) => {
  const files = [];
  for (const handle of handles) {
    const file = await handle.getFile();
    files.push(file);
  }
  const fileURLs = await Promise.all(
    files.map(async (file): Promise<string> => {
      const resizedFile = await resizeFile(file);
      const dataURL = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(resizedFile);
      });
      return dataURL;
    })
  );
  return fileURLs;
};
