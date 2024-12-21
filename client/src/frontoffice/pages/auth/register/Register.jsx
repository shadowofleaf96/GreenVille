import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { TextField, Typography, Paper, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Logo from "../../../components/logo";
import { Link } from "react-router-dom";
import { useRouter } from "../../../../routes/hooks";
import { motion } from "framer-motion";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha
} from 'react-google-recaptcha-v3';
import DOMPurify from "dompurify";


const RegistrationForm = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const router = useRouter();
  const [loadingSave, setLoadingSave] = useState(false);
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const axiosInstance = createAxiosInstance("customer");

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }
    const captchaToken = await executeRecaptcha('RegisterAction');
    return captchaToken;
  }, [executeRecaptcha]);


  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      const recaptchaToken = await handleReCaptchaVerify();
      if (!recaptchaToken) {
        toast.error("reCAPTCHA verification failed.");
        setLoadingSave(false);
        return;
      }
      const sanitizedData = {
        first_name: DOMPurify.sanitize(data.firstName),
        last_name: DOMPurify.sanitize(data.lastName),
        email: DOMPurify.sanitize(data.email),
        password: data.password,
        recaptchaToken,
      };

      const response = await axiosInstance.post("/customers", sanitizedData);
      toast.success(response?.data?.message);
      setLoadingSave(false);
      reset();
      router.push("/login");
    } catch (error) {
      toast.error(t("RegistrationError"));
      console.error("Error:", error.response?.data?.error);
      setLoadingSave(false);
    } finally {
      setRefreshReCaptcha(!refreshReCaptcha);
      setLoadingSave(false);
    }
  };

  return (
    <div className="backImage">
      <motion.div initial={{ scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <video autoPlay loop muted playsInline className="background-video" preload="auto"
        >
          <source src="https://res.cloudinary.com/donffivrz/video/upload/f_auto:video,q_auto/v1/greenville/public/videos/qdbnvi7dzfw7mc4i1mt7" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Paper
          elevation={3}
          className="form-container p-0.5 md:p-0 !rounded-2xl"
        >
          <div className="max-w-[400px] md:max-w-[450px] p-5 md:p-10">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <Typography variant="h5" gutterBottom style={{ color: "black" }}>
              {t("CreateAccount")}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: "flex", gap: "1em", marginBottom: "1em" }}>
                <TextField
                  label={t("FirstName")}
                  variant="outlined"
                  fullWidth
                  {...register("firstName", { required: t("FirstNameRequired") })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
                <TextField
                  label={t("LastName")}
                  variant="outlined"
                  fullWidth
                  {...register("lastName", { required: t("LastNameRequired") })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Box>
              <Box sx={{ display: "flex", gap: "1em", marginBottom: "1em" }}>
                <TextField
                  label={t("Email")}
                  variant="outlined"
                  fullWidth
                  {...register("email", {
                    required: t("EmailRequired"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t("EmailInvalid"),
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Box>
              <Box sx={{ display: "flex", gap: "1em", marginBottom: "1em" }}>
                <TextField
                  label={t("Password")}
                  variant="outlined"
                  type="password"
                  fullWidth
                  {...register("password", {
                    required: t("PasswordRequired"),
                    minLength: {
                      value: 6,
                      message: t("PasswordMinLength"),
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                <TextField
                  label={t("ConfirmPassword")}
                  variant="outlined"
                  type="password"
                  fullWidth
                  {...register("confirmPassword", {
                    required: t("ConfirmPasswordRequired"),
                    validate: (value) => value === watch("password") || t("PasswordsDoNotMatch"),
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Box>
              <LoadingButton
                type="submit"
                fullWidth
                loading={loadingSave}
                variant="contained"
                sx={{ fontWeight: 500, fontSize: 15, marginTop: "1em" }}
                className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-2 !mb-2"
              >
                {loadingSave ? t("Registering") : t("Register")}
              </LoadingButton>
              <Typography variant="body2" style={{ textAlign: "center", marginTop: "1em", marginRight: "1em" }}>
                {t("AlreadyHaveAccount")}{" "}
                <Link to="/login" style={{ color: "#8dc63f" }}>
                  {t("Login")}
                </Link>
              </Typography>
            </form>
          </div>
        </Paper>
      </motion.div>
    </div >
  );
};

export default RegistrationForm;
