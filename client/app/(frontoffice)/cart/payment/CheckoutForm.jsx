"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { clearCart } from "@/store/slices/shop/cartSlice";
import createAxiosInstance from "@/utils/axiosConfig";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Iconify from "@/components/shared/iconify";

import { Button } from "@/components/ui/button";

const CheckoutForm = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.carts);
  const { customer } = useSelector((state) => state.customers);
  const axiosInstance = createAxiosInstance("customer");
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  let orderId;
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent.status === "succeeded") {
        toast.success(t("Payment succeeded"));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe]);

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
      const orderData = {
        customer_id: customer._id,
        order_items: cartItems.map((item) => ({
          product_id: item.product,
          quantity: item.quantity,
          price: item.discountPrice || item.price,
        })),
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
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const handleCreditCardPayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      orderId = await createOrder();

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        console.error("Error during payment confirmation:", error.message);
        toast.error(error.message);
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        const paymentData = {
          order_id: orderId,
          amount: shippingInfo?.totalPrice,
          paymentMethod: "credit_card",
          paymentStatus: "completed",
          currency: "mad",
        };

        await axiosInstance.post("/payments/save-payment-info", paymentData);

        dispatch(clearCart());
        setLoading(false);
        router.replace("/success");
      }
    } catch (error) {
      console.error("Error confirming payment", error);
      toast.error(t("There was an error processing the payment."));
    } finally {
      setLoading(false);
    }
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleCreditCardPayment} className="space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none">
            {t("Card Details")}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {t("Secure encrypted payment via Stripe")}
          </p>
        </div>

        <div className="p-1">
          <PaymentElement options={paymentElementOptions} />
        </div>

        <Button
          type="submit"
          disabled={loading || !stripe || !elements}
          className="w-full h-16 rounded-4xl bg-gray-900 text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all gap-4 border-none"
        >
          {loading ? (
            <Iconify icon="svg-spinners:ring-resize" width={24} />
          ) : (
            <>
              <Iconify icon="solar:shield-check-bold-duotone" width={24} />
              {t("Pay Securedly")}
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CheckoutForm;
