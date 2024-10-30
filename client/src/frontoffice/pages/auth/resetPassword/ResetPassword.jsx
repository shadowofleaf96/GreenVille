import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Paper, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../../../components/logo";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";

const ResetPassword = () => {
  const { token } = useParams();
  const { t } = useTranslation(); // useTranslation hook
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosInstance = createAxiosInstance("customer");

  const history = useNavigate();

  useEffect(() => {
    if (resetSuccess) {
      history("/login");
    }
  }, [resetSuccess, history]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const sanitizedNewPassword = DOMPurify.sanitize(newPassword);
    const sanitizedConfirmedPassword = DOMPurify.sanitize(confirmPassword);

    if (sanitizedNewPassword !== sanitizedConfirmedPassword) {
      setResetError(t("Passwords do not match"));
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(
        `/customers/reset-password/${token}`,
        {
          newPassword: sanitizedNewPassword,
        }
      );

      setResetSuccess(true);
      toast.success(response.data.message);
      setResetError(null);
    } catch (error) {
      console.error(error.response.data.error);
      setResetError(t("Failed to reset password. Please try again."));
      setResetSuccess(false);
      toast.error(t("Error: ") + error.response.data.error);
    } finally {
      setLoading(false);
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
          {resetSuccess ? t("Password Reset Successful") : t("Reset Password")}
        </Typography>
        {resetSuccess ? (
          <Typography
            variant="body1"
            style={{ textAlign: "center", color: "green" }}
          >
            {t("Your password has been successfully reset.")}
          </Typography>
        ) : (
          <form onSubmit={handleResetPassword}>
            <TextField
              label={t("New Password")}
              autoComplete="chrome-off"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label={t("Confirm Password")}
              type="password"
              autoComplete="chrome-off"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {resetError && (
              <Typography
                variant="body1"
                style={{ textAlign: "center", color: "red", marginTop: "10px" }}
              >
                {resetError}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              style={{
                backgroundColor: "#8dc63f",
                color: "#fff",
                marginTop: "10px",
              }}
              className="rounded-lg"
              fullWidth
              disabled={loading}
            >
              {loading
                ? t("Loading...")
                : resetSuccess
                  ? t("Go to Login")
                  : t("Reset Password")}
            </Button>
          </form>
        )}
      </Paper>
    </div>
  );
};

export default ResetPassword;
