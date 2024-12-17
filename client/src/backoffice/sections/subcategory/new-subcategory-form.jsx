import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import DOMPurify from "dompurify";
import createAxiosInstance from "../../../utils/axiosConfig";

function NewSubCategoryForm({ onSave, onCancel, open, onClose }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [categories, setCategories] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subcategory_name: {
        en: "",
        fr: "",
        ar: "",
      },
      category_id: "",
      active: false,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const axiosInstance = createAxiosInstance("admin");
        const response = await axiosInstance.get("/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSave = async (data) => {
    setLoadingSave(true);

    try {
      const sanitizedData = {
        subcategory_name: {
          en: DOMPurify.sanitize(data.subcategory_name.en),
          fr: DOMPurify.sanitize(data.subcategory_name.fr),
          ar: DOMPurify.sanitize(data.subcategory_name.ar),
        },
        category_id: data.category_id,
        active: data.active,
      };
      await onSave(sanitizedData);
      onClose();
    } catch (error) {
      console.error("Error saving subcategory:", error);
    } finally {
      setLoadingSave(false);
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
          width: 500,
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
          {t("Add Subcategory")}
        </Typography>

        <form
          onSubmit={handleSubmit(handleSave)}
          noValidate
          style={{ width: "100%" }}
        >
          <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
            <Controller
              name="subcategory_name.en"
              control={control}
              render={({ field }) => (
                <TextField
                  label={t("Subcategory Name (English)")}
                  {...field}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  error={!!errors.subcategory_name?.en}
                  helperText={
                    errors.subcategory_name?.en && t("This field is required")
                  }
                />
              )}
            />
            <Controller
              name="subcategory_name.fr"
              control={control}
              render={({ field }) => (
                <TextField
                  label={t("Subcategory Name (French)")}
                  {...field}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  error={!!errors.subcategory_name?.fr}
                  helperText={
                    errors.subcategory_name?.fr && t("This field is required")
                  }
                />
              )}
            />
            <Controller
              name="subcategory_name.ar"
              control={control}
              render={({ field }) => (
                <TextField
                  label={t("Subcategory Name (Arabic)")}
                  {...field}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  error={!!errors.subcategory_name?.ar}
                  helperText={
                    errors.subcategory_name?.ar && t("This field is required")
                  }
                />
              )}
            />

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>{t("Category")}</InputLabel>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    error={!!errors.category_id}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.category_name[currentLanguage]}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <Stack direction="row" spacing={2} alignItems="center" justifyContent={"center"}>
              <FormControlLabel
                control={
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
                }
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
              <LoadingButton
                loading={loadingSave}
                type="submit"
                variant="contained"
                sx={{ flex: 1 }}
              >
                {t("Save")}
              </LoadingButton>
              <Button
                onClick={onCancel}
                variant="outlined"
                sx={{ flex: 1 }}
              >
                {t("Cancel")}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}

export default NewSubCategoryForm;
