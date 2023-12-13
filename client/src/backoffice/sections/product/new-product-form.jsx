import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import UploadButton from "../../components/button/UploadButton";
import axios from "axios";

function NewProductForm({ onSave, onCancel, open, onClose }) {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useTranslation();
  const [newProduct, setNewProduct] = useState({
    sku: "",
    product_name: "",
    subcategory_id: "",
    short_description: "",
    price: 0,
    discount_price: 0,
    quantity: 0,
    option: [],
    active: false,
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);

  useEffect(() => {
    // Fetch subcategories when the component mounts
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get("/v1/subcategories");
        setSubcategories(response.data.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        // Handle the error as needed (display an error message, etc.)
      }
    };

    fetchSubcategories();
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    // If the field is 'option', convert the comma-separated string to an array
    const newValue =
      name === "option"
        ? value.split(",").map((option) => option.trim())
        : value;

    setNewProduct({ ...newProduct, [name]: newValue });
  };

  const handleSwitchChange = (event) => {
    setNewProduct({
      ...newProduct,
      [event.target.name]: event.target.checked,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSelectChange = (event) => {
    setNewProduct({ ...newProduct, subcategory_id: event.target.value });
  };

  const handleSave = async () => {
    setLoadingSave(true);

    try {
      // Perform save operation, use newProduct.subcategory_id as needed
      await onSave(newProduct, selectedImage);

      {
        setNewProduct({
          sku: "",
          product_name: "",
          subcategory_id: "",
          short_description: "",
          price: 0,
          discount_price: 0,
          quantity: 0,
          option: [],
          active: false,
        });
      }
      setSelectedImage(null);
      onClose(); // Close the modal after a successful save
    } catch (error) {
      console.error("Error saving product:", error);
      // Handle the error as needed (display an error message, etc.)
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
          {t("New Product")}
        </Typography>

        <TextField
          label={t("SKU")}
          name="sku"
          value={newProduct.sku}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Product Name")}
          name="product_name"
          value={newProduct.product_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel htmlFor="subcategory">{t("Subcategory")}</InputLabel>
          <Select
            label={t("Subcategory")}
            id="subcategory"
            name="subcategory_id"
            value={newProduct.subcategory_id}
            onChange={handleSelectChange}
            fullWidth
          >
            {subcategories.map((subcategory) => (
              <MenuItem key={subcategory._id} value={subcategory._id}>
                {t(subcategory.subcategory_name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label={t("Short Description")}
          name="short_description"
          value={newProduct.short_description}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Price")}
          name="price"
          type="number"
          value={newProduct.price}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Discount Price")}
          name="discount_price"
          type="number"
          value={newProduct.discount_price}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Quantity")}
          name="quantity"
          type="number"
          value={newProduct.quantity}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label={t("Options (comma-separated)")}
          name="option"
          value={newProduct.option.join(", ")}
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
                  {newProduct.active ? t("Active") : t("Inactive")}
                </Typography>
              }
              control={
                <Switch
                  name="active"
                  checked={newProduct.active}
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

export default NewProductForm;
