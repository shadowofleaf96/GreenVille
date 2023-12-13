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

function EditUserForm({ user, onSave, onCancel, open, onClose }) {
  const [editedUser, setEditedUser] = useState({ ...user, password: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false); // New state for save loading

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    // Sanitize the value using DOMPurify before updating the state
    const sanitizedValue = DOMPurify.sanitize(value);

    if (name === "password") {
      setEditedUser({ ...editedUser, password: sanitizedValue });
      setPasswordsMatch(sanitizedValue === confirmPassword);
    } else {
      setEditedUser({ ...editedUser, [name]: sanitizedValue });
      setPasswordsMatch(editedUser.password === confirmPassword);
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
    setPasswordsMatch(editedUser.password === confirmPassword);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(editedUser.password === value);
  };

  const handleSave = async () => {
    // Validate password conditions
    if (editedUser.password.length < 8 || !passwordsMatch) {
      return;
    }

    setLoadingSave(true); // Set loading state before save operation

    try {
      await onSave(editedUser, selectedImage);
      setConfirmPassword(""); // Reset confirm password field
      onClose(); // Close the modal after successful save
    } catch (error) {
      console.error("Error saving user:", error);
      // Handle the error as needed (display an error message, etc.)
    } finally {
      setLoadingSave(false); // Reset loading state after save operation
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
          Edit User
        </Typography>

        <TextField
          label="First Name"
          name="first_name"
          value={editedUser.first_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Last Name"
          name="last_name"
          value={editedUser.last_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Email"
          name="email"
          value={editedUser.email}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="User Name"
          name="user_name"
          value={editedUser.user_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Password"
          name="password"
          placeholder="Your Password..."
          value={editedUser.password !== undefined ? editedUser.password : ""}
          onChange={handleFieldChange}
          type="password"
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        {editedUser.password.length < 8 && (
          <Typography color="error" variant="caption" sx={{ marginBottom: 2 }}>
            Password must be at least 8 characters long
          </Typography>
        )}
        <TextField
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm Password..."
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          type="password"
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        {!passwordsMatch && (
          <Typography color="error" variant="caption" sx={{ marginBottom: 2 }}>
            Password and Confirm Password do not match
          </Typography>
        )}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel htmlFor="role">Role</InputLabel>
          <Select
            label="Role"
            name="role"
            value={editedUser.role}
            onChange={handleSelectChange}
            fullWidth
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="column" alignItems="center" sx={{ marginBottom: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              labelPlacement="start"
              label={
                <Typography variant="body2">
                  {editedUser.active ? "Active" : "Inactive"}
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
          {!selectedImage && (
            <Typography
              color="error"
              variant="caption"
              sx={{ marginBottom: 2 }}
            >
              Please choose an User Image
            </Typography>
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
              !passwordsMatch ||
              !selectedImage
            }
          >
            Save
          </LoadingButton>
          <Button
            onClick={onCancel}
            variant="outlined"
            sx={{
              flex: 1,
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}

export default EditUserForm;
