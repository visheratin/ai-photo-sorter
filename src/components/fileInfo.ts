export interface FileInfo {
  id: string;
  name: string;
  src: string;
  hash: string;
  embedding: number[] | null;
  toDelete: boolean;
}
