import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Iconify from "../../../components/iconify";

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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

function EditReviewForm({ review, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      _id: review._id,
      rating: review.rating,
      comment: review.comment,
      review_date: review.review_date.slice(0, 10),
      status: review.status,
    },
  });

  const [loadingSave, setLoadingSave] = useState(false);

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      await onSave({
        ...data,
        review_date: new Date(data.review_date).toISOString(),
        status: data.status,
      });
      onClose();
    } catch (error) {
      console.error("Error saving review:", error);
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
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50 text-center">
          <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight">
            {t("Edit Review")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[70vh] p-8 pt-4">
            <div className="space-y-6">
              {/* Rating */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Rating")}
                </Label>
                <Controller
                  name="rating"
                  control={control}
                  rules={{ required: t("Rating is required"), min: 1, max: 5 }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="1-5"
                      className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all ${
                        errors.rating
                          ? "border-red-500 focus:ring-red-500/10"
                          : ""
                      }`}
                    />
                  )}
                />
                {errors.rating && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              {/* Review Date */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Review Date")}
                </Label>
                <Controller
                  name="review_date"
                  control={control}
                  rules={{ required: t("Review date is required") }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all ${
                        errors.review_date
                          ? "border-red-500 focus:ring-red-500/10"
                          : ""
                      }`}
                    />
                  )}
                />
                {errors.review_date && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.review_date.message}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Comment")}
                </Label>
                <Controller
                  name="comment"
                  control={control}
                  rules={{ required: t("Comment is required") }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      rows={4}
                      className={`min-h-[120px] rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 resize-none p-4 transition-all ${
                        errors.comment
                          ? "border-red-500 focus:ring-red-500/10"
                          : ""
                      }`}
                      placeholder={t("Write the review comment here...")}
                    />
                  )}
                />
                {errors.comment && (
                  <p className="text-xs font-bold text-red-500 ml-1">
                    {errors.comment.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all hover:bg-gray-100/50">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold text-gray-900">
                    {t("Status")}
                  </Label>
                  <p className="text-xs text-gray-500 font-medium">
                    {t("Toggle the visibility of this review.")}
                  </p>
                </div>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-black uppercase tracking-widest ${
                          field.value === "active"
                            ? "text-primary"
                            : "text-gray-400"
                        }`}
                      >
                        {field.value === "active" ? t("Active") : t("Inactive")}
                      </span>
                      <Switch
                        checked={field.value === "active"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "active" : "inactive")
                        }
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  )}
                />
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
                t("Save Changes")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditReviewForm;
