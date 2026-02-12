"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { updateVendorProfile } from "@/store/slices/admin/authSlice";

import Iconify from "@/components/shared/iconify";
import LazyImage from "@/components/shared/lazyimage/LazyImage";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const ProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { admin, vendor: vendorProfile } = useSelector(
    (state) => state.adminAuth,
  );
  const isActive = admin?.status;

  const { register, handleSubmit, reset, control } = useForm(); // eslint-disable-line no-unused-vars
  const [openEditVendor, setOpenEditVendor] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);

  const handleEditVendorClick = () => {
    reset({
      store_name: vendorProfile?.store_name,
      store_description: vendorProfile?.store_description,
    });
    setSelectedLogo(null);
    setOpenEditVendor(true);
  };

  const onSaveVendor = async (data) => {
    setLoadingSave(true);
    try {
      const formData = new FormData();
      formData.append("store_name", data.store_name);
      formData.append("store_description", data.store_description);
      if (selectedLogo) {
        formData.append("store_logo", selectedLogo);
      }

      await dispatch(updateVendorProfile(admin._id, formData));
      toast.success(t("Vendor profile updated successfully"));
      setOpenEditVendor(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || t("Error updating vendor profile"),
      );
    } finally {
      setLoadingSave(false);
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedLogo(e.target.files[0]);
    }
  };

  const initials = `${admin?.first_name?.charAt(0) || ""}${
    admin?.last_name?.charAt(0) || ""
  }`.toUpperCase();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-500">
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 sm:h-64 w-full rounded-3xl bg-linear-to-r from-primary to-green-600 shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl animate-pulse duration-1000" />
          <div className="absolute top-0 right-0 p-8">
            <Iconify
              icon="solar:star-fall-2-bold-duotone"
              className="text-white/20"
              width={120}
            />
          </div>
        </div>

        {/* Profile Card Overlay */}
        <Card className="rounded-3xl border-none shadow-2xl shadow-gray-200/50 mx-4 sm:mx-10 -mt-16 sm:-mt-20 relative z-10 bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8 sm:p-10 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative -mt-20 sm:-mt-24">
                <Avatar className="w-32 h-32 sm:w-44 sm:h-44 border-8 border-white shadow-2xl ring-1 ring-gray-100">
                  <AvatarImage src={admin?.user_image} alt={admin?.user_name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl font-black">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {isActive && (
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg pulse-animation" />
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center sm:justify-start gap-3">
                    {admin?.first_name} {admin?.last_name}
                    <Iconify
                      icon="solar:verified-check-bold"
                      className="text-primary"
                      width={24}
                    />
                  </h1>
                  <p className="text-lg font-medium text-gray-500">
                    {admin?.email}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                  <Badge
                    className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase ${
                      isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isActive ? t("Active Account") : t("Inactive")}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border-primary/20 text-primary"
                  >
                    {t(admin?.role)}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="my-10 bg-gray-100" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 transition-all hover:shadow-lg hover:shadow-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  {t("Username")}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {admin?.user_name}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 transition-all hover:shadow-lg hover:shadow-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  {t("Role")}
                </p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {t(admin?.role)}
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 transition-all hover:shadow-lg hover:shadow-gray-100">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                  {t("Joined At")}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(admin?.creation_date).toLocaleDateString(
                    undefined,
                    { year: "numeric", month: "long", day: "numeric" },
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Notification Section */}
      {admin?.role === "vendor" && vendorProfile && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Iconify icon="solar:shop-bold-duotone" width={24} />
              </div>
              {t("Vendor Information")}
            </h2>
            <Button
              variant="outline"
              onClick={handleEditVendorClick}
              className="rounded-2xl h-12 px-6 font-bold border-gray-200 hover:border-primary hover:text-primary transition-all group"
            >
              <Iconify
                icon="eva:edit-fill"
                width={20}
                className="mr-2 group-hover:scale-110 transition-transform"
              />
              {t("Edit Profile")}
            </Button>
          </div>

          <Card className="rounded-3xl border-none shadow-xl shadow-gray-100 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 p-10 bg-gray-50/50 border-r border-gray-100 flex flex-col items-center justify-center gap-6">
                  <div className="relative group">
                    {vendorProfile.store_logo ? (
                      <div className="w-48 h-48 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-transform group-hover:scale-105 duration-500">
                        <LazyImage
                          src={vendorProfile.store_logo}
                          alt={vendorProfile.store_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-6xl font-black shadow-inner">
                        {vendorProfile.store_name?.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col text-white backdrop-blur-[2px]">
                      <Iconify icon="solar:camera-bold" width={32} />
                      <span className="text-[10px] uppercase font-black tracking-widest mt-1">
                        {t("Store Logo")}
                      </span>
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                      {vendorProfile.store_name}
                    </h3>
                    <Badge
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${
                        vendorProfile.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : vendorProfile.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t(vendorProfile.status)}
                    </Badge>
                  </div>
                </div>

                <div className="lg:w-2/3 p-10 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        {t("Store Details")}
                      </h4>
                      <Separator className="flex-1 bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider opacity-50">
                        {t("Description")}
                      </Label>
                      <p className="text-lg font-medium text-gray-600 leading-relaxed bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                        {vendorProfile?.store_description ||
                          t("No description provided.")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        {t("Store Joined")}
                      </Label>
                      <div className="flex items-center gap-3 text-gray-900 font-bold p-4 rounded-xl bg-gray-50/30 border border-gray-50">
                        <Iconify
                          icon="solar:calendar-bold-duotone"
                          width={22}
                          className="text-primary"
                        />
                        {new Date(vendorProfile.created_at).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long" },
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                        {t("Verification Status")}
                      </Label>
                      <div className="flex items-center gap-3 text-gray-900 font-bold p-4 rounded-xl bg-gray-50/30 border border-gray-50">
                        <Iconify
                          icon={
                            vendorProfile.status === "approved"
                              ? "solar:shield-check-bold-duotone"
                              : "solar:shield-warning-bold-duotone"
                          }
                          width={22}
                          className={
                            vendorProfile.status === "approved"
                              ? "text-green-500"
                              : "text-yellow-500"
                          }
                        />
                        <span className="capitalize">
                          {t(vendorProfile.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Vendor Dialog */}
      <Dialog open={openEditVendor} onOpenChange={setOpenEditVendor}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
          <DialogHeader className="p-8 pb-4 bg-gray-50/50 text-center border-b border-gray-100">
            <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight uppercase">
              {t("Edit Vendor Profile")}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSaveVendor)}>
            <ScrollArea className="max-h-[70vh] p-8 pt-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
                    {t("Store Name")}
                  </Label>
                  <Input
                    {...register("store_name", { required: true })}
                    placeholder={t("Enter store name")}
                    className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">
                    {t("Store Description")}
                  </Label>
                  <Textarea
                    {...register("store_description")}
                    placeholder={t("Enter store description")}
                    rows={4}
                    className="rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 transition-all text-sm outline-none resize-none font-medium"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider block">
                    {t("Store Logo")}
                  </Label>
                  <div className="flex flex-col items-center gap-4 bg-gray-50/50 p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 transition-all cursor-pointer relative group">
                    <input
                      accept="image/*"
                      className="hidden"
                      id="vendor-logo-upload"
                      type="file"
                      onChange={handleLogoChange}
                    />
                    <label
                      htmlFor="vendor-logo-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {selectedLogo || vendorProfile?.store_logo ? (
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white relative">
                          <img
                            src={
                              selectedLogo
                                ? URL.createObjectURL(selectedLogo)
                                : vendorProfile?.store_logo
                            }
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Iconify icon="solar:pen-bold" width={20} />
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center text-gray-300 shadow-sm border border-gray-100">
                          <Iconify
                            icon="solar:gallery-bold-duotone"
                            width={40}
                          />
                        </div>
                      )}
                      <span className="text-xs font-black text-primary uppercase tracking-widest mt-2">
                        {t("Click to Update Logo")}
                      </span>
                    </label>
                    {selectedLogo && (
                      <p className="text-[10px] font-black text-gray-400 absolute bottom-2">
                        {selectedLogo.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="p-8 bg-gray-50 border-t flex flex-row sm:justify-between items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenEditVendor(false)}
                className="flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all border-none"
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                disabled={loadingSave}
                className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loadingSave ? (
                  <div className="flex items-center gap-2">
                    <Iconify icon="svg-spinners:180-ring-with-bg" width={20} />
                    {t("Saving...")}
                  </div>
                ) : (
                  t("Save Changes")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
