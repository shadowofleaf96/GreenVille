"use client";

import { useState, useEffect } from "react";
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
import Iconify from "@/components/shared/iconify";
import UploadButton from "@/admin/_components/button/UploadButton";
import LazyImage from "@/components/shared/lazyimage/LazyImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import createAxiosInstance from "@/utils/axiosConfig";
import { toast } from "react-toastify";

function EditSubCategoryForm({ subcategory, open, onClose, onSave }) {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    subcategory?.subcategory_image || null,
  );
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(false);

  const axiosInstance = createAxiosInstance("admin");

  useEffect(() => {
    const fetchCategories = async () => {
      setFetchingCategories(true);
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(t("Failed to fetch categories"));
      } finally {
        setFetchingCategories(false);
      }
    };

    if (open) {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subcategory_name: subcategory?.subcategory_name || {
        en: "",
        fr: "",
        ar: "",
      },
      category_id: subcategory?.category?._id || "",
      status: subcategory?.status || false,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const sanitized = {
        subcategory_name: {
          en: DOMPurify.sanitize(data.subcategory_name.en),
          fr: DOMPurify.sanitize(data.subcategory_name.fr),
          ar: DOMPurify.sanitize(data.subcategory_name.ar),
        },
        category_id: data.category_id,
        status: data.status,
      };
      await onSave(sanitized, imageFile);
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50">
          <DialogTitle className="text-3xl font-extrabold text-primary tracking-tight">
            {t("Edit Subcategory")}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] p-8 pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center border-4 border-white shadow-inner overflow-hidden">
                  {imagePreview ? (
                    <LazyImage
                      src={imagePreview}
                      alt="Subcategory"
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
                <span className="text-xs font-medium text-gray-400">
                  {t("Update subcategory icon or image")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name_en"
                  className="text-sm font-bold text-gray-700 ml-1"
                >
                  {t("Subcategory Name (English)")}
                </Label>
                <Controller
                  name="subcategory_name.en"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <Input
                        id="name_en"
                        placeholder={t("Subcategory name in English")}
                        {...field}
                        className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                          errors.subcategory_name?.en
                            ? "border-red-300 ring-red-100 focus:ring-red-100"
                            : ""
                        }`}
                      />
                      {errors.subcategory_name?.en && (
                        <p className="text-red-500 mt-1 text-xs font-bold italic">
                          {t("This field is required")}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="name_fr"
                  className="text-sm font-bold text-gray-700 ml-1"
                >
                  {t("Subcategory Name (French)")}
                </Label>
                <Controller
                  name="subcategory_name.fr"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <Input
                        id="name_fr"
                        placeholder={t("Subcategory name in French")}
                        {...field}
                        className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                          errors.subcategory_name?.fr
                            ? "border-red-300 ring-red-100 focus:ring-red-100"
                            : ""
                        }`}
                      />
                      {errors.subcategory_name?.fr && (
                        <p className="text-red-500 mt-1 text-xs font-bold italic">
                          {t("This field is required")}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="name_ar"
                  className="text-sm font-bold text-gray-700 ml-1"
                >
                  {t("Subcategory Name (Arabic)")}
                </Label>
                <Controller
                  name="subcategory_name.ar"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <Input
                        id="name_ar"
                        placeholder={t("Subcategory name in Arabic")}
                        {...field}
                        className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                          errors.subcategory_name?.ar
                            ? "border-red-300 ring-red-100 focus:ring-red-100"
                            : ""
                        }`}
                      />
                      {errors.subcategory_name?.ar && (
                        <p className="text-red-500 mt-1 text-xs font-bold italic">
                          {t("This field is required")}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category_id"
                  className="text-sm font-bold text-gray-700 ml-1"
                >
                  {t("Category")}
                </Label>
                <Controller
                  name="category_id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={fetchingCategories}
                      >
                        <SelectTrigger
                          id="category_id"
                          className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                            errors.category_id
                              ? "border-red-300 ring-red-100 focus:ring-red-100"
                              : ""
                          }`}
                        >
                          <SelectValue
                            placeholder={
                              fetchingCategories
                                ? t("Loading categories...")
                                : t("Select a category")
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                          {categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category._id}
                              className="focus:bg-primary/5 focus:text-primary font-medium"
                            >
                              {category.category_name[
                                i18n.language.split("-")[0]
                              ] || category.category_name.en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category_id && (
                        <p className="text-red-500 mt-1 text-xs font-bold italic">
                          {t("Category required")}
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
                              ? t("Subcategory will be visible on the store")
                              : t("Subcategory will be hidden from the store")}
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
            <button
              type="submit"
              className="hidden"
              id="edit-form-submit-btn"
            />
          </form>
        </ScrollArea>

        <DialogFooter className="p-8 bg-gray-50 border-t flex flex-row sm:justify-between items-center sm:gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={() => {
              const btn = document.getElementById("edit-form-submit-btn");
              if (btn) btn.click();
            }}
            disabled={loading}
            className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
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

export default EditSubCategoryForm;
