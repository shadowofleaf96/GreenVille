import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";

const OrderDetailsPopup = ({ order, open, onClose }) => {
  const { t } = useTranslation();
  const [shippingStatus, setShippingStatus] = useState("");

  useEffect(() => {
    if (order?.shipping_status === "not_shipped") {
      setShippingStatus("Not Shipped")
    } else if (order?.shipping_status === "shipped") {
      setShippingStatus("Shipped")
    } else if (order?.shipping_status === "in_transit") {
      setShippingStatus("In Transit")
    } else if (order?.shipping_status === "delivered") {
      setShippingStatus("Delivered")
    }
  }, [order?.shipping_status])


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          width: 500,
          maxHeight: "80vh",
          overflowY: "auto",
          p: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{ textAlign: "center", mb: 3, fontWeight: "bold", color: "#3f51b5" }}
        >
          {t("Order Details")}
        </Typography>

        <Stack direction="column" spacing={2}>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {t("Customer Details")}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{t("First Name")}: </strong> {order?.customer.first_name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{t("Last Name")}: </strong> {order?.customer.last_name}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{t("Email")}: </strong> {order?.customer.email}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {t("Order Details")}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{t("Cart Total Price")}: </strong> {order?.cart_total_price} DH
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{t("Shipping Method")}: </strong> <span className="text-black capitalize">{order?.shipping_method}</span>
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{t("Shipping Status")}: </strong> {shippingStatus}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{t("Order Notes")}: </strong> {order?.order_notes || t("No notes")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>{t("Shipping Address")}: </strong>
              {order?.shipping_address.street}, {order?.shipping_address.city},{order?.shipping_address.postal_code}, {order?.shipping_address.country}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>{t("Status")}: </strong> <span className="text-black capitalize">{order?.status}</span>
            </Typography>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {t("Order Items")}
              </Typography>
              <Divider sx={{ my: 1 }} />
              {order?.order_items.map((item, index) => (
                <Stack key={index} direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>{t("Product")}: </strong> {item.product.product_name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>{t("Qty")}: </strong> {item.quantity}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>{t("Price")}: </strong> {item.price} DH
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default OrderDetailsPopup;
