import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTranslation } from "react-i18next";

function EditContactForm({ contact, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [loadingSave, setLoadingSave] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: contact?.name || "",
      email: contact?.email || "",
      phone_number: contact?.phone_number || "",
      message: contact?.message || "",
    },
  });

  const onSubmit = async (data) => {
    setLoadingSave(true);

    try {
      const sanitizedData = {
        ...data,
        _id: contact?._id, 
      };

      await onSave(sanitizedData); 
      onClose();
    } catch (error) {
      console.error("Error saving contact:", error);
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
          width: 500,
          color: "#333",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "16px",
          padding: "20px",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#3f51b5", marginBottom: 2 }}>
          {t("Edit Contact")}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: "100%" }}>
          <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("Name")}
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name && t("Name is required")}
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("Email")}
                  fullWidth
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email && t("Valid email is required")}
                />
              )}
              rules={{ required: true, pattern: /^\S+@\S+\.\S+$/ }}
            />

            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("Phone Number")}
                  fullWidth
                  error={!!errors.phone_number}
                  helperText={errors.phone_number && t("Phone number is required")}
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t("Message")}
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.message}
                  helperText={errors.message && t("Message is required")}
                />
              )}
              rules={{ required: true }}
            />

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

export default EditContactForm;
