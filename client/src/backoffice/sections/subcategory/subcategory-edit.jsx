import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DOMPurify from "dompurify";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useSelector } from "react-redux";
import FormControlLabel from "@mui/material/FormControlLabel";
import UploadButton from "../../components/button/UploadButton";
import { useTranslation } from "react-i18next"; // Import translation hook

function EditSubCategoryForm({ subcategory, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation(); // Use translation hook
  const [categories, setCategories] = useState([]);
  const [editedSubCategory, setEditedSubCategory] = useState({
    ...subcategory,
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/v1/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingSubcategories(false);
      }
    };

    fetchCategories();
  }, []);

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedSubCategory({ ...editedSubCategory, [name]: value });
  };

  const handleSwitchChange = (event) => {
    setEditedSubCategory({
      ...editedSubCategory,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSelectChange = (event) => {
    const selectedCategory = categories.find(
      (category) => category._id === event.target.value
    );

    const { category_name } = selectedCategory;
    setEditedSubCategory((prev) => ({
      ...prev,
      category_id: selectedCategory._id,
      category: {
        _id: selectedCategory._id,
        category_name: category_name,
      },
    }));
  };

  const handleSave = async () => {
    setLoadingSave(true);

    try {
      const { category_id } = editedSubCategory;
      const selectedCategory = categories.find(
        (category) => category._id === category_id
      );
      const categoryName = selectedCategory.category_name;

      const updatedSubcategory = {
        ...editedSubCategory,
        category_name: categoryName,
      };

      await onSave(updatedSubcategory);
      onClose();
    } catch (error) {
      console.error("Error saving subcategory:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {!loadingSubcategories ? (
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
            {t("Edit Subcategory")}
          </Typography>

          <TextField
            label={t("Subcategory Name")}
            name="subcategory_name"
            value={editedSubCategory.subcategory_name}
            onChange={handleFieldChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel htmlFor="category">{t("Category")}</InputLabel>
            <Select
              label={t("Category")}
              id="category"
              name="category_id"
              value={editedSubCategory.category_id}
              onChange={handleSelectChange}
              fullWidth
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {t(category.category_name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack
            direction="column"
            alignItems="center"
            sx={{ marginBottom: 2 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControlLabel
                labelPlacement="start"
                label={
                  <Typography variant="body2">
                    {editedSubCategory.active ? t("Active") : t("Inactive")}
                  </Typography>
                }
                control={
                  <Switch
                    name="active"
                    checked={editedSubCategory.active}
                    onChange={handleSwitchChange}
                  />
                }
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
            <LoadingButton
              color="primary"
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
      ) : (
        <Stack style={containerStyle}>
          <CircularProgress />
        </Stack>
      )}
    </Modal>
  );
}

export default EditSubCategoryForm;
