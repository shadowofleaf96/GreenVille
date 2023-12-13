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

function AddUserForm({ onSave, onCancel, open, onClose }) {
  const [newProduct, setNewProduct] = useState({
    sku: "",
    product_name: "",
    short_description: "",
    subcategory_id: "",
    price: "",
    discount_price: "",
    option: "",
    active: false,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
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

  const handleSave = async () => {
    setLoadingSave(true);

    try {
      await onSave(newProduct, selectedImage);
      setNewProduct({
        sku: "",
        product_name: "",
        short_description: "",
        subcategory_id: "",
        price: "",
        discount_price: "",
        option: "",
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
          Add Product
        </Typography>

        <TextField
          label="SKU"
          name="sku"
          value={newProduct.sku}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Product Name"
          name="product_name"
          value={newProduct.product_name}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Product Short Description"
          name="short_description"
          value={newProduct.short_description}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Product SubCategory ID"
          name="subcategory_id"
          value={newProduct.subcategory_id}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Product Price"
          name="price"
          value={newProduct.price}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Product Discount Price"
          name="discount_price"
          value={newProduct.discount_price}
          onChange={handleFieldChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Product Options"
          name="option"
          value={newProduct.option}
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
                  {newProduct.active ? "Active" : "Inactive"}
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
              newUser.password.length < 8 ||
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

export default AddUserForm;
