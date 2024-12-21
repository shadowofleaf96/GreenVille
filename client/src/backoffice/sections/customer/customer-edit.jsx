import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import { useTranslation } from "react-i18next";
import Iconify from "../../components/iconify";
import UploadButton from "../../components/button/UploadButton";
import DOMPurify from "dompurify";
const backend = import.meta.env.VITE_BACKEND_URL

function EditCustomerForm({ customer, onSave, onCancel, open, onClose }) {
  const [editedCustomer, setEditedCustomer] = useState({
    ...customer,
    password: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const { t } = useTranslation();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    if (name === "email") {
      setEmailValid(isEmailValid(sanitizedValue));
    }

    setEditedCustomer({ ...editedCustomer, [name]: sanitizedValue });
    setPasswordsMatch(editedCustomer.password === confirmPassword);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSwitchChange = (event) => {
    setEditedCustomer({
      ...editedCustomer,
      [event.target.name]: event.target.checked,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(editedCustomer.password === value);
  };

  const handleSave = async () => {
    if (editedCustomer.password.length < 8 || !passwordsMatch) {
      return;
    }
    setLoadingSave(true);

    try {
      await onSave(editedCustomer, selectedImage, avatarRemoved);
      setConfirmPassword("");
      onClose();
    } catch (error) {
      console.error("Error saving customer:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarRemoved(true);
    setSelectedImage(null);
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
          {t("Edit Customer")}
        </Typography>

        {editedCustomer.customer_image && !avatarRemoved && (
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <img
              src={`${editedCustomer.customer_image}`}
              alt="Customer Avatar"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <IconButton
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                padding: "5px",
              }}
              onClick={handleRemoveAvatar}
            >
              <Iconify icon="ic:round-close" width={16} height={16} />
            </IconButton>
          </div>
        )}

        <TextField
          label={t("First Name")}
          name="first_name"
          placeholder={t("First Name")}
          value={editedCustomer.first_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Last Name")}
          name="last_name"
          placeholder={t("Last Name")}
          value={editedCustomer.last_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Email")}
          name="email"
          placeholder={t("Email")}
          value={editedCustomer.email}
          type="email"
          onChange={handleFieldChange}
          fullWidth
          error={!emailValid}
          helperText={!emailValid ? "Invalid email format" : ""}
          sx={{ marginBottom: 2 }}
        />

        {/* Password and Confirm Password Fields */}
        <TextField
          label={t("Password")}
          name="password"
          placeholder={t("Password")}
          value={editedCustomer.password}
          onChange={handleFieldChange}
          type="password"
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        {editedCustomer.password.length < 8 && (
          <Typography color="error" variant="caption" sx={{ marginBottom: 2 }}>
            {t("Password must be at least 8 characters long")}
          </Typography>
        )}
        <TextField
          label={t("Confirm Password")}
          name="confirmPassword"
          placeholder={t("Confirm Password")}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          type="password"
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        {!passwordsMatch && (
          <Typography color="error" variant="caption" sx={{ marginBottom: 2 }}>
            {t("Password and Confirm Password do not match")}
          </Typography>
        )}

        <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
          <FormControlLabel
            labelPlacement="start"
            label={
              <Typography variant="body2">
                {editedCustomer.status ? t("Active") : t("Inactive")}
              </Typography>
            }
            control={
              <Switch
                name="status"
                checked={editedCustomer.status}
                onChange={handleSwitchChange}
              />
            }
          />
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageChange}
            onClick={(event) => {
              event.target.value = null
            }}
            style={{ display: "none" }}
          />
          <label htmlFor="fileInput">
            <UploadButton onChange={handleImageChange} />
          </label>
        </Stack>
        {selectedImage && (
          <Typography variant="caption">{selectedImage.name}</Typography>
        )}

        <Stack direction="row" spacing={2} className="rtl:gap-4" sx={{ width: "100%" }}>
          <LoadingButton
            loading={loadingSave}
            onClick={handleSave}
            variant="contained"
            sx={{ flex: 1 }}
            disabled={!emailValid || editedCustomer.password.length < 8 || !passwordsMatch}
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

export default EditCustomerForm;
