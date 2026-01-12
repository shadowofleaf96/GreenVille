import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Iconify from "../../../components/iconify";
import UploadButton from "../../components/button/UploadButton";
import LazyImage from "@/components/lazyimage/LazyImage";
import { useSubcategories } from "@/api/queries";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

function EditProductForm({ Product, onSave, onCancel, open, onClose }) {
  const { t, i18n } = useTranslation();
  const { data: subcategories = [] } = useSubcategories();
  const [selectedImages, setSelectedImages] = useState(
    Product?.product_images || [],
  );
  const [loadingSave, setLoadingSave] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [generalCompleted, setGeneralCompleted] = useState(false);
  const [englishCompleted, setEnglishCompleted] = useState(false);
  const [frenchCompleted, setFrenchCompleted] = useState(false);
  const [arabicCompleted, setArabicCompleted] = useState(false);
  const currentLanguage = i18n.language;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      sku: Product?.sku || "",
      product_name: Product?.product_name || { en: "", fr: "", ar: "" },
      subcategory_id:
        Product?.subcategory_id?._id || Product?.subcategory_id || "",
      short_description: Product?.short_description || {
        en: "",
        fr: "",
        ar: "",
      },
      long_description: Product?.long_description || { en: "", fr: "", ar: "" },
      price: Product?.price || 0,
      discount_price: Product?.discount_price || 0,
      quantity: Product?.quantity || 0,
      option: Product?.option || "",
      on_sale: Product?.on_sale || false,
      status: Product?.status || false,
      variants: Product?.variants || [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Re-initialize form when Product changes
  useEffect(() => {
    if (Product) {
      reset({
        sku: Product.sku,
        product_name: Product.product_name,
        subcategory_id:
          Product.subcategory_id?._id || Product.subcategory_id || "",
        short_description: Product.short_description,
        long_description: Product.long_description,
        price: Product.price,
        discount_price: Product.discount_price,
        quantity: Product.quantity,
        option: Product.option,
        on_sale: Product.on_sale,
        status: Product.status,
        variants: Product.variants,
      });
      setSelectedImages(Product.product_images || []);
    }
  }, [Product, reset]);

  // Validation watchers
  const sku = watch("sku");
  const subcategory_id = watch("subcategory_id");
  const price = watch("price");
  const discount_price = watch("discount_price");
  const quantity = watch("quantity");
  const option = watch("option");

  useEffect(() => {
    const isGeneralValid =
      sku &&
      option &&
      subcategory_id &&
      price > 0 &&
      discount_price >= 0 &&
      quantity > 0;
    setGeneralCompleted(!!isGeneralValid);
  }, [sku, option, subcategory_id, price, discount_price, quantity]);

  const pNameEn = watch("product_name.en");
  const sDescEn = watch("short_description.en");
  const lDescEn = watch("long_description.en");
  useEffect(() => {
    setEnglishCompleted(!!(pNameEn && sDescEn && lDescEn));
  }, [pNameEn, sDescEn, lDescEn]);

  const pNameFr = watch("product_name.fr");
  const sDescFr = watch("short_description.fr");
  const lDescFr = watch("long_description.fr");
  useEffect(() => {
    setFrenchCompleted(!!(pNameFr && sDescFr && lDescFr));
  }, [pNameFr, sDescFr, lDescFr]);

  const pNameAr = watch("product_name.ar");
  const sDescAr = watch("short_description.ar");
  const lDescAr = watch("long_description.ar");
  useEffect(() => {
    setArabicCompleted(!!(pNameAr && sDescAr && lDescAr));
  }, [pNameAr, sDescAr, lDescAr]);

  const handleNext = () => {
    if (activeTab === "general") {
      if (!generalCompleted) {
        toast.error(t("Please complete general information"));
        return;
      }
      setActiveTab("variants");
    } else if (activeTab === "variants") {
      setActiveTab("english");
    } else if (activeTab === "english") {
      if (!englishCompleted) {
        toast.error(t("Please complete English information"));
        return;
      }
      setActiveTab("french");
    } else if (activeTab === "french") {
      if (!frenchCompleted) {
        toast.error(t("Please complete French information"));
        return;
      }
      setActiveTab("arabic");
    } else if (activeTab === "arabic") {
      if (!arabicCompleted) {
        toast.error(t("Please complete Arabic information"));
        return;
      }
      handleSubmit(onSubmit)();
    }
  };

  const handleImageChange = (file) => {
    if (selectedImages.length >= 5) {
      toast.error(t("You can only upload a maximum of 5 images."));
      return;
    }
    setSelectedImages((prev) => [...prev, file]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      const sanitizedData = {
        ...data,
        _id: Product?._id,
        product_name: {
          en: DOMPurify.sanitize(data.product_name.en),
          fr: DOMPurify.sanitize(data.product_name.fr),
          ar: DOMPurify.sanitize(data.product_name.ar),
        },
        short_description: {
          en: DOMPurify.sanitize(data.short_description.en),
          fr: DOMPurify.sanitize(data.short_description.fr),
          ar: DOMPurify.sanitize(data.short_description.ar),
        },
        long_description: {
          en: DOMPurify.sanitize(data.long_description.en),
          fr: DOMPurify.sanitize(data.long_description.fr),
          ar: DOMPurify.sanitize(data.long_description.ar),
        },
      };

      if (data.sku !== Product.sku) {
        sanitizedData.sku = DOMPurify.sanitize(data.sku);
      }

      await onSave(sanitizedData, selectedImages);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50">
          <DialogTitle className="text-3xl font-extrabold text-primary tracking-tight">
            {t("Edit Product")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1"
          >
            <div className="px-8 border-b">
              <TabsList className="bg-transparent h-auto p-0 gap-8">
                <TabsTrigger
                  value="general"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-4 text-sm font-bold transition-all relative"
                >
                  {t("General")}
                  {generalCompleted && (
                    <div className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="variants"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-4 text-sm font-bold transition-all"
                >
                  {t("Variants")}
                </TabsTrigger>
                <TabsTrigger
                  value="english"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-4 text-sm font-bold transition-all relative"
                >
                  {t("English")}
                  {englishCompleted && (
                    <div className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="french"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-4 text-sm font-bold transition-all relative"
                >
                  {t("French")}
                  {frenchCompleted && (
                    <div className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="arabic"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 py-4 text-sm font-bold transition-all relative"
                >
                  {t("Arabic")}
                  {arabicCompleted && (
                    <div className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="max-h-[60vh] p-8">
              <TabsContent value="general" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sku">{t("SKU")}</Label>
                    <Input
                      id="sku"
                      {...register("sku", { required: t("SKU is required") })}
                      placeholder="e.g. PRD-001"
                      className={
                        errors.sku
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                    />
                    {errors.sku && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.sku.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>{t("Subcategory")}</Label>
                    <Controller
                      name="subcategory_id"
                      control={control}
                      rules={{ required: t("Subcategory is required") }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            className={
                              errors.subcategory_id ? "border-destructive" : ""
                            }
                          >
                            <SelectValue
                              placeholder={t("Select subcategory")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {subcategories.map((sc) => (
                              <SelectItem key={sc._id} value={sc._id}>
                                {t(
                                  sc.subcategory_name[currentLanguage] ||
                                    sc.subcategory_name.en,
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.subcategory_id && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.subcategory_id.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">{t("Price")}</Label>
                    <Input
                      id="price"
                      type="number"
                      {...register("price", {
                        valueAsNumber: true,
                        required: t("Price is required"),
                      })}
                      className={errors.price ? "border-destructive" : ""}
                    />
                    {errors.price && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">{t("Discount Price")}</Label>
                    <Input
                      id="discount"
                      type="number"
                      {...register("discount_price", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">{t("Quantity")}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      {...register("quantity", {
                        valueAsNumber: true,
                        required: t("Quantity is required"),
                      })}
                      className={errors.quantity ? "border-destructive" : ""}
                    />
                    {errors.quantity && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="option">
                      {t("Options (comma-separated)")}
                    </Label>
                    <Input
                      id="option"
                      {...register("option")}
                      placeholder="e.g. Color, Size"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="status"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                          />
                          <Label htmlFor="status" className="font-bold">
                            {field.value ? t("Active") : t("Inactive")}
                          </Label>
                        </div>
                      )}
                    />
                    <Controller
                      name="on_sale"
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2 border-l pl-4">
                          <Switch
                            id="on_sale"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                          />
                          <Label htmlFor="on_sale" className="font-bold">
                            {t("On Sale")}
                          </Label>
                        </div>
                      )}
                    />
                  </div>

                  <UploadButton onChange={handleImageChange} />

                  {selectedImages.length > 0 && (
                    <div className="flex flex-wrap gap-4 justify-center mt-4">
                      {selectedImages.map((image, index) => {
                        const url =
                          image instanceof File
                            ? URL.createObjectURL(image)
                            : image;
                        return (
                          <div key={index} className="relative group w-20 h-20">
                            <LazyImage
                              src={url}
                              className="w-full h-full object-cover rounded-xl border border-gray-100 shadow-sm"
                            />
                            <Button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white p-0 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                            >
                              <Iconify
                                icon="material-symbols:close"
                                width={14}
                              />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground font-medium text-center">
                    {t("You can upload a maximum of 5 images.")}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="variants" className="mt-0 space-y-6">
                <Button
                  type="button"
                  onClick={() =>
                    append({ variant_name: "", price: 0, quantity: 0, sku: "" })
                  }
                  className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none rounded-xl font-bold"
                >
                  <Iconify icon="material-symbols:add" className="mr-2" />
                  {t("Add Variant")}
                </Button>

                <div className="space-y-4">
                  {fields.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-4 relative group"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="absolute top-2 right-2 text-destructive hover:bg-destructive/10 rounded-full"
                      >
                        <Iconify
                          icon="material-symbols:delete-rounded"
                          width={20}
                        />
                      </Button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                            {t("Variant Name")}
                          </Label>
                          <Input
                            {...register(`variants.${index}.variant_name`, {
                              required: true,
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                            {t("SKU")}
                          </Label>
                          <Input
                            {...register(`variants.${index}.sku`, {
                              required: true,
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                            {t("Price")}
                          </Label>
                          <Input
                            type="number"
                            {...register(`variants.${index}.price`, {
                              valueAsNumber: true,
                              required: true,
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                            {t("Quantity")}
                          </Label>
                          <Input
                            type="number"
                            {...register(`variants.${index}.quantity`, {
                              valueAsNumber: true,
                              required: true,
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className="text-center py-10 text-gray-400 font-medium italic">
                      {t("No variants added yet")}
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="english" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name_en">{t("Product Name")} (EN)</Label>
                    <Input
                      id="name_en"
                      {...register("product_name.en", { required: true })}
                      placeholder="Product name in English"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sdesc_en">
                      {t("Short Description")} (EN)
                    </Label>
                    <Input
                      id="sdesc_en"
                      {...register("short_description.en")}
                      placeholder="Brief overview"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ldesc_en">
                      {t("Long Description")} (EN)
                    </Label>
                    <Textarea
                      id="ldesc_en"
                      {...register("long_description.en")}
                      rows={6}
                      placeholder="Detailed product specifications..."
                      className="resize-none"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="french" className="mt-0 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name_fr">{t("Product Name")} (FR)</Label>
                    <Input
                      id="name_fr"
                      {...register("product_name.fr", { required: true })}
                      placeholder="Nom du produit en français"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sdesc_fr">
                      {t("Short Description")} (FR)
                    </Label>
                    <Input
                      id="sdesc_fr"
                      {...register("short_description.fr")}
                      placeholder="Aperçu rapide"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ldesc_fr">
                      {t("Long Description")} (FR)
                    </Label>
                    <Textarea
                      id="ldesc_fr"
                      {...register("long_description.fr")}
                      rows={6}
                      placeholder="Description détaillée..."
                      className="resize-none"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="arabic" className="mt-0 space-y-6">
                <div
                  className="space-y-4 text-right rtl:space-x-reverse"
                  dir="rtl"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name_ar">{t("Product Name")} (AR)</Label>
                    <Input
                      id="name_ar"
                      {...register("product_name.ar", { required: true })}
                      placeholder="اسم المنتج"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sdesc_ar">
                      {t("Short Description")} (AR)
                    </Label>
                    <Input
                      id="sdesc_ar"
                      {...register("short_description.ar")}
                      placeholder="وصف قصير"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ldesc_ar">
                      {t("Long Description")} (AR)
                    </Label>
                    <Textarea
                      id="ldesc_ar"
                      {...register("long_description.ar")}
                      rows={6}
                      placeholder="وصف مفصل..."
                      className="resize-none"
                    />
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter className="p-8 bg-gray-50 border-t flex flex-row sm:justify-between items-center sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-8 h-12 rounded-2xl border-none bg-white text-gray-500 hover:bg-gray-100 font-bold"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={loadingSave}
              className="px-10 h-12 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              {loadingSave && (
                <Iconify
                  icon="svg-spinners:180-ring-with-bg"
                  className="mr-2"
                  width={18}
                />
              )}
              {activeTab === "arabic" ? t("Save Product") : t("Continue")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditProductForm;
