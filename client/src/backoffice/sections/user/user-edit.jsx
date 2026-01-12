import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { loginSuccess } from "../../../redux/backoffice/authSlice";
import Iconify from "../../../components/iconify";
import UploadButton from "../../components/button/UploadButton";
import LazyImage from "../../../components/lazyimage/LazyImage";

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

function EditUserForm({ user, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const [editedUser, setEditedUser] = useState({ ...user, password: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const { admin } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      setEditedUser({ ...user, password: "" });
      setSelectedImage(null);
      setAvatarRemoved(false);
      setPasswordsMatch(true);
    }
  }, [open, user]);

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
      setEditedUser({ ...editedUser, password: sanitizedValue });
      setPasswordsMatch(sanitizedValue === editedUser.confirmPassword);
    } else {
      setEditedUser({ ...editedUser, [name]: sanitizedValue });
      if (name === "confirmPassword") {
        setPasswordsMatch(editedUser.password === sanitizedValue);
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setEditedUser({ ...editedUser, confirmPassword: value });
    setPasswordsMatch(editedUser.password === value);
  };

  const handleSwitchChange = (checked) => {
    setEditedUser({
      ...editedUser,
      status: checked,
    });
  };

  const handleSelectChange = (value) => {
    setEditedUser({
      ...editedUser,
      role: value,
    });
  };

  const handleSave = async () => {
    if (
      (editedUser.password &&
        (editedUser.password.length < 8 || !passwordsMatch)) ||
      !emailValid
    ) {
      return;
    }
    const loggedInUserId = admin._id;

    setLoadingSave(true);

    try {
      const isCurrentUser = editedUser._id === loggedInUserId;
      // If avatar removed, pass null as image, or handle in onSave wrapping
      // The controller needs to handle null/undefined correctly now.
      await onSave(editedUser, selectedImage);
      if (isCurrentUser) {
        // Optimistic update or fetch fresh text? logic remains same
        dispatch(loginSuccess({ adminUser: editedUser, token: admin.token })); // Ensure token is preserved if needed, or check slice
      }
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
            {t("Edit User")}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] p-8 pt-4">
          <div className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {editedUser.user_image && !avatarRemoved ? (
                  <div className="relative group">
                    <LazyImage
                      src={editedUser.user_image}
                      alt="User Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                    <button
                      onClick={() => {
                        setAvatarRemoved(true);
                        setSelectedImage(null);
                        setEditedUser({ ...editedUser, user_image: null });
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
                  onChange={(e) => {
                    setSelectedImage(e.target.files[0]);
                    setAvatarRemoved(false);
                  }}
                />
                {selectedImage && (
                  <span className="text-xs font-medium text-primary animate-in fade-in slide-in-from-top-1">
                    {selectedImage.name}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("First Name")}
                </Label>
                <Input
                  name="first_name"
                  value={editedUser.first_name || ""}
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
                  value={editedUser.last_name || ""}
                  onChange={handleFieldChange}
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("User Name")}
                </Label>
                <Input
                  name="user_name"
                  value={editedUser.user_name || ""}
                  onChange={handleFieldChange}
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700 ml-1">
                  {t("Role")}
                </Label>
                <Select
                  value={editedUser.role}
                  onValueChange={handleSelectChange}
                >
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
                  name="email"
                  type="email"
                  value={editedUser.email || ""}
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
                      {t("New Password")}
                    </Label>
                    <Input
                      name="password"
                      type="password"
                      value={editedUser.password || ""}
                      onChange={handleFieldChange}
                      placeholder={t("Leave empty to keep current")}
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                    />
                    {editedUser.password && editedUser.password.length < 8 && (
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
                      name="confirmPassword"
                      type="password"
                      value={editedUser.confirmPassword || ""}
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
                      {editedUser.status
                        ? t("User can access the system")
                        : t("User is currently blocked")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold uppercase tracking-wider ${
                        editedUser.status ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {editedUser.status ? t("Active") : t("Inactive")}
                    </span>
                    <Switch
                      checked={editedUser.status}
                      onCheckedChange={handleSwitchChange}
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
              (editedUser.password &&
                (editedUser.password.length < 8 || !passwordsMatch))
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

export default EditUserForm;
