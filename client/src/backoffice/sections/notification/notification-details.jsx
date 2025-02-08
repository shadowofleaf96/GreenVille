import React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DOMPurify from "dompurify";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";

const NotificationDetailsPopup = ({ notification, open, onClose }) => {
  const { t } = useTranslation();

  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const decodedBody = decodeHtmlEntities(notification?.body);
  const sanitizedBody = DOMPurify.sanitize(decodedBody);
  const cleanedBody = sanitizedBody.replace(/<\/?(html|body)[^>]*>/g, "");

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
          borderRadius: 3,
          width: 600,
          maxHeight: "80vh",
          overflowY: "auto",
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "#1976d2",
            mb: 3,
          }}
        >
          {t("Notification Details")}
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#424242",
                mb: 1,
                textAlign: "center",
              }}
            >
              {notification?.subject}
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Box>

          <Box sx={{ color: "#424242", mb: 2 }}>
            <div dangerouslySetInnerHTML={{ __html: cleanedBody }} />
          </Box>

          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f5f5f5" }}>
            <Typography variant="body1" sx={{ m: 1 }}>
              <strong>{t("Notification Type")}: </strong>
              <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                {notification?.sendType}
              </span>
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, maxWidth: "100%", m: 1 }}>
              {notification?.recipients.map((recipient, index) => (
                <Chip key={index} label={recipient} sx={{ maxWidth: "100%" }} />
              ))}
            </Box>
            <Typography variant="body1">
              <strong>{t("Date Sent")}: </strong> {notification?.dateSent}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default NotificationDetailsPopup;