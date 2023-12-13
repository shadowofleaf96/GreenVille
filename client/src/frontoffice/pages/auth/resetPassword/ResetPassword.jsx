import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../../../components/logo";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [loading, setLoading] = useState(false);

  const history = useNavigate();

  useEffect(() => {
    if (resetSuccess) {
      history.push("/login");
    }
  }, [resetSuccess, history]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Make an API request to your reset password endpoint
      const response = await axios.post(
        `http://localhost:3000/v1/customers/reset-password/${token}`,
        {
          newPassword,
        }
      );

      setResetSuccess(true);
      setResetError(null);
    } catch (error) {
      console.error(error.message);
      setResetError("Failed to reset password. Please try again.");
      setResetSuccess(false);
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
          backdropFilter: "blur(90px)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          borderRadius: "20px",
          textAlign: "center",
        }}
      >
        <Logo sx={{ marginBottom: "20px" }} />
        <Typography
          variant="h5"
          gutterBottom
          style={{ textAlign: "center", color: "black" }}
        >
          {resetSuccess ? "Password Reset Successful" : "Reset Password"}
        </Typography>
        {resetSuccess ? (
          <Typography
            variant="body1"
            style={{ textAlign: "center", color: "green" }}
          >
            Your password has been successfully reset.
          </Typography>
        ) : (
          <form onSubmit={handleResetPassword}>
            <TextField
              label="New Password"
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
              label="Confirm Password"
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
                borderRadius: "20px",
              }}
              fullWidth
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : resetSuccess
                ? "Go to Login"
                : "Reset Password"}
            </Button>
          </form>
        )}
      </Paper>
    </div>
  );
};

export default ResetPassword;
