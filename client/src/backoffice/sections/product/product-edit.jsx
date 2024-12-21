import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DOMPurify from "dompurify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Iconify from "../../components/iconify/iconify";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import UploadButton from "../../components/button/UploadButton";
import createAxiosInstance from "../../../utils/axiosConfig";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function EditProductForm({ Product, onSave, onCancel, open, onClose }) {
  const { t, i18n } = useTranslation();
  const [subcategories, setSubcategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState(Product?.product_images || []);
  const [loadingSave, setLoadingSave] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [generalCompleted, setGeneralCompleted] = useState(false);
  const [englishCompleted, setEnglishCompleted] = useState(false);
  const [frenchCompleted, setFrenchCompleted] = useState(false);
  const [arabicCompleted, setArabicCompleted] = useState(false);
  const currentLanguage = i18n.language

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
      subcategory_id: Product?.subcategory_id || "",
      short_description: Product?.short_description || { en: "", fr: "", ar: "" },
      long_description: Product?.long_description || { en: "", fr: "", ar: "" },
      price: Product?.price || 0,
      discount_price: Product?.discount_price || 0,
      quantity: Product?.quantity || 0,
      option: Product?.option || "",
      status: Product?.status || false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (subcategories && subcategories.length > 0) {
        return;
      }

      try {
        const axiosInstance = createAxiosInstance("admin");
        const response = await axiosInstance.get("/subcategories");
        setSubcategories(response.data.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, [subcategories]);

  useEffect(() => {
    const sku = watch("sku");
    const subcategory_id = watch("subcategory_id");
    const price = watch("price");
    const discount_price = watch("discount_price");
    const quantity = watch("quantity");
    const option = watch("option");

    const isGeneralValid =
      sku &&
      option &&
      subcategory_id &&
      price > 0 &&
      discount_price >= 0 &&
      quantity > 0;

    setGeneralCompleted(isGeneralValid);
  }, [watch("sku"), watch("option"), watch("subcategory_id"), watch("price"), watch("discount_price"), watch("quantity")]);

  useEffect(() => {
    const isEnglishValid =
      watch("product_name.en") &&
      watch("short_description.en") &&
      watch("long_description.en");
    setEnglishCompleted(isEnglishValid);
  }, [watch("product_name.en"), watch("short_description.en"), watch("long_description.en")]);

  useEffect(() => {
    const isFrenchValid =
      watch("product_name.fr") &&
      watch("short_description.fr") &&
      watch("long_description.fr");
    setFrenchCompleted(isFrenchValid);
  }, [watch("product_name.fr"), watch("short_description.fr"), watch("long_description.fr")]);

  useEffect(() => {
    const isArabicValid =
      watch("product_name.ar") &&
      watch("short_description.ar") &&
      watch("long_description.ar");
    setArabicCompleted(isArabicValid);
  }, [watch("product_name.ar"), watch("short_description.ar"), watch("long_description.ar")]);

  const handleNext = () => {
    if (activeTab === 0 && !generalCompleted) return;
    if (activeTab === 1 && !englishCompleted) return;
    if (activeTab === 2 && !frenchCompleted) return;
    if (activeTab === 3 && arabicCompleted) {
      handleSubmit(onSubmit)();
      return;
    } else if (!arabicCompleted && activeTab === 3) {
      toast.error("Error: Arabic completion is required.");
    }
    setActiveTab((prev) => prev + 1);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (selectedImages.length + files.length > 5) {
      toast.error("You can only upload a maximum of 5 images.");
      return;
    }

    setSelectedImages((prevImages) => {
      return [...prevImages, ...files].sort((a, b) => a.name.localeCompare(b.name));
    });
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
      reset();
      setSelectedImages([]);
    }
  };  

  return (
    <Modal open={open} onClose={onClose}>
      <Stack
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          p: 4,
          width: 450,
          color: "#333",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "16px",
          margin: "0 16px",
          padding: "20px",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#3f51b5", marginBottom: 2 }}>
          {t("Edit Product")}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
            <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
              <TabList className="flex justify-center gap-2">
                <Tab className={`cursor-pointer py-2 px-4 text-base font-semibold ${activeTab === 0 ? "border-b-2 border-light-green-500 text-light-green-500" : "text-gray-700"}`}>{t("General")}</Tab>
                <Tab className={`cursor-pointer py-2 px-4 text-base font-semibold ${activeTab === 1 ? "border-b-2 border-light-green-500 text-light-green-500" : "text-gray-700"}`}>{t("English")}</Tab>
                <Tab className={`cursor-pointer py-2 px-4 text-base font-semibold ${activeTab === 2 ? "border-b-2 border-light-green-500 text-light-green-500" : "text-gray-700"}`}>{t("French")}</Tab>
                <Tab className={`cursor-pointer py-2 px-4 text-base font-semibold ${activeTab === 3 ? "border-b-2 border-light-green-500 text-light-green-500" : "text-gray-700"}`}>{t("Arabic")}</Tab>
              </TabList>

              <TabPanel className="mt-5">
                <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
                  <TextField label={t("SKU")} {...register("sku", { required: "SKU is required" })} error={!!errors.sku} helperText={errors.sku?.message} fullWidth />
                </Stack>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>{t("Subcategory")}</InputLabel>
                  <Controller
                    name="subcategory_id"
                    control={control}
                    rules={{ required: "Subcategory is required" }}
                    render={({ field }) => {
                      const validValue = subcategories.some(subcategory => subcategory._id === field.value) ? field.value : "";

                      return (
                        <Select
                          {...field}
                          label={t("Subcategory")}
                          error={!!errors.subcategory_id}
                          onChange={(event) => field.onChange(event.target.value)}
                          value={validValue}
                        >
                          {subcategories.map((subcategory) => (
                            <MenuItem key={subcategory._id} value={subcategory._id}>
                              {t(subcategory.subcategory_name[currentLanguage])}
                            </MenuItem>
                          ))}
                        </Select>
                      );
                    }}
                  />
                  {errors.subcategory_id && (
                    <Typography color="error">{errors.subcategory_id.message}</Typography>
                  )}
                </FormControl>
                <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
                  <TextField label={t("Price")} {...register("price", { required: "Price is required" })} error={!!errors.price} helperText={errors.price?.message} fullWidth />
                  <TextField label={t("Discount Price")} {...register("discount_price")} fullWidth />
                </Stack>
                <TextField
                  label={t("Quantity")}
                  {...register("quantity", { required: "Quantity is required" })}
                  error={!!errors.quantity}
                  helperText={errors.quantity?.message}
                  fullWidth
                />
                <TextField
                  label={t("Options (comma-separated)")}
                  {...register("option")}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />

                <Stack direction="row" spacing={2} alignItems="center" justifyContent={"center"}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        label={<Typography variant="body2">{field.value ? t("Active") : t("Inactive")}</Typography>}
                        control={<Switch {...field} checked={field.value} />}
                      />
                    )}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="fileInput"
                    multiple
                    onChange={handleImageChange}
                    // This code is very important if you want to upload duplicates images
                    onClick={(event) => {
                      event.target.value = null
                    }}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="fileInput">
                    <UploadButton />
                  </label>
                </Stack>
                {selectedImages.length > 0 && (
                  <Stack spacing={2} direction={"row"} alignItems="center" justifyContent="center">
                    {selectedImages.map((image, index) => {
                      const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;
                      return (
                        <div
                          key={index}
                          style={{
                            position: 'relative',
                            display: 'inline-block',
                            maxWidth: '10%',
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt={`Image ${index + 1}`}
                            style={{
                              width: '100%',
                              height: 'auto',
                              display: 'block',
                            }}
                          />

                          <Iconify
                            icon="material-symbols-light:close"
                            width={18}
                            height={18}
                            onClick={() => handleRemoveImage(index)}
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              cursor: 'pointer',
                              zIndex: 10,
                              color: 'red',
                              background: 'white',
                              borderRadius: '50%',
                              padding: '2px',
                            }}
                          />
                        </div>
                      );
                    })}
                  </Stack>
                )}


                <Typography variant="caption" display="block" align="center" color="textSecondary" sx={{ marginTop: 1 }}>
                  {t("You can upload a maximum of 5 images as product images.")}
                </Typography>
              </TabPanel>

              <TabPanel>
                <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
                  <TextField label={t("Product Name")} {...register("product_name.en")} fullWidth />
                </Stack>
                <TextField
                  label={t("Short Description")}
                  {...register("short_description.en")}
                  fullWidth
                  multiline
                  rows={4}
                />
                <TextField
                  label={t("Long Description")}
                  {...register("long_description.en")}
                  fullWidth
                  multiline
                  rows={4}
                />
              </TabPanel>

              <TabPanel>
                <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
                  <TextField label={t("Product Name")} {...register("product_name.fr")} fullWidth />
                </Stack>
                <TextField
                  label={t("Short Description")}
                  {...register("short_description.fr")}
                  fullWidth
                  multiline
                  rows={4}
                />
                <TextField
                  label={t("Long Description")}
                  {...register("long_description.fr")}
                  fullWidth
                  multiline
                  rows={4}
                />
              </TabPanel>

              <TabPanel>
                <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
                  <TextField label={t("Product Name")} {...register("product_name.ar")} fullWidth />
                </Stack>
                <TextField
                  label={t("Short Description")}
                  {...register("short_description.ar")}
                  fullWidth
                  multiline
                  rows={4}
                />
                <TextField
                  label={t("Long Description")}
                  {...register("long_description.ar")}
                  fullWidth
                  multiline
                  rows={4}
                />
              </TabPanel>
            </Tabs>
          </Stack>

          <Stack direction="row" spacing={2} className="rtl:gap-4" sx={{ marginTop: 2, width: "100%" }}>
            <LoadingButton
              loading={loadingSave}
              variant="contained"
              onClick={handleNext}
              sx={{ flex: 1 }}
              disabled={activeTab === 3 && !generalCompleted}
            >
              {activeTab === 3 ? t("Save") : t("Continue")}
            </LoadingButton>
            <Button variant="outlined" onClick={onCancel} sx={{ flex: 1 }}>
              {t("Cancel")}
            </Button>
          </Stack>
        </form>
      </Stack >
    </Modal >
  );
}

export default EditProductForm;
