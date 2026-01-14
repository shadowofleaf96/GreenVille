import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings } from "../../../../redux/backoffice/settingsSlice";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "../../../../backoffice/components/logo";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthBackground from "../../../components/auth/AuthBackground";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Iconify from "../../../../backoffice/components/iconify";

const ResetPassword = () => {
  const { token } = useParams();
  const { t } = useTranslation();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const axiosInstance = createAxiosInstance("customer");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { data: settings } = useSelector((state) => state.adminSettings);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (resetSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [resetSuccess, navigate]);

  const onSubmit = async (data) => {
    const sanitizedNewPassword = DOMPurify.sanitize(data.newPassword);
    const sanitizedConfirmPassword = DOMPurify.sanitize(data.confirmPassword);

    if (sanitizedNewPassword !== sanitizedConfirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: t("Passwords do not match"),
      });
      return;
    }

    try {
      setLoadingSave(true);

      const response = await axiosInstance.post(
        `/customers/reset-password/${token}`,
        { newPassword: sanitizedNewPassword },
      );

      setResetSuccess(true);
      toast.success(response.data.message);
      setResetError(null);
    } catch (error) {
      setResetError(t("Failed to reset password. Please try again."));
      toast.error(
        t("Error: ") + (error.response?.data?.error || error.message),
      );
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-black">
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
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white rounded-[3rem] shadow-2xl shadow-black/80 border border-white/20 overflow-hidden">
          <CardContent className="p-10 md:p-12 space-y-10">
            <div className="flex flex-col items-center gap-8">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-4 rounded-2xl shadow-xl border border-gray-50"
              >
                <Logo />
              </motion.div>

              <div className="space-y-2 text-center">
                <Badge className="bg-primary/5 text-primary font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 border-none mb-2">
                  {t("Security Protocol")}
                </Badge>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                  {resetSuccess ? t("Reset Successful") : t("Restore Access")}
                </h1>
                <p className="text-xs font-bold text-gray-400 italic">
                  {resetSuccess
                    ? t(
                        "Your credentials have been updated. Redirecting in 3 seconds.",
                      )
                    : t(
                        "Establish a new secure entry for your distinguished account.",
                      )}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {resetSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-6 py-6"
                >
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-100 ring-8 ring-green-50/50">
                    <Iconify
                      icon="solar:check-circle-bold-duotone"
                      width={56}
                    />
                  </div>
                  <p className="text-sm font-black text-green-600 uppercase tracking-widest text-center animate-pulse">
                    {t("Identity Verified. Re-entry granted.")}
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="h-14 px-10 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest mt-4"
                  >
                    {t("Return to Portal")}
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        {t("New Selection")}
                      </Label>
                      <div className="relative">
                        <Iconify
                          icon="solar:lock-keyhole-bold-duotone"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          width={20}
                        />
                        <Input
                          type="password"
                          {...register("newPassword", {
                            required: t("Password is required"),
                            minLength: {
                              value: 8,
                              message: t("Password min 8 chars"),
                            },
                          })}
                          className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                            errors.newPassword ? "border-red-500" : ""
                          }`}
                          placeholder={t("Create New Password")}
                        />
                      </div>
                      {errors.newPassword && (
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        {t("Confirm Selection")}
                      </Label>
                      <div className="relative">
                        <Iconify
                          icon="solar:shield-check-bold-duotone"
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          width={20}
                        />
                        <Input
                          type="password"
                          {...register("confirmPassword", {
                            required: t("Please confirm your password"),
                          })}
                          className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                            errors.confirmPassword ? "border-red-500" : ""
                          }`}
                          placeholder={t("Repeat New Password")}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {resetError && (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
                      <Iconify
                        icon="solar:danger-bold-duotone"
                        className="text-red-500"
                        width={20}
                      />
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">
                        {resetError}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loadingSave}
                    className="w-full h-16 rounded-4xl bg-gray-900 text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all gap-4 border-none"
                  >
                    {loadingSave ? (
                      <>
                        <Iconify icon="svg-spinners:ring-resize" width={24} />
                        {t("Verifying...")}
                      </>
                    ) : (
                      <>
                        <Iconify
                          icon="solar:shield-keyhole-bold-duotone"
                          width={24}
                        />
                        {t("Reset Password")}
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-center gap-4">
              <Iconify
                icon="solar:shield-star-bold-duotone"
                width={20}
                className="text-primary"
              />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed italic">
                {t("Secured by Advanced Selection Authentication")}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
