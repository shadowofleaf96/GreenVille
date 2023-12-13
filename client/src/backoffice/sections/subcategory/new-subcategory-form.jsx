import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { useSelector } from "react-redux";
import FormControlLabel from "@mui/material/FormControlLabel";
import UploadButton from "../../components/button/UploadButton";
import { useTranslation } from "react-i18next";

function NewSubCategoryForm({ onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState({
    subcategory_name: "",
    category_id: "",
    active: false,
    category: {
      _id: "",
      category_name: "",
    },
  });
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/v1/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setNewSubCategory({ ...newSubCategory, [name]: value });
  };

  const handleSwitchChange = (event) => {
    setNewSubCategory({
      ...newSubCategory,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSelectChange = (event) => {
    const selectedCategory = categories.find(
      (category) => category._id === event.target.value
    );

    const { category_name } = selectedCategory;

    setNewSubCategory((prev) => ({
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
      await onSave(newSubCategory);
      setNewSubCategory({
        subcategory_name: "",
        category_id: "",
        active: false,
        category: {
          _id: "",
          category_name: "",
        },
      });
      onClose();
    } catch (error) {
      console.error("Error saving subcategory:", error);
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
          {t("Add Subcategory")}
        </Typography>

        <TextField
          label={t("Subcategory Name")}
          name="subcategory_name"
          value={newSubCategory.subcategory_name}
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
            value={newSubCategory.category_id}
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

        <Stack direction="column" alignItems="center" sx={{ marginBottom: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControlLabel
              labelPlacement="start"
              label={
                <Typography variant="body2">
                  {newSubCategory.active ? t("Active") : t("Inactive")}
                </Typography>
              }
              control={
                <Switch
                  name="active"
                  checked={newSubCategory.active}
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

export default NewSubCategoryForm;
