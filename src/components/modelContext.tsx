"use client";
import { Collection } from "@/lib/collection";
import {
  ZeroShotClassificationModel,
  MultimodalModel,
} from "@visheratin/web-ai/multimodal";
import { create } from "zustand";
import { Database } from "@/lib/database";
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
    let allFiles = collection.unsortedFiles;
    for (let cls of collection.classes) {
      allFiles.push(...cls.files);
    }
    allFiles.sort((a, b) => a.updateTime - b.updateTime);
    const noEmbedFiles = allFiles.filter((item) => item.embedding.length === 0);
    const embeddings = await processFiles(noEmbedFiles, model);
    const embedFiles = allFiles.filter((item) => item.embedding.length > 0);
    allFiles = [...embedFiles, ...noEmbedFiles];
    // const { Voy } = await import("voy-search");
    // const index = new Voy({ embeddings: embeddings });
    // collection.serializedIndex = index.serialize();
    await classify(collection, embeddings, model, allFiles);
    Database.updateCollection(collection);
    set({ status: ModelStatus.Ready });
  },
  getImageEmbedding: async (fileInfo: FileInfo) => {
    const model = get().model;
    if (!model) return;
    const embeddings = await processFiles([fileInfo], model);
    return embeddings[0];
  },
  getTextEmbedding: async (text: string) => {
    const model = get().model;
    if (!model) return;
    const lang = get().language;
    const langID = langMap.get(lang);
    if (!langID) return;
    const result = await model.embedTexts(`${langID} ${text}`);
    return result ? result[0] : [];
  },
}));

const classify = async (
  collection: Collection,
  embeddings: number[][],
  model: ZeroShotClassificationModel,
  allFiles: FileInfo[]
) => {
  const newUnsorted = [];
  const checkVectors = [];
  for (const classItem of collection.classes) {
    for (const prompt of classItem.prompts) {
      checkVectors.push(prompt.vector);
    }
    checkVectors.push(...classItem.classVectors);
  }
  const imageVectors = [];
  for (const embedding of embeddings) {
    imageVectors.push(embedding);
  }
  const batchSize = 20;
  for (let i = 0; i < imageVectors.length; i += batchSize) {
    const batchImageVectors = imageVectors.slice(i, i + batchSize);
    const logits = await model.imageLogits(batchImageVectors, checkVectors);
    for (let j = 0; j < logits.length; j++) {
      const max = Math.max(...logits[j]);
      const index = logits[j].indexOf(max);
      if (max > 0.5) {
        let c = 0;
        for (const classItem of collection.classes) {
          for (const _ of classItem.prompts) {
            if (c === index) {
              classItem.files.push(allFiles[i + j]);
            }
            c++;
          }
          for (const _ of classItem.classVectors) {
            if (c === index) {
              classItem.files.push(allFiles[i + j]);
            }
            c++;
          }
        }
      } else {
        newUnsorted.push(allFiles[i + j]);
      }
    }
  }
  collection.unsortedFiles = newUnsorted;
};

const processFiles = async (
  files: FileInfo[],
  model: ZeroShotClassificationModel
): Promise<number[][]> => {
  const res: number[][] = [];
  const batchSize = 4;
  for (let i = 0; i < files.length; i += batchSize) {
    const batchHandles = files
      .slice(i, i + batchSize)
      .map((item) => item.handle);
    const batchURLs = await handlesToURLs(batchHandles);
    const output = await model.embedImages(batchURLs);
    res.push(...output);
    for (let j = 0; j < output.length; j++) {
      files[i + j].embedding = output[j];
    }
    // const batchResources = output.map((embedding, index) => ({
    //   id: files[i + index].id,
    //   title: files[i + index].name,
    //   url: "",
    //   embeddings: embedding,
    // }));
    // res.push(...batchResources);
  }
  return res;
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
