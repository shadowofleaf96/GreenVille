import React from "react";
import { useTranslation } from "react-i18next";
import { fDateTime } from "../../../utils/format-time";
import Iconify from "../../../components/iconify";
import MapPicker from "../../../components/map/MapPicker";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const CustomerDetailsPopup = ({ customer, open, onClose }) => {
  const { t } = useTranslation();
  const isActive = customer?.status;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50">
          <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight">
            {t("Customer Details")}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] p-8 pt-4">
          <div className="flex flex-col items-center gap-6">
            {/* Header Profile Info */}
            <div className="flex flex-col items-center gap-4 w-full">
              <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
                <AvatarImage
                  src={customer?.customer_image}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold uppercase">
                  {customer?.first_name?.charAt(0)}
                  {customer?.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {customer?.first_name} {customer?.last_name}
                </h3>
                <Badge
                  variant={isActive ? "success" : "destructive"}
                  className={`mt-2 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-widest ${
                    isActive
                      ? "bg-green-100 text-green-700 hover:bg-green-100 border-none"
                      : "bg-red-100 text-red-700 hover:bg-red-100 border-none"
                  }`}
                >
                  {isActive ? t("Active") : t("Inactive")}
                </Badge>
              </div>
            </div>

            <Separator className="bg-gray-100" />

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-lg bg-gray-50 text-gray-400">
                    <Iconify icon="material-symbols:mail-outline" width={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t("Email")}
                    </p>
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
                      {customer?.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-lg bg-gray-50 text-gray-400">
                    <Iconify
                      icon="material-symbols:calendar-today-outline"
                      width={20}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t("Created At")}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {fDateTime(customer?.creation_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-lg bg-gray-50 text-gray-400">
                    <Iconify icon="material-symbols:login" width={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t("Last Login")}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {customer?.last_login
                        ? fDateTime(customer?.last_login)
                        : t("Never")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-lg bg-gray-50 text-gray-400">
                    <Iconify
                      icon="material-symbols:location-on-outline"
                      width={20}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {t("Shipping Address")}
                    </p>
                    {customer?.shipping_address &&
                    (customer.shipping_address.street ||
                      customer.shipping_address.city) ? (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900 uppercase">
                          {customer.shipping_address.street}
                        </p>
                        <p className="text-sm font-medium text-gray-600 uppercase">
                          {customer.shipping_address.city},{" "}
                          {customer.shipping_address.postal_code}
                        </p>
                        <p className="text-sm font-bold text-primary flex items-center gap-1 mt-2">
                          <Iconify
                            icon="material-symbols:phone-enabled-outline"
                            width={16}
                          />
                          {customer.shipping_address.phone_no}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-400 italic">
                        {t("No address provided")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {customer?.shipping_address?.latitude && (
                <div className="md:col-span-2 space-y-3 pt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {t("Map Location")}
                  </p>
                  <MapPicker
                    initialPosition={{
                      lat: customer.shipping_address.latitude,
                      lng: customer.shipping_address.longitude,
                    }}
                    readOnly={true}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons if needed can be added here */}
          </div>
        </ScrollArea>

        <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-center">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full h-12 rounded-2xl font-bold text-gray-500 hover:bg-white hover:shadow-sm transition-all"
          >
            {t("Close Details")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsPopup;
