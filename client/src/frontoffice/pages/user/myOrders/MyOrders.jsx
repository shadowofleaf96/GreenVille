import { Fragment, useEffect, useState } from "react";
import ProfileLink from "../../../components/profileLinks/ProfileLink";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  ordersList,
} from "../../../../redux/frontoffice/orderSlice";
import Iconify from "../../../../backoffice/components/iconify";
import MetaData from "../../../components/MetaData";
import { useTranslation } from "react-i18next";
import Review from "../../review/Review";
import optimizeImage from "../../../components/optimizeImage";
import { toast } from "react-toastify";
import LazyImage from "../../../../components/lazyimage/LazyImage";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CircularLoader from "../../../components/loader/CircularLoader";

const MyOrders = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.customers);
  const { loading, error, orders } = useSelector(
    (state) => state.orders.ordersList,
  );
  const [activeOrder, setActiveOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleLeaveReview = (productId, orderDate, customerId) => {
    setSelectedProduct({ productId, orderDate, customerId });
  };

  useEffect(() => {
    if (customer && customer._id) {
      dispatch(ordersList(customer._id));
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, customer, error]);

  const toggleOrderDetails = (orderId) => {
    setActiveOrder((prev) => (prev === orderId ? null : orderId));
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "delivered":
        return {
          color: "bg-green-50 text-green-700",
          icon: "solar:check-circle-bold-duotone",
          label: t("delivered"),
        };
      case "processing":
        return {
          color: "bg-yellow-50 text-yellow-700",
          icon: "solar:refresh-circle-bold-duotone",
          label: t("processing"),
        };
      case "shipped":
        return {
          color: "bg-blue-50 text-blue-700",
          icon: "solar:delivery-bold-duotone",
          label: t("shipped"),
        };
      case "canceled":
        return {
          color: "bg-red-50 text-red-700",
          icon: "solar:close-circle-bold-duotone",
          label: t("canceled"),
        };
      default:
        return {
          color: "bg-gray-50 text-gray-700",
          icon: "solar:question-square-bold-duotone",
          label: t(status),
        };
    }
  };

  return (
    <Fragment>
      <MetaData title={t("MyOrders.title") || t("My Orders")} />

      <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <ProfileLink />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-4xl sm:rounded-[3rem] shadow-xl border border-gray-100">
                  <CircularLoader />
                  <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
                    {t("Fetching your orders...")}
                  </p>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                        {t("Purchase History")}
                      </h1>
                      <p className="text-sm font-bold text-gray-400 italic">
                        {t(
                          "Detailed overview of all your past and current acquisitions.",
                        )}
                      </p>
                    </div>
                  </div>

                  {orders && orders.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white shadow-2xl rounded-4xl sm:rounded-[3rem] p-8 sm:p-16 text-center border border-gray-100 italic"
                    >
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gray-50 rounded-4xl sm:rounded-[2.5rem] rotate-6" />
                        <div className="absolute inset-0 bg-gray-100/50 rounded-4xl sm:rounded-[2.5rem] -rotate-3" />
                        <Iconify
                          icon="solar:cart-large-minimalistic-bold-duotone"
                          width={64}
                          className="text-gray-300 relative z-10"
                        />
                      </div>
                      <h4 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                        {t("MyOrders.noOrders") || t("Empty History")}
                      </h4>
                      <p className="text-sm font-bold text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed">
                        {t("MyOrders.noOrdersDesc") ||
                          t(
                            "Your purchase history is currently empty. Begin your journey with us today.",
                          )}
                      </p>
                      <Link to="/products">
                        <Button className="h-16 px-12 rounded-4xl bg-gray-900 text-white font-black uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all gap-4">
                          <Iconify icon="solar:shop-bold-duotone" width={24} />
                          {t("MyOrders.startShopping") || t("Start Shopping")}
                        </Button>
                      </Link>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      <AnimatePresence>
                        {orders.map((order, orderIdx) => {
                          const status = getStatusConfig(order.status);
                          const isActive = activeOrder === order._id;

                          return (
                            <motion.div
                              key={order._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: orderIdx * 0.05 }}
                              className={`bg-white shadow-xl rounded-4xl sm:rounded-[2.5rem] overflow-hidden border transition-all duration-500 hover:shadow-2xl ${
                                isActive
                                  ? "border-primary/20 shadow-primary/5 ring-1 ring-primary/5"
                                  : "border-gray-100 shadow-gray-200/30"
                              }`}
                            >
                              {/* Order Header */}
                              <div
                                className={`p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer group transition-colors ${
                                  isActive
                                    ? "bg-primary/2"
                                    : "hover:bg-gray-50/50"
                                }`}
                                onClick={() => toggleOrderDetails(order._id)}
                              >
                                <div className="flex items-center gap-6">
                                  <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                                      isActive
                                        ? "bg-primary text-white border-primary rotate-180"
                                        : "bg-white text-gray-400 border-gray-100 group-hover:border-primary/20 group-hover:text-primary"
                                    }`}
                                  >
                                    <Iconify
                                      icon="solar:alt-arrow-down-bold"
                                      width={24}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                                      {t("Order Placed")}
                                    </p>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                      {new Date(
                                        order.order_date,
                                      ).toLocaleDateString(undefined, {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </h3>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-8 md:gap-12 pl-16 md:pl-0">
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right md:text-left">
                                      {t("Total Amount")}
                                    </p>
                                    <p className="text-2xl font-black text-primary tracking-tighter">
                                      {order.cart_total_price}{" "}
                                      <span className="text-xs">DH</span>
                                    </p>
                                  </div>
                                  <div className="space-y-2 text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                                      {t("Shipment Status")}
                                    </p>
                                    <Badge
                                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none ${status.color}`}
                                    >
                                      <Iconify icon={status.icon} width={16} />
                                      {status.label}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Order Items (Collapsible) */}
                              <AnimatePresence>
                                {isActive && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                      duration: 0.4,
                                      ease: "easeInOut",
                                    }}
                                  >
                                    <div className="p-8 md:p-10 bg-gray-50/30 border-t border-gray-50 space-y-6">
                                      <div className="space-y-4">
                                        {order.order_items.map(
                                          (item, index) => (
                                            <div
                                              key={index}
                                              className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-4xl bg-white border border-gray-50 hover:border-primary/20 hover:shadow-lg transition-all group"
                                            >
                                              <div className="relative shrink-0">
                                                <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <LazyImage
                                                  className="w-24 h-24 object-contain bg-white rounded-2xl p-3 shadow-inner relative z-10 border border-gray-50"
                                                  src={
                                                    typeof item?.product
                                                      ?.product_images ===
                                                    "string"
                                                      ? optimizeImage(
                                                          item?.product
                                                            ?.product_images,
                                                          200,
                                                        )
                                                      : optimizeImage(
                                                          item?.product
                                                            ?.product_images?.[0],
                                                          200,
                                                        )
                                                  }
                                                  alt={
                                                    item?.product
                                                      ?.product_name?.[
                                                      currentLanguage
                                                    ] || t("Product")
                                                  }
                                                />
                                              </div>

                                              <div className="grow space-y-2">
                                                <h4 className="text-lg font-black text-gray-900 leading-tight uppercase tracking-tight group-hover:text-primary transition-colors">
                                                  {
                                                    item.product.product_name[
                                                      currentLanguage
                                                    ]
                                                  }
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-4">
                                                  {item.variant && (
                                                    <Badge
                                                      variant="outline"
                                                      className="h-6 gap-1 bg-white border-gray-100 text-gray-500 font-bold text-[10px] uppercase px-3 py-0"
                                                    >
                                                      <Iconify
                                                        icon="solar:tag-bold-duotone"
                                                        width={14}
                                                        className="text-primary"
                                                      />
                                                      {
                                                        item.variant
                                                          .variant_name
                                                      }
                                                    </Badge>
                                                  )}
                                                  <div className="flex items-center gap-3 text-xs">
                                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
                                                      {t("Quantity:")}
                                                    </span>
                                                    <span className="font-black text-gray-900">
                                                      x{item.quantity}
                                                    </span>
                                                    <span className="w-1 H-1 rounded-full bg-gray-200" />
                                                    <span className="font-black text-primary">
                                                      {item.price} DH
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="shrink-0">
                                                <Button
                                                  disabled={
                                                    !order.is_review_allowed ||
                                                    item.reviewed
                                                  }
                                                  onClick={() =>
                                                    handleLeaveReview(
                                                      item.product._id,
                                                      order.order_date,
                                                      order.customer._id,
                                                    )
                                                  }
                                                  className={`h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2 transition-all shadow-xl hover:shadow-primary/20 ${
                                                    !order.is_review_allowed ||
                                                    item.reviewed
                                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                                      : "bg-primary text-white hover:bg-primary/90"
                                                  }`}
                                                >
                                                  <Iconify
                                                    icon={
                                                      item.reviewed
                                                        ? "solar:check-circle-bold-duotone"
                                                        : "solar:star-bold-duotone"
                                                    }
                                                    width={18}
                                                  />
                                                  {item.reviewed
                                                    ? t("Reviewed")
                                                    : t("Leave Review")}
                                                </Button>
                                              </div>
                                            </div>
                                          ),
                                        )}
                                      </div>

                                      <Separator className="bg-gray-100" />

                                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-50 shadow-sm">
                                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                            {t("Transaction ID")}:
                                          </p>
                                          <span className="text-[10px] font-mono font-bold text-gray-900 tracking-tighter">
                                            {order._id
                                              .toString()
                                              .slice(-5)
                                              .toUpperCase()}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <Iconify
                                            icon="solar:shield-check-bold"
                                            width={20}
                                            className="text-green-500"
                                          />
                                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-relaxed italic max-w-xs text-right">
                                            {t(
                                              "Order is fully protected by our selection guarantee and return policy.",
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal Backdrop */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl shadow-primary/20 overflow-hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-2xl hover:bg-gray-100 text-gray-400"
                onClick={() => setSelectedProduct(null)}
              >
                <Iconify icon="ic:round-close" width={28} />
              </Button>

              <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
                <Review
                  productId={selectedProduct.productId}
                  orderDate={selectedProduct.orderDate}
                  customerId={selectedProduct.customerId}
                  closeModal={() => setSelectedProduct(null)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default MyOrders;
