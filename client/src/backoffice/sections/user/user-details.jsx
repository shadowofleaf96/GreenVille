import React from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Iconify from "../../../components/iconify";
import { fDateTime } from "../../../utils/format-time";

const UserDetailsPopup = ({ user, open, onClose }) => {
  const { t } = useTranslation();
  const isActive = user?.status;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-4xl border-none shadow-2xl bg-white/95 backdrop-blur-xl">
        <DialogHeader className="p-8 pb-4 bg-linear-to-br from-primary/5 via-transparent to-transparent">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black text-primary tracking-tight uppercase">
              {t("User Profile")}
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="p-8 pt-4 space-y-8">
            {/* Profile Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex flex-col items-center p-8 rounded-3xl bg-gray-50/50 border border-gray-100 shadow-sm"
            >
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                  <AvatarImage
                    src={user?.user_image}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl font-black uppercase">
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white shadow-sm ${
                    isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-primary font-bold text-sm tracking-widest uppercase mt-1">
                  @{user?.user_name}
                </p>
                <div className="flex gap-2 justify-center mt-4">
                  <Badge
                    variant={isActive ? "success" : "destructive"}
                    className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-none"
                  >
                    {isActive ? t("Active Account") : t("Suspended")}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary"
                  >
                    {t(user?.role)}
                  </Badge>
                </div>
              </div>
            </motion.div>

            <Separator className="bg-gray-100" />

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem
                icon="material-symbols:mail-outline-rounded"
                label={t("Email Address")}
                value={user?.email}
              />
              <InfoItem
                icon="material-symbols:shield-person-outline-rounded"
                label={t("Access Level")}
                value={user?.role}
                isCapitalize
              />
              <InfoItem
                icon="material-symbols:calendar-today-outline-rounded"
                label={t("Registration Date")}
                value={fDateTime(user?.creation_date)}
              />
              <InfoItem
                icon="material-symbols:update-rounded"
                label={t("Last Profile Update")}
                value={fDateTime(user?.last_update)}
              />
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex gap-4 items-center">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Iconify icon="material-symbols:security-rounded" width={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  {t("Security Audit")}
                </p>
                <p className="text-[11px] text-amber-600/80 font-medium leading-relaxed">
                  {t(
                    "All administrative actions by this user are logged for security compliance.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-2xl px-8 font-bold hover:bg-white transition-all border-gray-200"
          >
            {t("Close Details")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const InfoItem = ({ icon, label, value, isCapitalize }) => (
  <div className="flex items-start gap-4 group">
    <div className="mt-1 h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all overflow-hidden border border-gray-100">
      <Iconify icon={icon} width={20} />
    </div>
    <div className="space-y-1">
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
        {label}
      </p>
      <p
        className={`text-sm font-bold text-gray-800 ${
          isCapitalize ? "capitalize" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  </div>
);

export default UserDetailsPopup;
