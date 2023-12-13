import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import DOMPurify from "dompurify";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import UploadButton from "../../components/button/UploadButton";

function EditCustomerForm({ customer, onSave, onCancel, open, onClose }) {
  const [editedCustomer, setEditedCustomer] = useState({
    ...customer,
    password: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const { t } = useTranslation();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    // Sanitize the value using DOMPurify before updating the state
    const sanitizedValue = DOMPurify.sanitize(value);
    if (name === "email") {
      setEmailValid(isEmailValid(sanitizedValue));
    }

    if (name === "password") {
      setEditedCustomer({ ...editedCustomer, password: sanitizedValue });
      setPasswordsMatch(sanitizedValue === confirmPassword);
    } else {
      setEditedCustomer({ ...editedCustomer, [name]: sanitizedValue });
      setPasswordsMatch(editedCustomer.password === confirmPassword);
    }
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
      await onSave(editedCustomer, selectedImage);
      setConfirmPassword("");
      onClose();
    } catch (error) {
      console.error("Error saving customer:", error);
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
          backgroundColor: "#fff", // Background color set to white
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          p: 4,
          width: 500,
          color: "#333", // Text color
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "16px", // Adjust the radius value as needed
          margin: "0 16px", // Left and right margins
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

        <TextField
          label={t("Password")}
          name="password"
          placeholder={t("Password")}
          value={
            editedCustomer.password !== undefined ? editedCustomer.password : ""
          }
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

        <Stack direction="column" alignItems="center" sx={{ marginBottom: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              labelPlacement="start"
              label={
                <Typography variant="body2">
                  {editedCustomer.active ? t("Active") : t("Inactive")}
                </Typography>
              }
              control={
                <Switch
                  name="active"
                  checked={editedCustomer.active}
                  onChange={handleSwitchChange}
                />
              }
            />
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleImageChange}
              sx={{ display: "none" }}
              style={{ display: "none" }}
            />
            <label htmlFor="fileInput">
              <UploadButton onChange={handleImageChange} />
            </label>
          </Stack>
          {selectedImage && (
            <Typography variant="caption">{selectedImage.name}</Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
          <LoadingButton
            loading={loadingSave}
            onClick={handleSave}
            variant="contained"
            sx={{
              flex: 1,
              "&:disabled": {
                backgroundColor: "#c0c0c0",
                color: "#000",
              },
            }}
            disabled={
              !emailValid ||
              editedCustomer.password.length < 8 ||
              !passwordsMatch
            }
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
