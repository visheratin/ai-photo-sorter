"use client";
import { useTranslation } from "@/app/i18n/client";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ModelStatus, useModelStore } from "./modelContext";

interface ModelStatusProps {
  lng: string;
}

const ModelStatusComponent = (props: ModelStatusProps) => {
  const { t } = useTranslation(props.lng, "model");

  const modelStore = useModelStore();

  const initContext = async () => {
    localStorage.setItem("model-set", "true");
    await modelStore.init();
  };

  let color = "green-500";

  switch (modelStore.status) {
    case ModelStatus.Error:
      color = "red-500";
      break;
  }

  useEffect(() => {
    if (localStorage.getItem("model-set") !== null) {
      modelStore.init();
      modelStore.setLanguage(props.lng);
    }
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {modelStore.status === ModelStatus.Unknown ? (
        <>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button size="sm">{t("load-model")}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("load-header")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("load-body")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("load-cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={initContext}>
                  {t("load-confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <>
          <span className="text-sm font-medium">{t("title")}:</span>
          {modelStore.status === ModelStatus.Loading ? (
            <Loader2 className="w-3 h-3 text-gray-700 animate-spin" />
          ) : modelStore.status === ModelStatus.Processing ? (
            <Loader2 className="w-3 h-3 text-green-500 animate-spin" />
          ) : (
            <span className={`w-3 h-3 rounded-full bg-${color}`}></span>
          )}
        </>
      )}
    </div>
  );
};
export default ModelStatusComponent;
