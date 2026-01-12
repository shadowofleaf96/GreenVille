import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Iconify from "../../../components/iconify";
import createAxiosInstance from "../../../../utils/axiosConfig";
import {
  setData,
  setLoading,
  setError,
} from "../../../../redux/backoffice/orderSlice";
import Loader from "../../../../frontoffice/components/loader/Loader";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrderMap from "../../../../components/map/OrderMap";

export default function DeliveryView() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.adminOrder.data);
  const loading = useSelector((state) => state.adminOrder.loading);
  const error = useSelector((state) => state.adminOrder.error);

  const [mapOrder, setMapOrder] = useState(null);

  const axiosInstance = createAxiosInstance("admin");

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get("/orders");
      dispatch(setData(response.data.data));
    } catch (err) {
      dispatch(setError(err));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const updateStatus = async (orderId, newShippingStatus) => {
    try {
      const payload = {
        shipping_status: newShippingStatus,
      };

      if (newShippingStatus === "delivered") {
        payload.status = "completed";
      } else if (newShippingStatus === "shipped") {
        payload.status = "processing";
      }

      const response = await axiosInstance.put(`/orders/${orderId}`, payload);
      toast.success(response.data.message || t("Status updated successfully"));
      fetchData();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.response?.data?.error || t("Failed to update status"));
    }
  };

  if (loading && !data) return <Loader />;

  if (error) {
    return (
      <div className="p-8 text-destructive font-bold text-center">
        {t("Error")}: {error.message}
      </div>
    );
  }

  const orders = data || [];

  const toShip = orders.filter((o) => o.shipping_status === "not_shipped");
  const inTransit = orders.filter(
    (o) =>
      o.shipping_status === "shipped" || o.shipping_status === "in_transit",
  );
  const delivered = orders.filter((o) => o.shipping_status === "delivered");

  const OrderCard = ({ order }) => (
    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-gray-200/50 bg-white mb-6 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group">
      <CardContent className="p-0">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h4 className="font-black text-xl text-gray-900 tracking-tight flex items-center gap-2">
                {t("Order")}{" "}
                <span className="text-primary">
                  #{order._id.slice(-5).toUpperCase()}
                </span>
              </h4>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                {new Date(order.order_date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Badge className="rounded-full px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest bg-primary/10 text-primary border-none">
              {t(order.shipping_status)}
            </Badge>
          </div>

          <Separator className="bg-gray-100/50" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
                  <Iconify icon="solar:user-bold-duotone" width={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {t("Customer Name")}
                  </span>
                  <span className="font-bold text-gray-900 leading-tight">
                    {order.customer?.first_name} {order.customer?.last_name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
                  <Iconify icon="solar:phone-bold-duotone" width={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {t("Phone Number")}
                  </span>
                  <a
                    href={`tel:${order.shipping_address?.phone_no}`}
                    className="font-black text-primary hover:underline leading-tight"
                  >
                    {order.shipping_address?.phone_no || t("No phone")}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500 shrink-0">
                  <Iconify icon="solar:map-point-bold-duotone" width={24} />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {t("Delivery Address")}
                  </span>
                  <span className="text-sm font-bold text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                    {order.shipping_address?.street},{" "}
                    {order.shipping_address?.city},{" "}
                    {order.shipping_address?.postal_code}
                  </span>
                </div>
              </div>

              {order.shipping_address?.latitude &&
                order.shipping_address?.longitude &&
                (order.shipping_status === "shipped" ||
                  order.shipping_status === "in_transit") && (
                  <div className="space-y-3 mt-2">
                    <OrderMap
                      orderLocation={{
                        lat: order.shipping_address.latitude,
                        lng: order.shipping_address.longitude,
                      }}
                      customerName={`${order.customer?.first_name} ${order.customer?.last_name}`}
                      address={`${order.shipping_address.street}, ${order.shipping_address.city}`}
                      height="180px"
                    />
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-xl border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all gap-2"
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${order.shipping_address.latitude},${order.shipping_address.longitude}`;
                        window.open(url, "_blank");
                      }}
                    >
                      <Iconify icon="logos:google-maps" width={18} />
                      {t("Start Navigation")}
                    </Button>
                  </div>
                )}

              {order.shipping_address?.latitude &&
                order.shipping_address?.longitude &&
                order.shipping_status !== "shipped" &&
                order.shipping_status !== "in_transit" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMapOrder(order)}
                    className="w-fit ml-13 h-8 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all gap-2 px-3"
                  >
                    <Iconify icon="solar:map-bold-duotone" width={14} />
                    {t("Track on Map")}
                  </Button>
                )}
            </div>
          </div>

          <div className="flex justify-between items-center px-6 py-4 bg-gray-50/50 -mx-6 sm:-mx-8 border-y border-gray-100/50">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none flex items-center gap-2">
              <Iconify icon="solar:box-minimalistic-bold-duotone" width={16} />
              {order.order_items.length} {t("Items")}
            </span>
            <span className="text-sm font-black text-gray-900 leading-none">
              {order.cart_total_price} DH
            </span>
          </div>

          <div className="pt-2">
            {order.shipping_status === "not_shipped" && (
              <Button
                className="w-full h-14 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all duration-300 border-none gap-3"
                onClick={() => updateStatus(order._id, "shipped")}
              >
                <Iconify icon="solar:box-bold-duotone" width={24} />
                {t("Pick Up & Mark as Shipped")}
              </Button>
            )}
            {(order.shipping_status === "shipped" ||
              order.shipping_status === "in_transit") && (
              <Button
                className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all duration-300 border-none gap-3"
                onClick={() => updateStatus(order._id, "delivered")}
              >
                <Iconify icon="solar:check-circle-bold-duotone" width={24} />
                {t("Complete Delivery")}
              </Button>
            )}
            {order.shipping_status === "delivered" && (
              <div className="w-full h-14 rounded-2xl bg-green-50 flex items-center justify-center gap-3 text-green-600 font-black uppercase tracking-widest animate-in zoom-in duration-500">
                <Iconify icon="solar:verified-check-bold-duotone" width={24} />
                {t("Delivered Successfully")}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h4 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
          {t("My Deliveries")}
        </h4>
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-primary rounded-full" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
            {t("Manage your active shipments and history")}
          </p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-gray-100/50 p-1.5 rounded-4xl mb-10 inline-flex w-full sm:w-auto h-auto">
          <TabsTrigger
            value="pending"
            className="rounded-3xl px-8 py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all duration-300 flex-1 sm:flex-none"
          >
            {t("Pending")} ({toShip.length})
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="rounded-3xl px-8 py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all duration-300 flex-1 sm:flex-none"
          >
            {t("Active")} ({inTransit.length})
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-3xl px-8 py-3 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all duration-300 flex-1 sm:flex-none"
          >
            {t("Completed")}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="pending"
          className="animate-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none"
        >
          {toShip.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {toShip.map((o) => (
                <OrderCard key={o._id} order={o} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
              <Iconify
                icon="solar:box-outline-rounded"
                width={64}
                className="text-gray-200 mb-4"
              />
              <p className="text-lg font-black text-gray-300 uppercase tracking-widest">
                {t("No pending deliveries")}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="active"
          className="animate-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none"
        >
          {inTransit.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {inTransit.map((o) => (
                <OrderCard key={o._id} order={o} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
              <Iconify
                icon="solar:delivery-bold-duotone"
                width={64}
                className="text-gray-200 mb-4"
              />
              <p className="text-lg font-black text-gray-300 uppercase tracking-widest">
                {t("No active shipments")}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="history"
          className="animate-in slide-in-from-bottom-4 duration-500 focus-visible:outline-none"
        >
          {delivered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-80">
              {delivered.map((o) => (
                <OrderCard key={o._id} order={o} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
              <Iconify
                icon="solar:history-bold-duotone"
                width={64}
                className="text-gray-200 mb-4"
              />
              <p className="text-lg font-black text-gray-300 uppercase tracking-widest">
                {t("No delivery history")}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Map Dialog */}
      <Dialog open={!!mapOrder} onOpenChange={() => setMapOrder(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
          <DialogHeader className="p-8 pb-4 flex flex-row items-center justify-between">
            <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight uppercase">
              {t("Delivery Location")}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            {mapOrder && (
              <OrderMap
                orderLocation={{
                  lat: mapOrder.shipping_address.latitude,
                  lng: mapOrder.shipping_address.longitude,
                }}
                customerName={`${mapOrder.customer?.first_name} ${mapOrder.customer?.last_name}`}
                address={`${mapOrder.shipping_address.street}, ${mapOrder.shipping_address.city}`}
              />
            )}
            <div className="mt-6 flex items-center gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100">
              <Iconify
                icon="solar:info-circle-bold-duotone"
                className="text-primary shrink-0"
                width={24}
              />
              <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-wider">
                {t("map_info_desc")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
