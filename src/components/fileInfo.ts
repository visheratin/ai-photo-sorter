export interface FileInfo {
  name: string;
  src: string;
  embedding: number[] | null;
  toDelete: boolean;
}
