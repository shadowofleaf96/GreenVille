import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DOMPurify from "dompurify";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import UploadButton from "../../components/button/UploadButton";
import { useTranslation } from "react-i18next";

function AddUserForm({ onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    user_name: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    active: false,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);

    if (name === "email") {
      setEmailValid(isEmailValid(sanitizedValue));
    }

    if (name === "password") {
      setNewUser({ ...newUser, password: sanitizedValue });
      setPasswordsMatch(sanitizedValue === newUser.confirmPassword);
    } else {
      setNewUser({ ...newUser, [name]: sanitizedValue });
      setPasswordsMatch(newUser.password === newUser.confirmPassword);
    }
  };

  const handleSwitchChange = (event) => {
    setNewUser({
      ...newUser,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSelectChange = (event) => {
    setNewUser({
      ...newUser,
      [event.target.name]: event.target.value,
    });
    setPasswordsMatch(newUser.password === newUser.confirmPassword);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setNewUser({ ...newUser, confirmPassword: value });
    setPasswordsMatch(newUser.password === value);
  };

  const handleSave = async () => {
    if (newUser.password.length < 8 || !passwordsMatch) {
      return;
    }

    setLoadingSave(true);

    try {
      await onSave(newUser, selectedImage);
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        user_name: "",
        password: "",
        confirmPassword: "",
        role: "admin",
        active: false,
      });
      setSelectedImage(null);
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
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
          {t("Add User")}
        </Typography>

        <TextField
          label={t("First Name")}
          name="first_name"
          placeholder={t("First Name")}
          value={newUser.first_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Last Name")}
          name="last_name"
          placeholder={t("Last Name")}
          value={newUser.last_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Email")}
          name="email"
          type="email"
          placeholder={t("Email")}
          value={newUser.email}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
          error={!emailValid}
          helperText={!emailValid ? t("Invalid email format") : ""}
        />

        <TextField
          label={t("User Name")}
          name="user_name"
          placeholder={t("User Name")}
          value={newUser.user_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label={t("Password")}
          name="password"
          placeholder={t("Password")}
          value={newUser.password !== undefined ? newUser.password : ""}
          onChange={handleFieldChange}
          onBlur={() => {}}
          type="password"
          fullWidth
          sx={{ marginBottom: 2 }}
          error={newUser.password.length < 8}
          helperText={
            newUser.password.length > 0 && newUser.password.length < 8
              ? t("Password must be at least 8 characters long")
              : ""
          }
        />

        <TextField
          label={t("Confirm Password")}
          name="confirmPassword"
          placeholder={t("Confirm Password")}
          value={newUser.confirmPassword}
          onChange={handleConfirmPasswordChange}
          type="password"
          fullWidth
          sx={{ marginBottom: 2 }}
          error={!passwordsMatch}
          helperText={!passwordsMatch ? t("Password and Confirm Password do not match") : ""}
        />

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel htmlFor="role">{t("Role")}</InputLabel>
          <Select
            label={t("Role")}
            name="role"
            value={newUser.role}
            onChange={handleSelectChange}
            fullWidth
          >
            <MenuItem value="admin">{t("Admin")}</MenuItem>
            <MenuItem value="manager">{t("Manager")}</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="column" alignItems="center" sx={{ marginBottom: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              labelPlacement="start"
              label={
                <Typography variant="body2">
                  {newUser.active ? t("Active") : t("Inactive")}
                </Typography>
              }
              control={
                <Switch
                  name="active"
                  checked={newUser.active}
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
              !emailValid || newUser.password.length < 8 || !passwordsMatch
            }
          >
            {t("Save")}
          </LoadingButton>
          <Button
            onClick={onCancel}
            variant="outlined"
            sx={{
              flex: 1,
            }}
          >
            {t("Cancel")}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}

export default AddUserForm;
