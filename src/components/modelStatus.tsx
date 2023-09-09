import { useTranslation } from "@/app/i18n/client";
import { ModelContext, ModelStatus } from "./modelContext";
import { useContext } from "react";
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

interface ModelStatusProps {
  lng: string;
}

const ModelStatusComponent = (props: ModelStatusProps) => {
  const { t } = useTranslation(props.lng, "model");

  const modelContext = useContext(ModelContext);

  const initContext = async () => {
    localStorage.setItem("model-set", "true");
    await modelContext?.createModel();
  };

  if (!modelContext) return null;

  let color = "green-500";

  switch (modelContext.status) {
    case ModelStatus.Error:
      color = "red-500";
      break;
  }

  return (
    <div className="flex items-center space-x-2">
      {modelContext.status === ModelStatus.Unknown ? (
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
          {modelContext.status === ModelStatus.Loading ? (
            <Loader2 className="w-3 h-3 text-gray-700 animate-spin" />
          ) : (
            <span className={`w-3 h-3 rounded-full bg-${color}`}></span>
          )}
        </>
      )}
    </div>
  );
};
export default ModelStatusComponent;
