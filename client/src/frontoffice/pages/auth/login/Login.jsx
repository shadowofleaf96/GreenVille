import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
} from "../../../../redux/frontoffice/customerSlice";
import { GoogleLogin } from "@react-oauth/google";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import Logo from "../../../../backoffice/components/logo";
import createAxiosInstance from "../../../../utils/axiosConfig";
import Iconify from "../../../../backoffice/components/iconify";

import { Input } from "@/components/ui/input";
import AuthBackground from "../../../components/auth/AuthBackground";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

const Login = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [enteredForgotEmail, setEnteredForgotEmail] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingForgot, setLoadingForgot] = useState(false);
  const axiosInstance = createAxiosInstance("customer");
  const [isWebView, setIsWebView] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (searchParams.get("validationSuccess")) {
      toast.success(t("accountValidated"));
    }
  }, [searchParams, t]);

  const { data: settings } = useSelector((state) => state.adminSettings);

  const isLoggedin = localStorage.getItem("customer_access_token");

  useEffect(() => {
    if (isLoggedin) {
      const redirect = searchParams.get("redirect");
      navigate(redirect || "/", { replace: true });
    }
  }, [isLoggedin, searchParams, navigate]);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }
    const captchaToken = await executeRecaptcha("loginAction");
    return captchaToken;
  }, [executeRecaptcha]);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.includes("GreenVille")) {
      setIsWebView(true);
    }
  }, []);

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
        localStorage.setItem(
          "customer_access_token",
          response.data.access_token,
        );

        dispatch(
          loginSuccess({
            customerToken: response.data.access_token,
            isLoggedIn: true,
          }),
        );
        if (window.AndroidInterface) {
          window.AndroidInterface.onLoginSuccess(
            JSON.stringify({
              customer: response.data.customer,
            }),
          );
        }
      }
    } catch (error) {
      toast.error(
        "Error: " + (error.response?.data?.message || t("login.loginFailed")),
      );
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
        } else {
          localStorage.setItem("customer_access_token", res.data.access_token);

          dispatch(
            loginSuccess({
              customerToken: res.data.access_token,
            }),
          );
        }
        const redirect = searchParams.get("redirect");
        navigate(redirect || "/", { replace: true });
      }
    } catch (error) {
      toast.error(
        "Error: " + (error.response?.data?.message || t("login.loginFailed")),
      );
    }
  };

  const errorMessage = (error) => {
    console.error(error);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateEmail(enteredForgotEmail)) {
      toast.error(t("login.invalidEmail"));
      return;
    }
    setLoadingForgot(true);
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
    } finally {
      setLoadingForgot(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-black">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <AuthBackground
          url={settings?.auth_settings?.auth_video_url}
          className="w-full h-full object-cover opacity-60 filter brightness-50"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-black/80" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="rounded-4xl sm:rounded-[2.5rem] border-none shadow-2xl bg-white/95 overflow-hidden ring-1 ring-black/5">
          <CardContent className="p-6 sm:p-10 md:p-12">
            <div className="flex flex-col items-center">
              <RouterLink
                to="/"
                className="mb-8 hover:scale-105 transition-transform duration-300"
              >
                <Logo />
              </RouterLink>

              <div className="text-center space-y-2 mb-10">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {t("login.welcome")}
                </h1>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      {t("login.email")}
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <Iconify icon="solar:letter-bold-duotone" width={20} />
                      </div>
                      <Input
                        {...register("email", {
                          required: t("login.emailRequired"),
                          validate: {
                            isValidEmail: (value) =>
                              validateEmail(value) || t("login.invalidEmail"),
                          },
                        })}
                        placeholder="john@example.com"
                        className={`h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold ${
                          errors.email ? "border-red-500 bg-red-50/50" : ""
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 animate-in fade-in slide-in-from-left-2">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        {t("login.password")}
                      </Label>
                      <button
                        type="button"
                        onClick={() => setOpenDialog(true)}
                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary/70 transition-colors"
                      >
                        {t("login.forgotPassword")}
                      </button>
                    </div>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <Iconify
                          icon="solar:lock-password-bold-duotone"
                          width={20}
                        />
                      </div>
                      <Input
                        type="password"
                        {...register("password", {
                          required: t("PasswordRequired"),
                          minLength: {
                            value: 6,
                            message: t("login.passwordLength"),
                          },
                        })}
                        placeholder="••••••••"
                        className={`h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold ${
                          errors.password ? "border-red-500 bg-red-50/50" : ""
                        }`}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 animate-in fade-in slide-in-from-left-2">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loadingSave}
                  className="w-full h-14 rounded-2xl bg-primary text-white font-black text-base shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loadingSave ? (
                    <div className="flex items-center gap-2">
                      <Iconify
                        icon="svg-spinners:180-ring-with-bg"
                        width={24}
                      />
                      {t("login.loggingIn")}
                    </div>
                  ) : (
                    t("login.login")
                  )}
                </Button>

                {!isWebView && (
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-100" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-transparent px-2 text-gray-400 font-black tracking-widest">
                        {t("login.orContinueWith") || "Or continue with"}
                      </span>
                    </div>
                  </div>
                )}

                {!isWebView && (
                  <div className="flex justify-center transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <GoogleLogin
                      onSuccess={responseMessage}
                      onError={errorMessage}
                      size="large"
                      width={window.innerWidth < 640 ? "300" : "400"}
                      theme="outline"
                      shape="pill"
                      locale={i18n.language}
                      auto_select={false}
                      use_fedcm_for_prompt={true}
                      ux_mode="popup"
                      context="signin"
                    />
                  </div>
                )}
              </form>

              <div className="mt-10 text-center">
                <p className="text-gray-500 font-bold text-sm">
                  {t("login.noAccount")}{" "}
                  <RouterLink
                    to="/register"
                    className="text-primary hover:underline ml-1 font-black underline-offset-4"
                  >
                    {t("login.register")}
                  </RouterLink>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Forgot Password Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
          <DialogHeader className="p-8 pb-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
              <Iconify icon="solar:key-bold-duotone" width={32} />
            </div>
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
              {t("login.forgotPasswordTitle")}
            </DialogTitle>
            <DialogDescription className="text-gray-500 font-medium px-4">
              {t("login.forgotPasswordDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 pt-4 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                {t("login.email")}
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Iconify icon="solar:letter-bold-duotone" width={20} />
                </div>
                <Input
                  autoFocus
                  placeholder="john@example.com"
                  type="email"
                  value={enteredForgotEmail}
                  onChange={(e) => setEnteredForgotEmail(e.target.value)}
                  className="h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-4 sm:justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => setOpenDialog(false)}
              className="flex-1 h-14 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-all border-none uppercase tracking-widest text-xs"
            >
              {t("login.cancel")}
            </Button>
            <Button
              onClick={handleForgotPassword}
              disabled={loadingForgot}
              className="flex-2 h-14 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {loadingForgot ? (
                <div className="flex items-center gap-2">
                  <Iconify icon="svg-spinners:180-ring-with-bg" width={20} />
                  {t("login.submitting") || "Submitting..."}
                </div>
              ) : (
                t("login.submit")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
