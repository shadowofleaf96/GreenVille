import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Label from "../../components/label";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import { useTranslation } from 'react-i18next';

const OrderDetailsPopup = ({ order, open, onClose }) => {
  const { t } = useTranslation(); // Using translation hook
  const isActive = order?.status;
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
          borderRadius: "16px",
          p: 4,
          width: 400,
          textAlign: "center",
        }}
      >
        <Stack direction="column" alignItems="flex-start" spacing={2}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#3f51b5", alignSelf: "center" }} 
          >
            {t('Customer Details')}
          </Typography>

          <Typography variant="body1" style={{ marginBottom: 8 }}>
            <strong>{t('Customer First Name:')}</strong> {order?.customer.first_name}
          </Typography>

          <Typography variant="body1" style={{ marginBottom: 8 }}>
            <strong>{t('Customer Last Name:')}</strong> {order?.customer.last_name}
          </Typography>

          <Typography variant="body1" style={{ marginBottom: 8 }}>
            <strong>{t('Customer Email:')}</strong> {order?.customer.email}
          </Typography>

          <Typography>
            <Typography variant="body1" style={{ marginBottom: 8 }}>
              <strong>{t('Order Items:')}</strong>
            </Typography>
            {order?.order_items.map((orderItem, index) => (
              <Stack key={index}>
                <Stack>
                  <Typography sx={{ fontSize: "small" }}>
                    <strong>{t('Product N°')} {index + 1}</strong>
                  </Typography>
                  <Typography sx={{ fontSize: "small" }}>
                    <strong>{t('Name:')}</strong> {orderItem.product.product_name}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography sx={{ fontSize: "small" }}>
                    <strong>{t('Quantity:')}</strong> {orderItem.quantity}
                  </Typography>
                </Stack>
                <Stack>
                  <Typography sx={{ fontSize: "small" }}>
                    <strong>{t('Price:')}</strong> {orderItem.product.price} DH
                  </Typography>
                </Stack>
                {index < order.order_items.length - 1 && (
                  <div style={{ height: 8 }} />
                )}
              </Stack>
            ))}
          </Typography>

          <Typography variant="body1" style={{ marginBottom: 8 }}>
            <strong>{t('Order Total Price:')}</strong> {order?.cart_total_price} DH
          </Typography>

          <Typography variant="body1" sx={{ alignSelf: "center" }}>
            <Badge
              sx={{
                minWidth: 24,
              }}
              badgeContent={isActive ? t('Active') : t('Inactive')}
              color={color}
            ></Badge>
          </Typography>
        </Stack>
      </Box>
    </Modal>
  );
};

export default OrderDetailsPopup;
