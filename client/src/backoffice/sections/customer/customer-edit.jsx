import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
import Iconify from "../../../components/iconify";
import UploadButton from "../../components/button/UploadButton";
import LazyImage from "../../../components/lazyimage/LazyImage";
import MapPicker from "../../../components/map/MapPicker";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

function EditCustomerForm({ customer, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();

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

  const [editedCustomer, setEditedCustomer] = useState({
    ...customer,
    password: "",
    shipping_address: {
      street: customer.shipping_address?.street || "",
      city: customer.shipping_address?.city || "",
      phone_no: customer.shipping_address?.phone_no || "",
      postal_code: customer.shipping_address?.postal_code || "",
      latitude: customer.shipping_address?.latitude || 33.5731,
      longitude: customer.shipping_address?.longitude || -7.5898,
    },
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  useEffect(() => {
    if (open) {
      setEditedCustomer({
        ...customer,
        password: "",
        shipping_address: {
          street: customer.shipping_address?.street || "",
          city: customer.shipping_address?.city || "",
          phone_no: customer.shipping_address?.phone_no || "",
          postal_code: customer.shipping_address?.postal_code || "",
          latitude: customer.shipping_address?.latitude || 33.5731,
          longitude: customer.shipping_address?.longitude || -7.5898,
        },
      });
      setSelectedImage(null);
      setAvatarRemoved(false);
      setConfirmPassword("");
    }
  }, [open, customer]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);

    if (name.startsWith("shipping_address.")) {
      const field = name.split(".")[1];
      const finalValue =
        field === "phone_no"
          ? sanitizedValue.replace(/\D/g, "")
          : sanitizedValue;
      setEditedCustomer((prev) => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address,
          [field]: finalValue,
        },
      }));
    } else {
      setEditedCustomer((prev) => ({ ...prev, [name]: sanitizedValue }));
    }

    if (name === "email") {
      setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedValue));
    }
  };

  useEffect(() => {
    setPasswordsMatch(editedCustomer.password === confirmPassword);
  }, [editedCustomer.password, confirmPassword]);

  const handleSave = async () => {
    if (
      editedCustomer.password &&
      (editedCustomer.password.length < 8 || !passwordsMatch)
    ) {
      return;
    }
    setLoadingSave(true);
    try {
      const customerToSave = {
        ...editedCustomer,
        shipping_address: {
          ...editedCustomer.shipping_address,
          phone_no: formatPhone(editedCustomer.shipping_address.phone_no),
        },
      };
      await onSave(customerToSave, selectedImage);
      onClose();
    } catch (error) {
      console.error("Error saving customer:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50">
          <DialogTitle className="text-3xl font-extrabold text-primary tracking-tight">
            {t("Edit Customer")}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] p-8 pt-4">
          <div className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {editedCustomer.customer_image && !avatarRemoved ? (
                  <div className="relative group">
                    <LazyImage
                      src={editedCustomer.customer_image}
                      alt="Customer Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <button
                      onClick={() => {
                        setAvatarRemoved(true);
                        setSelectedImage(null);
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <Iconify icon="ic:round-close" width={18} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-inner">
                    <Iconify
                      icon="material-symbols:person-outline"
                      className="text-gray-300"
                      width={64}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <UploadButton
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
                {selectedImage && (
                  <span className="text-xs font-medium text-primary animate-in fade-in slide-in-from-top-1">
                    {selectedImage.name}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("First Name")}
                </Label>
                <Input
                  name="first_name"
                  value={editedCustomer.first_name}
                  onChange={handleFieldChange}
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Last Name")}
                </Label>
                <Input
                  name="last_name"
                  value={editedCustomer.last_name}
                  onChange={handleFieldChange}
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Email")}
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={editedCustomer.email}
                  onChange={handleFieldChange}
                  className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                    !emailValid
                      ? "border-red-300 ring-red-100 focus:ring-red-100"
                      : ""
                  }`}
                />
                {!emailValid && (
                  <p className="text-xs font-bold text-red-500 ml-1 mt-1 italic">
                    {t("Invalid email format")}
                  </p>
                )}
              </div>

              {/* Shipping Address */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Street")}
                </Label>
                <Input
                  name="shipping_address.street"
                  value={editedCustomer.shipping_address.street}
                  onChange={handleFieldChange}
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("City")}
                </Label>
                <Input
                  name="shipping_address.city"
                  value={editedCustomer.shipping_address.city}
                  onChange={handleFieldChange}
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("PhoneNumber")}
                </Label>
                <Input
                  name="shipping_address.phone_no"
                  value={editedCustomer.shipping_address.phone_no}
                  onChange={handleFieldChange}
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Postal Code")}
                </Label>
                <Input
                  name="shipping_address.postal_code"
                  value={editedCustomer.shipping_address.postal_code}
                  onChange={handleFieldChange}
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                />
              </div>

              {/* Map Location Section */}
              <div className="md:col-span-2 space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                    <Iconify icon="solar:map-bold-duotone" width={24} />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-gray-700">
                      {t("Geographic Location")}
                    </Label>
                    <p className="text-xs text-gray-500">
                      {t("Pin the customer's precise delivery location")}
                    </p>
                  </div>
                </div>

                <MapPicker
                  initialPosition={{
                    lat: editedCustomer.shipping_address.latitude,
                    lng: editedCustomer.shipping_address.longitude,
                  }}
                  onLocationSelect={({ latitude, longitude }) => {
                    setEditedCustomer((prev) => ({
                      ...prev,
                      shipping_address: {
                        ...prev.shipping_address,
                        latitude,
                        longitude,
                      },
                    }));
                  }}
                />
                <div className="flex justify-between px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                      {t("Latitude")}
                    </p>
                    <p className="text-xs font-bold text-gray-900">
                      {editedCustomer.shipping_address.latitude.toFixed(6)}
                    </p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                      {t("Longitude")}
                    </p>
                    <p className="text-xs font-bold text-gray-900">
                      {editedCustomer.shipping_address.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="md:col-span-2 pt-4">
                <div className="h-px bg-gray-100 w-full mb-8" />
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  {t("Security")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700 ml-1">
                      {t("New Password")}
                    </Label>
                    <Input
                      name="password"
                      type="password"
                      value={editedCustomer.password}
                      onChange={handleFieldChange}
                      placeholder={t("Leave empty to keep current")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                    />
                    {editedCustomer.password &&
                      editedCustomer.password.length < 8 && (
                        <p className="text-xs font-bold text-red-500 ml-1 mt-1 italic">
                          {t("Password must be at least 8 characters long")}
                        </p>
                      )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-700 ml-1">
                      {t("Confirm Password")}
                    </Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                        !passwordsMatch
                          ? "border-red-300 ring-red-100 focus:ring-red-100"
                          : ""
                      }`}
                    />
                    {!passwordsMatch && (
                      <p className="text-xs font-bold text-red-500 ml-1 mt-1 italic">
                        {t("Password and Confirm Password do not match")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="md:col-span-2 pt-4">
                <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold text-gray-900">
                      {t("Account Status")}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {editedCustomer.status
                        ? t("Customer can access the store")
                        : t("Customer is currently blocked")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold uppercase tracking-wider ${
                        editedCustomer.status
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {editedCustomer.status ? t("Active") : t("Inactive")}
                    </span>
                    <Switch
                      checked={editedCustomer.status}
                      onCheckedChange={(checked) =>
                        setEditedCustomer((prev) => ({
                          ...prev,
                          status: checked,
                        }))
                      }
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-8 bg-gray-50 border-t flex flex-row sm:justify-between items-center sm:gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            {t("Cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={
              loadingSave ||
              !emailValid ||
              (editedCustomer.password &&
                (editedCustomer.password.length < 8 || !passwordsMatch))
            }
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
      </DialogContent>
    </Dialog>
  );
}

export default EditCustomerForm;
