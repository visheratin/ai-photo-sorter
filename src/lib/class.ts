export interface ImageClass {
  id: string;
  name: string;
  prompts: ClassPrompt[];
}

export interface ClassPrompt {
  id: string;
  text: string;
  vector: number[];
}
