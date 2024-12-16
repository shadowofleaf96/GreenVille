import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { fDateTime } from "../../../utils/format-time";
import { useTranslation } from "react-i18next";

const backend = import.meta.env.VITE_BACKEND_URL;

const ProductDetailsPopup = ({ product, open, onClose }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isActive = product?.active;
  const color = isActive ? "primary" : "secondary";
  const imageArray = typeof product?.product_images === 'string' ? product?.product_images.split(',') : product?.product_images[0];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          borderRadius: "16px",
          p: 4,
          width: "auto",
          textAlign: "center",
        }}
      >
        <Stack direction="column" alignItems="flex-start" spacing={2}>
          <Avatar
            src={`${imageArray}`}
            sx={{ alignSelf: "center", width: 100, height: 100 }}
          />

          <Typography
            variant="h4"
            gutterBottom
            sx={{ alignSelf: "center", color: "#3f51b5" }}
          >
            {t("Product Details")}
          </Typography>

          <Stack direction="row" spacing={4} justifyContent="center" sx={{ width: "100%" }}>
            <Typography variant="body1">
              <strong>{t("SKU")}:</strong> {product?.sku}
            </Typography>
            <Typography variant="body1">
              <strong>{t("Product Name")}:</strong> {product?.product_name[currentLanguage]}
            </Typography>
          </Stack>

          <Typography variant="body1" align="justify">
            <strong>{t("Short Description")}:</strong> {product?.short_description[currentLanguage]}
          </Typography>

          <Typography variant="body1" align="justify">
            <strong>{t("Long Description")}:</strong> {product?.long_description[currentLanguage]}
          </Typography>

          <Stack direction="row" spacing={4} justifyContent="center" sx={{ width: "100%" }}>
            <Typography variant="body1">
              <strong>{t("Subcategory Name")}:</strong> {product?.subcategory.subcategory_name[currentLanguage]}
            </Typography>
            <Typography variant="body1">
              <strong>{t("Price")}:</strong> {product?.price} DH
            </Typography>
          </Stack>

          <Stack direction="row" spacing={4} justifyContent="center" sx={{ width: "100%" }}>
            <Typography variant="body1">
              <strong>{t("Discount Price")}:</strong> {product?.discount_price} DH
            </Typography>
            <Typography variant="body1">
              <strong>{t("Options")}:</strong> {product?.option}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={4} justifyContent="center" sx={{ width: "100%" }}>
            <Typography variant="body1">
              <strong>{t("Quantity")}:</strong> {product?.quantity}
            </Typography>

            <Typography variant="body1">
              <strong>{t("Creation Date")}:</strong> {fDateTime(product?.creation_date)}
            </Typography>

            <Typography variant="body1">
              <strong>{t("Last Update")}:</strong> {fDateTime(product?.last_update)}
            </Typography>
          </Stack>

          <Typography variant="body1" sx={{ alignSelf: "center" }}>
            <Badge
              sx={{
                minWidth: 24,
              }}
              badgeContent={isActive ? t("Active") : t("Inactive")}
              color={color}
            />
          </Typography>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ProductDetailsPopup;
