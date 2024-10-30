import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Paper, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../components/logo";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";

const SetGooglePassword = () => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [completeSuccess, setCompleteSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosInstance = createAxiosInstance("customer");

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const email = queryParams.get('email');
  const name = queryParams.get('name');
  const picture = queryParams.get('picture');

  useEffect(() => {
    if (completeSuccess) {
      navigate("/login");
    }
  }, [completeSuccess, navigate]);

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();

    const sanitizedNewPassword = DOMPurify.sanitize(newPassword);
    const sanitizedConfirmedPassword = DOMPurify.sanitize(confirmPassword);

    if (sanitizedNewPassword !== sanitizedConfirmedPassword) {
      setError(t("Passwords do not match"));
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post("/customers/complete-registration", {
        email,
        name,
        password: sanitizedNewPassword,
        picture,
      });

      setCompleteSuccess(true);
      toast.success(response.data.message);
      setError(null);
    } catch (error) {
      console.error(error);
      setError(t("Failed to complete registration. Please try again."));
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
          {completeSuccess ? t("Account Setup Successful") : t("Complete Registration")}
        </Typography>
        {completeSuccess ? (
          <Typography
            variant="body1"
            style={{ textAlign: "center", color: "green" }}
          >
            {t("Your account setup is complete.")}
          </Typography>
        ) : (
          <form onSubmit={handleCompleteRegistration}>
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
            {error && (
              <Typography
                variant="body1"
                style={{ textAlign: "center", color: "red", marginTop: "10px" }}
              >
                {error}
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
                : completeSuccess
                  ? t("Go to Login")
                  : t("Set Password")}
            </Button>
          </form>
        )}
      </Paper>
    </div>
  );
};

export default SetGooglePassword;
