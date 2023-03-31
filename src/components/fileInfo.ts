import { ClassificationPrediction } from "@visheratin/web-ai";

export interface FileInfo {
  name: string;
  src: string;
  hash: string;
  embedding: number[] | null;
  toDelete: boolean;
  classPredictions: ClassificationPrediction[];
}
