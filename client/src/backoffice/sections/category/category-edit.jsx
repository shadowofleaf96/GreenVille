import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import UploadButton from "../../components/button/UploadButton";

function EditCategoryForm({ category, onSave, onCancel, open, onClose }) {
  const [editedCategory, setEditedCategory] = useState({
    ...category,
    password: "",
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const { t } = useTranslation();

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedCategory({ ...editedCategory, [name]: value });
  };

  const handleSwitchChange = (event) => {
    setEditedCategory({
      ...editedCategory,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSave = async () => {
    setLoadingSave(true); // Set loading state before save operation

    try {
      await onSave(editedCategory);
      onClose(); // Close the modal after successful save
    } catch (error) {
      console.error("Error saving category:", error);
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

        <TextField
          label={t("Category Name")}
          name="category_name"
          value={t(editedCategory.category_name)}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <Stack direction="column" alignItems="center" sx={{ marginBottom: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              labelPlacement="start"
              label={
                <Typography variant="body2">
                  {editedCategory.active ? t("Active") : t("Inactive")}
                </Typography>
              }
              control={
                <Switch
                  name="active"
                  checked={editedCategory.active}
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
            sx={{
              flex: 1,
              "&:disabled": {
                backgroundColor: "#c0c0c0",
                color: "#000",
              },
            }}
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

export default EditCategoryForm;
