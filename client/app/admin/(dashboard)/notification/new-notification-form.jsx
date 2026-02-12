"use client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Iconify from "@/components/shared/iconify";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

function SendNotificationForm({ onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [loadingSave, setLoadingSave] = useState(false);
  const [sendType, setSendType] = useState("email");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "",
      body: "",
      sendType: "email",
    },
  });

  const handleSendTypeChange = (value) => {
    setSendType(value);
    if (value === "android") {
      setValue("body", "Android");
    } else {
      setValue("body", "");
    }
  };

  const handleSave = async (data) => {
    setLoadingSave(true);
    try {
      const sanitizedData = {
        subject: DOMPurify.sanitize(data.subject),
        body: DOMPurify.sanitize(data.body),
        sendType: data.sendType,
      };

      await onSave(sanitizedData);
      reset();
      onClose();
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setLoadingSave(false);
      setValue("body", "");
      setSendType("email");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50 text-center">
          <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight">
            {t("Send Notification")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSave)}>
          <ScrollArea className="max-h-[75vh] p-8 pt-4">
            <div className="space-y-6">
              {/* Subject */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Subject")}
                </Label>
                <Controller
                  name="subject"
                  control={control}
                  rules={{ required: t("Subject is required") }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Enter notification subject")}
                      className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all ${
                        errors.subject
                          ? "border-red-500 focus:ring-red-500/10"
                          : ""
                      }`}
                    />
                  )}
                />
                {errors.subject && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Send Type */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Send Type")}
                </Label>
                <Controller
                  name="sendType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        handleSendTypeChange(val);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all">
                        <SelectValue placeholder={t("Select Type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">{t("Email")}</SelectItem>
                        <SelectItem value="android">{t("Android")}</SelectItem>
                        <SelectItem value="both">
                          {t("Both Email & Android")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Body (Quill) */}
              {sendType !== "android" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label className="text-sm font-bold text-gray-700">
                      {t("Body")}
                    </Label>
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">
                      {t("HTML Allowed")}
                    </span>
                  </div>
                  <Controller
                    name="body"
                    control={control}
                    rules={{ required: t("Body is required") }}
                    render={({ field }) => (
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                        <ReactQuill
                          {...field}
                          theme="snow"
                          className="quill-premium h-[250px] mb-[42px]"
                        />
                      </div>
                    )}
                  />
                  {errors.body && (
                    <p className="text-xs font-bold text-red-500 ml-1">
                      {errors.body.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="p-8 bg-gray-50 border-t flex flex-row sm:justify-between items-center sm:gap-4 mt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={loadingSave}
              className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loadingSave ? (
                <div className="flex items-center gap-2">
                  <Iconify icon="svg-spinners:180-ring-with-bg" width={20} />
                  {t("Sending...")}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Iconify
                    icon="material-symbols-light:send-rounded"
                    width={22}
                  />
                  {t("Send Notification")}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SendNotificationForm;
