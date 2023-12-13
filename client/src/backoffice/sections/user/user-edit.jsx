import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { loginSuccess } from "../../../redux/backoffice/authSlice";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import UploadButton from "../../components/button/UploadButton";
import { useTranslation } from "react-i18next";

function EditUserForm({ user, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [editedUser, setEditedUser] = useState({ ...user, password: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const userLogin = useSelector((state) => state.adminAuth.adminUser);
  const dispatch = useDispatch();

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);

    if (name === "password") {
      setEditedUser({ ...editedUser, password: "" });
    }

    if (name === "email") {
      setEmailValid(isEmailValid(sanitizedValue));
    }

    if (name === "password") {
      setEditedUser({ ...editedUser, password: sanitizedValue });
      setPasswordsMatch(sanitizedValue === editedUser.confirmPassword);
    } else {
      setEditedUser({ ...editedUser, [name]: sanitizedValue });
      setPasswordsMatch(editedUser.password === editedUser.confirmPassword);
    }
  };

  const handleSwitchChange = (event) => {
    setEditedUser({
      ...editedUser,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSelectChange = (event) => {
    setEditedUser({
      ...editedUser,
      [event.target.name]: event.target.value,
    });
    setPasswordsMatch(editedUser.password === editedUser.confirmPassword);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setEditedUser({ ...editedUser, confirmPassword: value });
    setPasswordsMatch(editedUser.password === value);
  };

  const handleSave = async () => {
    if (editedUser.password.length < 8 || !passwordsMatch) {
      return;
    }
    const loggedInUserId = userLogin._id;

    setLoadingSave(true);

    try {
      const isCurrentUser = editedUser._id === loggedInUserId;
      await onSave(editedUser, selectedImage);
      if (isCurrentUser) {
        dispatch(loginSuccess({ adminUser: editedUser }));
      }
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
          {t("Edit User")}
        </Typography>

        <TextField
          label={t("First Name")}
          name="first_name"
          placeholder={t("First Name")}
          value={editedUser.first_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Last Name")}
          name="last_name"
          placeholder={t("Last Name")}
          value={editedUser.last_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Email")}
          name="email"
          type="email"
          placeholder={t("Email")}
          value={editedUser.email}
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
          value={editedUser.user_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label={t("Password")}
          name="password"
          placeholder={t("Password")}
          value={
            editedUser.password !== undefined ? editedUser.password : ""
          }
          onChange={handleFieldChange}
          onBlur={() => {}}
          type="password"
          fullWidth
          sx={{ marginBottom: 2 }}
          error={editedUser.password.length < 8}
          helperText={
            editedUser.password.length > 0 &&
            editedUser.password.length < 8
              ? t("Password must be at least 8 characters long")
              : ""
          }
        /> 

        <TextField
          label={t("Confirm Password")}
          name="confirmPassword"
          placeholder={t("Confirm Password")}
          value={editedUser.confirmPassword}
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
            value={editedUser.role}
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
                  {editedUser.active ? t("Active") : t("Inactive")}
                </Typography>
              }
              control={
                <Switch
                  name="active"
                  checked={editedUser.active}
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
              editedUser.password.length < 8 ||
              !passwordsMatch
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

export default EditUserForm;
