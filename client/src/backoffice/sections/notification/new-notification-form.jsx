import React, { useState } from "react";
import { MenuItem, Select, InputLabel, FormControl, Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import DOMPurify from "dompurify";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function SendNotificationForm({ onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [loadingSave, setLoadingSave] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      subject: "",
      body: "",
      sendType: "email",
    },
  });

  const handleSave = async (data) => {
    setLoadingSave(true);
    try {
      const sanitizedData = {
        subject: DOMPurify.sanitize(data.subject),
        body: DOMPurify.sanitize(data.body),
        sendType: data.sendType,
      };

      await onSave(sanitizedData);
      onClose();
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
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
        <Typography variant="h4" gutterBottom sx={{ color: "#3f51b5" }}>
          {t("SendNotification")}
        </Typography>

        <form onSubmit={handleSubmit(handleSave)} noValidate style={{ width: "100%" }}>
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <TextField
                  label={t("Subject")}
                  {...field}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
              )}
            />

            <Stack>
              <Controller
                name="body"
                control={control}
                render={({ field }) => (
                  <div>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                      {t("BodyHTMLAllowed")}
                    </Typography>
                    <ReactQuill
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      theme="snow"
                      style={{ height: "200px", marginBottom: "48px" }}
                    />
                  </div>
                )}
              />
            </Stack>

            <Stack>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel htmlFor="sendType">{t("SendType")}</InputLabel>
                <Controller
                  name="sendType"
                  control={control}
                  defaultValue="email"
                  render={({ field }) => (
                    <Select {...field} fullWidth>
                      <MenuItem value="email">{t("Email")}</MenuItem>
                      <MenuItem value="android">{t("Android")}</MenuItem>
                      <MenuItem value="both">{t("BothEmailAndroid")}</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Stack>

            {/* Buttons */}
            <Stack direction="row" spacing={2}>
              <LoadingButton loading={loadingSave} type="submit" variant="contained" sx={{ flex: 1 }}>
                {t("Send")}
              </LoadingButton>
              <Button onClick={onCancel} variant="outlined" sx={{ flex: 1 }}>
                {t("Cancel")}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}

export default SendNotificationForm;