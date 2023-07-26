import { ImageClass } from "@/lib/class";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { InputData } from "./inputData";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "@/app/i18n/client";

interface ClassEditorProps {
  item: ImageClass;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (item: ImageClass) => void;
  lng: string;
}

const ClassEditor = (props: ClassEditorProps) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [prompts, setPrompts] = useState<InputData[]>([]);
  const { t } = useTranslation(props.lng, "collection");

  useEffect(() => {
    const prompts = props.item.prompts.map((prompt) => ({
      id: uuidv4(),
      value: prompt,
    }));
    if (prompts.length === 0) prompts.push({ id: uuidv4(), value: "" });
    setPrompts(prompts);
  }, [props.item]);

  const addInputField = () => {
    const newPrompt = { id: uuidv4(), value: "" };
    setPrompts((prevPrompts) => {
      const updatedPrompts = [...prevPrompts];
      updatedPrompts.push(newPrompt);
      setTimeout(() => {
        focusInput(newPrompt.id);
      }, 0);
      return updatedPrompts;
    });
  };

  const handleInputChange = (id: number, value: string) => {
    const updatedInputs = prompts.map((input) =>
      input.id === id ? { ...input, value } : input
    );
    setPrompts(updatedInputs);
  };

  const removePrompt = (id: number) => {
    const updatedPrompts = prompts.filter((prompt) => prompt.id !== id);
    setPrompts(updatedPrompts);
  };

  const focusInput = (id: number) => {
    const inputElement = document.getElementById(
      `prompt-${id}`
    ) as HTMLInputElement;
    inputElement?.focus();
  };

  const saveChanges = () => {
    if (!nameRef.current) return;
    const item = {
      id: props.item.id,
      name: nameRef.current.value,
      prompts: prompts.map((prompt) => prompt.value),
    };
    console.log(item);
    props.onSave(item);
    props.setOpen(false);
  };

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {props.item.id ? t("edit-class") : t("create-class")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">{t("class-name")}</Label>
          <Input
            ref={nameRef}
            type="text"
            id="name"
            defaultValue={props.item.name}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>{t("class-prompts")}</Label>
          {prompts.map((prompt) => (
            <div
              key={`prompt-${prompt.id}`}
              className="flex justify-between items-center"
            >
              <Input
                id={`prompt-${prompt.id}`}
                value={prompt.value}
                onChange={(e) => handleInputChange(prompt.id, e.target.value)}
                type="text"
              />
              <Button
                variant="ghost"
                className="ml-2"
                onClick={() => removePrompt(prompt.id)}
              >
                <TrashIcon width={18} height={18} />
              </Button>
            </div>
          ))}
          <div className="mt-2">
            <Button
              size="sm"
              className="h-8 px-4"
              onClick={() => addInputField()}
            >
              <PlusIcon />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => saveChanges()}>
            {t("class-save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ClassEditor;
