import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { Modal, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function ReplyContactForm({ contact, onSave, onCancel, open, onClose }) {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: contact?.name || "",
            email: contact?.email || "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const sanitizedData = {
                ...data,
                _id: contact?._id,
            };
            await onSave(sanitizedData);

            toast.success("response has sent successfully!");
            onClose();
        } catch (error) {
            console.error("Error saving contact:", error);
            toast.error("Failed to send response. Please try again.");
        } finally {
            setLoading(false);
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
                    width: 500,
                    color: "#333",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: "16px",
                    padding: "20px",
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ color: "#3f51b5", marginBottom: 2 }}>
                    {t("Replying to " + contact.name)}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: "100%" }}>
                    <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                        <Controller
                            name="subject"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={t("Subject")}
                                    fullWidth
                                    error={!!errors.subject}
                                    helperText={errors.subject && t("Subject")}
                                />
                            )}
                            rules={{ required: true }}
                        />

                        <Controller
                            name="message"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={t("Message")}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    error={!!errors.message}
                                    helperText={errors.message && t("Message is required")}
                                />
                            )}
                            rules={{ required: true }}
                        />
                        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                            <LoadingButton
                                loading={loading}
                                type="submit"
                                variant="contained"
                                sx={{ flex: 1 }}
                            >
                                {t("Reply")}
                            </LoadingButton>
                            <Button onClick={onCancel} variant="outlined" sx={{ flex: 1 }}>
                                {t("Cancel")}
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Stack>
        </Modal>
    );
}
