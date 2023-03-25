import { FileInfo } from "./fileInfo";

export interface ClassData {
  name: string;
  files: FileInfo[];
  duplicates: ClassData[];
}
