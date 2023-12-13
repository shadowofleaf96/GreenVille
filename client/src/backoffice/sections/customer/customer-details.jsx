import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Label from "../../components/label";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { fDateTime } from "../../../utils/format-time";
import { useTranslation } from "react-i18next";

const CustomerDetailsPopup = ({ customer, open, onClose }) => {
  const isActive = customer?.active;
  const { t } = useTranslation();
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
            src={`http://localhost:3000/${customer?.customer_image}`}
            sx={{ width: 100, height: 100, alignSelf: "center" }}
          />
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#3f51b5", alignSelf: "center" }}
          >
            {t("Customer Details")}
          </Typography>

          <Typography variant="body1">
            <strong>{t("First Name")}: </strong> {customer?.first_name}
          </Typography>

          <Typography variant="body1">
            <strong>{t("Last Name")}: </strong> {customer?.last_name}
          </Typography>

          <Typography variant="body1">
            <strong>{t("Email")}: </strong> {customer?.email}
          </Typography>

          <Typography variant="body1">
            <strong>{t("Creation Date")}: </strong>
            {fDateTime(customer?.creation_date)}
          </Typography>

          <Typography variant="body1">
            <strong>{t("Last Login")}: </strong>
            {fDateTime(customer?.last_login)}
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

export default CustomerDetailsPopup;
