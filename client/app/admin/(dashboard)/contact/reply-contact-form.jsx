import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Iconify from "@/components/shared/iconify";

export default function ReplyContactForm({
  contact,
  onSave,
  onCancel,
  open,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: contact?.name || "",
      email: contact?.email || "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const sanitizedData = {
        ...data,
        _id: contact?._id,
      };
      await onSave(sanitizedData);
      toast.success(t("Response has been sent successfully!"));
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error(t("Failed to send response. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50 text-center border-b border-gray-100">
          <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight">
            {t("Replying to")}{" "}
            <span className="text-gray-900">{contact?.name}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[70vh] p-8 pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Subject")}
                </Label>
                <Controller
                  name="subject"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Enter subject")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold"
                    />
                  )}
                />
                {errors.subject && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {t("Subject is required")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Message")}
                </Label>
                <Controller
                  name="message"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder={t("Enter message")}
                      rows={6}
                      className="rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all text-sm outline-none resize-none"
                    />
                  )}
                />
                {errors.message && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {t("Message is required")}
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-8 bg-gray-50 border-t flex flex-row sm:justify-between items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all border-none"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Iconify icon="svg-spinners:180-ring-with-bg" width={20} />
                  {t("Replying...")}
                </div>
              ) : (
                t("Reply")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

