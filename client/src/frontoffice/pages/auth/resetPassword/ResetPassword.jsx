import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Paper, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../../../../backoffice/components/logo";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";

const ResetPassword = () => {
  const { token } = useParams();
  const { t } = useTranslation();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const axiosInstance = createAxiosInstance("customer");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (resetSuccess) {
      navigate("/login");
    }
  }, [resetSuccess, navigate]);

  const onSubmit = async (data) => {
    const sanitizedNewPassword = DOMPurify.sanitize(data.newPassword);
    const sanitizedConfirmPassword = DOMPurify.sanitize(data.confirmPassword);

    if (sanitizedNewPassword !== sanitizedConfirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: t("Passwords do not match"),
      });
      return;
    }

    try {
      setLoadingSave(true);

      const response = await axiosInstance.post(
        `/customers/reset-password/${token}`,
        { newPassword: sanitizedNewPassword }
      );

      setResetSuccess(true);
      toast.success(response.data.message);
      setResetError(null);
    } catch (error) {
      setResetError(t("Failed to reset password. Please try again."));
      toast.error(t("Error: ") + error.response?.data?.error || error.message);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="backImage">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <video autoPlay loop muted playsInline className="background-video" preload="auto"
        >
          <source src="https://res.cloudinary.com/donffivrz/video/upload/f_auto:video,q_auto/v1/greenville/public/videos/qdbnvi7dzfw7mc4i1mt7" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Paper
          elevation={3}
          className="form-container p-0.5 md:p-0 !rounded-2xl"
        >
          <div className="max-w-[360px] md:max-w-[420px] p-5 md:p-10">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <Typography variant="h5" gutterBottom style={{ color: "black" }}>
              {resetSuccess ? t("Password Reset Successful") : t("Reset Password")}
            </Typography>
            {resetSuccess ? (
              <Typography variant="body1" style={{ color: "green" }}>
                {t("Your password has been successfully reset.")}
              </Typography>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  {...register("newPassword", {
                    required: t("Password is required"),
                    minLength: {
                      value: 8,
                      message: t("Password must be at least 8 characters long"),
                    },
                  })}
                  label={t("New Password")}
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.newPassword)}
                  helperText={errors.newPassword?.message}
                />
                <TextField
                  {...register("confirmPassword", {
                    required: t("Please confirm your password"),
                  })}
                  label={t("Confirm Password")}
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword?.message}
                />
                {resetError && (
                  <Typography
                    variant="body1"
                    style={{ color: "red", marginTop: "10px" }}
                  >
                    {resetError}
                  </Typography>
                )}
                <LoadingButton
                  type="submit"
                  fullWidth
                  loading={loadingSave}
                  variant="contained"
                  sx={{ fontWeight: 500, fontSize: 15 }}
                  className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-2 !mb-2 !mt-2"
                >
                  {loadingSave ? t("Loading...") : t("Reset Password")}
                </LoadingButton>
              </form>
            )}
          </div>
        </Paper>
      </motion.div>
    </div>
  );
};

export default ResetPassword;