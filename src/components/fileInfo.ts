import { ClassificationPrediction } from "@visheratin/web-ai/image";

export interface FileInfo {
  name: string;
  src: string;
  hash: string;
  embedding: number[] | null;
  toDelete: boolean;
  classPredictions: ClassificationPrediction[];
}
