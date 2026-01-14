import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Iconify from "../../../components/iconify";
import createAxiosInstance from "../../../utils/axiosConfig";

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

function EditCouponForm({ coupon, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      _id: coupon._id,
      code: coupon.code,
      discount: coupon.discount,
      expiresAt: coupon.expiresAt?.slice(0, 10) || "",
      usageLimit: coupon.usageLimit,
      status: coupon.status, // "active" or "inactive"
    },
  });

  const [loadingSave, setLoadingSave] = useState(false);
  const [usedByUsers, setUsedByUsers] = useState(coupon.usedBy || []);
  const [loadingRevoke, setLoadingRevoke] = useState(null);

  const axiosInstance = createAxiosInstance("admin");

  const handleRevokeUsage = async (userId) => {
    setLoadingRevoke(userId);
    try {
      const response = await axiosInstance.delete(
        `/coupons/revoke-usage/${coupon._id}/${userId}`,
      );
      setUsedByUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error revoking usage:", error);
      toast.error(t("Failed to revoke usage"));
    } finally {
      setLoadingRevoke(null);
    }
  };

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      await onSave({
        ...data,
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt).toISOString()
          : null,
      });
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
            {t("Edit Coupon")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[70vh] p-8 pt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Coupon Code")}
                </Label>
                <Input
                  {...register("code", { required: true })}
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
                            field.value === "active"
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {field.value === "active"
                            ? t("Active")
                            : t("Inactive")}
                        </span>
                        <Switch
                          checked={field.value === "active"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "active" : "inactive")
                          }
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>

              {usedByUsers.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 ml-1">
                    <Iconify
                      icon="solar:users-group-rounded-bold-duotone"
                      className="text-primary"
                      width={20}
                    />
                    <Label className="text-sm font-bold text-gray-700">
                      {t("Used By")} ({usedByUsers.length})
                    </Label>
                  </div>
                  <div className="space-y-2">
                    {usedByUsers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100 group hover:bg-white hover:border-primary/20 transition-all"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 leading-none mb-1">
                            {user.name}
                          </span>
                          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                            {user.email}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRevokeUsage(user._id)}
                          disabled={loadingRevoke === user._id}
                          className="h-8 w-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          {loadingRevoke === user._id ? (
                            <Iconify
                              icon="svg-spinners:180-ring-with-bg"
                              width={16}
                            />
                          ) : (
                            <Iconify
                              icon="solar:trash-bin-trash-bold-duotone"
                              width={18}
                            />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                t("Save Changes")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditCouponForm;
