"use client";
import { ImageClass } from "@/lib/class";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";
import { PlusIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import ClassEditor from "./classEdit";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "@/app/i18n/client";

interface ClassListComponentProps {
  data: ImageClass[];
  lng: string;
  setClasses: (classes: ImageClass[]) => void;
}

const ClassListComponent = (props: ClassListComponentProps) => {
  const { t } = useTranslation(props.lng, "collection");
  const [classes, setClasses] = useState<ImageClass[]>(props.data);
  const [editItem, setEditItem] = useState<ImageClass>({
    id: "",
    name: "",
    prompts: [],
    files: [],
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setClasses(props.data);
  }, []);

  useEffect(() => {
    props.setClasses(classes);
  }, [props, classes]);

  const createClass = () => {
    const item = {
      id: "",
      name: "",
      prompts: [],
      files: [],
    };
    setEditItem(item);
    setOpen(true);
  };

  const editClass = (item: ImageClass) => {
    setEditItem(item);
    setOpen(true);
  };

  const deleteClass = (id: string) => {
    const updatedData = classes.filter((item) => item.id !== id);
    setClasses(updatedData);
  };

  const saveClass = (item: ImageClass) => {
    const updatedData = classes.map((dataItem) =>
      dataItem.id === item.id ? item : dataItem
    );
    if (item.id === "") {
      item.id = uuidv4();
      updatedData.push(item);
    }
    setClasses(updatedData);
  };

  return (
    <>
      <h4 className="mb-1 py-1 font-semibold">{t("classes")}</h4>
      {classes.length !== 0 && (
        <ScrollArea className="rounded-sm border">
          <div className="max-h-[450px] grid grid-flow-row auto-rows-max text-sm">
            {classes.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-center py-1 text-sm">
                  <Button variant="link" size="sm">
                    {item.name}
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      className="px-1 py-1 h-6"
                      onClick={() => editClass(item)}
                    >
                      <Pencil1Icon />
                    </Button>
                    <Button
                      variant="ghost"
                      className="pl-1 pr-3 py-1 h-6"
                      onClick={() => deleteClass(item.id)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      <div className="mt-2">
        <Button size="sm" className="h-8 px-4" onClick={() => createClass()}>
          <PlusIcon />
        </Button>
      </div>
      <ClassEditor
        open={open}
        setOpen={setOpen}
        item={editItem}
        onSave={saveClass}
        lng={props.lng}
      />
    </>
  );
};

export default ClassListComponent;
