import { FileInfo } from "./info";

export interface ImageClass {
  id: string;
  name: string;
  prompts: ClassPrompt[];
  files: FileInfo[];
  classVectors: number[][];
}

export interface ClassPrompt {
  id: string;
  text: string;
  vector: number[];
}
