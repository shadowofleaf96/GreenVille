import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../redux/backoffice/authSlice";
import {
  Box,
  Link,
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import { bgGradient } from "../../../theme/css";
import InputAdornment from "@mui/material/InputAdornment";
import { useRouter } from "../../../routes/hooks";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Logo from "../../components/logo";
import Iconify from "../../components/iconify";
import createAxiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { control, handleSubmit, setError } = useForm();
  const [loadingSave, setLoadingSave] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const axiosInstance = createAxiosInstance("admin");
  const isRtl = i18n.language === "ar";

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      const response = await axiosInstance.post("/users/login", data);

      if (response.status === 200) {
        localStorage.setItem("user_access_token", response.data.access_token);
        localStorage.setItem("user_refresh_token", response.data.refresh_token);

        dispatch(
          loginSuccess({
            admin: response.data.user,
            adminToken: response.data.access_token,
          })
        );
        router.push("/admin/");
      }
    } catch (error) {
      toast.error("Error: " + error.response.data.message);
      setError("server", { type: "manual", message: error.response.data.message });
    } finally {
      setLoadingSave(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: "/assets/background/overlay_4.jpg",
        }),
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1, width: "100%" }}>
        <Card
          sx={{
            p: 5,
            width: "100%",
            maxWidth: 420,
          }}
        >
          <Stack alignItems="center">
            <Logo />
          </Stack>
          <Divider sx={{ my: 3 }}></Divider>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Controller
                name="user_name"
                control={control}
                defaultValue=""
                rules={{ required: t("Username is required") }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t("User Name")}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: t("Password is required") }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label={t("Password")}
                    type={showPassword ? "text" : "password"}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      ...(isRtl
                        ? {
                            startAdornment: (
                              <InputAdornment position="start">
                                <IconButton onClick={handleClickShowPassword}>
                                  <Iconify
                                    icon={
                                      showPassword
                                        ? "material-symbols-light:visibility-outline-rounded"
                                        : "material-symbols-light:visibility-off-outline-rounded"
                                    }
                                    width={24}
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }
                        : {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword}>
                                  <Iconify
                                    icon={
                                      showPassword
                                        ? "material-symbols-light:visibility-outline-rounded"
                                        : "material-symbols-light:visibility-off-outline-rounded"
                                    }
                                    width={24}
                                  />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }),
                    }}
                  />
                )}
              />
            </Stack>

            <LoadingButton
              fullWidth
              loading={loadingSave}
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              className="!py-3 !mt-4 !font-medium !rounded-lg !shadow-none !transition-shadow !duration-300 !cursor-pointer hover:!shadow-lg hover:!shadow-yellow-400"
            >
              {t("Login")}
            </LoadingButton>
          </form>
        </Card>
      </Stack>
    </Box>
  );
}
