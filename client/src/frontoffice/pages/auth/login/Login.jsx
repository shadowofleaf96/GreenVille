import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../../../redux/frontoffice/customerSlice";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Logo from "../../../components/logo";
import Link from "@mui/material/Link";
import InputAdornment from "@mui/material/InputAdornment";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
const backend = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [loginSuccessFlag, setLoginSuccessFlag] = useState(false);
  const axiosInstance = createAxiosInstance("customer");

  useEffect(() => {
    const storedRememberMe = localStorage.getItem("rememberMe");
    if (storedRememberMe) {
      setRememberMe(JSON.parse(storedRememberMe));
    }
  }, []);

  useEffect(() => {
    if (loginSuccessFlag) {
      const redirect = searchParams.get("redirect");
      history(redirect || "/", { replace: true });
    }
  }, [loginSuccessFlag, searchParams, history]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleRememberMeChange = () => {
    const newRememberMe = !rememberMe;
    setRememberMe(newRememberMe);
    localStorage.setItem("rememberMe", JSON.stringify(newRememberMe));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingSave(true);
    dispatch(loginStart());

    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedPassword = DOMPurify.sanitize(password);

    try {
      const response = await axiosInstance.post("/customers/login", {
        email: sanitizedEmail,
        password: sanitizedPassword,
        rememberMe,
      });

      if (response.status === 200) {
        localStorage.setItem("customer_access_token", response.data.access_token);
        localStorage.setItem("customer_refresh_token", response.data.refresh_token);

        dispatch(
          loginSuccess({
            customerToken: response.data.access_token,
            isLoggedIn: true
          })
        );
        setLoginSuccessFlag(true);
      }
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.message || t('login.loginFailed')));
    } finally {
      setLoadingSave(false);
    }
  };

  const responseMessage = async (response) => {
    try {
      const res = await axiosInstance.post(`/customers/google-login`, {
        idToken: response.credential,
      });

      if (res.status === 200) {
        if (res.data.cleanUrl) {
          window.location.href = res.data.cleanUrl;
        } else {
          localStorage.setItem("customer_access_token", res.data.access_token);
          localStorage.setItem("customer_refresh_token", res.data.refresh_token);

          dispatch(
            loginSuccess({
              customerToken: res.data.access_token,
              isLoggedIn: true
            })
          );
          setLoginSuccessFlag(true);
        }
      }
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.message || t('login.loginFailed')));
    }
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/customers/forgot-password", {
        email: enteredEmail,
      });

      toast.success(response.data.message);
      setOpenDialog(false);
    } catch (error) {
      console.error(error.message);
      toast.error("Error: " + error.response.data.message);
    }
  };

  return (
    <div className="backImage">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
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
          <Typography variant="h5" gutterBottom style={{ color: "black" }}>
            {t("login.welcome")}
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label={t("login.email")}
              variant="outlined"
              autoComplete="chrome-off"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ shrink: true }}
              placeholder={t("login.email")}
            />
            <TextField
              label={t("login.password")}
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ shrink: true }}
              placeholder={t("login.password")}
              InputProps={{
                autoComplete: "new-password",
                form: { autoComplete: "off" },
                endAdornment: (
                  <InputAdornment position="end">
                    <MuiLink
                      component={Link}
                      to="/forgot-password"
                      variant="body2"
                      style={{ color: "black", cursor: "pointer" }}
                      onClick={handleOpenDialog}
                    >
                      {t("login.forgotPassword")}
                    </MuiLink>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  style={{ color: "#8dc63f" }}
                />
              }
              label={t("login.rememberMe")}
            />

            <LoadingButton
              type="submit"
              fullWidth
              loading={loadingSave}
              variant="contained"
              sx={{ fontWeight: 500, fontSize: 15 }}
              className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-2 !mb-2"
            >
              {loadingSave ? t("login.loggingIn") : t("login.login")}
            </LoadingButton>

            <div className="mt-2">
              <GoogleLogin
                onSuccess={responseMessage}
                onError={errorMessage}
                size="medium"
                useOneTap
                width="340px"
                theme="outline"
                auto_select={false}
                text={t("login.googleLogin")}
                ux_mode="popup"
                context="signin"
                logo_alignment="left"
              />
            </div>

            <Typography
              variant="body2"
              style={{ textAlign: "center", marginTop: "30px" }}
            >
              {t("login.noAccount")}{" "}
              <Link
                component={RouterLink}
                to="/register"
                underline="hover"
                style={{ color: "#8dc63f" }}
              >
                {t("login.register")}
              </Link>
            </Typography>
          </form>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{t("login.forgotPasswordTitle")}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t("login.email")}
              type="email"
              fullWidth
              value={enteredEmail}
              onChange={(e) => setEnteredEmail(e.target.value)}
              variant="outlined"
            />
            <Typography>{t("login.forgotPasswordDesc")}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t("login.cancel")}</Button>
            <Button onClick={handleForgotPassword}>{t("login.submit")}</Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default Login;