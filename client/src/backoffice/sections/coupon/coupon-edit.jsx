import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

function EditCouponForm({ coupon, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; 
  };

  const [editedCoupon, setEditedCoupon] = useState({
    _id: coupon._id,
    code: coupon.code || "",
    discount: coupon.discount || "",
    expiresAt: formatDate(coupon.expiresAt) || "",
    usageLimit: coupon.usageLimit || "",
    status: coupon.status || "inactive",
  });

  const [loadingSave, setLoadingSave] = useState(false);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedCoupon({ ...editedCoupon, [name]: value });
  };

  const handleSwitchChange = (event) => {
    const isActive = event.target.checked;
    setEditedCoupon({
      ...editedCoupon,
      status: isActive ? "active" : "inactive",
    });
  };

  const handleSave = async () => {
    setLoadingSave(true);

    try {
      await onSave({
        ...editedCoupon,
        expiresAt: new Date(editedCoupon.expiresAt).toISOString(),
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

        <TextField
          label={t("Coupon Code")}
          name="code"
          value={editedCoupon.code}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Discount (%)")}
          name="discount"
          value={editedCoupon.discount}
          onChange={handleFieldChange}
          fullWidth
          type="number"
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Expiration Date")}
          name="expiresAt"
          value={editedCoupon.expiresAt}
          onChange={handleFieldChange}
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
          value={editedCoupon.usageLimit}
          onChange={handleFieldChange}
          fullWidth
          type="number"
          sx={{ marginBottom: 2 }}
        />

        <Stack direction="column" alignItems="center" sx={{ marginBottom: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              labelPlacement="start"
              label={
                <Typography variant="body2">
                  {editedCoupon.status === "active" ? t("Active") : t("Inactive")}
                </Typography>
              }
              control={
                <Switch
                  name="status"
                  checked={editedCoupon.status === "active"}
                  onChange={handleSwitchChange}
                />
              }
            />
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
          <LoadingButton
            loading={loadingSave}
            onClick={handleSave}
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
    </Modal>
  );
}

export default EditCouponForm;
