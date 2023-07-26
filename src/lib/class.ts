export interface ImageClass {
  id: string;
  name: string;
  prompts: string[];
  children?: ImageClass[];
}
