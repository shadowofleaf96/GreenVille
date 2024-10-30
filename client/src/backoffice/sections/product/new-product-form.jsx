// Other imports remain unchanged
import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
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
import createAxiosInstance from "../../../utils/axiosConfig";

function NewProductForm({ onSave, onCancel, open, onClose }) {
  const [subcategories, setSubcategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const { t } = useTranslation();
  const [newProduct, setNewProduct] = useState({
    sku: "",
    product_name: "",
    subcategory_id: "",
    short_description: "",
    long_description: "", // Add this line
    price: 0,
    discount_price: 0,
    quantity: 0,
    option: [],
    active: false,
  });
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const axiosInstance = createAxiosInstance('admin');
        const response = await axiosInstance.get("/subcategories");
        setSubcategories(response.data.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    const sanitizedValue = DOMPurify.sanitize(value);

    const newValue =
      name === "option"
        ? sanitizedValue.split(",").map((option) => option.trim())
        : sanitizedValue;

    setNewProduct({ ...newProduct, [name]: newValue });
  };

  const handleSwitchChange = (event) => {
    setNewProduct({
      ...newProduct,
      [event.target.name]: event.target.checked,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const currentImages = selectedImages.length;

    if (currentImages + files.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }

    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSelectChange = (event) => {
    setNewProduct({ ...newProduct, subcategory_id: event.target.value });
  };

  const handleSave = async () => {
    setLoadingSave(true);

    try {
      const sanitizedProduct = {
        ...newProduct,
        product_name: DOMPurify.sanitize(newProduct.product_name),
        short_description: DOMPurify.sanitize(newProduct.short_description),
        long_description: DOMPurify.sanitize(newProduct.long_description),
        option: newProduct.option.map((opt) => DOMPurify.sanitize(opt)),
      };

      await onSave(sanitizedProduct, selectedImages);

      setNewProduct({
        sku: "",
        product_name: "",
        subcategory_id: "",
        short_description: "",
        long_description: "",
        price: 0,
        discount_price: 0,
        quantity: 0,
        option: [],
        active: false,
      });
      setSelectedImages([]);
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
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

        {/* Stack to hold SKU and Product Name inputs side by side */}
        <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
          <TextField
            label={t("Product Name")}
            name="product_name"
            value={newProduct.product_name}
            onChange={handleFieldChange}
            sx={{ flex: 1.2 }}
            fullWidth
          />

          <TextField
            label={t("SKU")}
            name="sku"
            value={newProduct.sku}
            onChange={handleFieldChange}
            sx={{ flex: 0.3 }}
            fullWidth
          />
        </Stack>

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

        {/* Add the long description input field here */}
        <TextField
          label={t("Long Description")}
          name="long_description"
          value={newProduct.long_description}
          onChange={handleFieldChange}
          fullWidth
          multiline
          rows={4} // Adjust the number of rows as needed
          sx={{ marginBottom: 2 }}
        />

        {/* Stack to hold Price and Discount Price inputs side by side */}
        <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
          <TextField
            label={t("Price")}
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleFieldChange}
            fullWidth
          />

          <TextField
            label={t("Discount Price")}
            name="discount_price"
            type="number"
            value={newProduct.discount_price}
            onChange={handleFieldChange}
            fullWidth
          />
        </Stack>

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
              multiple
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label htmlFor="fileInput">
              <UploadButton onChange={handleImageChange} />
            </label>
          </Stack>

          {selectedImages.length > 0 && (
            <Stack>
              {selectedImages.map((image, index) => (
                <Typography key={index} variant="caption">
                  {image.name}
                </Typography>
              ))}
            </Stack>
          )}

          <Typography variant="caption" color="textSecondary" sx={{ marginTop: 1 }}>
            {t("You can upload a maximum of 5 images as product images.")}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} className="rtl:gap-4" sx={{ width: "100%" }}>
          <LoadingButton
            loading={loadingSave}
            variant="contained"
            onClick={handleSave}
            sx={{ flex: 1 }}
          >
            {t("Save")}
          </LoadingButton>
          <Button variant="outlined" onClick={onCancel} sx={{ flex: 1 }}>
            {t("Cancel")}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}

export default NewProductForm;
