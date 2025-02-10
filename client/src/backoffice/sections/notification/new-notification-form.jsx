import React, { useState } from "react";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  TextField,
  Button,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LoadingButton from "@mui/lab/LoadingButton";
import DOMPurify from "dompurify";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

function SendNotificationForm({ onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [loadingSave, setLoadingSave] = useState(false);
  const [sendType, setSendType] = useState("email");

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: "",
      body: "",
      sendType: "email",
    },
  });

  const handleSendTypeChange = (value) => {
    setSendType(value);
    if (value === "android") {
      setValue("body", "Android");
    } else {
      setValue("body", "");
    }
  };

  const handleSave = async (data) => {
    setLoadingSave(true);
    try {
      const sanitizedData = {
        subject: DOMPurify.sanitize(data.subject),
        body: DOMPurify.sanitize(data.body),
        sendType: data.sendType,
      };

      await onSave(sanitizedData);
      reset();
      onClose();
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setLoadingSave(false);
      setValue("body", "");
      setSendType("email")
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

        <form
          onSubmit={handleSubmit(handleSave)}
          noValidate
          style={{ width: "100%" }}
        >
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Controller
              name="subject"
              control={control}
              rules={{ required: t("Subject is required") }}
              render={({ field }) => (
                <TextField
                  label={t("Subject")}
                  {...field}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  error={!!errors.subject}
                  helperText={errors.subject ? errors.subject.message : ""}
                />
              )}
            />

            {sendType !== "android" && (
              <Stack>
                <Controller
                  name="body"
                  control={control}
                  rules={{ required: t("Body is required") }}
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
                      {errors.body && (
                        <Typography color="error" variant="body2">
                          {errors.body.message}
                        </Typography>
                      )}
                    </div>
                  )}
                />
              </Stack>
            )}

            <Stack>
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel htmlFor="sendType">{t("SendType")}</InputLabel>
                <Controller
                  name="sendType"
                  control={control}
                  defaultValue="email"
                  render={({ field }) => (
                    <Select
                      label={t("SendType")}
                      id="sendType"
                      {...field}
                      fullWidth
                      onChange={(e) => {
                        field.onChange(e);
                        handleSendTypeChange(e.target.value);
                      }}
                    >
                      <MenuItem value="email">{t("Email")}</MenuItem>
                      <MenuItem value="android">{t("Android")}</MenuItem>
                      <MenuItem value="both">
                        {t("BothEmailAndroid")}
                      </MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2}>
              <LoadingButton
                loading={loadingSave}
                type="submit"
                variant="contained"
                sx={{ flex: 1 }}
              >
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