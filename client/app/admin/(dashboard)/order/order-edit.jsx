import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { useSelector } from "react-redux";
import Iconify from "@/components/shared/iconify";
import createAxiosInstance from "@/utils/axiosConfig";
import Loader from "@/frontoffice/_components/loader/Loader";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

function EditOrderForm({ order, onSave, onCancel, open, onClose }) {
  const { t } = useTranslation();
  const { admin } = useSelector((state) => state.adminAuth);
  const isAdmin = admin?.role === "admin" || admin?.role === "manager";

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

  const [customers, setCustomers] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [editedOrder, setEditedOrder] = useState({
    ...order,
    shipping_address: {
      street: order.shipping_address?.street || "",
      city: order.shipping_address?.city || "",
      postal_code: order.shipping_address?.postal_code || "",
      country: order.shipping_address?.country || "",
      phone_no: order.shipping_address?.phone_no || "",
      latitude: order.shipping_address?.latitude || null,
      longitude: order.shipping_address?.longitude || null,
    },
  });

  const statuses = ["open", "processing", "canceled", "completed"];
  const shippingStatuses = [
    { value: "not_shipped", label: "Not Shipped" },
    { value: "shipped", label: "Shipped" },
    { value: "in_transit", label: "In Transit" },
    { value: "delivered", label: "Delivered" },
  ];
  const shippingMethods = [
    { value: "standard", label: "Standard Shipping" },
    { value: "express", label: "Express Shipping" },
    { value: "overnight", label: "Overnight Shipping" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const axiosInstance = createAxiosInstance("admin");
        const customersResponse = await axiosInstance.get("/customers");
        setCustomers(customersResponse.data.data);
        const deliveryBoysResponse = await axiosInstance.get(
          "/users?role=delivery_boy",
        );
        setDeliveryBoys(deliveryBoysResponse.data.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleFieldChange = (name, value) => {
    const sanitizedValue =
      typeof value === "string" ? DOMPurify.sanitize(value) : value;
    setEditedOrder((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleCustomerChange = (customerId) => {
    const selectedCustomer = customers.find((c) => c._id === customerId);
    if (selectedCustomer) {
      const { _id, first_name, last_name, email } = selectedCustomer;
      setEditedOrder((prev) => ({
        ...prev,
        customer: { _id, first_name, last_name, email },
      }));
    }
  };

  const handleShippingAddressChange = (name, value) => {
    const sanitizedValue = DOMPurify.sanitize(value);
    setEditedOrder((prev) => ({
      ...prev,
      shipping_address: {
        ...prev.shipping_address,
        [name]: sanitizedValue,
      },
    }));
  };

  const handleSave = async () => {
    setLoadingSave(true);
    try {
      const orderToSave = {
        ...editedOrder,
        shipping_address: {
          ...editedOrder.shipping_address,
          phone_no: formatPhone(editedOrder.shipping_address.phone_no),
        },
      };
      await onSave(orderToSave);
      onClose();
    } catch (error) {
      console.error("Error saving order:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-gray-50/50 text-center">
          <DialogTitle className="text-3xl font-extrabold text-primary tracking-tight">
            {t("Edit Order")} #{order._id.toString().slice(-5).toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        {loadingData ? (
          <div className="h-64 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <ScrollArea className="max-h-[70vh] p-8 pt-4 overflow-scroll">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                {/* Customer Section */}
                <div className="space-y-2 col-span-full">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Customer")}
                  </Label>
                  <Select
                    value={editedOrder.customer?._id || ""}
                    onValueChange={handleCustomerChange}
                    disabled={!isAdmin}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20">
                      <SelectValue placeholder={t("Select Customer")} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer._id} value={customer._id}>
                          {customer.first_name || customer.last_name
                            ? `${customer.first_name || ""} ${
                                customer.last_name || ""
                              }`.trim()
                            : customer.email || t("Unknown Customer")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Delivery Boy Section */}
                <div className="space-y-2 col-span-full">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Delivery Boy")}
                  </Label>
                  <Select
                    value={editedOrder.delivery_boy_id || ""}
                    onValueChange={(val) =>
                      handleFieldChange(
                        "delivery_boy_id",
                        val === "unassigned" ? null : val,
                      )
                    }
                    disabled={!isAdmin}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20">
                      <SelectValue placeholder={t("Assign Delivery Boy")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">
                        {t("Unassigned")}
                      </SelectItem>
                      {deliveryBoys.map((boy) => (
                        <SelectItem key={boy._id} value={boy._id}>
                          {`${boy.first_name} ${boy.last_name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price and Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Cart Total Price")}
                  </Label>
                  <Input
                    type="number"
                    value={editedOrder.cart_total_price}
                    onChange={(e) =>
                      handleFieldChange("cart_total_price", e.target.value)
                    }
                    className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20"
                    disabled={!isAdmin}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Status")}
                  </Label>
                  <Select
                    value={editedOrder.status}
                    onValueChange={(val) => handleFieldChange("status", val)}
                    disabled={!isAdmin}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          <span className="capitalize">{t(status)}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Shipping Info */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Shipping Status")}
                  </Label>
                  <Select
                    value={editedOrder.shipping_status}
                    onValueChange={(val) =>
                      handleFieldChange("shipping_status", val)
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingStatuses.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {t(label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Shipping Method")}
                  </Label>
                  <Select
                    value={editedOrder.shipping_method}
                    onValueChange={(val) =>
                      handleFieldChange("shipping_method", val)
                    }
                    disabled={!isAdmin}
                  >
                    <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingMethods.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {t(label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Address Section */}
                <div className="col-span-full pt-4">
                  <h6 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Iconify
                      icon="material-symbols:location-on-outline-rounded"
                      width={18}
                    />
                    {t("Shipping Address")}
                  </h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 ml-1 uppercase">
                        {t("Street")}
                      </Label>
                      <Input
                        value={editedOrder.shipping_address.street}
                        onChange={(e) =>
                          handleShippingAddressChange("street", e.target.value)
                        }
                        className="h-11 rounded-lg bg-white border-gray-100 focus:ring-primary/20"
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 ml-1 uppercase">
                        {t("City")}
                      </Label>
                      <Input
                        value={editedOrder.shipping_address.city}
                        onChange={(e) =>
                          handleShippingAddressChange("city", e.target.value)
                        }
                        className="h-11 rounded-lg bg-white border-gray-100 focus:ring-primary/20"
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 ml-1 uppercase">
                        {t("Postal Code")}
                      </Label>
                      <Input
                        value={editedOrder.shipping_address.postal_code}
                        onChange={(e) =>
                          handleShippingAddressChange(
                            "postal_code",
                            e.target.value,
                          )
                        }
                        className="h-11 rounded-lg bg-white border-gray-100 focus:ring-primary/20"
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 ml-1 uppercase">
                        {t("Country")}
                      </Label>
                      <Input
                        value={editedOrder.shipping_address.country}
                        onChange={(e) =>
                          handleShippingAddressChange("country", e.target.value)
                        }
                        className="h-11 rounded-lg bg-white border-gray-100 focus:ring-primary/20"
                        disabled={!isAdmin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-500 ml-1 uppercase">
                        {t("Phone Number")}
                      </Label>
                      <Input
                        value={editedOrder.shipping_address.phone_no}
                        onChange={(e) =>
                          handleShippingAddressChange(
                            "phone_no",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        className="h-11 rounded-lg bg-white border-gray-100 focus:ring-primary/20"
                        disabled={!isAdmin}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2 col-span-full pt-4">
                  <Label className="text-sm font-bold text-gray-700 ml-1">
                    {t("Order Notes")}
                  </Label>
                  <Textarea
                    value={editedOrder.order_notes || ""}
                    onChange={(e) =>
                      handleFieldChange("order_notes", e.target.value)
                    }
                    className="min-h-25 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-primary/20 resize-none p-4"
                    placeholder={t(
                      "Add special instructions or notes about the order...",
                    )}
                  />
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
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditOrderForm;
