import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/backoffice/authSlice";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Logo from "../../components/logo";
import Iconify from "../../../components/iconify";
import createAxiosInstance from "../../../utils/axiosConfig";
import { useRouter } from "../../../routes/hooks";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginView() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const history = useNavigate();
  const { t, i18n } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loadingSave, setLoadingSave] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const axiosInstance = createAxiosInstance("admin");
  const isRtl = i18n.language === "ar"; // eslint-disable-line no-unused-vars

  const isLoggedin = localStorage.getItem("user_access_token");

  useEffect(() => {
    if (isLoggedin) {
      const redirect = searchParams.get("redirect");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const defaultPath =
        user.role === "delivery_boy" ? "/admin/order" : "/admin/";
      history(redirect || defaultPath, { replace: true });
    }
  }, [isLoggedin, searchParams, history]);

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      const response = await axiosInstance.post("/users/login", data);

      if (response.status === 200) {
        localStorage.setItem("user_access_token", response.data.access_token);

        dispatch(
          loginSuccess({
            admin: response.data.user,
            adminToken: response.data.access_token,
          }),
        );
        const defaultPath =
          response.data.user.role === "delivery_boy"
            ? "/admin/order"
            : "/admin/";
        router.push(defaultPath);
      }
    } catch (error) {
      toast.error(
        t("Error") +
          ": " +
          (error.response?.data?.message || t("An error occurred")),
      );
    } finally {
      setLoadingSave(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[420px] px-4 relative z-10"
      >
        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white/80 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pt-10 pb-6 text-center space-y-4">
            <div className="flex justify-center mb-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileActive={{ scale: 0.95 }}
              >
                <Logo />
              </motion.div>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">
                {t("Welcome Back")}
              </CardTitle>
              <CardDescription className="text-gray-500 font-medium">
                {t("Please enter your details to sign in")}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <div className="flex items-center gap-4 mb-8">
              <Separator className="flex-1 bg-gray-100" />
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest px-2">
                {t("Admin Panel")}
              </span>
              <Separator className="flex-1 bg-gray-100" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="user_name"
                    className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1"
                  >
                    {t("User Name")}
                  </Label>
                  <Controller
                    name="user_name"
                    control={control}
                    defaultValue=""
                    rules={{ required: t("Username is required") }}
                    render={({ field }) => (
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                          <Iconify
                            icon="material-symbols-light:person-outline-rounded"
                            width={22}
                          />
                        </div>
                        <Input
                          {...field}
                          id="user_name"
                          placeholder={t("Enter your username")}
                          className={`pl-11 h-13 rounded-2xl border-gray-100 bg-gray-50/50 transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 ${
                            errors.user_name
                              ? "border-red-400 focus:ring-red-50"
                              : ""
                          }`}
                        />
                      </div>
                    )}
                  />
                  {errors.user_name && (
                    <p className="text-xs font-bold text-red-500 ml-1 mt-1 transition-all">
                      {errors.user_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1"
                  >
                    {t("Password")}
                  </Label>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{ required: t("Password is required") }}
                    render={({ field }) => (
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                          <Iconify
                            icon="material-symbols-light:lock-outline-rounded"
                            width={22}
                          />
                        </div>
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`pl-11 pr-12 h-13 rounded-2xl border-gray-100 bg-gray-50/50 transition-all focus:bg-white focus:ring-4 focus:ring-primary/10 ${
                            errors.password
                              ? "border-red-400 focus:ring-red-50"
                              : ""
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleClickShowPassword}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Iconify
                            icon={
                              showPassword
                                ? "material-symbols-light:visibility-outline-rounded"
                                : "material-symbols-light:visibility-off-outline-rounded"
                            }
                            width={22}
                          />
                        </button>
                      </div>
                    )}
                  />
                  {errors.password && (
                    <p className="text-xs font-bold text-red-500 ml-1 mt-1 transition-all">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  disabled={loadingSave}
                  className="w-full h-14 bg-primary text-white font-black text-lg rounded-[1.25rem] shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_15px_40px_rgba(var(--primary-rgb),0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
                  type="submit"
                >
                  <AnimatePresence mode="wait">
                    {loadingSave ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3"
                      >
                        <Iconify
                          icon="svg-spinners:180-ring-with-bg"
                          width={24}
                        />
                        {t("Authenticating...")}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        {t("Login")}
                        <Iconify
                          icon="material-symbols-light:arrow-right-alt-rounded"
                          width={24}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center mt-10 text-gray-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} GreenVille Admin.{" "}
          {t("All rights reserved.")}
        </p>
      </motion.div>
    </div>
  );
}
