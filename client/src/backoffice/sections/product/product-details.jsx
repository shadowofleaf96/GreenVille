import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Label from "../../components/label";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { fDateTime } from "../../../utils/format-time";
import { useTranslation } from "react-i18next"; // Importing translation hook

const ProductDetailsPopup = ({ product, open, onClose }) => {
  const { t } = useTranslation(); // Using translation hook
  const isActive = product?.active;
  const color = isActive ? "primary" : "secondary";

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
          borderRadius: "16px", // Circular edge
          p: 4,
          width: 400,
          textAlign: "center",
        }}
      >
        <Stack direction="column" alignItems="flex-start" spacing={2}>
          <Avatar
            src={`http://localhost:3000/${product?.product_image}`}
            sx={{ alignSelf: "center", width: 100, height: 100 }}
          />

          <Typography
            variant="h4"
            gutterBottom
            sx={{ alignSelf: "center", color: "#3f51b5" }} // Different color for the title
          >
            {t("Product Details")}
          </Typography>

          <Typography variant="body1">
            <strong>{t("SKU")}:</strong> {product?.sku}
          </Typography>

          <Typography variant="body1">
            <strong>{t("Product Name")}:</strong> {product?.product_name}
          </Typography>

          <Typography variant="body1">
            <strong>{t("Short Description")}:</strong>{" "}
            {product?.short_description}
          </Typography>

          <Typography variant="body1">
            <strong>{t("Subcategory Name")}:</strong>{" "}
            {product?.subcategory.subcategory_name}
          </Typography>

          <Typography variant="body1">
            <strong>{t("Price")}:</strong> {product?.price} DH
          </Typography>

          <Typography variant="body1">
            <strong>{t("Discount Price")}:</strong> {product?.discount_price} DH
          </Typography>

          <Typography variant="body1">
            <strong>{t("Options")}:</strong> {product?.option}
          </Typography>

          <Typography variant="body1">
            <strong>{t("Quantity")}:</strong> {product?.quantity}
          </Typography>

          <Typography variant="body1">
            <strong>{t("Creation Date")}:</strong>{" "}
            {fDateTime(product?.creation_date)}
          </Typography>

          <Typography variant="body1">
            <strong>{t("Last Update")}:</strong>{" "}
            {fDateTime(product?.last_update)}
          </Typography>

          <Typography variant="body1" sx={{ alignSelf: "center" }}>
            <Badge
              sx={{
                minWidth: 24,
              }}
              badgeContent={isActive ? t("Active") : t("Inactive")}
              color={color}
            ></Badge>
          </Typography>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ProductDetailsPopup;
