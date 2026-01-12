import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
import Iconify from "../../../components/iconify";

function EditContactForm({ contact, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [loadingSave, setLoadingSave] = useState(false);

  const formatPhone = (phone) => {
    let sanitized = phone.replace(/\D/g, "");
    if (sanitized.startsWith("00212")) {
      sanitized = "0" + sanitized.slice(5);
    } else if (sanitized.startsWith("212")) {
      sanitized = "0" + sanitized.slice(3);
    }
    if (sanitized && !sanitized.startsWith("0")) {
      sanitized = "0" + sanitized;
    }
    return sanitized;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: contact?.name || "",
      email: contact?.email || "",
      phone_number: contact?.phone_number || "",
      message: contact?.message || "",
    },
  });

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      const sanitizedData = {
        ...data,
        phone_number: formatPhone(data.phone_number),
        _id: contact?._id,
      };
      await onSave(sanitizedData);
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
    } finally {
      setLoadingSave(false);
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
        <DialogHeader className="p-8 pb-4 bg-gray-50/50 text-center">
          <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight">
            {t("Edit Contact")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[70vh] p-8 pt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Name")}
                </Label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t("Enter name")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold"
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {t("Name is required")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Email")}
                </Label>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: true, pattern: /^\S+@\S+\.\S+$/ }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder={t("Enter email")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-medium"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {t("Valid email is required")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Phone Number")}
                </Label>
                <Controller
                  name="phone_number"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        field.onChange(val);
                      }}
                      placeholder={t("Enter phone number")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-medium"
                    />
                  )}
                />
                {errors.phone_number && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {t("Phone number is required")}
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
                      rows={4}
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
                  {t("Saving...")}
                </div>
              ) : (
                t("Save")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditContactForm;
