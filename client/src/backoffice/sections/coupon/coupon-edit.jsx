import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

function EditCouponForm({ coupon, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const { control, register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      _id: coupon._id,
      code: coupon.code,
      discount: coupon.discount,
      expiresAt: coupon.expiresAt.slice(0, 10),
      usageLimit: coupon.usageLimit,
      status: coupon.status,
    }
  });

  const [loadingSave, setLoadingSave] = useState(false);

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      await onSave({
        ...data,
        expiresAt: new Date(data.expiresAt).toISOString(),
        status: data.status,
      });
      onClose();
    } catch (error) {
      console.error("Error saving coupon:", error);
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
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#3f51b5", marginBottom: 2 }}
        >
          {t("Edit Coupon")}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label={t("Coupon Code")}
            name="code"
            {...register("code", { required: true })}
            error={!!errors.code}
            helperText={errors.code?.message || ""}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label={t("Discount (%)")}
            name="discount"
            {...register("discount", { required: true })}
            error={!!errors.discount}
            helperText={errors.discount?.message || ""}
            fullWidth
            type="number"
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label={t("Expiration Date")}
            name="expiresAt"
            {...register("expiresAt", { required: true })}
            error={!!errors.expiresAt}
            helperText={errors.expiresAt?.message || ""}
            fullWidth
            type="date"
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label={t("Usage Limit")}
            name="usageLimit"
            {...register("usageLimit")}
            error={!!errors.usageLimit}
            helperText={errors.usageLimit?.message || ""}
            fullWidth
            type="number"
            sx={{ marginBottom: 2 }}
          />

          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  label={
                    <Typography variant="body2">
                      {field.value === "active" ? t("Active") : t("Inactive")}
                    </Typography>
                  }
                  control={
                    <Switch
                      checked={field.value === "active"}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "active" : "inactive")
                      }
                    />
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
        </form>
      </Stack>
    </Modal>
  );
}

export default EditCouponForm;