import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSettings } from "../../../../redux/backoffice/settingsSlice";
import { loginSuccess } from "../../../../redux/frontoffice/customerSlice";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import AuthBackground from "../../../components/auth/AuthBackground";
import createAxiosInstance from "../../../../utils/axiosConfig";
import Logo from "../../../../backoffice/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Iconify from "../../../../backoffice/components/iconify";

const SetGooglePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const email = queryParams.get("email");
  const name = queryParams.get("name");
  const picture = queryParams.get("picture");

  const dispatch = useDispatch();
  const { data: settings } = useSelector((state) => state.adminSettings);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (!email || !name || !picture) {
      navigate("/login");
    }
  }, [email, name, picture, navigate]);

  const axiosInstance = createAxiosInstance("customer");
  const [loadingSave, setLoadingSave] = useState(false);
  const [completeSuccess, setCompleteSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword");

  useEffect(() => {
    if (completeSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [completeSuccess, navigate]);

  const onSubmit = async (data) => {
    setLoadingSave(true);
    try {
      const cleanImageUrl = picture.replace(/=s96-c$/, "") + "=d";
      const customerImage = await fetch(cleanImageUrl, { redirect: "follow" });
      const blob = await customerImage.blob();

      if (!blob.type.startsWith("image/")) {
        throw new Error("The fetched resource is not an image");
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("password", DOMPurify.sanitize(data.newPassword));
      formData.append("customer_image", blob, "customer_image.png");

      const axiosResponse = await axiosInstance.post(
        "/customers/complete-registration",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setCompleteSuccess(true);
      toast.success(t(axiosResponse.data.message));

      if (axiosResponse.data.access_token) {
        localStorage.setItem(
          "customer_access_token",
          axiosResponse.data.access_token
        );
        dispatch(
          loginSuccess({
            customer: axiosResponse.data.customer,
            token: axiosResponse.data.access_token,
          })
        );
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error("Error in submission:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoadingSave(false);
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
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white rounded-[3rem] shadow-2xl shadow-black/80 border border-white/20 overflow-hidden">
          <CardContent className="p-6 sm:p-10 md:p-12 space-y-6 sm:space-y-10">
            <div className="flex flex-col items-center gap-8">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-2 rounded-2xl"
              >
                <Logo />
              </motion.div>

              <div className="space-y-1 text-center">
                <Badge className="bg-primary/5 text-primary font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1 border-none mb-2">
                  {t("One Final Step")}
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase">
                  {completeSuccess ? t("Account Ready") : t("Complete Setup")}
                </h1>
                <p className="text-xs font-bold text-gray-400 italic">
                  {completeSuccess
                    ? t(
                        "Your distinguished account is now fully operational. Redirecting..."
                      )
                    : t(
                        "Establish a secure password to finalize your registration via Google."
                      )}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {completeSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-6 py-3"
                >
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-100 ring-8 ring-green-50/50">
                    <Iconify
                      icon="solar:check-circle-bold-duotone"
                      width={56}
                    />
                  </div>
                  <p className="text-sm font-black text-green-600 uppercase tracking-widest text-center animate-pulse">
                    {t("Registration Complete. Welcome abroad.")}
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="h-14 px-10 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest mt-4"
                  >
                    {t("Return to Login")}
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="p-3 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                      <img
                        src={picture}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grow min-w-0">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest truncate">
                        {name}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 truncate italic">
                        {email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        {t("Set Access Selection")}
                      </Label>
                      <Controller
                        name="newPassword"
                        control={control}
                        rules={{
                          required: t("PasswordRequired"),
                          minLength: {
                            value: 6,
                            message: t("PasswordMinLength"),
                          },
                        }}
                        render={({ field }) => (
                          <div className="relative">
                            <Iconify
                              icon="solar:lock-keyhole-bold-duotone"
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                              width={20}
                            />
                            <Input
                              {...field}
                              type="password"
                              className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                                errors.newPassword ? "border-red-500" : ""
                              }`}
                              placeholder={t("Create Password")}
                            />
                          </div>
                        )}
                      />
                      {errors.newPassword && (
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                          {errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        {t("Verify Access Selection")}
                      </Label>
                      <Controller
                        name="confirmPassword"
                        control={control}
                        rules={{
                          validate: (value) =>
                            value === newPasswordValue ||
                            t("PasswordsDoNotMatch"),
                        }}
                        render={({ field }) => (
                          <div className="relative">
                            <Iconify
                              icon="solar:shield-check-bold-duotone"
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                              width={20}
                            />
                            <Input
                              {...field}
                              type="password"
                              className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                                errors.confirmPassword ? "border-red-500" : ""
                              }`}
                              placeholder={t("Confirm Password")}
                            />
                          </div>
                        )}
                      />
                      {errors.confirmPassword && (
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loadingSave}
                    className="w-full h-14 sm:h-16 rounded-4xl bg-gray-900 text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all gap-4 border-none"
                  >
                    {loadingSave ? (
                      <>
                        <Iconify icon="svg-spinners:ring-resize" width={24} />
                        {t("Configuring...")}
                      </>
                    ) : (
                      <>
                        <Iconify
                          icon="solar:shield-user-bold-duotone"
                          width={24}
                        />
                        {t("Complete Registration")}
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SetGooglePassword;
