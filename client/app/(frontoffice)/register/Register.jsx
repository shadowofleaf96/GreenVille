"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/store/slices/shop/customerSlice";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import Logo from "@/frontoffice/_components/logo";
import createAxiosInstance from "@/utils/axiosConfig";
import Iconify from "@/components/shared/iconify";

import { Input } from "@/components/ui/input";
import AuthBackground from "@/frontoffice/_components/auth/AuthBackground";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const RegistrationForm = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const [loadingSave, setLoadingSave] = useState(false);
  const [searchParams] = useSearchParams();
  const [setRefreshReCaptcha] = useState(false);
  const [, setRegisterSuccess] = useState(false);
  const axiosInstance = createAxiosInstance("customer");

  const { executeRecaptcha } = useGoogleReCaptcha();

  const { data: settings } = useSelector((state) => state.adminSettings);

  const isLoggedin = localStorage.getItem("customer_access_token");
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoggedin) {
      const redirect = searchParams.get("redirect");
      router.replace(redirect || "/");
    }
  }, [isLoggedin, searchParams, router]);

  const onSubmit = async (data) => {
    setLoadingSave(true);
    setRegisterSuccess(false);
    try {
      if (!executeRecaptcha) {
        toast.error(t("RecaptchaError"));
        setLoadingSave(false);
        return;
      }

      const recaptchaToken = await executeRecaptcha("RegisterAction");

      if (!recaptchaToken) {
        toast.error(t("RecaptchaVerificationFailed"));
        setLoadingSave(false);
        return;
      }

      const sanitizedData = {
        first_name: DOMPurify.sanitize(data.firstName),
        last_name: DOMPurify.sanitize(data.lastName),
        email: DOMPurify.sanitize(data.email),
        password: data.password,
        recaptchaToken,
      };

      const response = await axiosInstance.post("/customers", sanitizedData);

      // Success handling
      toast.success(response?.data?.message);
      setRegisterSuccess(true);
      reset();

      if (response.data.access_token) {
        // Auto-login logic
        localStorage.setItem(
          "customer_access_token",
          response.data.access_token,
        );
        dispatch(
          loginSuccess({
            customer: response.data.customer,
            token: response.data.access_token,
          }),
        );
        // Delay navigation slightly to allow toast to be seen
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        // Fallback for strict verification (shouldn't happen with current controller)
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(
        error.response?.data?.error ||
          t("RegistrationError") ||
          "An error occurred",
      );
    } finally {
      // Ensure loading is always disabled
      setLoadingSave(false);
      setRefreshReCaptcha((prev) => !prev);
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
        className="relative z-10 w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg"
      >
        <Card className="rounded-4xl sm:rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden ring-1 ring-black/5">
          <CardContent className="p-6 sm:p-10 md:p-12">
            <div className="flex flex-col items-center">
              <Link
                href="/"
                className="mb-8 hover:scale-105 transition-transform duration-300"
              >
                <Logo />
              </Link>

              <div className="text-center space-y-2 mb-10">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {t("CreateAccount")}
                </h1>
                <p className="text-gray-500 font-medium">
                  {t("register.joinTheCommunity") ||
                    "Join our community of plant lovers"}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      {t("FirstName")}
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <Iconify icon="solar:user-bold-duotone" width={20} />
                      </div>
                      <Input
                        {...register("firstName", {
                          required: t("FirstNameRequired"),
                        })}
                        placeholder="John"
                        className={`h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold ${
                          errors.firstName ? "border-red-500 bg-red-50/50" : ""
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 animate-in fade-in slide-in-from-left-2">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      {t("LastName")}
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <Iconify icon="solar:user-bold-duotone" width={20} />
                      </div>
                      <Input
                        {...register("lastName", {
                          required: t("LastNameRequired"),
                        })}
                        placeholder="Doe"
                        className={`h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold ${
                          errors.lastName ? "border-red-500 bg-red-50/50" : ""
                        }`}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 animate-in fade-in slide-in-from-left-2">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    {t("Email")}
                  </Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      <Iconify icon="solar:letter-bold-duotone" width={20} />
                    </div>
                    <Input
                      {...register("email", {
                        required: t("EmailRequired"),
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: t("EmailInvalid"),
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      {t("Password")}
                    </Label>
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
                            message: t("PasswordMinLength"),
                          },
                        })}
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
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

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                      {t("ConfirmPassword")}
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                        <Iconify
                          icon="solar:shield-check-bold-duotone"
                          width={20}
                        />
                      </div>
                      <Input
                        type="password"
                        {...register("confirmPassword", {
                          required: t("ConfirmPasswordRequired"),
                          validate: (value) =>
                            value === watch("password") ||
                            t("PasswordsDoNotMatch"),
                        })}
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                        className={`h-14 pl-12 rounded-2xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold ${
                          errors.confirmPassword
                            ? "border-red-500 bg-red-50/50"
                            : ""
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 animate-in fade-in slide-in-from-left-2">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loadingSave}
                  className="w-full h-14 rounded-2xl bg-primary text-white font-black text-base shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
                >
                  {loadingSave ? (
                    <div className="flex items-center gap-2">
                      <Iconify
                        icon="svg-spinners:180-ring-with-bg"
                        width={24}
                      />
                      {t("Registering")}
                    </div>
                  ) : (
                    t("Register")
                  )}
                </Button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-gray-500 font-bold text-sm">
                  {t("AlreadyHaveAccount")}{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:underline ml-1 font-black underline-offset-4"
                  >
                    {t("Login")}
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
