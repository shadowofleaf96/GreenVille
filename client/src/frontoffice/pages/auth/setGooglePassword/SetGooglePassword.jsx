import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Paper, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useNavigate, useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import createAxiosInstance from "../../../../utils/axiosConfig";
import Logo from "../../../components/logo";

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
    const sanitizedNewPassword = DOMPurify.sanitize(data.newPassword);
    const sanitizedConfirmPassword = DOMPurify.sanitize(data.confirmPassword);

    if (sanitizedNewPassword !== sanitizedConfirmPassword) {
      toast.error(t("PasswordsDoNotMatch"));
      return;
    }

    try {
      setLoadingSave(true);
      const response = await axiosInstance.post("/customers/complete-registration", {
        email,
        name,
        password: sanitizedNewPassword,
        picture,
      });

      setCompleteSuccess(true);
      toast.success(t(response.data.message));
    } catch (error) {
      toast.error(t("RegistrationError"));
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="backImage">
      <Paper
        elevation={3}
        sx={{ p: 5 }}
        style={{
          maxWidth: "420px",
          backgroundColor: "white",
          borderRadius: "20px",
          textAlign: "center",
        }}
      >
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
      </Paper>
    </div>
  );
};

export default SetGooglePassword;
