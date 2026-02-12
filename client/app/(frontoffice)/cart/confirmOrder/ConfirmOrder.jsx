"use client";

import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MetaData from "@/frontoffice/_components/MetaData";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import {
  applyCouponCode,
  saveShippingInfo,
} from "@/store/slices/shop/cartSlice";
import createAxiosInstance from "@/utils/axiosConfig";
import optimizeImage from "@/frontoffice/_components/optimizeImage";
import LazyImage from "@/components/shared/lazyimage/LazyImage";
import { motion } from "framer-motion";
import Iconify from "@/components/shared/iconify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const ConfirmOrder = () => {
  const { t, i18n } = useTranslation();
  const { cartItems, shippingInfo, coupon } = useSelector(
    (state) => state.carts,
  );
  const { customer } = useSelector((state) => state.customers);
  const { data: settings } = useSelector((state) => state.adminSettings);
  const isVatActive = settings?.vat_config?.isActive;
  const isStripeActive = settings?.payment_methods?.stripe_active;
  const currentLanguage = i18n.language;
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = createAxiosInstance("customer");
  const dispatch = useDispatch();

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
    0,
  );

  if (itemsPrice === 0) {
    router.push("/products");
  }

  let discountedTotal;
  let discountedPrice = ((itemsPrice * coupon?.discount) / 100).toFixed(2);
  if (coupon) {
    discountedTotal = itemsPrice - discountedPrice;
  } else {
    discountedTotal = itemsPrice;
  }
  const totalPrice = (
    discountedTotal +
    shippingInfo.shippingPrice +
    shippingInfo.taxPrice
  ).toFixed(2);

  const applyCoupon = async () => {
    if (!couponCode) return;
    setIsLoading(true);
    const sanitizedCouponCode = DOMPurify.sanitize(couponCode);

    try {
      const response = await axiosInstance.post(`/coupons/apply`, {
        code: sanitizedCouponCode,
        userId: customer._id,
      });
      dispatch(
        applyCouponCode({
          code: response.data.code,
          discount: response.data.discount,
        }),
      );
      setCouponCode("");
      toast.success(t("Coupon applied successfully"));
    } catch {
      toast.error(t("Failed to apply coupon"));
    } finally {
      setIsLoading(false);
    }
  };

  const processToPayment = () => {
    const updatedShippingInfo = {
      ...shippingInfo,
      totalPrice,
      discountedTotal,
      discountedPrice,
    };
    dispatch(saveShippingInfo(updatedShippingInfo));
    router.replace("/payment");
  };

  return (
    <Fragment>
      <MetaData title={t("Confirm Order")} />

      <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">
              {t("Confirmation")}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-12 bg-primary rounded-full" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
                {t("Review your selection and complete your order")}
              </p>
            </div>
          </div>

          <CheckoutSteps shipping confirmOrder />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-4xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-gray-200/50 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                      <Iconify icon="solar:user-bold-duotone" width={24} />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                      {t("Shipping Information")}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/shipping?edit=true")}
                    className="text-[10px] font-black uppercase text-primary tracking-widest gap-2"
                  >
                    <Iconify
                      icon="solar:pen-new-square-bold-duotone"
                      width={16}
                    />
                    {t("Edit Info")}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {t("Recipient")}
                      </p>
                      <p className="font-black text-gray-900">
                        {customer &&
                          `${customer.first_name} ${customer.last_name}`}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {t("Contact Details")}
                      </p>
                      <p className="font-black text-gray-900 italic">
                        {shippingInfo.phoneNo}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {t("Delivery Address")}
                      </p>
                      <p className="font-bold text-gray-600 leading-relaxed text-sm">
                        {shippingInfo.address}, {shippingInfo.city},{" "}
                        {shippingInfo.postalCode}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Iconify
                          icon="solar:delivery-bold-duotone"
                          width={14}
                        />
                        {t(shippingInfo.shippingMethod)}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Iconify icon="solar:global-bold-duotone" width={14} />
                        {shippingInfo.country}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Cart Items List */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 px-4">
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center">
                    <Iconify icon="solar:bag-heart-bold-duotone" width={20} />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">
                    {t("Review Items")}
                  </h2>
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-gray-100 text-gray-500 font-black uppercase tracking-widest text-[10px]"
                  >
                    {cartItems.length} {t("items")}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={`${item.product}-${item.variant?._id || "base"}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-6 p-6 bg-white rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <LazyImage
                          src={
                            typeof item?.image === "string"
                              ? optimizeImage(item?.image, 150)
                              : optimizeImage(item?.image[0], 150)
                          }
                          alt={item.name[currentLanguage]}
                          className="w-full h-full object-contain drop-shadow-lg"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Link
                          href={`/product/${item.product}`}
                          className="font-black text-gray-900 hover:text-primary transition-colors block text-base"
                        >
                          {item.name[currentLanguage]}
                        </Link>
                        {item.variant && (
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {t("Variant")}:{" "}
                            <span className="text-primary">
                              {item.variant.variant_name}
                            </span>
                          </p>
                        )}
                        <p className="text-xs font-black text-gray-400 tracking-tight">
                          {item.quantity} x {item.discountPrice} DH
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-lg text-gray-900">
                          {(
                            item.quantity * (item.discountPrice || item.price)
                          ).toFixed(2)}{" "}
                          <span className="text-xs text-primary">
                            {t("DH")}
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary & Actions */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                <Card className="rounded-4xl sm:rounded-[3rem] border-none shadow-2xl shadow-gray-200 bg-white overflow-hidden">
                  <CardContent className="p-6 sm:p-10 space-y-8 sm:space-y-10">
                    {/* Coupon Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Iconify
                          icon="solar:tag-bold-duotone"
                          width={20}
                          className="text-primary"
                        />
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                          {t("Have a coupon?")}
                        </h3>
                      </div>
                      {coupon ? (
                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center justify-between border-dashed animate-in zoom-in">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                              {t("Active Reward")}
                            </span>
                            <span className="text-sm font-black text-gray-900 uppercase tracking-tight italic">
                              {coupon.code}
                            </span>
                          </div>
                          <Badge className="bg-primary text-white font-black text-[10px] uppercase">
                            -{coupon.discount}%
                          </Badge>
                        </div>
                      ) : (
                        <div className="relative group">
                          <Input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder={t("Enter code here...")}
                            className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 pr-24 focus:bg-white transition-all font-medium uppercase tracking-tight text-xs"
                          />
                          <Button
                            onClick={applyCoupon}
                            disabled={!couponCode || isLoading}
                            className="absolute right-1 top-1 bottom-1 h-12 rounded-xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest px-6 hover:bg-black transition-all"
                          >
                            {isLoading ? (
                              <Iconify
                                icon="svg-spinners:ring-resize"
                                width={16}
                              />
                            ) : (
                              t("Apply")
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-gray-100" />

                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-400 uppercase tracking-widest">
                          {t("Subtotal")}
                        </span>
                        <span className="font-black text-gray-900">
                          {itemsPrice.toFixed(2)} DH
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-400 uppercase tracking-widest">
                          {t("Shipping")}
                        </span>
                        <span className="font-black text-gray-900">
                          {shippingInfo?.shippingPrice === 0
                            ? t("Free")
                            : `${shippingInfo?.shippingPrice} DH`}
                        </span>
                      </div>
                      {coupon && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-primary uppercase tracking-widest">
                            {t("Discount")}
                          </span>
                          <span className="font-black text-primary animate-pulse">
                            -{discountedPrice} DH
                          </span>
                        </div>
                      )}
                      {isVatActive && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-gray-400 uppercase tracking-widest">
                            {t("VAT")} ({settings?.vat_config?.percentage}%)
                          </span>
                          <span className="font-black text-gray-900">
                            {shippingInfo?.taxPrice} DH
                          </span>
                        </div>
                      )}
                      <Separator className="bg-gray-50" />
                      <div className="flex justify-between items-end">
                        <span className="font-black text-gray-900 uppercase tracking-widest text-lg">
                          {t("Total Pay")}
                        </span>
                        <div className="text-right">
                          <span className="text-3xl font-black text-primary tracking-tight">
                            {totalPrice}{" "}
                            <span className="text-base font-bold">
                              {t("DH")}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={processToPayment}
                      className="w-full h-16 rounded-[2.5rem] bg-primary text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-4 border-none"
                    >
                      <Iconify icon="solar:card-send-bold-duotone" width={24} />
                      {t("Proceed to Payment")}
                    </Button>
                  </CardContent>
                </Card>

                {/* Secure Info */}
                <div className="flex items-center justify-center gap-6 py-4 bg-gray-50/50 rounded-3xl border border-gray-100 border-dashed">
                  {isStripeActive && (
                    <>
                      <div className="flex flex-col items-center gap-1">
                        <Iconify
                          icon="logos:stripe"
                          width={40}
                          className="grayscale hover:grayscale-0 transition-all cursor-pointer"
                        />
                      </div>
                      <Separator
                        orientation="vertical"
                        className="h-4 bg-gray-200"
                      />
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <Iconify
                      icon="solar:shield-check-bold"
                      width={20}
                      className="text-green-500"
                    />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {t("SSL Secure")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
