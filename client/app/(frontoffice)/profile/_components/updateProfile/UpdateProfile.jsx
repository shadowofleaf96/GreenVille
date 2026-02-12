"use client";

import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MetaData from "@/frontoffice/_components/MetaData";
import ProfileLink from "@/frontoffice/_components/profileLinks/ProfileLink";
import UploadButton from "@/admin/_components/button/UploadButton";
import createAxiosInstance from "@/utils/axiosConfig";
import { toast } from "react-toastify";
import { fetchCustomerProfile } from "@/store/slices/shop/customerSlice";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import Iconify from "@/components/shared/iconify";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const UpdateProfile = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { customer } = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const axiosInstance = createAxiosInstance("customer");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    values: {
      first_name: customer?.first_name || "",
      last_name: customer?.last_name || "",
      email: customer?.email || "",
    },
  });

  const handleImageChange = (file) => {
    setSelectedImage(file);
  };

  const onSubmit = async (data) => {
    const editedCustomer = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
    };

    try {
      await handleSaveEditedCustomer(
        customer._id,
        editedCustomer,
        selectedImage,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveEditedCustomer = async (
    customerId,
    editedCustomer,
    selectedImage,
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("first_name", editedCustomer.first_name);
      formData.append("last_name", editedCustomer.last_name);
      formData.append("email", editedCustomer.email);
      if (editedCustomer.password) {
        formData.append("password", editedCustomer.password);
      }
      if (selectedImage) {
        formData.append("customer_image", selectedImage);
      }

      const response = await axiosInstance.put(
        `/customers/${customerId}`,
        formData,
      );
      dispatch(fetchCustomerProfile(customerId));
      setLoading(false);
      toast.success(t(response.data.message));
    } catch (error) {
      setLoading(false);
      toast.error(
        "Error: " + t(error.response?.data?.message || "Unknown error"),
      );
    }
  };

  return (
    <Fragment>
      <MetaData title={t("Update Profile")} />

      <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <ProfileLink />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-4xl sm:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
              >
                <div className="p-6 sm:p-12 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-gray-50">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                        {t("Edit Profile")}
                      </h1>
                      <p className="text-sm font-bold text-gray-400 italic">
                        {t(
                          "Refine your account credentials and personal details.",
                        )}
                      </p>
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <Avatar className="h-24 w-24 border-4 border-white shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-105">
                        <AvatarImage
                          src={
                            selectedImage
                              ? URL.createObjectURL(selectedImage)
                              : customer?.customer_image
                          }
                          alt={`${customer?.first_name} ${customer?.last_name}`}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary text-white font-black text-2xl">
                          {customer?.first_name?.charAt(0)}
                          {customer?.last_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-10"
                  >
                    {/* Profile Picture Section */}
                    <div className="bg-gray-50/50 rounded-3xl p-8 border border-dashed border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                          <Iconify
                            icon="solar:camera-bold-duotone"
                            width={32}
                          />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                            {t("Account Avatar")}
                          </h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                            {t("JPG, PNG or WEBP (Max 5MB)")}
                          </p>
                        </div>
                      </div>
                      <UploadButton onChange={handleImageChange} />
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label
                          htmlFor="first_name"
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1"
                        >
                          {t("First Name")}
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <Iconify
                              icon="solar:user-bold-duotone"
                              width={20}
                            />
                          </div>
                          <Input
                            id="first_name"
                            {...register("first_name", {
                              required: t("FirstNameRequired"),
                            })}
                            className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                              errors.first_name ? "border-red-500" : ""
                            }`}
                            placeholder={t("Your First Name")}
                          />
                        </div>
                        {errors.first_name && (
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                            {errors.first_name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="last_name"
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1"
                        >
                          {t("Last Name")}
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <Iconify
                              icon="solar:user-bold-duotone"
                              width={20}
                            />
                          </div>
                          <Input
                            id="last_name"
                            {...register("last_name", {
                              required: t("LastNameRequired"),
                            })}
                            className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                              errors.last_name ? "border-red-500" : ""
                            }`}
                            placeholder={t("Your Last Name")}
                          />
                        </div>
                        {errors.last_name && (
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                            {errors.last_name.message}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1"
                        >
                          {t("Email Address")}
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <Iconify
                              icon="solar:letter-bold-duotone"
                              width={20}
                            />
                          </div>
                          <Input
                            id="email"
                            type="email"
                            {...register("email", {
                              required: t("EmailRequired"),
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: t("EmailInvalid"),
                              },
                            })}
                            className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                              errors.email ? "border-red-500" : ""
                            }`}
                            placeholder={t("Your Email")}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1"
                        >
                          {t("New Password")}
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <Iconify
                              icon="solar:lock-keyhole-bold-duotone"
                              width={20}
                            />
                          </div>
                          <Input
                            id="password"
                            type="password"
                            {...register("password", {
                              minLength: {
                                value: 6,
                                message: t("PasswordMinLength"),
                              },
                            })}
                            className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                              errors.password ? "border-red-500" : ""
                            }`}
                            placeholder={t("Leave empty to keep current")}
                          />
                        </div>
                        {errors.password && (
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1"
                        >
                          {t("Confirm New Password")}
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                            <Iconify
                              icon="solar:lock-keyhole-bold-duotone"
                              width={20}
                            />
                          </div>
                          <Input
                            id="confirmPassword"
                            type="password"
                            {...register("confirmPassword", {
                              validate: (value) => {
                                const { password } = getValues();
                                return (
                                  !password ||
                                  value === password ||
                                  t("PasswordsDoNotMatch")
                                );
                              },
                            })}
                            className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 pl-12 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                              errors.confirmPassword ? "border-red-500" : ""
                            }`}
                            placeholder={t("Confirm New Password")}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-gray-50" />

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 rounded-4xl bg-primary text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all gap-3 border-none"
                      >
                        {loading ? (
                          <>
                            <Iconify
                              icon="svg-spinners:ring-resize"
                              width={24}
                            />
                            {t("Processing...")}
                          </>
                        ) : (
                          <>
                            <Iconify
                              icon="solar:check-circle-bold-duotone"
                              width={24}
                            />
                            {t("Save Changes")}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>

                  {/* Security Footer Small */}
                  <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-center gap-4">
                    <Iconify
                      icon="solar:shield-keyhole-bold-duotone"
                      width={24}
                      className="text-primary"
                    />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                      {t(
                        "All password updates are encrypted instantly for your safety.",
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProfile;
