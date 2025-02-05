import React, { useState, useEffect, useCallback } from "react";
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
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Logo from "../../../../backoffice/components/logo";
import Link from "@mui/material/Link";
import InputAdornment from "@mui/material/InputAdornment";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha
} from 'react-google-recaptcha-v3';

const Login = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const history = useNavigate();
  const [searchParams] = useSearchParams();
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [enteredForgotEmail, setEnteredForgotEmail] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const axiosInstance = createAxiosInstance("customer");
  const [isWebView, setIsWebView] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    if (searchParams.get("validationSuccess")) {
      toast.success(t("accountValidated"));
    }
  }, [searchParams, t]);

  const isLoggedin = localStorage.getItem("customer_access_token")

  useEffect(() => {
    if (isLoggedin) {
      const redirect = searchParams.get("redirect");
      history(redirect || "/", { replace: true });
    }
  }, [isLoggedin, searchParams, history]);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }
    const captchaToken = await executeRecaptcha('loginAction');
    return captchaToken;
  }, [executeRecaptcha]);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.includes("GreenVille")) {
      setIsWebView(true);
    }
  }, []);


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const onSubmit = async (data) => {
    setLoadingSave(true);
    dispatch(loginStart());

    const sanitizedEmail = DOMPurify.sanitize(data.email);
    const sanitizedPassword = DOMPurify.sanitize(data.password);

    const recaptchaToken = await handleReCaptchaVerify();
    if (!recaptchaToken) {
      toast.error("reCAPTCHA verification failed.");
      setLoadingSave(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/customers/login", {
        email: sanitizedEmail,
        password: sanitizedPassword,
        recaptchaToken,
      });

      if (response.status === 200) {
        localStorage.setItem("customer_access_token", response.data.access_token);

        dispatch(
          loginSuccess({
            customerToken: response.data.access_token,
            isLoggedIn: true
          })
        );
        if (window.AndroidInterface) {
          window.AndroidInterface.onLoginSuccess(JSON.stringify({
            customer: response.data.customer,
          }));
        }
      }
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.message || t('login.loginFailed')));
    } finally {
      setRefreshReCaptcha(!refreshReCaptcha);
      setLoadingSave(false);
    }
  };

  const responseMessage = async (response) => {
    try {
      const res = await axiosInstance.post("/customers/google-login", {
        idToken: response.credential,
      });

      if (res.status === 200) {
        if (res.data.cleanUrl) {
          let redirectUrl = res.data.cleanUrl;
          window.location.href = redirectUrl;
          console.log('Redirecting to WebView URL: ', redirectUrl);
        } else {
          localStorage.setItem("customer_access_token", res.data.access_token);

          dispatch(
            loginSuccess({
              customerToken: res.data.access_token,
            })
          );
        }
        const redirect = searchParams.get("redirect");
        history(redirect || "/", { replace: true });
      }
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.message || t('login.loginFailed')));
    }
  }

  const errorMessage = (error) => {
    console.error(error);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/customers/forgot-password", {
        email: enteredForgotEmail,
      });

      setEnteredForgotEmail("");
      toast.success(response.data.message);
      setOpenDialog(false);
    } catch (error) {
      console.error(error.response?.data?.error);
      toast.error("Error: " + error.response?.data?.error);
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
          className="form-container p-0 !rounded-2xl"
        >
          <div className="max-w-[380px] md:max-w-[450px] p-5 md:p-10"
          >
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <Typography variant="h5" gutterBottom style={{ color: "black" }}>
              {t("login.welcome")}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label={t("login.email")}
                variant="outlined"
                autoComplete="chrome-off"
                fullWidth
                margin="normal"
                {...register("email", {
                  required: t("login.emailRequired"),
                  validate: {
                    isValidEmail: value =>
                      validateEmail(value) || t("login.invalidEmail"),
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label={t("login.password")}
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("password", {
                  required: t("PasswordRequired"),
                  minLength: {
                    value: 6,
                    message: t("login.passwordLength"),
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  ...(isRtl
                    ? {
                      startAdornment: (
                        <InputAdornment position="start">
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
                    }
                    : {
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
                    }),
                }}
              />
              <LoadingButton
                type="submit"
                fullWidth
                loading={loadingSave}
                variant="contained"
                sx={{ fontWeight: 500, fontSize: 15 }}
                className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-2 !mb-2 !mt-2"
              >
                {loadingSave ? t("login.loggingIn") : t("login.login")}
              </LoadingButton>

              <div className="mt-2 flex justify-center">
                <GoogleLogin
                  onSuccess={responseMessage}
                  onError={errorMessage}
                  size="medium"
                  useOneTap
                  width="320px"
                  theme="outline"
                  locale={i18n.language}
                  auto_select={false}
                  use_fedcm_for_prompt={true}
                  ux_mode="popup"
                  context="signin"
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
                  style={{ color: "#8dc63f", fontWeight: 600 }}
                >
                  {t("login.register")}
                </Link>
              </Typography>
            </form>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>{t("login.forgotPasswordTitle")}</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label={t("login.email")}
                  type="email"
                  fullWidth
                  value={enteredForgotEmail}
                  onChange={(e) => setEnteredForgotEmail(e.target.value)}
                  variant="outlined"
                />
                <Typography>{t("login.forgotPasswordDesc")}</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>{t("login.cancel")}</Button>
                <Button onClick={handleForgotPassword}>{t("login.submit")}</Button>
              </DialogActions>
            </Dialog>
          </div>
        </Paper>
      </motion.div>
    </div>
  );
};

export default Login;
