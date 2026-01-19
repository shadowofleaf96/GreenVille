import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import createAxiosInstance from "../../../utils/axiosConfig";
import { useForm } from "react-hook-form";

import MetaData from "../../components/MetaData";
import Iconify from "../../../backoffice/components/iconify";
import AuthBackground from "../../components/auth/AuthBackground";
import Logo from "../../../backoffice/components/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RouterLink } from "@/routes/components";
import { useNavigate } from "react-router-dom";

const VendorRegistration = () => {
  const { t } = useTranslation();
  const { customer } = useSelector((state) => state.customers);
  const { data: settings } = useSelector((state) => state.adminSettings);
  const axiosInstance = createAxiosInstance("customer");
  const [loading, setLoading] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const navigate = useNavigate();

  const formatPhone = (phone) => {
    let sanitized = phone.replace(/\D/g, "");
    if (sanitized.startsWith("00212")) {
      sanitized = "0" + sanitized.slice(5);
    } else if (sanitized.startsWith("212")) {
      sanitized = "0" + sanitized.slice(3);
    }
    if (sanitized && !sanitized.startsWith("0")) {
      sanitized = "0" + sanitized;
    }
    return sanitized;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_id", customer?._id);
      formData.append("store_name", data.store_name);
      formData.append("store_description", data.store_description);
      formData.append("phone_number", formatPhone(data.phone_number));
      formData.append("vendor_type", data.vendor_type);
      formData.append("rc_number", data.rc_number);
      formData.append("ice_number", data.ice_number);

      if (selectedLogo) {
        formData.append("store_logo", selectedLogo);
      }

      const response = await axiosInstance.post(`/vendors/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
      setTimeout(() => {
        toast.success(response.data.message);
      }, 500);
      reset();
      setSelectedLogo(null);
      setLogoPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || t("Something went wrong"));
      console.error(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="backImage min-h-screen w-full flex items-center justify-center p-4 overflow-hidden relative">
      <MetaData title={t("Vendor Registration")} />

      {/* Dynamic Background */}
      <AuthBackground url={settings?.auth_settings?.auth_video_url} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-5xl"
      >
        <Card className="rounded-3xl md:rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden ring-1 ring-black/5">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row min-h-auto lg:min-h-150">
              {/* Left Column: Form */}
              <div className="lg:w-3/5 p-4 sm:p-12 border-b lg:border-b-0 lg:border-r border-gray-100/50 h-full overflow-y-auto max-h-[90vh]">
                <div className="flex flex-col items-start mb-6 md:mb-8">
                  <div className="mb-4">
                    <RouterLink to="/">
                      <Logo
                        disabledLink
                        className="w-10 h-10 md:w-12 md:h-12 text-primary"
                      />
                    </RouterLink>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/80">
                    {t("Become a Vendor")}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-xs md:text-sm">
                    {t(
                      "Fill out the form below to apply for a vendor account.",
                    )}
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Store Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="store_name"
                        className="text-sm font-semibold text-gray-700 ml-1"
                      >
                        {t("Store Name")}
                      </Label>
                      <div className="relative group">
                        <Iconify
                          icon="solar:shop-bold-duotone"
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none"
                        />
                        <Input
                          id="store_name"
                          {...register("store_name", {
                            required: t("Store Name is required"),
                          })}
                          className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-primary/20 transition-all rounded-xl"
                          placeholder={t("Enter your store name")}
                        />
                      </div>
                      {errors.store_name && (
                        <p className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1">
                          <Iconify icon="solar:danger-circle-bold" width={12} />
                          {errors.store_name.message}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone_number"
                        className="text-sm font-semibold text-gray-700 ml-1"
                      >
                        {t("Phone Number")}
                      </Label>
                      <div className="relative group">
                        <Iconify
                          icon="solar:phone-bold-duotone"
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none"
                        />
                        <Input
                          id="phone_number"
                          {...register("phone_number", {
                            required: t("Phone Number is required"),
                            onChange: (e) => {
                              e.target.value = e.target.value.replace(
                                /\D/g,
                                "",
                              );
                            },
                          })}
                          className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-primary/20 transition-all rounded-xl"
                          placeholder={t("Enter your phone number")}
                        />
                      </div>
                      {errors.phone_number && (
                        <p className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1">
                          <Iconify icon="solar:danger-circle-bold" width={12} />
                          {errors.phone_number.message}
                        </p>
                      )}
                    </div>

                    {/* Vendor Type */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="vendor_type"
                        className="text-sm font-semibold text-gray-700 ml-1"
                      >
                        {t("Legal Status")}
                      </Label>
                      <div className="relative group">
                        <Iconify
                          icon="solar:user-id-bold-duotone"
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none z-10"
                        />
                        <select
                          id="vendor_type"
                          {...register("vendor_type", {
                            required: t("Legal status is required"),
                          })}
                          className="pl-10 h-12 w-full bg-gray-50/50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all rounded-xl text-sm appearance-none outline-none"
                        >
                          <option value="">{t("Select status")}</option>
                          <option value="entrepreneur">
                            {t("Entrepreneur")}
                          </option>
                          <option value="societe">{t("Société")}</option>
                        </select>
                        <Iconify
                          icon="solar:alt-arrow-down-bold"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none"
                        />
                      </div>
                      {errors.vendor_type && (
                        <p className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1">
                          <Iconify icon="solar:danger-circle-bold" width={12} />
                          {errors.vendor_type.message}
                        </p>
                      )}
                    </div>

                    {/* RC Number */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="rc_number"
                        className="text-sm font-semibold text-gray-700 ml-1"
                      >
                        {t("Registre de commerce (RC)")}
                      </Label>
                      <div className="relative group">
                        <Iconify
                          icon="solar:document-bold-duotone"
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none"
                        />
                        <Input
                          id="rc_number"
                          {...register("rc_number", {
                            required: t("RC number is required"),
                          })}
                          className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-primary/20 transition-all rounded-xl"
                          placeholder={t("Enter RC number")}
                        />
                      </div>
                      {errors.rc_number && (
                        <p className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1">
                          <Iconify icon="solar:danger-circle-bold" width={12} />
                          {errors.rc_number.message}
                        </p>
                      )}
                    </div>

                    {/* ICE Number */}
                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="ice_number"
                        className="text-sm font-semibold text-gray-700 ml-1"
                      >
                        {t("Identifiant Commun de l'Entreprise (ICE)")}
                      </Label>
                      <div className="relative group">
                        <Iconify
                          icon="solar:mask-h-bold-duotone"
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5 pointer-events-none"
                        />
                        <Input
                          id="ice_number"
                          {...register("ice_number", {
                            required: t("ICE number is required"),
                          })}
                          className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white focus:ring-primary/20 transition-all rounded-xl"
                          placeholder={t("Enter ICE number")}
                        />
                      </div>
                      {errors.ice_number && (
                        <p className="text-xs text-red-500 ml-1 font-medium flex items-center gap-1">
                          <Iconify icon="solar:danger-circle-bold" width={12} />
                          {errors.ice_number.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Store Description */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="store_description"
                      className="text-sm font-semibold text-gray-700 ml-1"
                    >
                      {t("Store Description")}
                    </Label>
                    <textarea
                      id="store_description"
                      {...register("store_description")}
                      className="flex min-h-25 w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:bg-white transition-all resize-none"
                      placeholder={t(
                        "Tell us about your products and vision...",
                      )}
                    />
                  </div>

                  {/* Store Logo Upload */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 ml-1">
                      {t("Store Logo")}
                    </Label>
                    <div className="flex items-center gap-6 p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 group hover:border-primary/50 transition-all">
                      <div className="relative group/avatar">
                        <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Logo Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Iconify
                              icon="solar:shop-bold-duotone"
                              className="w-10 h-10 text-gray-300"
                            />
                          )}
                        </div>
                        <label
                          htmlFor="store_logo"
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all"
                        >
                          <Iconify icon="solar:camera-add-bold" width={18} />
                          <input
                            id="store_logo"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                        </label>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-bold text-gray-900">
                          {selectedLogo ? selectedLogo.name : t("Upload Logo")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t("Best format: 500x500px (WebP, PNG, JPG)")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 md:h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Iconify
                          icon="svg-spinners:180-ring-with-bg"
                          width={24}
                        />
                        <span>{t("Processing...")}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {t("Register My Store")}
                        <Iconify
                          icon="solar:arrow-right-bold"
                          className="w-5 h-5"
                        />
                      </div>
                    )}
                  </Button>
                </form>
              </div>

              {/* Right Column: Instructions */}
              <div className="lg:w-2/5 bg-gray-50/50 p-4 sm:p-12 space-y-8 flex flex-col justify-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Iconify
                      icon="solar:info-circle-bold-duotone"
                      className="text-primary"
                      width={24}
                    />
                    {t("How it works")}
                  </h3>

                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">
                          {t("Submit Application")}
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {t(
                            "Fill in your store details and logo. Make sure your store name is unique.",
                          )}
                        </p>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">
                          {t("Admin Review")}
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {t(
                            "Our team will review your application. This usually takes 24-48 hours.",
                          )}
                        </p>
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">
                          {t("Start Selling")}
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {t(
                            "Once approved, you'll receive an email with instructions to access your dedicated dashboard.",
                          )}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-gray-200/50">
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex gap-3">
                    <Iconify
                      icon="solar:shield-check-bold"
                      className="text-primary shrink-0"
                      width={20}
                    />
                    <p className="text-xs text-primary/80 leading-relaxed">
                      <strong>{t("Tip")}:</strong>{" "}
                      {t(
                        "Use the same password as your customer account. After approval, your accounts will be linked for easy access.",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VendorRegistration;
