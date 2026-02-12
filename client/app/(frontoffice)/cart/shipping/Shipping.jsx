"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CheckoutSteps from "../checkoutSteps/CheckoutSteps";
import { toast } from "react-toastify";
import createAxiosInstance from "@/utils/axiosConfig";
import {
  applyCouponCode,
  saveShippingInfo,
} from "@/store/slices/shop/cartSlice";
import MetaData from "@/frontoffice/_components/MetaData";
import { motion } from "framer-motion";
import Iconify from "@/components/shared/iconify";
import MapPicker from "@/components/shared/map/MapPicker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Shipping = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { customer } = useSelector((state) => state.customers);
  const axiosInstance = createAxiosInstance("customer");
  const { cartItems, shippingInfo } = useSelector((state) => state.carts);
  const { data: settings } = useSelector((state) => state.adminSettings);

  const {
    free_shipping_enabled = false,
    free_shipping_threshold = 0,
    default_shipping_cost = 30,
    express_shipping_cost = 45,
    overnight_shipping_cost = 65,
  } = settings?.shipping_config || {};

  const { isActive: isVatActive = false, percentage: vatPercentage = 0 } =
    settings?.vat_config || {};

  const {
    standard_shipping_enabled = true,
    express_shipping_enabled = true,
    overnight_shipping_enabled = true,
  } = settings?.shipping_config || {};

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
    0,
  );

  if (itemsPrice === 0) {
    router.push("/products");
  }

  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [loading, setLoading] = useState(false);
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");
  const [shippingMethod, setShippingMethod] = useState(
    shippingInfo.shippingMethod ||
      (standard_shipping_enabled
        ? "standard"
        : express_shipping_enabled
          ? "express"
          : overnight_shipping_enabled
            ? "overnight"
            : ""),
  );
  const [country] = useState(shippingInfo.country || "Morocco");
  const [latitude, setLatitude] = useState(
    shippingInfo?.latitude || customer?.shipping_address?.latitude || 33.5731,
  );
  const [longitude, setLongitude] = useState(
    shippingInfo?.longitude || customer?.shipping_address?.longitude || -7.5898,
  );
  const [saveToProfile, setSaveToProfile] = useState(true);

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

  const getShippingPrice = () => {
    if (free_shipping_enabled && itemsPrice >= free_shipping_threshold)
      return 0;
    if (shippingMethod === "standard") return default_shipping_cost;
    if (shippingMethod === "express") return express_shipping_cost;
    if (shippingMethod === "overnight") return overnight_shipping_cost;
    return 0;
  };

  const shippingPrice = getShippingPrice();
  const taxPrice = isVatActive
    ? Number(((vatPercentage / 100) * itemsPrice).toFixed(2))
    : 0;
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const saveAddressToProfile = async () => {
    setLoading(true);
    try {
      const shipping_address = {
        street: address,
        city,
        postal_code: postalCode,
        phone_no: formatPhone(phoneNo),
        country,
        latitude,
        longitude,
      };

      await axiosInstance.put(`/customers/${customer._id}`, {
        shipping_address,
      });
    } catch (error) {
      console.error(error);
      toast.error(t("Failed to save address to profile."));
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(
        saveShippingInfo({
          address,
          city,
          phoneNo: formatPhone(phoneNo),
          postalCode,
          taxPrice,
          shippingPrice,
          shippingMethod,
          country,
          latitude,
          longitude,
        }),
      );
      dispatch(applyCouponCode(null));

      if (saveToProfile) {
        await saveAddressToProfile();
      }

      router.replace("/confirm");
    } catch (error) {
      console.log(error);
    }
  };

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryParams = searchParams;
    if (queryParams.get("edit")) return;
    if (itemsPrice === 0) return;

    const hasShippingInfo =
      shippingInfo &&
      shippingInfo.address &&
      shippingInfo.city &&
      shippingInfo.postalCode &&
      shippingInfo.phoneNo &&
      shippingInfo.latitude !== undefined &&
      shippingInfo.longitude !== undefined;
    const hasCustomerAddress =
      customer && customer.shipping_address && customer.shipping_address.street;

    if (hasShippingInfo) {
      router.replace("/confirm");
      return;
    }

    if (hasCustomerAddress) {
      const finalAddress = customer.shipping_address.street;
      const finalCity = customer.shipping_address.city;
      const finalPostalCode = customer.shipping_address.postal_code;
      const finalPhoneNo = formatPhone(customer.shipping_address.phone_no);
      const finalCountry = customer.shipping_address.country || "Morocco";
      const finalLat = customer.shipping_address.latitude || 33.5731;
      const finalLng = customer.shipping_address.longitude || -7.5898;
      const finalShippingMethod = standard_shipping_enabled
        ? "standard"
        : express_shipping_enabled
          ? "express"
          : overnight_shipping_enabled
            ? "overnight"
            : "standard";

      let currentShippingPrice = 0;
      if (free_shipping_enabled && itemsPrice >= free_shipping_threshold) {
        currentShippingPrice = 0;
      } else {
        if (finalShippingMethod === "standard")
          currentShippingPrice = default_shipping_cost;
      }

      const currentTaxPrice = isVatActive
        ? Number(((vatPercentage / 100) * itemsPrice).toFixed(2))
        : 0;

      dispatch(
        saveShippingInfo({
          address: finalAddress,
          city: finalCity,
          phoneNo: finalPhoneNo,
          postalCode: finalPostalCode,
          taxPrice: currentTaxPrice,
          shippingPrice: currentShippingPrice,
          shippingMethod: finalShippingMethod,
          country: finalCountry,
          latitude: finalLat,
          longitude: finalLng,
        }),
      );

      dispatch(applyCouponCode(null));
      router.replace("/confirm");
    }
  }, [
    itemsPrice,
    shippingInfo,
    customer,
    dispatch,
    router,
    searchParams,
    free_shipping_enabled,
    free_shipping_threshold,
    default_shipping_cost,
    isVatActive,
    vatPercentage,
    standard_shipping_enabled,
    express_shipping_enabled,
    overnight_shipping_enabled,
  ]);

  return (
    <Fragment>
      <MetaData title={t("Shipping")} />

      <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">
              {t("Checkout")}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-12 bg-primary rounded-full" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
                {t("Nearly there, just a few details left")}
              </p>
            </div>
          </div>

          <CheckoutSteps shipping />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-4xl sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100"
              >
                <form onSubmit={submitHandler} className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                        <Iconify
                          icon="solar:map-point-bold-duotone"
                          width={24}
                        />
                      </div>
                      <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                        {t("Delivery Address")}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label
                          htmlFor="address_field"
                          className="text-xs font-black uppercase tracking-widest text-gray-400"
                        >
                          {t("Street Address")}
                        </Label>
                        <Input
                          id="address_field"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder={t("Enter your full address")}
                          required
                          className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="city_field"
                          className="text-xs font-black uppercase tracking-widest text-gray-400"
                        >
                          {t("City")}
                        </Label>
                        <Input
                          id="city_field"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder={t("e.g. Casablanca")}
                          required
                          className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="postal_code_field"
                          className="text-xs font-black uppercase tracking-widest text-gray-400"
                        >
                          {t("Postal Code")}
                        </Label>
                        <Input
                          id="postal_code_field"
                          type="number"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder={t("e.g. 20000")}
                          required
                          className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone_field"
                          className="text-xs font-black uppercase tracking-widest text-gray-400"
                        >
                          {t("Phone Number")}
                        </Label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                            <span className="text-sm font-black text-gray-400 border-r border-gray-200 pr-2">
                              +212
                            </span>
                          </div>
                          <Input
                            id="phone_field"
                            type="tel"
                            value={phoneNo}
                            onChange={(e) =>
                              setPhoneNo(e.target.value.replace(/\D/g, ""))
                            }
                            placeholder={t("6XX XXX XXX")}
                            required
                            className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium pl-20"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="country_field"
                          className="text-xs font-black uppercase tracking-widest text-gray-400"
                        >
                          {t("Country")}
                        </Label>
                        <Input
                          id="country_field"
                          value={country}
                          readOnly
                          className="h-14 rounded-2xl border-gray-100 bg-gray-100 text-gray-500 font-black uppercase tracking-widest cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                        <Iconify icon="solar:map-bold-duotone" width={24} />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                          {t("Precise Pin Location")}
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                          {t("Help our delivery team find you instantly")}
                        </p>
                      </div>
                    </div>

                    <MapPicker
                      initialPosition={{ lat: latitude, lng: longitude }}
                      onLocationSelect={({ latitude, longitude }) => {
                        setLatitude(latitude);
                        setLongitude(longitude);
                      }}
                    />
                    <div className="flex justify-between px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                          {t("Latitude")}
                        </p>
                        <p className="text-xs font-bold text-gray-900">
                          {latitude.toFixed(6)}
                        </p>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                          {t("Longitude")}
                        </p>
                        <p className="text-xs font-bold text-gray-900">
                          {longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-100" />

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                        <Iconify
                          icon="solar:delivery-bold-duotone"
                          width={24}
                        />
                      </div>
                      <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                        {t("Shipping Method")}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          id: "standard",
                          label: t("Standard"),
                          price: default_shipping_cost,
                          time: "3-5 Business Days",
                          enabled: standard_shipping_enabled,
                        },
                        {
                          id: "express",
                          label: t("Express"),
                          price: express_shipping_cost,
                          time: "1-2 Business Days",
                          enabled: express_shipping_enabled,
                        },
                        {
                          id: "overnight",
                          label: t("Overnight"),
                          price: overnight_shipping_cost,
                          time: "Next Day Delivery",
                          enabled: overnight_shipping_enabled,
                        },
                      ]
                        .filter((method) => method.enabled)
                        .map((method) => {
                          const isFree =
                            free_shipping_enabled &&
                            itemsPrice >= free_shipping_threshold;
                          const isSelected = shippingMethod === method.id;
                          return (
                            <div
                              key={method.id}
                              onClick={() =>
                                !isFree && setShippingMethod(method.id)
                              }
                              className={`relative p-6 rounded-4xl border-2 transition-all cursor-pointer ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                                  : "border-gray-100 bg-white hover:border-primary/20"
                              } ${
                                isFree && method.id !== "standard"
                                  ? "opacity-40 grayscale cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-4 right-4 text-primary animate-in zoom-in">
                                  <Iconify
                                    icon="solar:check-circle-bold"
                                    width={20}
                                  />
                                </div>
                              )}
                              <div className="space-y-1">
                                <p className="font-black text-xs text-gray-400 uppercase tracking-widest">
                                  {method.label}
                                </p>
                                <p className="font-black text-lg text-gray-900">
                                  {isFree ? "Free" : `${method.price} DH`}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase italic">
                                  {method.time}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {free_shipping_enabled &&
                      itemsPrice >= free_shipping_threshold && (
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                          <Iconify
                            icon="solar:gift-bold-duotone"
                            width={20}
                            className="text-green-600"
                          />
                          <p className="text-xs font-black text-green-700 uppercase tracking-tight">
                            {t(
                              "Congratulations! You unlocked FREE Standard Shipping.",
                            )}
                          </p>
                        </div>
                      )}
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Checkbox
                      id="save_to_profile"
                      checked={saveToProfile}
                      onCheckedChange={setSaveToProfile}
                      className="w-6 h-6 rounded-lg"
                    />
                    <Label
                      htmlFor="save_to_profile"
                      className="text-sm font-bold text-gray-500 cursor-pointer hover:text-gray-900 transition-colors"
                    >
                      {t("Save this address to my profile for future orders")}
                    </Label>
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-16 rounded-[2.5rem] bg-primary text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3 border-none"
                    >
                      {loading ? (
                        <>
                          <Iconify icon="svg-spinners:ring-resize" width={24} />
                          {t("Processing...")}
                        </>
                      ) : (
                        <>
                          <Iconify
                            icon="solar:arrow-right-bold-duotone"
                            width={24}
                          />
                          {t("Continue to Confirmation")}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                <Card className="rounded-4xl sm:rounded-[3rem] border-none shadow-2xl shadow-gray-200 bg-white overflow-hidden">
                  <CardContent className="p-6 sm:p-10 space-y-8 sm:space-y-10">
                    <div className="space-y-4">
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                        {t("Order Summary")}
                      </h2>
                      <Separator className="bg-gray-100" />
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-400 uppercase tracking-widest">
                          {t("Subtotal")}
                        </span>
                        <span className="font-black text-gray-900">
                          {itemsPrice} DH
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-400 uppercase tracking-widest">
                          {t("Shipping")}
                        </span>
                        <span className="font-black text-gray-900">
                          {shippingPrice === 0 ? "Free" : `${shippingPrice} DH`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-400 uppercase tracking-widest">
                          {t("VAT")} ({isVatActive ? vatPercentage : 0}%)
                        </span>
                        <span className="font-black text-gray-900">
                          {taxPrice} DH
                        </span>
                      </div>
                      <Separator className="bg-gray-50" />
                      <div className="flex justify-between items-end">
                        <span className="font-black text-gray-900 uppercase tracking-widest text-lg">
                          {t("Total")}
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

                    {/* Trust Info */}
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                        <Iconify
                          icon="solar:refresh-square-bold-duotone"
                          width={24}
                          className="text-primary"
                        />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                          {t(
                            "Free returns within 14 days for all eligible items",
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
