import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DOMPurify from "dompurify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Iconify from "../../components/iconify/iconify";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import UploadButton from "../../components/button/UploadButton";
import createAxiosInstance from "../../../utils/axiosConfig";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function NewProductForm({ onSave, onCancel, open, onClose }) {
  const { t, i18n } = useTranslation();
  const [subcategories, setSubcategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
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
    formState: { errors, isValid },
    reset,
  } = useForm({
    defaultValues: {
      sku: "",
      product_name: "",
      subcategory_id: "",
      short_description: "",
      long_description: "",
      price: 0,
      discount_price: 0,
      quantity: 0,
      option: "",
      active: false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const axiosInstance = createAxiosInstance("admin");
        const response = await axiosInstance.get("/subcategories");
        setSubcategories(response.data.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubcategories();
  }, []);

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


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const currentImages = selectedImages.length;

    if (currentImages + files.length > 5) {
      toast.error("You can only upload a maximum of 5 images.");
      return;
    }

    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      const sanitizedData = {
        ...data,
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
      await onSave(sanitizedData, selectedImages);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoadingSave(false);
      reset();
      setSelectedImages([])
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
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#3f51b5", marginBottom: 2 }}
        >
          {t("New Product")}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
            <Tabs selectedIndex={activeTab} onSelect={(index) => setActiveTab(index)}>
              <TabList className={"flex justify-center gap-2"}>
                <Tab
                  className={`cursor-pointer py-2 px-4 text-base font-semibold ${activeTab === 0 ? "border-b-2 border-light-green-500 text-light-green-500" : "text-gray-700"}`}
                >
                  {t("General")}
                </Tab>
                <Tab
                  className={`cursor-pointer py-2 px-4 text-base font-semibold ${activeTab === 1 ? "border-b-2 border-light-green-500 text-light-green-500" : "text-gray-700"}`}
                >
                  {t("English")}
                </Tab>
                <Tab
                  className={`cursor-pointer py-2 px-4 text-base font-semibold ${activeTab === 2 ? "border-b-2 border-light-green-500 text-light-green-500" : "text-gray-700"}`}
                >
                  {t("French")}
                </Tab>
                <Tab
                  className={`cursor-pointer py-2 px-4 text-base font-semibold ${activeTab === 3 ? "border-b-2 border-light-green-500 text-light-green-500" : "text-gray-700"}`}
                >
                  {t("Arabic")}
                </Tab>
              </TabList>

              <TabPanel className={"mt-5"}>
                <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
                  <TextField
                    label={t("SKU")}
                    {...register("sku", { required: "SKU is required" })}
                    error={!!errors.sku}
                    helperText={errors.sku?.message}
                    fullWidth
                  />
                </Stack>
                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                  <InputLabel>{t("Subcategory")}</InputLabel>
                  <Controller
                    name="subcategory_id"
                    control={control}
                    rules={{ required: "Subcategory is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label={t("Subcategory")}
                        error={!!errors.subcategory_id}
                        onChange={(event) => field.onChange(event.target.value)}
                        value={field.value || ""}
                      >
                        {subcategories.map((subcategory) => (
                          <MenuItem key={subcategory._id} value={subcategory._id}>
                            {t(subcategory.subcategory_name[currentLanguage])}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.subcategory_id && (
                    <Typography color="error">{errors.subcategory_id.message}</Typography>
                  )}
                </FormControl>
                <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
                  <TextField
                    label={t("Price")}
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    fullWidth
                  />

                  <TextField
                    label={t("Discount Price")}
                    type="number"
                    {...register("discount_price", { valueAsNumber: true })}
                    fullWidth
                  />
                </Stack>

                <TextField
                  label={t("Quantity")}
                  type="number"
                  {...register("quantity", { valueAsNumber: true })}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />

                <TextField
                  label={t("Options (comma-separated)")}
                  {...register("option")}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />

                <Stack direction="row" spacing={2} alignItems="center" justifyContent={"center"}>
                  <Controller
                    name="active"
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
                <Stack direction="column" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
                  <TextField
                    label={`${t("Product Name")} (EN)`}
                    {...register(`product_name.en`, { required: true })}
                    error={!!errors.product_name?.en}
                    helperText={errors.product_name?.en?.message}
                    fullWidth
                  />

                  <TextField
                    label={`${t("Short Description")} (EN)`}
                    {...register(`short_description.en`)}
                    fullWidth
                  />

                  <TextField
                    label={`${t("Long Description")} (EN)`}
                    {...register(`long_description.en`)}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Stack>
              </TabPanel>

              <TabPanel>
                <Stack direction="column" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
                  <TextField
                    label={`${t("Product Name")} (FR)`}
                    {...register(`product_name.fr`, { required: true })}
                    error={!!errors.product_name?.fr}
                    helperText={errors.product_name?.fr?.message}
                    fullWidth
                  />

                  <TextField
                    label={`${t("Short Description")} (FR)`}
                    {...register(`short_description.fr`)}
                    fullWidth
                  />

                  <TextField
                    label={`${t("Long Description")} (FR)`}
                    {...register(`long_description.fr`)}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Stack>
              </TabPanel>

              <TabPanel>
                <Stack direction="column" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
                  <TextField
                    label={`${t("Product Name")} (AR)`}
                    {...register(`product_name.ar`, { required: true })}
                    error={!!errors.product_name?.ar}
                    helperText={errors.product_name?.ar?.message}
                    fullWidth
                  />

                  <TextField
                    label={`${t("Short Description")} (AR)`}
                    {...register(`short_description.ar`)}
                    fullWidth
                  />

                  <TextField
                    label={`${t("Long Description")} (AR)`}
                    {...register(`long_description.ar`)}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Stack>
              </TabPanel>
            </Tabs>
          </Stack>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Button variant="outlined" onClick={onCancel}>
              {t("Cancel")}
            </Button>
            <LoadingButton
              loading={loadingSave}
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={
                (activeTab === 1 && !englishCompleted) ||
                (activeTab === 2 && !frenchCompleted) ||
                (activeTab === 3 && !arabicCompleted) ||
                (activeTab === 0 && !generalCompleted)
              }
            >
              {activeTab === 3 ? t("Save") : t("Continue")}
            </LoadingButton>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}

export default NewProductForm;
