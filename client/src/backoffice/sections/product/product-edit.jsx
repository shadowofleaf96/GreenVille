import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import UploadButton from "../../components/button/UploadButton";
import { useTranslation } from "react-i18next";
import Loader from "../../../frontoffice/components/loader/Loader";
import createAxiosInstance from "../../../utils/axiosConfig";
import IconButton from "@mui/material/IconButton";
import Iconify from "../../components/iconify";
import DOMPurify from "dompurify"; // Import DOMPurify

const backend = import.meta.env.VITE_BACKEND_URL;

function EditProductForm({ Product, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();

  const [editedProduct, setEditedProduct] = useState({ ...Product });
  const [subcategories, setSubcategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const axiosInstance = createAxiosInstance("admin");
        const response = await axiosInstance.get("/subcategories");
        setSubcategories(response.data.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoadingSubcategories(false);
      }
    };

    fetchSubcategories();
  }, []);

  const sanitizeInput = (value) => {
    return DOMPurify.sanitize(value); // Sanitize the input using DOMPurify
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;

    const newValue =
      name === "option"
        ? value.split(",").map((option) => option.trim())
        : sanitizeInput(value); // Sanitize the value here
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
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleDeleteImage = (index) => {
    if (Array.isArray(editedProduct.product_images)) {
      const updatedImages = [...editedProduct.product_images];
      updatedImages.splice(index, 1);
      setEditedProduct({ ...editedProduct, product_images: updatedImages });
    } else {
      setEditedProduct({ ...editedProduct, product_images: "" });
    }
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      await onSave(editedProduct, selectedImages);
      setSelectedImages([]);
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

          <Stack direction="row" spacing={2} sx={{ width: "100%", marginBottom: 2 }}>
            <TextField
              label={t("Product Name")}
              name="product_name"
              value={editedProduct.product_name}
              onChange={handleFieldChange}
              fullWidth
              sx={{ flex: 1.2 }}
            />

            <TextField
              label={t("SKU")}
              name="sku"
              value={editedProduct.sku}
              onChange={handleFieldChange}
              fullWidth
              sx={{ flex: 0.3 }}
            />
          </Stack>


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
            label={t("Long Description")}
            name="long_description"
            value={editedProduct.long_description}
            onChange={handleFieldChange}
            multiline
            rows={4}
            fullWidth
            sx={{ marginBottom: 2 }}
          />


          {/* Stack for Price and Discount Price */}
          <Stack direction="row" spacing={2} sx={{ marginBottom: 2, width: "100%" }}>
            <TextField
              label={t("Price")}
              name="price"
              type="number"
              value={editedProduct.price}
              onChange={handleFieldChange}
              fullWidth
            />

            <TextField
              label={t("Discount Price")}
              name="discount_price"
              type="number"
              value={editedProduct.discount_price}
              onChange={handleFieldChange}
              fullWidth
            />
          </Stack>

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

          {Array.isArray(editedProduct.product_images) && editedProduct.product_images.length > 0 ? (
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginBottom: 2 }}>
              {editedProduct.product_images.map((image, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={`${backend}/${image}`}
                    alt={`Product image ${index + 1}`}
                    style={{ width: "60px", height: "50px", objectFit: "cover" }}
                  />
                  <IconButton
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "5px",
                    }}
                    onClick={() => handleDeleteImage(index)}
                  >
                    <Iconify
                      icon="ic:round-close"
                      width={16}
                      height={16}
                      className="mx-auto"
                    />
                  </IconButton>
                </div>
              ))}
            </Stack>
          ) : !Array.isArray(editedProduct.product_images) && editedProduct.product_images ? (
            <div style={{ position: "relative" }}>
              <img
                src={`${backend}/${editedProduct.product_images}`}
                alt="Product image"
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
              />
              <IconButton
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "5px",
                }}
                onClick={() => handleDeleteImage(0)}
              >
                <Iconify
                  icon="ic:round-close"
                  width={16}
                  height={16}
                  className="mx-auto"
                />
              </IconButton>
            </div>
          ) : (
            null
          )}

          <Stack direction="column" alignItems="center" sx={{ marginBottom: 2 }}>
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
              className="rtl:ml-3"
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
      ) : (
        <Loader />
      )}
    </Modal>
  );
}

export default EditProductForm;
