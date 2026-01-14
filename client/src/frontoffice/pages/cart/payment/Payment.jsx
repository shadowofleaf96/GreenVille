import { useState, useEffect, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import MetaData from "../../../components/MetaData";
import Iconify from "../../../../backoffice/components/iconify";
import CheckoutSteps from "../../../pages/cart/checkoutSteps/CheckoutSteps";
import { clearCart } from "../../../../redux/frontoffice/cartSlice";
import CheckoutForm from "./CheckoutForm";
import createAxiosInstance from "../../../../utils/axiosConfig";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Payment = () => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = loadStripe(stripeKey);

  const dispatch = useDispatch();
  let orderId;
  const { t } = useTranslation();

  const { customer } = useSelector((state) => state.customers);
  const { cartItems, shippingInfo } = useSelector((state) => state.carts);
  const { data: settings } = useSelector((state) => state.adminSettings);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const axiosInstance = useMemo(() => createAxiosInstance("customer"), []);

  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
    0,
  );

  const totalPriceUSD = (shippingInfo?.totalPrice * 0.11).toFixed(2);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const response = await axiosInstance.post(
          "/payments/create-stripe-payment",
          {
            amount: shippingInfo?.totalPrice,
            currency: "mad",
            isSavingCard: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const result = response.data;
        if (result.clientSecret) {
          setClientSecret(result.clientSecret);
        } else {
          console.error("Client secret not found in response");
        }
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    fetchStripeKey();
  }, [axiosInstance, shippingInfo?.totalPrice]);

  const createOrder = async () => {
    setLoading(true);
    try {
      const shipping_address = {
        street: shippingInfo.address,
        city: shippingInfo.city,
        postal_code: shippingInfo.postalCode,
        phone_no: shippingInfo.phoneNo || shippingInfo.phone_no,
        country: shippingInfo.country,
        state: shippingInfo.state || "",
        latitude: shippingInfo.latitude,
        longitude: shippingInfo.longitude,
      };
      console.log("Creating Order with Cart Items:", cartItems);
      const orderData = {
        customer_id: customer._id,
        order_items: cartItems.map((item) => {
          const price = item.discountPrice || item.price;
          console.log(
            `Processing item ${item.product}: price=${price} (discount=${item.discountPrice}, base=${item.price})`,
          );
          return {
            product_id: item.product,
            quantity: item.quantity,
            price: price,
          };
        }),
        tax: shippingInfo.taxPrice,
        order_date: new Date(),
        shipping_address,
        coupon_discount: Number(shippingInfo?.discountedPrice) || 0,
        shipping_price: shippingInfo.shippingPrice,
        cart_total_price: shippingInfo.totalPrice,
        shipping_method: shippingInfo.shippingMethod,
        shipping_status: "not_shipped",
        order_notes:
          "Your order is being processed with care. We will notify you once it's ready for shipment.",
        status: "processing",
      };

      const orderResponse = await axiosInstance.post("/orders", orderData);
      return orderResponse.data.order._id;
    } catch (error) {
      setLoading(false);
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const onCreateOrder = async (data, actions) => {
    orderId = await createOrder();
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalPriceUSD,
          },
        },
      ],
    });
  };

  const onApproveOrder = async (data, actions) => {
    return actions.order.capture().then(async () => {
      try {
        const paymentData = {
          order_id: orderId,
          amount: shippingInfo?.totalPrice,
          paymentMethod: "paypal",
          paymentStatus: "completed",
          currency: "mad",
        };

        await axiosInstance.post("/payments/save-payment-info", paymentData);

        dispatch(clearCart());
        navigate("/success");
      } catch (error) {
        console.error("Error creating payment:", error);
      }
    });
  };

  const createPayment = async (operation, orderId, currency) => {
    try {
      const paymentData = {
        order_id: orderId,
        amount: shippingInfo?.totalPrice,
        paymentMethod: paymentMethod,
        paymentStatus: "pending",
        currency: currency,
      };

      await axiosInstance.post("/payments" + operation, paymentData);

      dispatch(clearCart());

      setLoading(false);
      navigate("/success");
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  const handleCODPayment = async (e) => {
    e.preventDefault();
    try {
      orderId = await createOrder();
      await createPayment("/save-payment-info", orderId, "mad");
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <Fragment>
      <MetaData title={t("Payment")} />

      <div className="min-h-screen bg-gray-50/50 pt-24 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">
              {t("Payment")}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-12 bg-primary rounded-full" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
                {t("Securely complete your transaction")}
              </p>
            </div>
          </div>

          <CheckoutSteps shipping confirmOrder payment />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            {/* Payment Selection */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-4xl sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100"
              >
                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                        <Iconify icon="solar:card-2-bold-duotone" width={24} />
                      </div>
                      <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
                        {t("Select Payment Method")}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          id: "cod",
                          label: t("Cash On Delivery"),
                          icon: "solar:wallet-money-bold-duotone",
                          desc: t("Pay when you receive"),
                        },
                        {
                          id: "paypal",
                          label: t("PayPal"),
                          icon: "logos:paypal",
                          desc: t("Digital wallet / Cards"),
                          isLogo: true,
                        },
                        {
                          id: "creditCard",
                          label: t("Credit Card"),
                          icon: "solar:card-send-bold-duotone",
                          desc: t("Stripe Secure Payment"),
                        },
                      ]
                        .filter((m) => {
                          if (m.id === "paypal")
                            return settings?.payment_methods?.paypal_active;
                          if (m.id === "creditCard")
                            return settings?.payment_methods?.stripe_active;
                          return true; // COD is always available
                        })
                        .map((method) => {
                          const isSelected = paymentMethod === method.id;
                          return (
                            <div
                              key={method.id}
                              onClick={() =>
                                handlePaymentMethodChange(method.id)
                              }
                              className={`relative p-6 sm:p-8 rounded-4xl sm:rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col items-center text-center group ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-xl shadow-primary/10"
                                  : "border-gray-100 bg-white hover:border-primary/20"
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
                              <div
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 ${
                                  isSelected
                                    ? "bg-primary text-white"
                                    : "bg-gray-50 text-gray-400"
                                }`}
                              >
                                {method.isLogo ? (
                                  <Iconify
                                    icon={method.icon}
                                    width={method.id === "paypal" ? 24 : 32}
                                    className={isSelected ? "" : "grayscale"}
                                  />
                                ) : (
                                  <Iconify icon={method.icon} width={32} />
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="font-black text-xs text-gray-900 uppercase tracking-widest leading-none">
                                  {method.label}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                  {method.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={paymentMethod}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Separator className="bg-gray-100 my-10" />

                      {paymentMethod === "cod" && (
                        <div className="space-y-6">
                          <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-start gap-4">
                            <Iconify
                              icon="solar:info-circle-bold-duotone"
                              width={24}
                              className="text-gray-400 shrink-0"
                            />
                            <div className="space-y-1">
                              <p className="text-xs font-black text-gray-900 uppercase tracking-tight">
                                {t("Cash on Delivery Policy")}
                              </p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-widest">
                                {t("Please have the exact amount of")}{" "}
                                <span className="text-primary">
                                  {shippingInfo?.totalPrice} DH
                                </span>{" "}
                                {t(
                                  "ready upon delivery to ensure a smooth transaction.",
                                )}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={handleCODPayment}
                            disabled={loading}
                            className="w-full h-16 rounded-[2.5rem] bg-gray-900 text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all gap-4 border-none"
                          >
                            {loading ? (
                              <Iconify
                                icon="svg-spinners:ring-resize"
                                width={24}
                              />
                            ) : (
                              <>
                                <Iconify
                                  icon="solar:check-circle-bold-duotone"
                                  width={24}
                                />
                                {t("Confirm Order & Pay Later")}
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {paymentMethod === "paypal" && (
                        <div className="flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="text-center space-y-2">
                            <Iconify icon="logos:paypal" width={100} />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                              {t("Redirecting you to a secure PayPal gateway")}
                            </p>
                          </div>
                          <div className="w-full max-w-md">
                            <PayPalButtons
                              style={{
                                layout: "vertical",
                                label: "pay",
                                height: 55,
                                shape: "pill",
                              }}
                              createOrder={(data, actions) =>
                                onCreateOrder(data, actions)
                              }
                              onApprove={(data, actions) =>
                                onApproveOrder(data, actions)
                              }
                              fundingSource={FUNDING.PAYPAL}
                            />
                          </div>
                        </div>
                      )}

                      {paymentMethod === "creditCard" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                          {clientSecret ? (
                            <Elements
                              options={{
                                clientSecret,
                                appearance: {
                                  theme: "stripe",
                                  variables: { colorPrimary: "#006400" },
                                },
                              }}
                              stripe={stripePromise}
                            >
                              <CheckoutForm />
                            </Elements>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                              <Iconify
                                icon="svg-spinners:90-ring-with-bg"
                                width={40}
                                className="text-primary"
                              />
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                {t("Initializing Secure Payment Gateway...")}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                <Card className="rounded-4xl sm:rounded-[3rem] border-none shadow-2xl shadow-gray-200 bg-white overflow-hidden">
                  <CardContent className="p-6 sm:p-10 space-y-8 sm:space-y-10">
                    <div className="space-y-4">
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                        {t("Final Summary")}
                      </h2>
                      <Separator className="bg-gray-100" />
                    </div>

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
                            ? "Free"
                            : `${shippingInfo?.shippingPrice} DH`}
                        </span>
                      </div>
                      {shippingInfo?.discountedPrice > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-bold text-primary uppercase tracking-widest">
                            {t("Discount")}
                          </span>
                          <span className="font-black text-primary">
                            -{shippingInfo?.discountedPrice} DH
                          </span>
                        </div>
                      )}
                      {settings?.vat_config?.isActive && (
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
                            {shippingInfo?.totalPrice}{" "}
                            <span className="text-base font-bold">
                              {t("DH")}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Security Badges */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                        <Iconify
                          icon="solar:shield-up-bold-duotone"
                          width={24}
                          className="text-green-500"
                        />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                          {t("256-Bit SSL")}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                        <Iconify
                          icon="solar:history-bold-duotone"
                          width={24}
                          className="text-primary"
                        />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                          {t("Buyer Protection")}
                        </span>
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

export default Payment;
