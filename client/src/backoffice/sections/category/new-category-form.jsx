import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";

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
import Iconify from "../../../components/iconify";
import UploadButton from "../../components/button/UploadButton";
import LazyImage from "../../../components/lazyimage/LazyImage";

function AddCategoryForm({ onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [loadingSave, setLoadingSave] = useState(false);
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
      e.target.value = null;
    }
  };

  const handleRemoveImage = () => {
    setCategoryImage(null);
    setImagePreview(null);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_name: {
        en: "",
        fr: "",
        ar: "",
      },
      status: false,
    },
  });

  const handleSave = async (data) => {
    setLoadingSave(true);
    try {
      const sanitizedData = {
        category_name: {
          en: DOMPurify.sanitize(data.category_name.en),
          fr: DOMPurify.sanitize(data.category_name.fr),
          ar: DOMPurify.sanitize(data.category_name.ar),
        },
        status: data.status,
      };
      await onSave(sanitizedData, categoryImage);
      setCategoryImage(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50">
          <DialogTitle className="text-3xl font-extrabold text-primary tracking-tight">
            {t("Add Category")}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] p-8 pt-4">
          <form onSubmit={handleSubmit(handleSave)} className="space-y-8">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center border-4 border-white shadow-inner overflow-hidden">
                  {imagePreview ? (
                    <LazyImage
                      src={imagePreview}
                      alt="Category"
                      className="w-full h-full object-cover animate-in fade-in duration-300"
                    />
                  ) : (
                    <Iconify
                      icon="material-symbols:category-outline"
                      className="text-gray-300"
                      width={64}
                    />
                  )}
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg border border-gray-100 text-destructive hover:scale-110 active:scale-90 transition-all z-10"
                  >
                    <Iconify icon="eva:close-fill" width={18} />
                  </button>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <UploadButton onChange={handleImageChange} />
                {!imagePreview && (
                  <span className="text-xs font-medium text-gray-400">
                    {t("Upload category icon or image")}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="category_name_en"
                  className="text-sm font-bold text-gray-700 ml-1"
                >
                  {t("Category Name (English)")}
                </Label>
                <Controller
                  name="category_name.en"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <Input
                        id="category_name_en"
                        placeholder={t("Category name in English")}
                        {...field}
                        className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                          errors.category_name?.en
                            ? "border-red-300 ring-red-100 focus:ring-red-100"
                            : ""
                        }`}
                      />
                      {errors.category_name?.en && (
                        <p className="text-xs font-bold text-red-500 ml-1 mt-1 italic">
                          {t("This field is required")}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category_name_fr"
                  className="text-sm font-bold text-gray-700 ml-1"
                >
                  {t("Category Name (French)")}
                </Label>
                <Controller
                  name="category_name.fr"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <Input
                        id="category_name_fr"
                        placeholder={t("Category name in French")}
                        {...field}
                        className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                          errors.category_name?.fr
                            ? "border-red-300 ring-red-100 focus:ring-red-100"
                            : ""
                        }`}
                      />
                      {errors.category_name?.fr && (
                        <p className="text-xs font-bold text-red-500 ml-1 mt-1 italic">
                          {t("This field is required")}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category_name_ar"
                  className="text-sm font-bold text-gray-700 ml-1"
                >
                  {t("Category Name (Arabic)")}
                </Label>
                <Controller
                  name="category_name.ar"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <Input
                        id="category_name_ar"
                        placeholder={t("Category name in Arabic")}
                        {...field}
                        className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                          errors.category_name?.ar
                            ? "border-red-300 ring-red-100 focus:ring-red-100"
                            : ""
                        }`}
                      />
                      {errors.category_name?.ar && (
                        <p className="text-xs font-bold text-red-500 ml-1 mt-1 italic">
                          {t("This field is required")}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Status */}
              <div className="pt-4">
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold text-gray-900">
                      {t("Display Status")}
                    </Label>
                    <p className="text-sm text-gray-500">
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <>
                            {field.value
                              ? t("Category will be visible on the store")
                              : t("Category will be hidden from the store")}
                          </>
                        )}
                      />
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <>
                          <span
                            className={`text-sm font-bold uppercase tracking-wider ${
                              field.value ? "text-green-600" : "text-gray-400"
                            }`}
                          >
                            {field.value ? t("Active") : t("Inactive")}
                          </span>
                          <Switch
                            id="status"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-green-500"
                          />
                        </>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* hidden submit button for react-hook-form handle submit to work with outside footer */}
            <button type="submit" className="hidden" id="form-submit-btn" />
          </form>
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
            onClick={() => {
              const btn = document.getElementById("form-submit-btn");
              if (btn) btn.click();
            }}
            disabled={loadingSave}
            className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loadingSave ? (
              <div className="flex items-center gap-2">
                <Iconify
                  icon="svg-spinners:180-ring-with-bg"
                  className="mr-2"
                  width={16}
                  height={16}
                />
                {t("Saving...")}
              </div>
            ) : (
              t("Save")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddCategoryForm;
