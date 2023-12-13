import React, { useState } from "react";
import {
  Box,
  Card,
  Stack,
  Divider,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Logo from "../../../components/logo";
import axios from "axios";
import Iconify from "../../../components/iconify";
import { bgGradient } from "../../../theme/css";
import { useRouter } from "../../../../routes/hooks";
import Alert from "@mui/material/Alert";

const ResetPasswordPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation(); // Translation hook
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async () => {
    try {
      setResetPasswordLoading(true);
      const newPasswordJson = { newPassword };

      // Send a request to your server to update the password
      const response = await axios.post(
        "/v1/users/reset-password/" + token,
        newPasswordJson
      );

      openSnackbar(response.data.message);
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch (error) {
      openSnackbar(t("Error") + ": " + error.response.data.message);
      console.error("Reset Password error:", error);
      console.log(error);
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: "/assets/background/overlay_4.jpg",
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Stack>
            <Stack alignItems="center">
              <Logo />
            </Stack>
            <Divider sx={{ my: 3 }}></Divider>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("Reset Password")}
            </Typography>
            <TextField
              name="password"
              label={t("New Password")}
              type={showPassword ? "text" : "password"}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword
                            ? "material-symbols-light:visibility-outline-rounded"
                            : "material-symbols-light:visibility-off-outline-rounded"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              label={t("Confirm Password")}
              type={showPassword ? "text" : "password"}
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword
                            ? "material-symbols-light:visibility-outline-rounded"
                            : "material-symbols-light:visibility-off-outline-rounded"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <LoadingButton
              fullWidth
              size="large"
              onClick={handleResetPassword}
              variant="contained"
              color="primary"
              loading={resetPasswordLoading}
              sx={{ mb: 2 }}
            >
              {t("Reset Password")}
            </LoadingButton>
          </Stack>
        </Card>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPasswordPage;
