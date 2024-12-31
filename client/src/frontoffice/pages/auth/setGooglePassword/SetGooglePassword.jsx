import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Paper, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate, useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import createAxiosInstance from "../../../../utils/axiosConfig";
import Logo from "../../../../backoffice/components/logo";

const SetGooglePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const email = queryParams.get("email");
  const name = queryParams.get("name");
  const picture = queryParams.get("picture");

  const axiosInstance = createAxiosInstance("customer");
  const [loadingSave, setLoadingSave] = useState(false);
  const [completeSuccess, setCompleteSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (completeSuccess) {
      navigate("/login");
    }
  }, [completeSuccess, navigate]);

  const onSubmit = async (data) => {
    setLoadingSave(true)
    try {
      const cleanImageUrl = picture.replace(/=s96-c$/, "") + "=d";
      const customerImage = await fetch(cleanImageUrl, { redirect: "follow" });
      const blob = await customerImage.blob();

      if (!blob.type.startsWith("image/")) {
        throw new Error("The fetched resource is not an image");
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("password", DOMPurify.sanitize(data.newPassword));
      formData.append("customer_image", blob, "customer_image.png");

      const axiosResponse = await axiosInstance.post(
        "/customers/complete-registration",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setCompleteSuccess(true);
      toast.success(t(axiosResponse.data.message));
      setLoadingSave(false)
    } catch (error) {
      console.error("Error in submission:", error);
      toast.error(error.message || "An error occurred");
      setLoadingSave(false)
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
            <Typography
              variant="h5"
              gutterBottom
              style={{ textAlign: "center", color: "black" }}
            >
              {completeSuccess ? t("AccountSetupSuccess") : t("Set Your Password")}
            </Typography>

            {!completeSuccess ? (
              <>
                <Typography variant="body1" style={{ marginBottom: "20px" }}>
                  {t("As a new user, please set a password to complete your registration.")}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="newPassword"
                    control={control}
                    rules={{
                      required: t("PasswordRequired"),
                      minLength: {
                        value: 6,
                        message: t("PasswordMinLength"),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("New Password")}
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message}
                      />
                    )}
                  />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      validate: (value) =>
                        value === newPassword || t("PasswordsDoNotMatch"),
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("Confirm Password")}
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                      />
                    )}
                  />
                  <LoadingButton
                    type="submit"
                    fullWidth
                    loading={loadingSave}
                    variant="contained"
                    sx={{ fontWeight: 500, fontSize: 15 }}
                    className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-2 !mb-2 !mt-2"
                  >
                    {loadingSave ? t("Loading") : t("Set Password")}
                  </LoadingButton>
                </form>
              </>
            ) : (
              <Typography
                variant="body1"
                style={{ textAlign: "center", color: "green", marginTop: "20px" }}
              >
                {t("AccountSetupComplete")}
              </Typography>
            )}
          </div>
        </Paper>
      </motion.div>
    </div>
  );
};

export default SetGooglePassword;
