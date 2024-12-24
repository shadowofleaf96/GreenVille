import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DOMPurify from "dompurify";

function EditCategoryForm({ category, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [loadingSave, setLoadingSave] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      category_name: category?.category_name || {
        en: "",
        fr: "",
        ar: "",
      },
      status: category?.status || false,
    },
  });

  const handleSave = async (data) => {
    setLoadingSave(true);
    try {
      const sanitizedData = {
        _id: category?._id,
        category_name: {
          en: DOMPurify.sanitize(data.category_name.en),
          fr: DOMPurify.sanitize(data.category_name.fr),
          ar: DOMPurify.sanitize(data.category_name.ar),
        },
        status: data.status,
      };
      await onSave(sanitizedData);
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
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
          {t("Edit Category")}
        </Typography>

        <form onSubmit={handleSubmit(handleSave)} noValidate style={{ width: "100%" }}>
          <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
            <Controller
              name="category_name.en"
              control={control}
              render={({ field }) => (
                <TextField
                  label={t("Category Name (English)")}
                  {...field}
                  fullWidth
                  error={!!errors.category_name?.en}
                  helperText={errors.category_name?.en && t("This field is required")}
                />
              )}
            />

            <Controller
              name="category_name.fr"
              control={control}
              render={({ field }) => (
                <TextField
                  label={t("Category Name (French)")}
                  {...field}
                  fullWidth
                  error={!!errors.category_name?.fr}
                  helperText={errors.category_name?.fr && t("This field is required")}
                />
              )}
            />

            <Controller
              name="category_name.ar"
              control={control}
              render={({ field }) => (
                <TextField
                  label={t("Category Name (Arabic)")}
                  {...field}
                  fullWidth
                  error={!!errors.category_name?.ar}
                  helperText={errors.category_name?.ar && t("This field is required")}
                />
              )}
            />

            <Stack direction="row" spacing={2} alignItems="center" justifyContent={"center"}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    label={<Typography variant="body2">{field.value ? t("Active") : t("Inactive")}</Typography>}
                    control={
                      <Switch {...field} checked={field.value} />
                    }
                  />
                )}
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
              <Button onClick={onCancel} variant="outlined" sx={{ flex: 1 }}>
                {t("Cancel")}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
}

export default EditCategoryForm;
