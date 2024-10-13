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
  const { t } = useTranslation();

  const [user_name, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loadingSave, setLoadingSave] = useState(false);
  const axiosInstance = createAxiosInstance("admin")

  const navigate = useNavigate()

  useEffect(() => {
    const isloggedin = localStorage.getItem("user_access_token");

    if (isloggedin) {
      navigate("/admin/")
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoadingSave(true);

    try {
      const requestBody = {
        user_name,
        password,
      };
      const response = await axiosInstance.post("/users/login", requestBody);

      if (response.status === 200) {
        localStorage.setItem('user_access_token', response.data.access_token);
        localStorage.setItem('user_refresh_token', response.data.refresh_token);

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
    } finally {
      setLoadingSave(false);
    }
  };

  const handleChangeEmail = (event) => {
    setUserName(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const renderForm = (
    <>
      <form id="loginForm" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="user_name"
            label={t("User Name")}
            autoComplete="username"
            value={user_name}
            onChange={handleChangeEmail}
          />

          <TextField
            name="password"
            label={t("Password")}
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handleChangePassword}
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
                      width={24}
                      height={24}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ my: 3 }}
        >
        </Stack>

        <LoadingButton
          fullWidth
          loading={loadingSave}
          size="large"
          type="submit"
          variant="contained"
          color="primary"
          form="loginForm"
        >
          {t("Login")}
        </LoadingButton>
      </form>
    </>
  );

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
      <Stack alignItems="center" justifyContent="center"
        sx={{ height: 1, width: "100%" }}>
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

          {renderForm}
        </Card>
      </Stack>
    </Box >
  );
}
