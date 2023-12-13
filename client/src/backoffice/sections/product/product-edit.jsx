import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import UploadButton from "../../components/button/UploadButton";

// Importing translation hook
import { useTranslation } from "react-i18next";

function EditProductForm({ Product, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation(); // Using translation hook

  const [editedProduct, setEditedProduct] = useState({ ...Product });
  const [subcategories, setSubcategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSubcategories, setLoadingSubcategories] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get("/v1/subcategories");
        setSubcategories(response.data.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoadingSubcategories(false); // Set loading to false when data is fetched
      }
    };

    fetchSubcategories();
  }, []);

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    // If the field is 'option', convert the comma-separated string to an array
    const newValue =
      name === "option"
        ? value.split(",").map((option) => option.trim())
        : value;
    setEditedProduct({ ...editedProduct, [name]: newValue });
  };

  const handleSwitchChange = (event) => {
    setEditedProduct({
      ...editedProduct,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSelectChange = (event) => {
    setEditedProduct({ ...editedProduct, subcategory_id: event.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  const handleSave = async () => {
    setLoadingSave(true);
    try {
      await onSave(editedProduct, selectedImage);
      setSelectedImage(null);
      onClose();
    } catch (error) {
      console.error("Error saving Product:", error);
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
            {t("Edit Product")}
          </Typography>

          <TextField
            label={t("SKU")}
            name="sku"
            value={editedProduct.sku}
            onChange={handleFieldChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label={t("Product Name")}
            name="product_name"
            value={editedProduct.product_name}
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
              value={editedProduct.subcategory_id}
              onChange={handleSelectChange}
              fullWidth
            >
              {subcategories.map((subcategory) => (
                <MenuItem key={subcategory._id} value={subcategory._id}>
                  {subcategory.subcategory_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={t("Short Description")}
            name="short_description"
            value={editedProduct.short_description}
            onChange={handleFieldChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label={t("Price")}
            name="price"
            type="number"
            value={editedProduct.price}
            onChange={handleFieldChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label={t("Discount Price")}
            name="discount_price"
            type="number"
            value={editedProduct.discount_price}
            onChange={handleFieldChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label={t("Quantity")}
            name="quantity"
            type="number"
            value={editedProduct.quantity}
            onChange={handleFieldChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label={t("Options (comma-separated)")}
            name="option"
            value={editedProduct.option.join(", ")}
            onChange={handleFieldChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />

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
                    {editedProduct.active ? t("Active") : t("Inactive")}
                  </Typography>
                }
                control={
                  <Switch
                    name="active"
                    checked={editedProduct.active}
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
              color="primary"
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
      ) : (
        <Stack style={containerStyle}>
          <CircularProgress />
        </Stack>
      )}
    </Modal>
  );
}

export default EditProductForm;
