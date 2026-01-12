import React, { useState } from "react";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import UploadButton from "../../components/button/UploadButton";
import LazyImage from "../../../components/lazyimage/LazyImage";
import Iconify from "../../../components/iconify";

function AddUserForm({ onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    user_name: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    status: false,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);

    if (name === "email") {
      setEmailValid(isEmailValid(sanitizedValue));
    }

    if (name === "password") {
      setNewUser({ ...newUser, password: sanitizedValue });
      setPasswordsMatch(sanitizedValue === newUser.confirmPassword);
    } else {
      setNewUser({ ...newUser, [name]: sanitizedValue });
      if (name === "confirmPassword") {
        setPasswordsMatch(newUser.password === sanitizedValue);
      }
    }
  };

  const handleSwitchChange = (checked) => {
    setNewUser({
      ...newUser,
      status: checked,
    });
  };

  const handleSelectChange = (value) => {
    setNewUser({
      ...newUser,
      role: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setNewUser({ ...newUser, confirmPassword: value });
    setPasswordsMatch(newUser.password === value);
  };

  const handleSave = async () => {
    if (newUser.password.length < 8 || !passwordsMatch || !emailValid) {
      return;
    }

    setLoadingSave(true);

    try {
      await onSave(newUser, selectedImage);
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        user_name: "",
        password: "",
        confirmPassword: "",
        role: "admin",
        status: false,
      });
      setSelectedImage(null);
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50">
          <DialogTitle className="text-3xl font-extrabold text-primary tracking-tight">
            {t("Add User")}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] p-8 pt-4">
          <div className="space-y-8">
            {/* Image Upload Section - Simplified for New User (No existing image to show generally, unless preview implemented, but sticking to design) */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {/* Only show placeholder or preview if implemented. currently just upload button logic from user-edit minus the generic avatar fallback logic for *existing* user.
                     But for consistent UX, let's show a placeholder.
                 */}
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-inner">
                  <Iconify
                    icon="material-symbols:person-outline"
                    className="text-gray-300"
                    width={64}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <UploadButton onChange={handleImageChange} />
                {selectedImage && (
                  <span className="text-xs font-medium text-primary animate-in fade-in slide-in-from-top-1">
                    {selectedImage.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                {t("First Name")}
              </Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder={t("First Name")}
                value={newUser.first_name}
                onChange={handleFieldChange}
                className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                {t("Last Name")}
              </Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder={t("Last Name")}
                value={newUser.last_name}
                onChange={handleFieldChange}
                className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                {t("User Name")}
              </Label>
              <Input
                id="user_name"
                name="user_name"
                placeholder={t("User Name")}
                value={newUser.user_name}
                onChange={handleFieldChange}
                className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                {t("Role")}
              </Label>
              <Select value={newUser.role} onValueChange={handleSelectChange}>
                <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20">
                  <SelectValue placeholder={t("Select role")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t("Admin")}</SelectItem>
                  <SelectItem value="manager">{t("Manager")}</SelectItem>
                  <SelectItem value="vendor">{t("Vendor")}</SelectItem>
                  <SelectItem value="delivery_boy">
                    {t("Delivery Boy")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-bold text-gray-700 ml-1">
                {t("Email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("Email")}
                value={newUser.email}
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

            {/* Security */}
            <div className="md:col-span-2 pt-4">
              <div className="h-px bg-gray-100 w-full mb-8" />
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {t("Security")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Password")}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t("Password")}
                    value={
                      newUser.password !== undefined ? newUser.password : ""
                    }
                    onChange={handleFieldChange}
                    className={`h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 ${
                      newUser.password.length < 8 && newUser.password.length > 0
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {newUser.password.length > 0 &&
                    newUser.password.length < 8 && (
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
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder={t("Confirm Password")}
                    value={newUser.confirmPassword}
                    onChange={handleConfirmPasswordChange}
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
                    {newUser.status
                      ? t("User can access the system")
                      : t("User is currently blocked")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold uppercase tracking-wider ${
                      newUser.status ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {newUser.status ? t("Active") : t("Inactive")}
                  </span>
                  <Switch
                    checked={newUser.status}
                    onCheckedChange={handleSwitchChange}
                    className="data-[state=checked]:bg-green-500"
                  />
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
            onClick={handleSave}
            disabled={
              !emailValid ||
              newUser.password.length < 8 ||
              !passwordsMatch ||
              loadingSave
            }
            className="flex-1 h-12 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loadingSave ? (
              <div className="flex items-center gap-2">
                <Iconify
                  icon="svg-spinners:180-ring-with-bg"
                  className="mr-2"
                  width={16}
                  height={16}
                />
                {t("Saving...")}
              </div>
            ) : (
              t("Save")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddUserForm;
