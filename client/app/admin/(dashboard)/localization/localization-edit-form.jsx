import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function LocalizationEditForm({
  open,
  onClose,
  onSave,
  currentItem,
}) {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      key: "",
      en: "",
      fr: "",
      ar: "",
    },
  });

  useEffect(() => {
    const formatValue = (val) => {
      if (typeof val === "object" && val !== null) {
        return JSON.stringify(val, null, 2);
      }
      return val || "";
    };

    if (currentItem) {
      reset({
        key: currentItem.key || "",
        en: formatValue(currentItem.en),
        fr: formatValue(currentItem.fr),
        ar: formatValue(currentItem.ar),
      });
    } else {
      reset({
        key: "",
        en: "",
        fr: "",
        ar: "",
      });
    }
  }, [currentItem, reset, open]);

  const onSubmit = (data) => {
    const parseValue = (val) => {
      try {
        if (
          typeof val === "string" &&
          (val.trim().startsWith("{") || val.trim().startsWith("["))
        ) {
          return JSON.parse(val);
        }
      } catch (e) {
        console.error(e);
      }
      return val;
    };

    const formattedData = {
      ...data,
      en: parseValue(data.en),
      fr: parseValue(data.fr),
      ar: parseValue(data.ar),
    };
    onSave(formattedData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-3xl p-8 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {currentItem ? t("Edit Translation") : t("New Translation")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="key" className="text-sm font-bold text-gray-700">
              {t("Translation Key")}
            </Label>
            <Input
              id="key"
              {...register("key", { required: true })}
              disabled={!!currentItem} // Disable key editing if updating
              placeholder="e.g., home_title"
              className="rounded-xl border-gray-200 focus-visible:ring-primary/20 bg-gray-50"
            />
            {currentItem && (
              <p className="text-xs text-gray-400">
                {t("Key cannot be changed once created.")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black text-primary/40 tracking-[0.2em] px-1">
                English
              </span>
              <Textarea
                {...register("en")}
                className="rounded-xl border-gray-200 focus-visible:ring-primary/20 resize-none h-20"
                placeholder="English translation"
              />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black text-primary/40 tracking-[0.2em] px-1">
                FranÃ§ais
              </span>
              <Textarea
                {...register("fr")}
                className="rounded-xl border-gray-200 focus-visible:ring-primary/20 resize-none h-20"
                placeholder="Traduction franÃ§aise"
              />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black text-primary/40 tracking-[0.2em] px-1">
                Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©
              </span>
              <Textarea
                {...register("ar")}
                dir="rtl"
                className="rounded-xl border-gray-200 focus-visible:ring-primary/20 resize-none h-20"
                placeholder="Ø§Ù„ØªØ±Ø¬Ù…Ø© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©"
              />
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-gray-200 text-gray-500 font-bold hover:bg-gray-50"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              {currentItem ? t("Update") : t("Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

