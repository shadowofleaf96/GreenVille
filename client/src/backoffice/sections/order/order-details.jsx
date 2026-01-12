import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "../../../components/iconify";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import OrderMap from "../../../components/map/OrderMap";

const OrderDetailsPopup = ({ order, open, onClose }) => {
  const { t, i18n } = useTranslation();
  const [shippingStatusLabel, setShippingStatusLabel] = useState("");
  const [showMap, setShowMap] = useState(false);
  const currentLanguage = i18n.language;

  useEffect(() => {
    const statusMap = {
      not_shipped: "Not Shipped",
      shipped: "Shipped",
      in_transit: "In Transit",
      delivered: "Deliverd",
    };
    setShippingStatusLabel(
      statusMap[order?.shipping_status] || order?.shipping_status,
    );
  }, [order?.shipping_status]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "canceled":
        return "destructive";
      case "processing":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-6 bg-gray-50/50 flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-extrabold text-primary tracking-tight">
            {t("Order Details")}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <div className="p-8 space-y-10">
            {/* Top Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest text-[11px] font-extrabold">
                  <Iconify
                    icon="material-symbols:person-outline-rounded"
                    width={16}
                  />
                  {t("Customer Information")}
                </div>
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                      {t("Full Name")}
                    </span>
                    <span className="font-bold text-gray-900">
                      {order?.customer?.first_name || order?.customer?.last_name
                        ? `${order?.customer?.first_name || ""} ${
                            order?.customer?.last_name || ""
                          }`.trim()
                        : order?.customer?.email || t("Unknown Customer")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">{t("Email")}</span>
                    <span className="font-medium text-gray-700">
                      {order?.customer.email}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                      {t("Shipping Address")}
                    </span>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      {order?.shipping_address.street},{" "}
                      {order?.shipping_address.city},{" "}
                      {order?.shipping_address.postal_code},{" "}
                      {order?.shipping_address.country}
                    </span>
                    {order?.shipping_address?.latitude &&
                      order?.shipping_address?.longitude && (
                        <Button
                          variant="link"
                          onClick={() => setShowMap(!showMap)}
                          className="text-primary p-0 h-auto font-black text-[10px] uppercase tracking-widest flex items-center gap-1 mt-1 hover:no-underline"
                        >
                          <Iconify
                            icon={
                              showMap
                                ? "solar:map-arrow-up-bold-duotone"
                                : "solar:map-bold-duotone"
                            }
                            width={14}
                          />
                          {showMap ? t("Hide Map") : t("View on Map")}
                        </Button>
                      )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">
                      {t("Phone Number")}
                    </span>
                    <span className="font-bold text-gray-900">
                      {order?.shipping_address?.phone_no ||
                        order?.customer?.shipping_address?.phone_no ||
                        t("N/A")}
                    </span>
                  </div>
                </div>

                {showMap && order?.shipping_address?.latitude && (
                  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-in slide-in-from-top-4 duration-300">
                    <OrderMap
                      orderLocation={{
                        lat: order.shipping_address.latitude,
                        lng: order.shipping_address.longitude,
                      }}
                      customerName={`${order?.customer?.first_name} ${order?.customer?.last_name}`}
                      address={`${order?.shipping_address.street}, ${order?.shipping_address.city}`}
                    />
                  </div>
                )}
              </div>

              {/* Order Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest text-[11px] font-extrabold">
                  <Iconify
                    icon="material-symbols:receipt-long-outline-rounded"
                    width={16}
                  />
                  {t("Order Overview")}
                </div>
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      {t("Total Amount")}
                    </span>
                    <span className="text-xl font-black text-primary">
                      {order?.cart_total_price} DH
                    </span>
                  </div>

                  <Separator className="bg-gray-100/50" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                        {t("Status")}
                      </span>
                      <Badge
                        variant={getStatusVariant(order?.status)}
                        className="w-fit px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider h-5"
                      >
                        {t(order?.status)}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                        {t("Shipping")}
                      </span>
                      <Badge className="w-fit px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider h-5 bg-blue-100 text-blue-700 border-none hover:bg-blue-100">
                        {t(shippingStatusLabel)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">{t("Method")}</span>
                    <span className="text-sm font-bold text-gray-800 capitalize">
                      {t(order?.shipping_method)}
                    </span>
                  </div>

                  <Separator className="bg-gray-100/50" />

                  <div className="flex flex-col space-y-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {t("Assigned Delivery Boy")}
                    </span>
                    {order?.delivery_boy ? (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:bg-primary/5 group">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <Iconify
                            icon="material-symbols:delivery-dining-outline-rounded"
                            width={24}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            {`${order.delivery_boy.first_name} ${order.delivery_boy.last_name}`}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {order.delivery_boy.email}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-100/50 rounded-xl flex items-center gap-2 text-gray-400 italic text-xs">
                        <Iconify
                          icon="material-symbols:info-outline-rounded"
                          width={16}
                        />
                        {t("Not yet assigned")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {order?.order_notes && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest text-[11px] font-extrabold">
                  <Iconify icon="material-symbols:notes-rounded" width={16} />
                  {t("Order Notes")}
                </div>
                <div className="bg-amber-50/30 rounded-2xl p-6 border border-amber-100/50 italic text-sm text-gray-600 leading-relaxed">
                  "{order.order_notes}"
                </div>
              </div>
            )}

            {/* Items Section */}
            <div className="space-y-4 pb-4">
              <div className="flex items-center gap-2 text-gray-400 uppercase tracking-widest text-[11px] font-extrabold">
                <Iconify
                  icon="material-symbols:shopping-bag-outline-rounded"
                  width={16}
                />
                {t("Order Items")} ({order?.order_items.length})
              </div>
              <div className="rounded-3xl border border-gray-100 overflow-hidden divide-y divide-gray-100 shadow-sm">
                {order?.order_items.map((item, index) => (
                  <div
                    key={index}
                    className="p-5 flex items-center justify-between bg-white hover:bg-gray-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                        <Iconify
                          icon="material-symbols-light:package-2-outline"
                          width={28}
                          className="text-gray-400"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                          {typeof item.product?.product_name === "string"
                            ? item.product.product_name
                            : item.product?.product_name?.[currentLanguage] ||
                              item.product?.product_name?.en ||
                              t("Unknown Product")}
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          {t("Quantity")}:{" "}
                          <span className="text-primary">{item.quantity}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-sm font-black text-gray-900">
                        {item.price} DH
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider italic">
                        {t("Unit Price")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsPopup;
