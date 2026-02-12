"use client";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

function NewCouponForm({ onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      status: false,
      code: "",
      discount: "",
      expiresAt: "",
      usageLimit: "",
    },
  });

  const [loadingSave, setLoadingSave] = useState(false);

  const handleSave = async (data) => {
    setLoadingSave(true);
    try {
      await onSave(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error saving coupon:", error);
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
            {t("Add Coupon")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSave)}>
          <ScrollArea className="max-h-[70vh] p-8 pt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Coupon Code")}
                </Label>
                <Input
                  {...register("code", { required: true })}
                  placeholder="e.g. SUMMER25"
                  className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                    errors.code ? "border-red-300 ring-red-100" : ""
                  }`}
                />
                {errors.code && (
                  <p className="text-xs font-bold text-red-500 ml-1 italic">
                    {t("This field is required")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Discount (%)")}
                </Label>
                <Input
                  type="number"
                  {...register("discount", {
                    required: true,
                    min: 0,
                    max: 100,
                  })}
                  className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                    errors.discount ? "border-red-300 ring-red-100" : ""
                  }`}
                />
                {errors.discount && (
                  <p className="text-xs font-bold text-red-500 ml-1 italic">
                    {t("Enter a valid discount (0-100)")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Expiration Date")}
                </Label>
                <Input
                  type="date"
                  {...register("expiresAt", { required: true })}
                  className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                    errors.expiresAt ? "border-red-300 ring-red-100" : ""
                  }`}
                />
                {errors.expiresAt && (
                  <p className="text-xs font-bold text-red-500 ml-1 italic">
                    {t("This field is required")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Usage Limit")}
                </Label>
                <Input
                  type="number"
                  {...register("usageLimit")}
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                />
              </div>

              <div className="pt-4">
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold text-gray-900">
                      {t("Status")}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {t("Toggle to activate/deactivate coupon")}
                    </p>
                  </div>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-sm font-bold uppercase tracking-wider ${
                            field.value ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {field.value ? t("Active") : t("Inactive")}
                        </span>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-8 bg-gray-50 border-t flex flex-row sm:justify-between items-center sm:gap-4">
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
                t("Save Coupon")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default NewCouponForm;
